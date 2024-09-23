const multipliers = [
  1, 1.00484334492253, 1.01958625189898, 1.04499759650553, 1.08239165259558,
  1.13388969521045, 1.20268921308045, 1.29364432542917, 1.41420712477549,
  1.57631740727313, 1.79995320121677, 2.12134068731438, 2.61314936761785,
  3.44494970373433, 5.12583935619458, 10.20199959192
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
