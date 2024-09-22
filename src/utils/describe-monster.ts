type LangOpt = "always" | "never" | "not en only";

export interface DescribeMonsterOpts {
  showId?: boolean;
  showRank?: boolean;
  showLevel?: boolean;
  lang?: GameLanguage;
  showLang?: LangOpt;
}

/**
 * Describes a monster in text
 * @param data MonsterData Object
 */
export function describeMonster(data: MonsterData, opts?: DescribeMonsterOpts) {
  const showLevel = opts?.showLevel ?? true;
  const showRank = opts?.showRank ?? false;
  const lang: GameLanguage = opts?.lang ?? "en";
  const showLang = opts?.showLang ?? "not en only";
  let description = "";

  // Handle showing ID
  if (opts?.showId ?? false) description += `[#${data.id}] `;

  // Handle showing level (potentially with rank)
  if (showLevel) {
    description += `[Lv. ${data.level}`;
    if (showRank) {
      const [first, ...rest] = data.rank;
      description += ` ${first.toUpperCase()}${rest.join("")}`;
    }
    description += "] ";
  }

  // Handle showing rank without level
  if (showRank && !showLevel) {
    const [first, ...rest] = data.rank;
    description += `[${first.toUpperCase()}${rest.join("")}] `;
  }

  // Handle including name
  description += data.name[lang];

  // Handle displaying language
  if (showLang === "always" || (lang != "en" && showLang == "not en only")) {
    description += ` (${lang})`;
  }

  return description;
}
