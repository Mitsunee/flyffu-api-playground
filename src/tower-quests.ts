import { getQuestData } from "./utils/get-quest-data";
import { getQuestList } from "./utils/get-quest-list";

//const [, , ...args] = process.argv;

interface TowerQuestData extends QuestData {
  beginNPC: 11734;
  minLevel: number;
  maxLevel: number;
  endReceiveExperience: NonNullable<QuestData["endReceiveExperience"]>;
  endReceiveGold: NonNullable<QuestData["endReceiveGold"]>;
}

interface TowerFloor {
  num: number;
  minLevel: number;
  maxLevel: number;
  quests: Array<TowerQuestData>;
}

function isTowerQuest(quest: QuestData): quest is TowerQuestData {
  if (quest.beginNPC !== 11734) return false;
  return true;
}

async function main() {
  const fullList = await getQuestList();
  const towerQuests = new Array<TowerQuestData>();
  const towerFloors = new Array<TowerFloor>();

  // find all tower quests
  for (const id of fullList) {
    const data = await getQuestData(id);
    if (!isTowerQuest(data)) continue;
    towerQuests.push(data);
  }

  // sort by minimum level and get list of max levels
  towerQuests.sort((a, b) => a.minLevel - b.minLevel);
  const maxLevels = Array.from(
    new Set(towerQuests.map(quest => quest.maxLevel))
  ).sort((a, b) => a - b);

  // sort by floor
  for (let i = 0; i < maxLevels.length; i++) {
    const num = i + 1;
    const quests = towerQuests.filter(quest => quest.maxLevel == maxLevels[i]);
    const minLevel = Math.min(...quests.map(quest => quest.minLevel));
    towerFloors.push({ num, minLevel, maxLevel: maxLevels[i], quests });
  }

  console.log(`Found ${towerFloors.length} Floors`);

  for (const { num, minLevel, maxLevel, quests } of towerFloors) {
    console.log(`\nFloor F${num}: ${minLevel}~${maxLevel}`);
    const table = Object.fromEntries(
      Array.from({ length: maxLevel - minLevel + 1 }, (_, i) => {
        const lv = minLevel + i;
        const validQuests = quests.filter(quest => quest.minLevel <= lv);
        const expDirty = validQuests.reduce((sum, quest) => {
          return sum + quest.endReceiveExperience[lv - 1];
        }, 0);
        const exp = Math.round(expDirty * 10000) / 10000;
        const penya = validQuests.reduce((sum, quest) => {
          return sum + quest.endReceiveGold;
        }, 0);

        return [lv, { exp, penya, quests: validQuests.length }] as const;
      })
    );
    console.table(table);
  }
}

main()
  .then(() => console.log("Completed"))
  .catch(e => {
    console.error(e);
    process.exit(1);
  });
