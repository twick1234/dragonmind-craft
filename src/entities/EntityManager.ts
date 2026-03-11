import * as THREE from 'three';
import { Mob, MobType } from './Mob';
import { Zombie } from './mobs/Zombie';
import { Skeleton } from './mobs/Skeleton';
import { Spider } from './mobs/Spider';
import { Creeper } from './mobs/Creeper';
import { Cow } from './mobs/Cow';
import { Pig } from './mobs/Pig';
import { Sheep } from './mobs/Sheep';
import { Chicken } from './mobs/Chicken';
import { PlayerStats } from '../player/PlayerStats';

const MAX_HOSTILE = 40;
const MAX_PASSIVE = 30;
const SPAWN_RADIUS = 48;
const DESPAWN_RADIUS = 96;

export class EntityManager {
  private mobs: Map<string, Mob> = new Map();
  private scene: THREE.Scene;
  private spawnTimer = 0;

  constructor(scene: THREE.Scene) {
    this.scene = scene;
  }

  update(
    dt: number,
    playerPos: THREE.Vector3,
    playerStats: PlayerStats,
    getBlock: (x: number, y: number, z: number) => number,
    isDaytime: boolean
  ): { damage: number; drops: Array<{ id: number; count: number }> } {
    let totalDamage = 0;
    const drops: Array<{ id: number; count: number }> = [];

    this.spawnTimer += dt;
    if (this.spawnTimer > 5) {
      this.spawnTimer = 0;
      this.trySpawn(playerPos, getBlock, isDaytime);
    }

    for (const [id, mob] of this.mobs) {
      // Despawn if too far
      if (mob.position.distanceTo(playerPos) > DESPAWN_RADIUS) {
        this.scene.remove(mob.mesh);
        this.mobs.delete(id);
        continue;
      }

      mob.update(dt, playerPos, getBlock);

      // Creeper explosion
      if (mob instanceof Creeper) {
        if (mob.position.distanceTo(playerPos) < mob.attackRange && !mob.fuseLit) {
          mob.lightFuse();
        }
        if (mob.exploding) {
          // Deal explosion damage
          const dist = mob.position.distanceTo(playerPos);
          if (dist < 5) totalDamage += Math.max(0, 10 - dist * 2);
          this.scene.remove(mob.mesh);
          this.mobs.delete(id);
          drops.push(...mob.getDrop());
          continue;
        }
      }

      // Hostile attack
      if (mob.hostile && mob.canAttack(playerPos)) {
        totalDamage += mob.attack();
      }

      // Remove dead mobs
      if (mob.dead) {
        drops.push(...mob.getDrop());
        this.scene.remove(mob.mesh);
        this.mobs.delete(id);
      }
    }

    return { damage: totalDamage, drops };
  }

  private trySpawn(playerPos: THREE.Vector3, getBlock: (x:number,y:number,z:number)=>number, isDaytime: boolean): void {
    const hostileCount = [...this.mobs.values()].filter(m => m.hostile).length;
    const passiveCount = [...this.mobs.values()].filter(m => !m.hostile).length;

    // Spawn passive mobs during day
    if (passiveCount < MAX_PASSIVE && Math.random() < 0.3) {
      this.spawnMob(playerPos, getBlock, false);
    }

    // Spawn hostile mobs at night or underground
    if (!isDaytime && hostileCount < MAX_HOSTILE && Math.random() < 0.5) {
      this.spawnMob(playerPos, getBlock, true);
    }
  }

  private spawnMob(playerPos: THREE.Vector3, getBlock: (x:number,y:number,z:number)=>number, hostile: boolean): void {
    const angle = Math.random() * Math.PI * 2;
    const dist = 16 + Math.random() * (SPAWN_RADIUS - 16);
    const x = Math.floor(playerPos.x + Math.cos(angle) * dist);
    const z = Math.floor(playerPos.z + Math.sin(angle) * dist);

    // Find surface
    let y = 100;
    while (y > 0 && getBlock(x, y, z) === 0) y--;
    y += 1;

    if (getBlock(x, y, z) !== 0 || getBlock(x, y + 1, z) !== 0) return;

    let mob: Mob;
    if (hostile) {
      const r = Math.random();
      if (r < 0.35) mob = new Zombie(x, y, z);
      else if (r < 0.6) mob = new Skeleton(x, y, z);
      else if (r < 0.8) mob = new Spider(x, y, z);
      else mob = new Creeper(x, y, z);
    } else {
      const r = Math.random();
      if (r < 0.3) mob = new Cow(x, y, z);
      else if (r < 0.6) mob = new Pig(x, y, z);
      else if (r < 0.85) mob = new Sheep(x, y, z);
      else mob = new Chicken(x, y, z);
    }

    this.mobs.set(mob.id, mob);
    this.scene.add(mob.mesh);
  }

  hitMob(mobId: string, damage: number): Mob | null {
    const mob = this.mobs.get(mobId);
    if (!mob) return null;
    mob.takeDamage(damage);
    return mob;
  }

  getMobsNear(pos: THREE.Vector3, radius: number): Mob[] {
    return [...this.mobs.values()].filter(m => m.position.distanceTo(pos) <= radius);
  }

  getAllMobMeshes(): THREE.Object3D[] {
    return [...this.mobs.values()].map(m => m.mesh);
  }

  dispose(): void {
    for (const mob of this.mobs.values()) {
      this.scene.remove(mob.mesh);
    }
    this.mobs.clear();
  }
}
