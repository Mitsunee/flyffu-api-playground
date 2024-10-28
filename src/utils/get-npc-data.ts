import { isFile, readFile, writeFile } from "@foxkit/node-util/fs";
import { API, PATHS } from "~/paths";

const cache = new Map<number, NPCData>();

/**
 * Fetches item data, either from cache or API
 * @param id Item ID
 * @returns Data of Item
 */
export async function getNPCData(id: number): Promise<NPCData> {
  const cached = cache.get(id);
  if (cached) return cached;

  const filePath = PATHS.npc(id);
  const exists = await isFile(filePath);
  let data: NPCData | null = null;

  // check if item exists in local cache
  if (exists) {
    const file = await readFile(filePath);
    if (!file) throw new Error(`Error when reading file '${filePath}'`);
    data = JSON.parse(file);
  }

  // fetch data from API
  if (!data) {
    const res = await fetch(API.npc(id));
    if (!res.ok) {
      throw new Error(
        `Failed to fetch Item data for id ${id}: ${res.statusText}`
      );
    }

    data = (await res.json()) as NPCData;
    await writeFile(filePath, JSON.stringify(data)); // save to local cache
  }

  cache.set(id, data);
  return data;
}
