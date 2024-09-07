import fs from "fs/promises";
import { isDirectory, isFile, writeFile } from "@foxkit/node-util/fs";
import { sleep } from "./utils/sleep";
import { List } from "@foxkit/list";

const [, , ...args] = process.argv;
const isForced = args.includes("--force");

async function setupDirs() {
  if (!(await isDirectory("data"))) {
    await fs.mkdir("data");
  }

  if (!(await isDirectory("data/monsters"))) {
    await fs.mkdir("data/monsters");
  }
}

async function fetchMonsterList(): Promise<Array<number>> {
  const res = await fetch("https://api.flyff.com/monster");
  if (!res.ok) {
    throw new Error(`Failed to fetch Monster list: ${res.statusText}`);
  }

  await sleep(200);

  return res.json();
}

async function fetchMonsterData(id: number) {
  const res = await fetch(`https://api.flyff.com/monster/${id}`);
  if (!res.ok) {
    throw new Error(
      `Failed to fetch Monster data for id ${id}: ${res.statusText}`
    );
  }

  await sleep(220);

  return res.text();
}

async function main() {
  if (isForced) {
    console.log("Forceing redownloading of all data");
  }

  await setupDirs();

  console.log("Downloading Monster List");
  const list = await fetchMonsterList();
  console.log(`Found ${list.length} Monster IDs`);

  const queue = new List(list);
  let id: number | undefined;
  while ((id = queue.shift())) {
    if (!isForced && (await isFile(`data/monsters/${id}.json`))) {
      console.log(`[SKIP] Already have data for id ${id}`);
      continue;
    }

    console.log(`[LOG] Fetching data for id ${id}`);
    const data = await fetchMonsterData(id);
    await writeFile(`data/monsters/${id}.json`, data);
    console.log(`[DONE] completed download of data for id ${id}`);
  }

  // TODO: fetching skills
  // TODO: global constants for paths such as data/monsters/*.json
}

main()
  .then(() => console.log("Completed"))
  .catch(e => {
    console.error(e);
    process.exit(1);
  });
