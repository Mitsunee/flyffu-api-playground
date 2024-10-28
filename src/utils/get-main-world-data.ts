import { readFile } from "@foxkit/node-util/fs";
import { PATHS } from "~/paths";

let cache: null | WorldData = null;

/**
 * Reads and parses cached main world data
 * @returns Main World Data
 */
export async function getMainWorldData(): Promise<WorldData> {
  if (cache) return cache;

  const file = await readFile(PATHS.mainWorld);
  if (!file) throw new Error("Error when reading main world file");

  return (cache = JSON.parse(file));
}
