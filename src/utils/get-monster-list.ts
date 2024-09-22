import { readFile } from "@foxkit/node-util/fs";
import { PATHS } from "~/paths";

let cache: number[];

/**
 * Reads and parses the cached monster id list
 * @returns Array of Monster IDs (as number)
 */
export async function getMonsterList(): Promise<number[]> {
  if (cache) return cache;
  const file = await readFile(PATHS.monsterList);
  if (!file) throw new Error("Error while reading monsters list file");
  const list = JSON.parse(file);
  cache = list;
  return list;
}
