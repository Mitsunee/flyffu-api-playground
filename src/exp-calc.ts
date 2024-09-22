/*
### CONFIGURATION ###
The following section contains an editable level range and monster filter
*/

import { getMonsterData } from "./utils/get-monster-data";
import { getMonsterList } from "./utils/get-monster-list";

/**
 * How many monsters to display per level (-1 to show all)
 */
// TEMP: unused
//const limitList = 5;
/**
 * Minimum player level that will be calculated (1-160)
 */
const playerMinLevel: number = 95;
/**
 * Maximum player level that will be calculated (1-160)
 */
const playerMaxLevel: number = 105;
/**
 * This function should return a function that will be used to filter the monster list
 * @param playerLevel
 */
const createFilter: (
  playerLevel: number
) => (data: MonsterData) => boolean = playerLevel => {
  const lvMin = playerLevel + 7;
  const lvMax = playerLevel + 13;
  /**
   * Filter function here:
   */
  return data => {
    if (data.level < lvMin) return false; // monster must be at least lvMin
    if (data.level > lvMax) return false; // monster may not be above lvMax
    if (data.area != "normal") return false; // only overworld monsters
    if (data.flying || data.event) return false; // no flying or event monsters
    // Monster must be small, normal or captain rank
    if (
      !(data.rank == "small" || data.rank == "normal" || data.rank == "captain")
    ) {
      return false;
    }
    const nameNormalized = data.name.en.toLowerCase();
    if (nameNormalized.startsWith("criminal")) return false; // no kebaras
    if (nameNormalized.includes("berry carrier")) return false; // no berry carriers
    if (nameNormalized.endsWith("catcher")) return false; // no ore catchers
    return true;
  };
};

/*
### CONFIGURATION END
*/

async function main() {
  const list = await getMonsterList();
  const levels = new Array<{
    playerLv: number;
    monsters: Array<MonsterData>;
    filterFn: ReturnType<typeof createFilter>;
  }>();

  // create levels
  for (let lv = playerMinLevel; lv <= playerMaxLevel; lv++) {
    levels.push({ playerLv: lv, monsters: [], filterFn: createFilter(lv) });
  }

  // filter monsters and add data
  for (const id of list) {
    const data = await getMonsterData(id);
    for (const { monsters, filterFn } of levels) {
      if (filterFn(data)) monsters.push(data);
    }
  }

  // DEBUG
  for (const { playerLv, monsters } of levels) {
    monsters.sort((a, b) => a.level - b.level); // sort monster by lvl
    console.log(`\nFor level ${playerLv} found:`);
    monsters.forEach(monster =>
      console.log(`- [${monster.id}] [${monster.level}] ${monster.name.en}`)
    );
  }
}

main()
  .then(() => console.log("Completed"))
  .catch(e => {
    console.error(e);
    process.exit(1);
  });
