type GameLanguage =
  | "en"
  | "ar"
  | "br"
  | "cns"
  | "de"
  | "fi"
  | "fil"
  | "fr"
  | "id"
  | "it"
  | "jp"
  | "kr"
  | "nl"
  | "pl"
  | "ru"
  | "sp"
  | "sw"
  | "th"
  | "tw"
  | "vi";

type EntityName = Record<"en" | "kr", string> &
  Partial<Record<GameLanguage, string>>;

type MonsterRank =
  | "small"
  | "normal"
  | "captain"
  | "giant"
  | "violet"
  | "boss"
  | "material"
  | "super"
  | "guard"
  | "citizen"
  | "worldboss";

type MonsterArea = "normal" | "dungeon" | "instance";

type EntityElement =
  | "fire"
  | "water"
  | "electricity"
  | "wind"
  | "earth"
  | "none";

interface MonsterAttack {
  minAttack: number;
  maxAttack: number;
  attackRange: number;
  target: "area" | "single";
  triggerSkill?: number;
}

/**
 * Monster Data from `/monster/{id}` endpoint
 * Some (unused) props may be missing
 */
interface MonsterData {
  id: number;
  name: EntityName;
  event: boolean;
  level: number;
  rank: MonsterRank;
  area: MonsterArea;
  element: EntityElement;
  /**
   * Use with `https://api.flyff.com/monster/image/{icon}`
   */
  icon: string;
  flying: boolean;
  hp: number;
  runaway: boolean;
  berserkThresholdHP?: number;
  recoveryThresholdHP?: number;
  experienceTable: Array<number>;
  attacks: Array<MonsterAttack>;
}

interface MonsterSkillAbility {
  parameter: string;
  attribute?: string;
  add?: number;
}

interface MonsterSkillLevel {
  duration?: number;
  abilities?: Array<MonsterSkillAbility>;
  flybackPropability?: number;
}

/**
 * Skill used in MonsterAttack available via `/skill/{id}`
 * Some (unused) props may be missing
 */
interface MonsterSkill {
  id: number;
  name: EntityName;
  levels: Array<MonsterSkillLevel>;
}
