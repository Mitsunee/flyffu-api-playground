type QuestType = "category" | "normal" | "repeat" | "chain" | "daily";

// NOTE: not all props are implemented here
interface QuestData {
  id: number;
  name: LocalizedName;
  type: QuestType;
  repeatable: boolean;
  removable: boolean;
  partyShare: boolean;
  parent?: number;
  beginNPC?: number;
  minLevel?: number;
  maxLevel?: number;
  endReceiveGold?: number;
  endReceiveExperience?: Array<number>;
  endReceiveInventorySpaces?: number;
  endNeededItems?: Array<{ item: number; count: number }>;
  endReceiveItems?: Array<{ item: number; count: number; soulLinked: boolean }>;
}
