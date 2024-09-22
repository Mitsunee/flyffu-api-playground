import { isFile, readFile } from "@foxkit/node-util/fs";
import { PATHS } from "~/paths";

const cache = new Map<number, MonsterData>();

/**
 * Reads and parses cached Monster Data
 * @param id Monster Id
 * @returns Data of Monster
 */
export async function getMonsterData(id: number): Promise<MonsterData> {
  const cached = cache.get(id);
  if (cached) return cached;

  const filePath = PATHS.monster(id);
  const exists = await isFile(filePath);
  if (!exists) throw new Error(`Monster id ${id} does not exist`);

  const file = await readFile(filePath);
  if (!file) throw new Error(`Error when reading file '${filePath}'`);

  const data: MonsterData = JSON.parse(file);
  cache.set(id, data);
  return data;
}
