import { readFile } from "@foxkit/node-util/fs";
import { PATHS } from "~/paths";

/**
 * Reads and parses the cached monster id list
 * @returns Array of Monster IDs (as number)
 */
export async function getMonsterList(): Promise<number[]> {
  const file = await readFile(PATHS.monsterList);
  if (!file) throw new Error("Error while reading monsters list file");
  return JSON.parse(file);
}
