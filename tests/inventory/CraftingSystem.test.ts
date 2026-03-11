import { CraftingSystem } from '../../src/inventory/CraftingSystem';
import { Inventory } from '../../src/inventory/Inventory';
import { BlockType } from '../../src/world/blocks/BlockTypes';
import { ItemId } from '../../src/inventory/ItemRegistry';

describe('CraftingSystem', () => {
  let crafting: CraftingSystem;
  let inventory: Inventory;

  beforeEach(() => {
    crafting = new CraftingSystem();
    inventory = new Inventory();
  });

  test('crafts oak planks from log', () => {
    crafting.setCell(0, 0, BlockType.OAK_LOG);
    expect(crafting.result).not.toBeNull();
    expect(crafting.result?.id).toBe(BlockType.OAK_PLANKS);
    expect(crafting.result?.count).toBe(4);
  });

  test('crafts sticks from planks', () => {
    crafting.setCell(0, 0, BlockType.OAK_PLANKS);
    crafting.setCell(1, 0, BlockType.OAK_PLANKS);
    expect(crafting.result).not.toBeNull();
    expect(crafting.result?.id).toBe(ItemId.STICK);
    expect(crafting.result?.count).toBe(4);
  });

  test('crafts wooden pickaxe', () => {
    crafting.setCell(0, 0, BlockType.OAK_PLANKS);
    crafting.setCell(0, 1, BlockType.OAK_PLANKS);
    crafting.setCell(1, 1, ItemId.STICK);
    crafting.setCell(2, 1, ItemId.STICK);
    expect(crafting.result?.id).toBe(ItemId.WOOD_PICKAXE);
  });

  test('crafts stone pickaxe', () => {
    crafting.setCell(0, 0, BlockType.COBBLESTONE);
    crafting.setCell(0, 1, BlockType.COBBLESTONE);
    crafting.setCell(1, 1, ItemId.STICK);
    crafting.setCell(2, 1, ItemId.STICK);
    expect(crafting.result?.id).toBe(ItemId.STONE_PICKAXE);
  });

  test('crafts diamond pickaxe', () => {
    crafting.setCell(0, 0, ItemId.DIAMOND);
    crafting.setCell(0, 1, ItemId.DIAMOND);
    crafting.setCell(1, 1, ItemId.STICK);
    crafting.setCell(2, 1, ItemId.STICK);
    expect(crafting.result?.id).toBe(ItemId.DIAMOND_PICKAXE);
  });

  test('consumes items on craft', () => {
    inventory.addItem(BlockType.OAK_LOG, 5);
    crafting.setCell(0, 0, BlockType.OAK_LOG);
    const result = crafting.craft(inventory);
    expect(result).not.toBeNull();
    expect(result?.id).toBe(BlockType.OAK_PLANKS);
    expect(result?.count).toBe(4);
    expect(inventory.countItem(BlockType.OAK_LOG)).toBe(4);
  });

  test('returns null when missing ingredients', () => {
    crafting.setCell(0, 0, BlockType.OAK_LOG);
    // No logs in inventory
    const result = crafting.craft(inventory);
    expect(result).toBeNull();
  });

  test('clears grid after crafting', () => {
    inventory.addItem(BlockType.OAK_LOG, 5);
    crafting.setCell(0, 0, BlockType.OAK_LOG);
    crafting.craft(inventory);
    expect(crafting.grid[0][0]).toBeNull();
  });

  test('crafts furnace from cobblestone', () => {
    crafting.setCell(0, 0, BlockType.COBBLESTONE);
    crafting.setCell(0, 1, BlockType.COBBLESTONE);
    crafting.setCell(0, 2, BlockType.COBBLESTONE);
    crafting.setCell(1, 0, BlockType.COBBLESTONE);
    crafting.setCell(1, 2, BlockType.COBBLESTONE);
    crafting.setCell(2, 0, BlockType.COBBLESTONE);
    crafting.setCell(2, 1, BlockType.COBBLESTONE);
    crafting.setCell(2, 2, BlockType.COBBLESTONE);
    expect(crafting.result?.id).toBe(BlockType.FURNACE);
  });

  test('empty grid gives null result', () => {
    expect(crafting.result).toBeNull();
  });
});
