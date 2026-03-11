import { findRecipe } from './recipes/AllRecipes';
import { Inventory } from './Inventory';
import { ItemStack } from '../player/PlayerStats';

export class CraftingSystem {
  grid: (number | null)[][] = [[null,null,null],[null,null,null],[null,null,null]];
  result: { id: number; count: number } | null = null;

  setCell(row: number, col: number, itemId: number | null): void {
    this.grid[row][col] = itemId;
    this.updateResult();
  }

  private updateResult(): void {
    this.result = findRecipe(this.grid);
  }

  craft(inventory: Inventory): ItemStack | null {
    if (!this.result) return null;

    // Count items needed from grid
    const needed = new Map<number, number>();
    for (const row of this.grid) {
      for (const cell of row) {
        if (cell !== null) needed.set(cell, (needed.get(cell) ?? 0) + 1);
      }
    }

    // Check inventory has enough
    for (const [id, count] of needed) {
      if (inventory.countItem(id) < count) return null;
    }

    // Consume items
    for (const [id, count] of needed) {
      inventory.removeItem(id, count);
    }

    const crafted: ItemStack = { id: this.result.id, count: this.result.count };
    this.clearGrid();
    return crafted;
  }

  clearGrid(): void {
    this.grid = [[null,null,null],[null,null,null],[null,null,null]];
    this.result = null;
  }

  /** 2x2 crafting (for inventory) */
  static craft2x2(grid: (number|null)[][], inventory: Inventory): ItemStack | null {
    // Expand 2x2 to 3x3
    const grid3: (number|null)[][] = [
      [grid[0]?.[0]??null, grid[0]?.[1]??null, null],
      [grid[1]?.[0]??null, grid[1]?.[1]??null, null],
      [null, null, null],
    ];
    const result = findRecipe(grid3);
    if (!result) return null;

    const needed = new Map<number, number>();
    for (const row of grid3) for (const cell of row) {
      if (cell !== null) needed.set(cell, (needed.get(cell) ?? 0) + 1);
    }
    for (const [id, count] of needed) {
      if (inventory.countItem(id) < count) return null;
      inventory.removeItem(id, count);
    }
    return { id: result.id, count: result.count };
  }
}
