import fs from "fs/promises";
import { isDirectory, isFile, readFile, writeFile } from "@foxkit/node-util/fs";
import { List } from "@foxkit/list";
import { sleep } from "./utils/sleep";
import { API, DATA_DIR, PATHS } from "./paths";

const [, , ...args] = process.argv;
const isForced = args.includes("--force");
const monsterData = new Map<number, MonsterData>();
const knownSkills = new Set<number>();

async function setupDirs() {
  const dirs = [DATA_DIR, PATHS.monsters, PATHS.monsterSkills];

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

  await sleep(200);

  return res.json();
}

async function fetchMonsterData(id: number) {
  const res = await fetch(API.monster(id));
  if (!res.ok) {
    throw new Error(
      `Failed to fetch Monster data for id ${id}: ${res.statusText}`
    );
  }

  await sleep(220);

  return res.text();
}

async function fetchSkillData(id: number) {
  const res = await fetch(API.skill(id));
  if (!res.ok) {
    throw new Error(
      `Failed to fetch Skill data for id ${id}: ${res.statusText}`
    );
  }

  await sleep(220);

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

async function main() {
  if (isForced) {
    console.log("Forceing redownloading of all data");
  }

  await setupDirs();

  console.log("Downloading Monster List");
  const list = await fetchMonsterList();
  console.log(`Found ${list.length} Monster IDs`);

  await writeFile(PATHS.monsterList, JSON.stringify(list));
  await downloadMonsterData(list);
  await downloadMonsterSkillsData();
}

main()
  .then(() => console.log("Completed"))
  .catch(e => {
    console.error(e);
    process.exit(1);
  });
