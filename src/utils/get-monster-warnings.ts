import { getMonsterSkillData } from "./get-skill-data";

export type MonsterWarnings =
  | "flees"
  | "berserk"
  | "heals self"
  | "ranged"
  | "has stun"
  | "has root"
  | "has silence"
  | "has knockback"
  | "strong skilldmg";

export async function getMonsterWarnings(data: MonsterData) {
  const warnings = new Set<MonsterWarnings>();

  if (data.berserkThresholdHP) warnings.add("berserk");
  if (data.runaway) warnings.add("flees");
  if (data.recoveryThresholdHP) warnings.add("heals self");

  for (const attack of data.attacks) {
    if (attack.attackRange > 2) warnings.add("ranged");
    if (!attack.triggerSkill) continue;
    const skill = await getMonsterSkillData(attack.triggerSkill);
    for (const level of skill.levels) {
      if (level.flybackPropability) warnings.add("has knockback");
      for (const ability of level.abilities ?? []) {
        switch (ability.attribute) {
          case "rooting":
            warnings.add("has root");
            break;
          case "silent":
            warnings.add("has silence");
            break;
          case "stun":
          case "weaponstun":
          case "allstun":
            warnings.add("has stun");
            break;
          case "stunandrooting":
            warnings.add("has stun");
            warnings.add("has root");
        }
        if (ability.parameter == "hprestoration" && (ability.add ?? 0) < 0) {
          warnings.add("strong skilldmg");
        }
      }
    }
  }

  return Array.from(warnings);
}
