import { isFile, readFile } from "@foxkit/node-util/fs";
import { PATHS } from "~/paths";

const cache = new Map<number, MonsterSkill>();
/**
 * Reads and parses cached Monster Skill Data
 * @param id Monster Skill Id
 * @returns Data of Monster Skill
 */
export async function getMonsterSkillData(id: number): Promise<MonsterSkill> {
  const cached = cache.get(id);
  if (cached) return cached;

  const filePath = PATHS.monsterSkill(id);
  const exists = await isFile(filePath);
  if (!exists) throw new Error(`Monster skill id ${id} does not exist`);

  const file = await readFile(filePath);
  if (!file) throw new Error(`Error when reading file '${filePath}'`);

  const data: MonsterSkill = JSON.parse(file);
  cache.set(id, data);
  return data;
}
