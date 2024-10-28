interface NPCData {
  id: number;
  name: LocalizedName;
  menus: Array<string>;
  image: string;
  place?: string;
  locations: Array<WorldLocation>;
  // shop
}
