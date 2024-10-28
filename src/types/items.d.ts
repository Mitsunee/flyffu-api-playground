type ItemRarity = "common" | "uncommon" | "rare" | "veryrare" | "unique";

interface ItemData {
  id: number;
  name: LocalizedName;
  icon: string;
  item: string;
  category: string;
  subcategory?: string;
  rarity: ItemRarity;
  element: EntityElement;
}
