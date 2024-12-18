import fs from "fs/promises";
import { isDirectory, isFile, readFile, writeFile } from "@foxkit/node-util/fs";
import { List } from "@foxkit/list";
import { sleep } from "~/utils/sleep";
import { API, DATA_DIR, PATHS } from "~/paths";

const [, , ...args] = process.argv;
const isForced = args.includes("--force");
const monsterData = new Map<number, MonsterData>();
const knownSkills = new Set<number>();
const sleepDuration = 220;

async function setupDirs() {
  const dirs = [DATA_DIR, PATHS.monsters, PATHS.monsterSkills, PATHS.quests];

  for (const dir of dirs) {
    if (!(await isDirectory(dir))) {
      await fs.mkdir(dir);
    }
  }
}

async function fetchMonsterList(): Promise<Array<number>> {
  const res = await fetch(API.monstersList);
  if (!res.ok) {
    throw new Error(`Failed to fetch Monster list: ${res.statusText}`);
  }

  await sleep(sleepDuration);

  return res.json();
}

async function fetchQuestList(): Promise<Array<number>> {
  const res = await fetch(API.questsList);
  if (!res.ok) {
    throw new Error(`Failed to fetch Quest list: ${res.statusText}`);
  }

  await sleep(sleepDuration);

  return res.json();
}

async function fetchMainWorld() {
  const res = await fetch(API.world(6063));
  if (!res.ok) {
    throw new Error(`Failed to fetch main world data`);
  }

  const data = await res.text();

  return Promise.all([sleep(sleepDuration), writeFile(PATHS.mainWorld, data)]);
}

async function fetchMonsterData(id: number) {
  const res = await fetch(API.monster(id));
  if (!res.ok) {
    throw new Error(
      `Failed to fetch Monster data for id ${id}: ${res.statusText}`
    );
  }

  await sleep(sleepDuration);

  return res.text();
}

async function fetchSkillData(id: number) {
  const res = await fetch(API.skill(id));
  if (!res.ok) {
    throw new Error(
      `Failed to fetch Skill data for id ${id}: ${res.statusText}`
    );
  }

  await sleep(sleepDuration);

  return res.text();
}

async function fetchQuestData(id: number) {
  const res = await fetch(API.quest(id));
  if (!res.ok) {
    throw new Error(
      `Failed to fetch Quest data for id ${id}: ${res.statusText}`
    );
  }

  await sleep(sleepDuration);

  return res.text();
}

async function downloadMonsterData(list: Array<number>) {
  const queue = new List(list);
  let id: number | undefined;
  while ((id = queue.shift())) {
    const filePath = PATHS.monster(id);
    if (!isForced && (await isFile(filePath))) {
      console.log(`[SKIP] Already have monster data for id ${id}`);
      const content = await readFile(filePath);
      if (!content) {
        throw new Error(`[ERROR] Could not read file '${filePath}'`);
      }
      const data = JSON.parse(content);
      monsterData.set(id, data);
      continue;
    }

    console.log(`[LOG] Fetching monster data for id ${id}`);
    const data = await fetchMonsterData(id);
    await writeFile(filePath, data);
    monsterData.set(id, JSON.parse(data));
    console.log(`[DONE] Completed download of monster data for id ${id}`);
  }
}

async function downloadQuestData(list: Array<number>) {
  const queue = new List(list);
  let id: number | undefined;
  while ((id = queue.shift())) {
    const filePath = PATHS.quest(id);
    if (!isForced && (await isFile(filePath))) {
      console.log(`[SKIP] Already have quest data for id ${id}`);
      continue;
    }

    console.log(`[LOG] Fetching quest data for id ${id}`);
    const data = await fetchQuestData(id);
    await writeFile(filePath, data);
    console.log(`[DONE] Completed download of quest data for id ${id}`);
  }
}

async function downloadMonsterSkillsData() {
  console.log("Downloading Skill Data");
  const queue = new List(monsterData.values());
  let monster: MonsterData | undefined;

  // DEBUG
  console.log(`[DEBUG] skills queue size ${queue.length}`);

  while ((monster = queue.shift())) {
    for (const attack of monster.attacks) {
      const id = attack.triggerSkill;
      if (!id || knownSkills.has(id)) {
        continue;
      }

      const filePath = PATHS.monsterSkill(id);

      if (!isForced && (await isFile(filePath))) {
        console.log(`[SKIP] Already have skill data for id ${id}`);
        continue;
      }

      const data = await fetchSkillData(id);
      await writeFile(filePath, data);
      knownSkills.add(id);
      console.log(`[DONE] Completed download of skill data for id ${id}`);
    }
  }
}

async function prepareFilteredMonsterLists(fullList: number[]) {
  const lists: Record<keyof (typeof PATHS)["monsterLists"], Array<number>> = {
    /**
     * Contains all non-flying non-event overworld monsters (excl. Kebaras,
     * Catcher and Berry Carriers)
     */
    overworld: new Array<number>(),
    /**
     * Same list as `overworld` but excluding Giants and Violets
     */
    overworldNonGiant: new Array<number>(),
    /**
     * Same list as `overworld` but only includes Giants and Violets
     */
    overworldGiant: new Array<number>()
    // TODO: figure out how to get a list of monsters in old non-instanced dungeons (Mars Dungeon etc)
  };
  type ListKey = keyof typeof lists;
  type ListEntry = [ListKey, Array<number>];

  for (const id of fullList) {
    const data = monsterData.get(id);
    if (!data) continue;
    if (data.area != "normal" || data.flying || data.event) continue;
    const nameNormalized = data.name.en.toLowerCase();
    if (nameNormalized.startsWith("criminal")) continue; // no kebaras
    if (nameNormalized.includes("berry carrier")) continue; // no berry carriers
    if (nameNormalized.endsWith("catcher")) continue; // no ore catchers
    lists.overworld.push(id);
    if (
      data.rank == "small" ||
      data.rank == "normal" ||
      data.rank == "captain"
    ) {
      lists.overworldNonGiant.push(id);
    } else {
      lists.overworldGiant.push(id);
    }
  }

  console.log(
    `[DONE] Prepared filtered lists: ${Object.keys(lists).join(", ")}`
  );

  return Promise.all(
    (Object.entries(lists) as Array<ListEntry>).map(([key, list]) =>
      writeFile(PATHS.monsterLists[key], JSON.stringify(list))
    )
  );
}

async function main() {
  if (isForced) {
    console.log("Forceing redownloading of all data");
  }

  await setupDirs();

  console.log("Downloading Lists and main world");
  const [monstersList, questsList] = await Promise.all([
    fetchMonsterList(),
    fetchQuestList(),
    fetchMainWorld()
  ]);
  console.log(`Found ${monstersList.length} Monster IDs`);
  console.log(`Found ${questsList.length} Quest IDs`);

  await Promise.all([
    writeFile(PATHS.monsterList, JSON.stringify(monstersList)),
    writeFile(PATHS.questList, JSON.stringify(questsList))
  ]);
  await downloadMonsterData(monstersList);
  await downloadMonsterSkillsData();
  await downloadQuestData(questsList);
  await prepareFilteredMonsterLists(monstersList);
}

main()
  .then(() => console.log("Completed"))
  .catch(e => {
    console.error(e);
    process.exit(1);
  });
