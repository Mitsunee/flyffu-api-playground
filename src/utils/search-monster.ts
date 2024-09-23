import { getMonsterData } from "./get-monster-data";

export async function searchMonsterByName(list: number[], query: string) {
  const matches = new Array<{ data: MonsterData; lang: "en" | "de" }>();
  for (const id of list) {
    const data = await getMonsterData(id);
    if (data.name.en.toLowerCase().includes(query)) {
      matches.push({ data, lang: "en" });
    } else if (data.name.de?.toLowerCase().includes(query)) {
      matches.push({ data, lang: "de" });
    }
  }

  return matches;
}
