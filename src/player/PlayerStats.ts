import { MAX_HEALTH, MAX_HUNGER } from '../utils/Constants';

export interface Equipment {
  helmet: ItemStack | null;
  chestplate: ItemStack | null;
  leggings: ItemStack | null;
  boots: ItemStack | null;
}

export interface ItemStack {
  id: number;
  count: number;
  durability?: number;
  maxDurability?: number;
  meta?: Record<string, unknown>;
}

export class PlayerStats {
  health = MAX_HEALTH;
  maxHealth = MAX_HEALTH;
  hunger = MAX_HUNGER;
  maxHunger = MAX_HUNGER;
  saturation = 5;
  xp = 0;
  xpLevel = 0;
  xpToNext = 7;
  armor = 0;
  dead = false;
  equipment: Equipment = { helmet:null, chestplate:null, leggings:null, boots:null };

  private hungerTick = 0;
  private healTick = 0;
  private starveTick = 0;

  update(dt: number, isMoving: boolean): void {
    if (this.dead) return;

    // Hunger drain (slower when still)
    this.hungerTick += dt * (isMoving ? 1 : 0.3);
    if (this.hungerTick > 4) {
      this.hungerTick = 0;
      if (this.saturation > 0) {
        this.saturation = Math.max(0, this.saturation - 1);
      } else if (this.hunger > 0) {
        this.hunger = Math.max(0, this.hunger - 1);
      }
    }

    // Natural regeneration
    if (this.hunger >= 18 && this.health < this.maxHealth) {
      this.healTick += dt;
      if (this.healTick > 1) {
        this.healTick = 0;
        this.health = Math.min(this.maxHealth, this.health + 1);
      }
    }

    // Starvation damage
    if (this.hunger <= 0) {
      this.starveTick += dt;
      if (this.starveTick > 4) {
        this.starveTick = 0;
        this.takeDamage(1);
      }
    }
  }

  takeDamage(amount: number): void {
    const armorReduction = this.armor * 0.04;
    const actual = Math.max(1, amount * (1 - armorReduction));
    this.health = Math.max(0, this.health - actual);
    if (this.health <= 0) this.dead = true;
  }

  heal(amount: number): void {
    this.health = Math.min(this.maxHealth, this.health + amount);
  }

  eat(foodValue: number, saturationValue: number): void {
    this.hunger = Math.min(this.maxHunger, this.hunger + foodValue);
    this.saturation = Math.min(this.maxHunger, this.saturation + saturationValue);
  }

  addXP(amount: number): void {
    this.xp += amount;
    while (this.xp >= this.xpToNext) {
      this.xp -= this.xpToNext;
      this.xpLevel++;
      this.xpToNext = this.xpLevel < 17 ? (2 * this.xpLevel + 7)
        : this.xpLevel < 32 ? (5 * this.xpLevel - 38)
        : (9 * this.xpLevel - 158);
    }
  }

  respawn(): void {
    this.health = this.maxHealth;
    this.hunger = this.maxHunger;
    this.saturation = 5;
    this.dead = false;
  }

  updateArmor(): void {
    let total = 0;
    if (this.equipment.helmet) total += 1;
    if (this.equipment.chestplate) total += 5;
    if (this.equipment.leggings) total += 4;
    if (this.equipment.boots) total += 1;
    this.armor = total;
  }
}
