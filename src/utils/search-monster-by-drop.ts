import { getMonsterData } from "./get-monster-data";

export async function searchMonsterByDrop(
  list: number[],
  query: number | ItemData
) {
  const matches = new Array<MonsterData>();
  const queryId = typeof query == "number" ? query : query.id;
  for (const id of list) {
    const data = await getMonsterData(id);
    if (data.drops.some(drop => drop.item == queryId)) {
      matches.push(data);
    }
  }

  return matches;
}
