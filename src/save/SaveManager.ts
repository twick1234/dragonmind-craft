import { WorldSlot } from '../ui/MainMenu';
import { Inventory } from '../inventory/Inventory';
import { PlayerStats } from '../player/PlayerStats';
import * as THREE from 'three';

const SAVE_KEY = 'dragonmind-craft-saves';
const WORLD_KEY = (name: string) => `dragonmind-craft-world-${name}`;

export interface SaveData {
  slot: WorldSlot;
  playerPos: { x: number; y: number; z: number };
  playerStats: ReturnType<PlayerStats['serialize']>;
  inventory: ReturnType<Inventory['serialize']>;
  time: number;
  chunks: Record<string, number[]>; // key -> block data
}

export class SaveManager {
  getSlots(): WorldSlot[] {
    try {
      return JSON.parse(localStorage.getItem(SAVE_KEY) ?? '[]');
    } catch { return []; }
  }

  private setSlots(slots: WorldSlot[]): void {
    localStorage.setItem(SAVE_KEY, JSON.stringify(slots));
  }

  save(
    slot: WorldSlot,
    playerPos: THREE.Vector3,
    stats: PlayerStats,
    inventory: Inventory,
    time: number,
    chunks: Map<string, Uint8Array>
  ): void {
    const chunkData: Record<string, number[]> = {};
    for (const [key, data] of chunks) {
      chunkData[key] = Array.from(data);
    }

    const saveData: SaveData = {
      slot: { ...slot, lastPlayed: Date.now() },
      playerPos: { x: playerPos.x, y: playerPos.y, z: playerPos.z },
      playerStats: stats.serialize(),
      inventory: inventory.serialize(),
      time,
      chunks: chunkData,
    };

    try {
      localStorage.setItem(WORLD_KEY(slot.name), JSON.stringify(saveData));
      const slots = this.getSlots();
      const idx = slots.findIndex(s => s.name === slot.name);
      if (idx >= 0) slots[idx] = saveData.slot;
      else slots.unshift(saveData.slot);
      this.setSlots(slots);
      console.log(`World "${slot.name}" saved.`);
    } catch (e) {
      console.error('Save failed:', e);
    }
  }

  load(slotName: string): SaveData | null {
    try {
      const raw = localStorage.getItem(WORLD_KEY(slotName));
      if (!raw) return null;
      return JSON.parse(raw) as SaveData;
    } catch { return null; }
  }

  delete(slotName: string): void {
    localStorage.removeItem(WORLD_KEY(slotName));
    const slots = this.getSlots().filter(s => s.name !== slotName);
    this.setSlots(slots);
  }
}

// Extend PlayerStats and Inventory with serialize
declare module '../player/PlayerStats' {
  interface PlayerStats {
    serialize(): object;
    deserialize(data: object): void;
  }
}

PlayerStats.prototype.serialize = function() {
  return {
    health: this.health,
    hunger: this.hunger,
    saturation: this.saturation,
    xp: this.xp,
    xpLevel: this.xpLevel,
    armor: this.armor,
  };
};

PlayerStats.prototype.deserialize = function(data: Record<string, number>) {
  this.health = data.health ?? this.maxHealth;
  this.hunger = data.hunger ?? this.maxHunger;
  this.saturation = data.saturation ?? 5;
  this.xp = data.xp ?? 0;
  this.xpLevel = data.xpLevel ?? 0;
};
