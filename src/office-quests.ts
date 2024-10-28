import { getItemData } from "./utils/get-item-data";
import { getMonsterList } from "./utils/get-monster-list";
import { getNPCData } from "./utils/get-npc-data";
import { getQuestData } from "./utils/get-quest-data";
import { getQuestList } from "./utils/get-quest-list";

interface QuestOfficeNPC extends NPCData {
  place: "questoffice";
}

interface OfficeQuestData extends QuestData {
  type: "category";
  minLevel: number;
  beginNPC: number;
  endReceiveGold: number;
  endNeededItems: NonNullable<QuestData["endNeededItems"]>;
  endReceiveExperience: NonNullable<QuestData["endReceiveExperience"]>;
}

function isOfficeQuest(quest: QuestData): quest is OfficeQuestData {
  if (quest.type != "category") return false;
  if (!quest.beginNPC || !quest.endReceiveGold || !quest.endNeededItems)
    return false;
  return true;
}

function isQuestOfficeNPC(npc: NPCData): npc is QuestOfficeNPC {
  return npc.place === "questoffice";
}

async function main() {
  const [_monsterList, questList] = await Promise.all([
    getMonsterList("overworldNonGiant"),
    getQuestList()
  ]);
  const officeQuests = new Array<OfficeQuestData>();

  for (const id of questList) {
    const quest = await getQuestData(id);
    if (!isOfficeQuest(quest)) continue;
    const npc = await getNPCData(quest.beginNPC);
    if (!isQuestOfficeNPC(npc)) continue;
    const questItem = await getItemData(quest.endNeededItems[0].item);
    if (questItem.category !== "booty") continue;
    officeQuests.push(quest);
  }

  // sort by minLevel
  officeQuests.sort((a, b) => a.minLevel - b.minLevel);

  // DEBUG
  console.log(`[DEBUG] Found ${officeQuests.length} potential office quests`);
  officeQuests.forEach(quest =>
    console.log(`[#${quest.id}] [Lv. ${quest.minLevel}] ${quest.name.en}`)
  );
}

main()
  .then(() => console.log("Completed"))
  .catch(e => {
    console.error(e);
    process.exit(1);
  });
