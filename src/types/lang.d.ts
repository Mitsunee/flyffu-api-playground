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

type LocalizedName = { en: string } & Partial<
  Record<Exclude<GameLanguage, "en">, string>
>;
