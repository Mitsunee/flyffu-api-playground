import { readFile } from "@foxkit/node-util/fs";
import { PATHS } from "~/paths";

type MonsterListKey = keyof (typeof PATHS)["monsterLists"];
let cache: number[];

/**
 * Reads and parses the cached monster id list. If a specific name is provided
 * that list is returned, otherwise the full monster list will be retrieved
 * @param listName Name of specific list (optional)
 * @returns Array of Monster IDs (as number)
 */
export async function getMonsterList(
  listName?: MonsterListKey
): Promise<number[]> {
  if (cache) return cache;
  const filePath = listName ? PATHS.monsterLists[listName] : PATHS.monsterList;
  const file = await readFile(filePath);
  if (!file) throw new Error("Error while reading monsters list file");
  const list = JSON.parse(file);
  cache = list;
  return list;
}
