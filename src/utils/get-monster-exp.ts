import { getAdjustedMonsterHP } from "./get-adjusted-monster-hp";

/**
 * Return Exp gain and Exp per HP (adjusted for dmg debuff based on level
 * difference) for Monster at specified player level
 * @param playerLv Level of player
 * @param data MonsterData Object
 * @returns Object containing Exp gain as `exp` and `expPerHp`
 */
export function getMonsterExp(playerLv: number, data: MonsterData) {
  const exp = data.experienceTable[playerLv - 1] ?? 0;
  const hpAdjstd = getAdjustedMonsterHP(playerLv, data);
  return { exp, expPerHp: exp / hpAdjstd };
}
