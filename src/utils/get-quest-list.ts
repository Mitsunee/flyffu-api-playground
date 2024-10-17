import { readFile } from "@foxkit/node-util/fs";
import { PATHS } from "~/paths";

let cache: number[];

/**
 * Reads and parses the cached quest id list
 * @returns Array of Quest IDs (as number)
 */
export async function getQuestList(): Promise<number[]> {
  if (cache) return cache;
  const file = await readFile(PATHS.questList);
  if (!file) throw new Error("Error while reading quests list file");
  const list = JSON.parse(file);
  cache = list;
  return list;
}
