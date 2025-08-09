import { describeMonster } from "./utils/describe-monster";
import { getContinentFromLocation } from "./utils/get-continent-from-location";
import { getItemData } from "./utils/get-item-data";
import { getMonsterData } from "./utils/get-monster-data";
import { getMonsterList } from "./utils/get-monster-list";
import { getNPCData } from "./utils/get-npc-data";
import { getQuestData } from "./utils/get-quest-data";
import { getQuestList } from "./utils/get-quest-list";
import { searchMonsterByDrop } from "./utils/search-monster-by-drop";

interface QuestOfficeNPC extends NPCData {
  place: "questoffice";
}

interface CategoryQuestData extends QuestData {
  type: "category";
  minLevel: number;
  beginNPC: number;
}

interface ItemQuestData extends CategoryQuestData {
  endNeededItems: NonNullable<QuestData["endNeededItems"]>;
}

interface OfficeQuestBase {
  quest: QuestData;
  amount: number;
  location: string;
}

interface ItemQuest extends OfficeQuestBase {
  quest: ItemQuestData;
  item: ItemData;
  droppedBy: Array<MonsterData>;
}

interface KillQuestData extends CategoryQuestData {
  endKillMonsters: NonNullable<QuestData["endKillMonsters"]>;
}

interface KillQuest extends OfficeQuestBase {
  quest: KillQuestData;
  targets: Array<MonsterData>;
}

type OfficeQuest = ExplicitOverlap<ItemQuest, KillQuest>;

function isCategoryQuest(quest: QuestData): quest is CategoryQuestData {
  if (quest.type != "category" || !quest.beginNPC) return false;
  return true;
}

function isItemQuest(quest: CategoryQuestData): quest is ItemQuestData {
  if (!quest.endNeededItems) return false;
  return true;
}

function isKillQuest(quest: CategoryQuestData): quest is KillQuestData {
  if (!quest.endKillMonsters) return false;
  return true;
}

function isQuestOfficeNPC(npc: NPCData): npc is QuestOfficeNPC {
  return npc.place === "questoffice";
}

const getOfficeLocation = (() => {
  // this is wrapped in an IIFE to isolate this cache variable:
  const locationMap = new Map<NPCData, string>();

  return async function getOfficeLocation(npc: NPCData) {
    const cached = locationMap.get(npc);
    if (cached) return cached;

    const location = await getContinentFromLocation(npc.locations[0]);
    locationMap.set(npc, location);
    return location;
  };
})();

async function main() {
  // TEMP
  // FIXME: missing help
  if (process.argv.includes("--help") || process.argv.includes("-h")) {
    throw new Error("HELP UNIMPLEMENTED");
  }

  const argShort =
    process.argv.includes("--short") || process.argv.includes("-s");
  const [monsterList, questList] = await Promise.all([
    getMonsterList("overworldNonGiant"),
    getQuestList()
  ]);
  let officeQuestsCount = 0;
  const locationMap: Record<string, OfficeQuest[]> = {};

  for (const id of questList) {
    const quest = await getQuestData(id);
    if (!isCategoryQuest(quest)) continue;
    const npc = await getNPCData(quest.beginNPC);
    if (!isQuestOfficeNPC(npc)) continue;
    const location = await getOfficeLocation(npc);

    // handle item quests
    if (isItemQuest(quest)) {
      const [neededItem] = quest.endNeededItems;
      console.assert(
        quest.endNeededItems.length == 1,
        `[WARN] Quest #${quest.id} has zero or multiple needed items`
      );

      const item = await getItemData(neededItem.item);
      const droppedBy = await searchMonsterByDrop(monsterList, item);

      officeQuestsCount++;
      (locationMap[location] ??= []).push({
        quest,
        location,
        item,
        amount: neededItem.count,
        droppedBy
      });
    }

    // handle kill quests
    else if (isKillQuest(quest)) {
      const [killMonster] = quest.endKillMonsters;
      console.assert(
        quest.endKillMonsters.length === 1,
        `[WARN] #${quest.id} has zero or multiple endKillMonsters`
      );

      officeQuestsCount++;
      (locationMap[location] ??= []).push({
        quest,
        location,
        targets: await Promise.all(
          killMonster.monster.map(id => getMonsterData(id))
        ),
        amount: killMonster.count
      });
    }

    // handle error
    else {
      throw new Error(
        `Could not recognize Quest #${quest.id} as either item or kill quest, but has [${location} Quest Office] ${npc.name.en} as begin NPC`
      );
    }
  }

  // sorting locations by level
  const locations = Object.entries(locationMap);
  locations.forEach(loc => {
    const officeQuests = loc[1];
    officeQuests.sort((a, b) => a.quest.minLevel - b.quest.minLevel);
  });
  locations.sort((a, b) => {
    const aMin = a[1][0].quest.minLevel;
    const bMin = b[1][0].quest.minLevel;
    return aMin - bMin;
  });

  console.log(
    `Found ${officeQuestsCount} office quests in ${locations.length} locations`
  );

  for (const [location, officeQuests] of locations) {
    const minLv = officeQuests[0].quest.minLevel;
    const maxLv = officeQuests[officeQuests.length - 1].quest.minLevel;
    console.log(
      `\n${location} (${officeQuests.length} Quests) [${minLv}~${maxLv}]`
    );
    const table = [];

    for (const officeQuest of officeQuests) {
      const targets = (officeQuest.droppedBy || officeQuest.targets).sort(
        (a, b) => a.level - b.level
      );
      let condition = officeQuest.item
        ? `Collect ${officeQuest.amount}x ${officeQuest.item.name.en}${argShort ? "" : ", dropped by:"}`
        : `Kill ${officeQuest.amount} of:`;
      if (!argShort || !officeQuest.item) {
        condition += `\n\n${(
          await Promise.all(
            targets.map(
              async target =>
                ` - ${await describeMonster(target, { showRank: true, showLevel: true })}`
            )
          )
        ).join("\n")}`;
      }

      table.push({
        lv: officeQuest.quest.minLevel,
        name: officeQuest.quest.name.en,
        condition
      });
    }

    console.table(table);
  }
}

main()
  .then(() => console.log("Completed"))
  .catch(e => {
    console.error(e);
    process.exit(1);
  });
