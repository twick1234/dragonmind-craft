export enum BlockType {
  AIR = 0,
  // Natural
  GRASS = 1,
  DIRT = 2,
  STONE = 3,
  SAND = 4,
  GRAVEL = 5,
  BEDROCK = 6,
  WATER = 7,
  LAVA = 8,
  ICE = 9,
  SNOW = 10,
  CLAY = 11,
  // Wood types
  OAK_LOG = 12,
  BIRCH_LOG = 13,
  SPRUCE_LOG = 14,
  JUNGLE_LOG = 15,
  OAK_LEAVES = 16,
  BIRCH_LEAVES = 17,
  SPRUCE_LEAVES = 18,
  JUNGLE_LEAVES = 19,
  // Ores
  COAL_ORE = 20,
  IRON_ORE = 21,
  GOLD_ORE = 22,
  DIAMOND_ORE = 23,
  EMERALD_ORE = 24,
  REDSTONE_ORE = 25,
  LAPIS_ORE = 26,
  // Processed
  COBBLESTONE = 27,
  OAK_PLANKS = 28,
  BIRCH_PLANKS = 29,
  SPRUCE_PLANKS = 30,
  BRICKS = 31,
  STONE_BRICKS = 32,
  GLASS = 33,
  IRON_BLOCK = 34,
  GOLD_BLOCK = 35,
  DIAMOND_BLOCK = 36,
  EMERALD_BLOCK = 37,
  // Special
  GLOWSTONE = 38,
  OBSIDIAN = 39,
  TNT = 40,
  SPONGE = 41,
  // Plants
  TALL_GRASS = 42,
  FERN = 43,
  FLOWER_RED = 44,
  FLOWER_YELLOW = 45,
  CACTUS = 46,
  SUGAR_CANE = 47,
  WHEAT_0 = 48,
  WHEAT_1 = 49,
  WHEAT_2 = 50,
  WHEAT_FULL = 51,
  // Crafting
  CRAFTING_TABLE = 52,
  FURNACE = 53,
  CHEST = 54,
  TORCH = 55,
  LADDER = 56,
  // Dragon-themed (unique to DragonMind Craft)
  DRAGON_STONE = 57,
  DRAGON_ORE = 58,
  DRAGON_CRYSTAL = 59,
  DRAGON_SCALE_BLOCK = 60,
  NETHER_RACK = 61,
  SOUL_SAND = 62,
  MAGMA_BLOCK = 63,
}

export interface BlockDef {
  id: BlockType;
  name: string;
  solid: boolean;
  transparent: boolean;
  fluid: boolean;
  luminance: number;          // 0-15 light emission
  hardness: number;           // seconds to break by hand
  toolRequired: ToolType | null;
  drops: BlockType[];
  color: number;              // hex color for procedural texture
  topColor?: number;
  sideColor?: number;
  bottomColor?: number;
  flammable: boolean;
  stackSize: number;
}

export enum ToolType {
  HAND = 'hand',
  PICKAXE = 'pickaxe',
  AXE = 'axe',
  SHOVEL = 'shovel',
  SWORD = 'sword',
  HOE = 'hoe',
}

export enum ToolTier {
  WOOD = 0,
  STONE = 1,
  IRON = 2,
  GOLD = 3,
  DIAMOND = 4,
}
