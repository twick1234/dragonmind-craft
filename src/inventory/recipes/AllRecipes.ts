import { BlockType } from '../../world/blocks/BlockTypes';
import { ItemId } from '../ItemRegistry';

// Recipe: { pattern: 3x3 grid (null=empty), result: {id, count} }
// Items <1000 = block IDs, >=1000 = ItemId

export interface Recipe {
  pattern: (number | null)[][];  // 3x3
  result: { id: number; count: number };
  shapeless?: boolean;
}

const B = BlockType;
const I = ItemId;

export const CRAFTING_RECIPES: Recipe[] = [
  // === BASIC WOOD ===
  { pattern: [[B.OAK_LOG,null,null],[null,null,null],[null,null,null]], result:{id:B.OAK_PLANKS,count:4}, shapeless:true },
  { pattern: [[B.BIRCH_LOG,null,null],[null,null,null],[null,null,null]], result:{id:B.BIRCH_PLANKS,count:4}, shapeless:true },
  { pattern: [[B.SPRUCE_LOG,null,null],[null,null,null],[null,null,null]], result:{id:B.SPRUCE_PLANKS,count:4}, shapeless:true },
  // Sticks
  { pattern: [[B.OAK_PLANKS,null,null],[B.OAK_PLANKS,null,null],[null,null,null]], result:{id:I.STICK,count:4}, shapeless:false },
  // Crafting Table
  { pattern: [[B.OAK_PLANKS,B.OAK_PLANKS,null],[B.OAK_PLANKS,B.OAK_PLANKS,null],[null,null,null]], result:{id:B.CRAFTING_TABLE,count:1} },
  // Chest
  { pattern: [[B.OAK_PLANKS,B.OAK_PLANKS,B.OAK_PLANKS],[B.OAK_PLANKS,null,B.OAK_PLANKS],[B.OAK_PLANKS,B.OAK_PLANKS,B.OAK_PLANKS]], result:{id:B.CHEST,count:1} },
  // Furnace
  { pattern: [[B.COBBLESTONE,B.COBBLESTONE,B.COBBLESTONE],[B.COBBLESTONE,null,B.COBBLESTONE],[B.COBBLESTONE,B.COBBLESTONE,B.COBBLESTONE]], result:{id:B.FURNACE,count:1} },
  // Torch
  { pattern: [[I.COAL,null,null],[I.STICK,null,null],[null,null,null]], result:{id:B.TORCH,count:4}, shapeless:true },

  // === TOOLS - WOODEN ===
  { pattern: [[B.OAK_PLANKS,B.OAK_PLANKS,null],[null,I.STICK,null],[null,I.STICK,null]], result:{id:I.WOOD_PICKAXE,count:1} },
  { pattern: [[B.OAK_PLANKS,B.OAK_PLANKS,null],[B.OAK_PLANKS,I.STICK,null],[null,I.STICK,null]], result:{id:I.WOOD_AXE,count:1} },
  { pattern: [[null,B.OAK_PLANKS,null],[null,I.STICK,null],[null,I.STICK,null]], result:{id:I.WOOD_SHOVEL,count:1} },
  { pattern: [[null,B.OAK_PLANKS,null],[null,B.OAK_PLANKS,null],[null,I.STICK,null]], result:{id:I.WOOD_SWORD,count:1} },
  { pattern: [[B.OAK_PLANKS,B.OAK_PLANKS,null],[null,I.STICK,null],[null,I.STICK,null]], result:{id:I.WOOD_HOE,count:1} },

  // === TOOLS - STONE ===
  { pattern: [[B.COBBLESTONE,B.COBBLESTONE,null],[null,I.STICK,null],[null,I.STICK,null]], result:{id:I.STONE_PICKAXE,count:1} },
  { pattern: [[B.COBBLESTONE,B.COBBLESTONE,null],[B.COBBLESTONE,I.STICK,null],[null,I.STICK,null]], result:{id:I.STONE_AXE,count:1} },
  { pattern: [[null,B.COBBLESTONE,null],[null,I.STICK,null],[null,I.STICK,null]], result:{id:I.STONE_SHOVEL,count:1} },
  { pattern: [[null,B.COBBLESTONE,null],[null,B.COBBLESTONE,null],[null,I.STICK,null]], result:{id:I.STONE_SWORD,count:1} },

  // === TOOLS - IRON ===
  { pattern: [[I.IRON_INGOT,I.IRON_INGOT,null],[null,I.STICK,null],[null,I.STICK,null]], result:{id:I.IRON_PICKAXE,count:1} },
  { pattern: [[I.IRON_INGOT,I.IRON_INGOT,null],[I.IRON_INGOT,I.STICK,null],[null,I.STICK,null]], result:{id:I.IRON_AXE,count:1} },
  { pattern: [[null,I.IRON_INGOT,null],[null,I.STICK,null],[null,I.STICK,null]], result:{id:I.IRON_SHOVEL,count:1} },
  { pattern: [[null,I.IRON_INGOT,null],[null,I.IRON_INGOT,null],[null,I.STICK,null]], result:{id:I.IRON_SWORD,count:1} },

  // === TOOLS - DIAMOND ===
  { pattern: [[I.DIAMOND,I.DIAMOND,null],[null,I.STICK,null],[null,I.STICK,null]], result:{id:I.DIAMOND_PICKAXE,count:1} },
  { pattern: [[I.DIAMOND,I.DIAMOND,null],[I.DIAMOND,I.STICK,null],[null,I.STICK,null]], result:{id:I.DIAMOND_AXE,count:1} },
  { pattern: [[null,I.DIAMOND,null],[null,I.STICK,null],[null,I.STICK,null]], result:{id:I.DIAMOND_SHOVEL,count:1} },
  { pattern: [[null,I.DIAMOND,null],[null,I.DIAMOND,null],[null,I.STICK,null]], result:{id:I.DIAMOND_SWORD,count:1} },

  // === ARMOR - IRON ===
  { pattern: [[I.IRON_INGOT,null,I.IRON_INGOT],[I.IRON_INGOT,null,I.IRON_INGOT],[null,null,null]], result:{id:I.IRON_HELMET,count:1} },
  { pattern: [[I.IRON_INGOT,null,I.IRON_INGOT],[I.IRON_INGOT,I.IRON_INGOT,I.IRON_INGOT],[I.IRON_INGOT,I.IRON_INGOT,I.IRON_INGOT]], result:{id:I.IRON_CHESTPLATE,count:1} },
  { pattern: [[I.IRON_INGOT,I.IRON_INGOT,I.IRON_INGOT],[I.IRON_INGOT,null,I.IRON_INGOT],[I.IRON_INGOT,null,I.IRON_INGOT]], result:{id:I.IRON_LEGGINGS,count:1} },
  { pattern: [[null,null,null],[I.IRON_INGOT,null,I.IRON_INGOT],[I.IRON_INGOT,null,I.IRON_INGOT]], result:{id:I.IRON_BOOTS,count:1} },

  // === ARMOR - DIAMOND ===
  { pattern: [[I.DIAMOND,null,I.DIAMOND],[I.DIAMOND,null,I.DIAMOND],[null,null,null]], result:{id:I.DIAMOND_HELMET,count:1} },
  { pattern: [[I.DIAMOND,null,I.DIAMOND],[I.DIAMOND,I.DIAMOND,I.DIAMOND],[I.DIAMOND,I.DIAMOND,I.DIAMOND]], result:{id:I.DIAMOND_CHESTPLATE,count:1} },
  { pattern: [[I.DIAMOND,I.DIAMOND,I.DIAMOND],[I.DIAMOND,null,I.DIAMOND],[I.DIAMOND,null,I.DIAMOND]], result:{id:I.DIAMOND_LEGGINGS,count:1} },
  { pattern: [[null,null,null],[I.DIAMOND,null,I.DIAMOND],[I.DIAMOND,null,I.DIAMOND]], result:{id:I.DIAMOND_BOOTS,count:1} },

  // === BLOCKS ===
  { pattern: [[I.IRON_INGOT,I.IRON_INGOT,I.IRON_INGOT],[I.IRON_INGOT,I.IRON_INGOT,I.IRON_INGOT],[I.IRON_INGOT,I.IRON_INGOT,I.IRON_INGOT]], result:{id:B.IRON_BLOCK,count:1} },
  { pattern: [[I.GOLD_INGOT,I.GOLD_INGOT,I.GOLD_INGOT],[I.GOLD_INGOT,I.GOLD_INGOT,I.GOLD_INGOT],[I.GOLD_INGOT,I.GOLD_INGOT,I.GOLD_INGOT]], result:{id:B.GOLD_BLOCK,count:1} },
  { pattern: [[I.DIAMOND,I.DIAMOND,I.DIAMOND],[I.DIAMOND,I.DIAMOND,I.DIAMOND],[I.DIAMOND,I.DIAMOND,I.DIAMOND]], result:{id:B.DIAMOND_BLOCK,count:1} },
  { pattern: [[B.COBBLESTONE,B.COBBLESTONE,null],[B.COBBLESTONE,B.COBBLESTONE,null],[null,null,null]], result:{id:B.STONE_BRICKS,count:4} },
  { pattern: [[B.SAND,B.SAND,null],[null,null,null],[null,null,null]], result:{id:B.GLASS,count:1}, shapeless:true },

  // === FOOD ===
  { pattern: [[null,I.IRON_INGOT,null],[null,I.IRON_INGOT,null],[null,I.IRON_INGOT,null]], result:{id:I.BUCKET,count:1} },

  // === DRAGON ITEMS ===
  { pattern: [[I.DRAGON_SCALE,I.DRAGON_SCALE,null],[I.DRAGON_SCALE,I.DRAGON_HEART,null],[I.DRAGON_SCALE,I.DRAGON_SCALE,null]], result:{id:I.DRAGON_SWORD,count:1} },
  { pattern: [[I.DRAGON_SCALE,I.DRAGON_SCALE,null],[null,I.DRAGON_HEART,null],[null,I.STICK,null]], result:{id:I.DRAGON_PICKAXE,count:1} },
  { pattern: [[B.DRAGON_SCALE_BLOCK,B.DRAGON_SCALE_BLOCK,B.DRAGON_SCALE_BLOCK],[B.DRAGON_SCALE_BLOCK,null,B.DRAGON_SCALE_BLOCK],[B.DRAGON_SCALE_BLOCK,B.DRAGON_SCALE_BLOCK,B.DRAGON_SCALE_BLOCK]], result:{id:I.DRAGON_ARMOR,count:1} },

  // === MISC ===
  { pattern: [[I.FLINT,null,null],[I.IRON_INGOT,null,null],[null,null,null]], result:{id:I.FLINT_AND_STEEL,count:1}, shapeless:true },
  { pattern: [[I.IRON_INGOT,I.IRON_INGOT,null],[null,null,null],[null,null,null]], result:{id:I.SHEARS,count:1}, shapeless:true },
];

export function findRecipe(grid: (number | null)[][]): { id: number; count: number } | null {
  for (const recipe of CRAFTING_RECIPES) {
    if (matchesRecipe(grid, recipe)) return recipe.result;
  }
  return null;
}

function matchesRecipe(grid: (number | null)[][], recipe: Recipe): boolean {
  if (recipe.shapeless) {
    const needed = new Map<number, number>();
    for (const row of recipe.pattern) {
      for (const cell of row) {
        if (cell !== null) needed.set(cell, (needed.get(cell) ?? 0) + 1);
      }
    }
    const provided = new Map<number, number>();
    for (const row of grid) {
      for (const cell of row) {
        if (cell !== null) provided.set(cell, (provided.get(cell) ?? 0) + 1);
      }
    }
    for (const [id, count] of needed) {
      if ((provided.get(id) ?? 0) < count) return false;
    }
    return true;
  }

  // Shaped: try all offsets within 3x3
  for (let dy = 0; dy <= 0; dy++) {
    for (let dx = 0; dx <= 0; dx++) {
      if (shapeMatch(grid, recipe.pattern, dx, dy)) return true;
    }
  }
  return false;
}

function shapeMatch(grid: (number|null)[][], pattern: (number|null)[][], ox: number, oy: number): boolean {
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      const g = grid[row]?.[col] ?? null;
      const p = pattern[row]?.[col] ?? null;
      if (g !== p) return false;
    }
  }
  return true;
}
