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
  // TODO: endReceiveItems
}
