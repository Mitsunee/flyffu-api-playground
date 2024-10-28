import { getMainWorldData } from "./get-main-world-data";

/**
 * Finds name of continent from WorldLocation data.
 * If not possible `"??"` is returned.
 * @param location WorldLocation data
 * @returns Continent Name or `"??"`
 */
export async function getContinentFromLocation(location: WorldLocation) {
  const continentId = location.continent;
  if (typeof continentId != "number") return "??";
  const world = await getMainWorldData();
  const continent = world.continents.find(
    continent => continent.id == continentId
  );
  if (!continent) return "??";
  if (continent.name.en == "ids_propmap_txt_100077") return "Coral Island"; // nice data gala
  return continent.name.en;
}
