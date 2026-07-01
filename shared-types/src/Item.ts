export type ItemRarity = "common" | "uncommon" | "rare" | "epic" | "legendary";

export interface Item {
  id: string;
  name: string;
  description: string;
  rarity: ItemRarity;
  iconKey: string;
  stackable: boolean;
  maxStack: number;
}

export interface InventorySlot {
  item: Item;
  quantity: number;
}
