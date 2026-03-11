import { BlockType, ToolType, ToolTier } from '../world/blocks/BlockTypes';

export enum ItemId {
  // Tools
  WOOD_PICKAXE = 1000, STONE_PICKAXE, IRON_PICKAXE, GOLD_PICKAXE, DIAMOND_PICKAXE,
  WOOD_AXE, STONE_AXE, IRON_AXE, GOLD_AXE, DIAMOND_AXE,
  WOOD_SHOVEL, STONE_SHOVEL, IRON_SHOVEL, GOLD_SHOVEL, DIAMOND_SHOVEL,
  WOOD_SWORD, STONE_SWORD, IRON_SWORD, GOLD_SWORD, DIAMOND_SWORD,
  WOOD_HOE, STONE_HOE, IRON_HOE, GOLD_HOE, DIAMOND_HOE,
  // Armor
  LEATHER_HELMET, LEATHER_CHESTPLATE, LEATHER_LEGGINGS, LEATHER_BOOTS,
  IRON_HELMET, IRON_CHESTPLATE, IRON_LEGGINGS, IRON_BOOTS,
  GOLD_HELMET, GOLD_CHESTPLATE, GOLD_LEGGINGS, GOLD_BOOTS,
  DIAMOND_HELMET, DIAMOND_CHESTPLATE, DIAMOND_LEGGINGS, DIAMOND_BOOTS,
  // Resources
  COAL = 2000, IRON_INGOT, GOLD_INGOT, DIAMOND, EMERALD, REDSTONE, LAPIS,
  STICK, STRING, FEATHER, GUNPOWDER, BONE, ARROW, BOW,
  LEATHER, WOOL_WHITE, WOOL_COLORED,
  // Food
  APPLE = 3000, BREAD, RAW_BEEF, COOKED_BEEF, RAW_PORK, COOKED_PORK,
  RAW_CHICKEN, COOKED_CHICKEN, EGG, CARROT, POTATO, BAKED_POTATO,
  // Dragon items
  DRAGON_SCALE = 4000, DRAGON_HEART, DRAGON_SWORD, DRAGON_PICKAXE, DRAGON_ARMOR,
  // Misc
  BUCKET = 5000, WATER_BUCKET, LAVA_BUCKET, COMPASS, CLOCK, MAP,
  FLINT, FLINT_AND_STEEL, SHEARS, FISHING_ROD, BOOK, PAPER,
}

export interface ItemDef {
  id: number;
  name: string;
  stackSize: number;
  color: number;
  tool?: ToolType;
  tier?: ToolTier;
  damage?: number;
  durability?: number;
  foodValue?: number;
  saturation?: number;
  isBlock?: boolean;
  blockId?: BlockType;
  isArmor?: boolean;
  armorSlot?: 'helmet' | 'chestplate' | 'leggings' | 'boots';
  armorValue?: number;
}

const T = ToolType;
const Ti = ToolTier;

export const ITEMS: Record<number, ItemDef> = {
  // Tools - Pickaxes
  [ItemId.WOOD_PICKAXE]:    {id:ItemId.WOOD_PICKAXE, name:'Wooden Pickaxe', stackSize:1, color:0xba9757, tool:T.PICKAXE, tier:Ti.WOOD, damage:2, durability:59},
  [ItemId.STONE_PICKAXE]:   {id:ItemId.STONE_PICKAXE, name:'Stone Pickaxe', stackSize:1, color:0x808080, tool:T.PICKAXE, tier:Ti.STONE, damage:3, durability:131},
  [ItemId.IRON_PICKAXE]:    {id:ItemId.IRON_PICKAXE, name:'Iron Pickaxe', stackSize:1, color:0xd0d0d8, tool:T.PICKAXE, tier:Ti.IRON, damage:4, durability:250},
  [ItemId.GOLD_PICKAXE]:    {id:ItemId.GOLD_PICKAXE, name:'Gold Pickaxe', stackSize:1, color:0xffd700, tool:T.PICKAXE, tier:Ti.GOLD, damage:2, durability:32},
  [ItemId.DIAMOND_PICKAXE]: {id:ItemId.DIAMOND_PICKAXE, name:'Diamond Pickaxe', stackSize:1, color:0x4ae0e8, tool:T.PICKAXE, tier:Ti.DIAMOND, damage:5, durability:1561},
  // Axes
  [ItemId.WOOD_AXE]:    {id:ItemId.WOOD_AXE, name:'Wooden Axe', stackSize:1, color:0xba9757, tool:T.AXE, tier:Ti.WOOD, damage:3, durability:59},
  [ItemId.STONE_AXE]:   {id:ItemId.STONE_AXE, name:'Stone Axe', stackSize:1, color:0x808080, tool:T.AXE, tier:Ti.STONE, damage:4, durability:131},
  [ItemId.IRON_AXE]:    {id:ItemId.IRON_AXE, name:'Iron Axe', stackSize:1, color:0xd0d0d8, tool:T.AXE, tier:Ti.IRON, damage:5, durability:250},
  [ItemId.GOLD_AXE]:    {id:ItemId.GOLD_AXE, name:'Gold Axe', stackSize:1, color:0xffd700, tool:T.AXE, tier:Ti.GOLD, damage:3, durability:32},
  [ItemId.DIAMOND_AXE]: {id:ItemId.DIAMOND_AXE, name:'Diamond Axe', stackSize:1, color:0x4ae0e8, tool:T.AXE, tier:Ti.DIAMOND, damage:6, durability:1561},
  // Swords
  [ItemId.WOOD_SWORD]:    {id:ItemId.WOOD_SWORD, name:'Wooden Sword', stackSize:1, color:0xba9757, tool:T.SWORD, tier:Ti.WOOD, damage:4, durability:59},
  [ItemId.STONE_SWORD]:   {id:ItemId.STONE_SWORD, name:'Stone Sword', stackSize:1, color:0x808080, tool:T.SWORD, tier:Ti.STONE, damage:5, durability:131},
  [ItemId.IRON_SWORD]:    {id:ItemId.IRON_SWORD, name:'Iron Sword', stackSize:1, color:0xd0d0d8, tool:T.SWORD, tier:Ti.IRON, damage:6, durability:250},
  [ItemId.GOLD_SWORD]:    {id:ItemId.GOLD_SWORD, name:'Gold Sword', stackSize:1, color:0xffd700, tool:T.SWORD, tier:Ti.GOLD, damage:4, durability:32},
  [ItemId.DIAMOND_SWORD]: {id:ItemId.DIAMOND_SWORD, name:'Diamond Sword', stackSize:1, color:0x4ae0e8, tool:T.SWORD, tier:Ti.DIAMOND, damage:7, durability:1561},
  // Shovels
  [ItemId.WOOD_SHOVEL]:    {id:ItemId.WOOD_SHOVEL, name:'Wooden Shovel', stackSize:1, color:0xba9757, tool:T.SHOVEL, tier:Ti.WOOD, damage:1, durability:59},
  [ItemId.STONE_SHOVEL]:   {id:ItemId.STONE_SHOVEL, name:'Stone Shovel', stackSize:1, color:0x808080, tool:T.SHOVEL, tier:Ti.STONE, damage:2, durability:131},
  [ItemId.IRON_SHOVEL]:    {id:ItemId.IRON_SHOVEL, name:'Iron Shovel', stackSize:1, color:0xd0d0d8, tool:T.SHOVEL, tier:Ti.IRON, damage:3, durability:250},
  [ItemId.DIAMOND_SHOVEL]: {id:ItemId.DIAMOND_SHOVEL, name:'Diamond Shovel', stackSize:1, color:0x4ae0e8, tool:T.SHOVEL, tier:Ti.DIAMOND, damage:4, durability:1561},
  // Armor
  [ItemId.IRON_HELMET]:     {id:ItemId.IRON_HELMET, name:'Iron Helmet', stackSize:1, color:0xd0d0d8, isArmor:true, armorSlot:'helmet', armorValue:2, durability:165},
  [ItemId.IRON_CHESTPLATE]: {id:ItemId.IRON_CHESTPLATE, name:'Iron Chestplate', stackSize:1, color:0xd0d0d8, isArmor:true, armorSlot:'chestplate', armorValue:6, durability:240},
  [ItemId.IRON_LEGGINGS]:   {id:ItemId.IRON_LEGGINGS, name:'Iron Leggings', stackSize:1, color:0xd0d0d8, isArmor:true, armorSlot:'leggings', armorValue:5, durability:225},
  [ItemId.IRON_BOOTS]:      {id:ItemId.IRON_BOOTS, name:'Iron Boots', stackSize:1, color:0xd0d0d8, isArmor:true, armorSlot:'boots', armorValue:2, durability:195},
  [ItemId.DIAMOND_HELMET]:     {id:ItemId.DIAMOND_HELMET, name:'Diamond Helmet', stackSize:1, color:0x4ae0e8, isArmor:true, armorSlot:'helmet', armorValue:3, durability:363},
  [ItemId.DIAMOND_CHESTPLATE]: {id:ItemId.DIAMOND_CHESTPLATE, name:'Diamond Chestplate', stackSize:1, color:0x4ae0e8, isArmor:true, armorSlot:'chestplate', armorValue:8, durability:528},
  [ItemId.DIAMOND_LEGGINGS]:   {id:ItemId.DIAMOND_LEGGINGS, name:'Diamond Leggings', stackSize:1, color:0x4ae0e8, isArmor:true, armorSlot:'leggings', armorValue:6, durability:495},
  [ItemId.DIAMOND_BOOTS]:      {id:ItemId.DIAMOND_BOOTS, name:'Diamond Boots', stackSize:1, color:0x4ae0e8, isArmor:true, armorSlot:'boots', armorValue:3, durability:429},
  // Dragon
  [ItemId.DRAGON_SWORD]:   {id:ItemId.DRAGON_SWORD, name:'Dragon Sword', stackSize:1, color:0xaa40cc, tool:T.SWORD, tier:Ti.DIAMOND, damage:12, durability:3000},
  [ItemId.DRAGON_PICKAXE]: {id:ItemId.DRAGON_PICKAXE, name:'Dragon Pickaxe', stackSize:1, color:0xaa40cc, tool:T.PICKAXE, tier:Ti.DIAMOND, damage:8, durability:3000},
  // Resources
  [ItemId.COAL]:      {id:ItemId.COAL, name:'Coal', stackSize:64, color:0x202020},
  [ItemId.IRON_INGOT]:{id:ItemId.IRON_INGOT, name:'Iron Ingot', stackSize:64, color:0xd0d0d8},
  [ItemId.GOLD_INGOT]:{id:ItemId.GOLD_INGOT, name:'Gold Ingot', stackSize:64, color:0xffd700},
  [ItemId.DIAMOND]:   {id:ItemId.DIAMOND, name:'Diamond', stackSize:64, color:0x4ae0e8},
  [ItemId.EMERALD]:   {id:ItemId.EMERALD, name:'Emerald', stackSize:64, color:0x00a040},
  [ItemId.STICK]:     {id:ItemId.STICK, name:'Stick', stackSize:64, color:0xba9757},
  [ItemId.STRING]:    {id:ItemId.STRING, name:'String', stackSize:64, color:0xffffff},
  [ItemId.FEATHER]:   {id:ItemId.FEATHER, name:'Feather', stackSize:64, color:0xeeeeee},
  [ItemId.GUNPOWDER]: {id:ItemId.GUNPOWDER, name:'Gunpowder', stackSize:64, color:0x444444},
  [ItemId.BONE]:      {id:ItemId.BONE, name:'Bone', stackSize:64, color:0xf0eecc},
  [ItemId.ARROW]:     {id:ItemId.ARROW, name:'Arrow', stackSize:64, color:0x909090},
  [ItemId.LEATHER]:   {id:ItemId.LEATHER, name:'Leather', stackSize:64, color:0xa05030},
  [ItemId.DRAGON_SCALE]:{id:ItemId.DRAGON_SCALE, name:'Dragon Scale', stackSize:64, color:0xaa40cc},
  [ItemId.DRAGON_HEART]:{id:ItemId.DRAGON_HEART, name:'Dragon Heart', stackSize:1, color:0xff00aa},
  // Food
  [ItemId.APPLE]:         {id:ItemId.APPLE, name:'Apple', stackSize:64, color:0xff2020, foodValue:4, saturation:2.4},
  [ItemId.BREAD]:         {id:ItemId.BREAD, name:'Bread', stackSize:64, color:0xd4a060, foodValue:5, saturation:6},
  [ItemId.COOKED_BEEF]:   {id:ItemId.COOKED_BEEF, name:'Steak', stackSize:64, color:0x8a3010, foodValue:8, saturation:12.8},
  [ItemId.COOKED_PORK]:   {id:ItemId.COOKED_PORK, name:'Cooked Porkchop', stackSize:64, color:0xc07050, foodValue:8, saturation:12.8},
  [ItemId.COOKED_CHICKEN]:{id:ItemId.COOKED_CHICKEN, name:'Cooked Chicken', stackSize:64, color:0xd4a060, foodValue:6, saturation:7.2},
  [ItemId.BAKED_POTATO]:  {id:ItemId.BAKED_POTATO, name:'Baked Potato', stackSize:64, color:0xc09050, foodValue:5, saturation:6},
  [ItemId.CARROT]:        {id:ItemId.CARROT, name:'Carrot', stackSize:64, color:0xff8020, foodValue:3, saturation:3.6},
  // Misc
  [ItemId.FLINT_AND_STEEL]:{id:ItemId.FLINT_AND_STEEL, name:'Flint and Steel', stackSize:1, color:0x808080, durability:64},
  [ItemId.SHEARS]:        {id:ItemId.SHEARS, name:'Shears', stackSize:1, color:0x909090, durability:238},
};

export function getItem(id: number): ItemDef | null {
  return ITEMS[id] ?? null;
}

// Block IDs as item IDs (blocks can be placed)
export function blockToItemId(blockId: number): number {
  return blockId; // Block IDs below 1000 are used directly as items
}
