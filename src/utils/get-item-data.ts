import { isFile, readFile, writeFile } from "@foxkit/node-util/fs";
import { API, PATHS } from "~/paths";

const cache = new Map<number, ItemData>();

/**
 * Fetches item data, either from cache or API
 * @param id Item ID
 * @returns Data of Item
 */
export async function getItemData(id: number): Promise<ItemData> {
  const cached = cache.get(id);
  if (cached) return cached;

  const filePath = PATHS.item(id);
  const exists = await isFile(filePath);
  let data: ItemData | null = null;

  // check if item exists in local cache
  if (exists) {
    const file = await readFile(filePath);
    if (!file) throw new Error(`Error when reading file '${filePath}'`);
    data = JSON.parse(file);
  }

  // fetch data from API
  if (!data) {
    const res = await fetch(API.item(id));
    if (!res.ok) {
      throw new Error(
        `Failed to fetch Item data for id ${id}: ${res.statusText}`
      );
    }

    data = (await res.json()) as ItemData;
    await writeFile(filePath, JSON.stringify(data)); // save to local cache
  }

  cache.set(id, data);
  return data;
}
