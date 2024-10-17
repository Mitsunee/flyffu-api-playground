import { isFile, readFile } from "@foxkit/node-util/fs";
import { PATHS } from "~/paths";

const cache = new Map<number, QuestData>();

/**
 * Reads and parses cached Quest Data
 * @param id Quest Id
 * @returns Data of Quest
 */
export async function getQuestData(id: number): Promise<QuestData> {
  const cached = cache.get(id);
  if (cached) return cached;

  const filePath = PATHS.quest(id);
  const exists = await isFile(filePath);
  if (!exists) throw new Error(`Quest id ${id} does not exist`);

  const file = await readFile(filePath);
  if (!file) throw new Error(`Error when readinf file '${filePath}'`);

  const data: QuestData = JSON.parse(file);
  cache.set(id, data);
  return data;
}
