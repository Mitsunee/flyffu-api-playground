const multipliers = [
  1, 1.0196, 1.045, 1.0824, 1.1339, 1.2027, 1.2936, 1.4142, 1.5763, 1.8, 2.1213,
  2.6131, 3.4449, 5.1258, 10.202
];

/**
 * Returns theoretical HP of a Monster based on dmg debuff for specified player
 * level by multiplying the HP stat with a multiplier derived from the debuff
 * @param playerLv Level of player
 * @param data MonsterData Object
 * @returns theoretical HP of Monster
 */
export function getAdjustedMonsterHP(playerLv: number, data: MonsterData) {
  const lvDiff = data.level - playerLv;
  if (lvDiff < 0) return data.hp;
  const multiplier = multipliers[lvDiff] ?? multipliers[multipliers.length - 1];
  return data.hp * multiplier;
}
