import { ItemStack } from '../player/PlayerStats';
import { HOTBAR_SIZE, INVENTORY_ROWS, INVENTORY_COLS } from '../utils/Constants';

export const INVENTORY_SIZE = INVENTORY_ROWS * INVENTORY_COLS;

export class Inventory {
  slots: (ItemStack | null)[];
  hotbarIndex = 0;

  constructor(size = INVENTORY_SIZE) {
    this.slots = new Array(size).fill(null);
  }

  getHotbarItem(): ItemStack | null {
    return this.slots[this.hotbarIndex] ?? null;
  }

  addItem(id: number, count = 1): boolean {
    // Try to stack with existing
    for (let i = 0; i < this.slots.length; i++) {
      const s = this.slots[i];
      if (s && s.id === id) {
        const maxStack = 64; // simplified
        const canAdd = Math.min(count, maxStack - s.count);
        if (canAdd > 0) {
          s.count += canAdd;
          count -= canAdd;
          if (count <= 0) return true;
        }
      }
    }
    // Find empty slot
    for (let i = 0; i < this.slots.length; i++) {
      if (!this.slots[i]) {
        this.slots[i] = { id, count: Math.min(count, 64) };
        count -= 64;
        if (count <= 0) return true;
      }
    }
    return count <= 0;
  }

  removeItem(id: number, count = 1): boolean {
    let remaining = count;
    for (let i = 0; i < this.slots.length && remaining > 0; i++) {
      const s = this.slots[i];
      if (s && s.id === id) {
        const remove = Math.min(s.count, remaining);
        s.count -= remove;
        remaining -= remove;
        if (s.count <= 0) this.slots[i] = null;
      }
    }
    return remaining <= 0;
  }

  countItem(id: number): number {
    let total = 0;
    for (const s of this.slots) {
      if (s && s.id === id) total += s.count;
    }
    return total;
  }

  hasItems(requirements: Array<[number, number]>): boolean {
    return requirements.every(([id, count]) => this.countItem(id) >= count);
  }

  setSlot(index: number, item: ItemStack | null): void {
    this.slots[index] = item;
  }

  getSlot(index: number): ItemStack | null {
    return this.slots[index] ?? null;
  }

  scrollHotbar(delta: number): void {
    this.hotbarIndex = ((this.hotbarIndex + delta) % HOTBAR_SIZE + HOTBAR_SIZE) % HOTBAR_SIZE;
  }

  selectHotbar(index: number): void {
    if (index >= 0 && index < HOTBAR_SIZE) this.hotbarIndex = index;
  }

  serialize(): object {
    return { slots: this.slots, hotbarIndex: this.hotbarIndex };
  }

  deserialize(data: { slots: (ItemStack | null)[]; hotbarIndex: number }): void {
    this.slots = data.slots;
    this.hotbarIndex = data.hotbarIndex;
  }
}
