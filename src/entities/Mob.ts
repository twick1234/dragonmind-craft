import * as THREE from 'three';
import { isSolid } from '../world/blocks/BlockRegistry';
import { GRAVITY } from '../utils/Constants';

export enum MobType {
  ZOMBIE = 'zombie',
  SKELETON = 'skeleton',
  SPIDER = 'spider',
  CREEPER = 'creeper',
  COW = 'cow',
  PIG = 'pig',
  SHEEP = 'sheep',
  CHICKEN = 'chicken',
}

export interface MobDrop { id: number; min: number; max: number; chance: number; }

export abstract class Mob {
  id: string;
  type: MobType;
  position: THREE.Vector3;
  velocity = new THREE.Vector3();
  rotation = 0;
  health: number;
  maxHealth: number;
  dead = false;
  onGround = false;
  mesh: THREE.Group;
  target: THREE.Vector3 | null = null;
  hostile: boolean;
  drops: MobDrop[];
  abstract speed: number;
  abstract attackDamage: number;
  abstract attackRange: number;
  abstract attackCooldown: number;
  protected attackTimer = 0;
  protected stateTimer = 0;
  protected wanderTarget: THREE.Vector3 | null = null;

  constructor(type: MobType, x: number, y: number, z: number, health: number, hostile: boolean, drops: MobDrop[]) {
    this.id = `${type}_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    this.type = type;
    this.position = new THREE.Vector3(x, y, z);
    this.health = health;
    this.maxHealth = health;
    this.hostile = hostile;
    this.drops = drops;
    this.mesh = this.createMesh();
  }

  protected abstract createMesh(): THREE.Group;

  createBoxMesh(w: number, h: number, d: number, color: number): THREE.Mesh {
    const geo = new THREE.BoxGeometry(w, h, d);
    const mat = new THREE.MeshLambertMaterial({ color });
    return new THREE.Mesh(geo, mat);
  }

  update(dt: number, playerPos: THREE.Vector3, getBlock: (x: number, y: number, z: number) => number): void {
    if (this.dead) return;
    this.attackTimer = Math.max(0, this.attackTimer - dt);
    this.stateTimer += dt;

    this.updateAI(dt, playerPos, getBlock);
    this.applyPhysics(dt, getBlock);
    this.mesh.position.copy(this.position);
    this.mesh.rotation.y = this.rotation;
  }

  protected updateAI(dt: number, playerPos: THREE.Vector3, getBlock: (x: number, y: number, z: number) => number): void {
    const distToPlayer = this.position.distanceTo(playerPos);

    if (this.hostile && distToPlayer < 16) {
      // Chase player
      this.target = playerPos;
    } else {
      this.target = null;
      // Wander
      if (this.stateTimer > 3 || !this.wanderTarget) {
        this.stateTimer = 0;
        this.wanderTarget = new THREE.Vector3(
          this.position.x + (Math.random() - 0.5) * 20,
          this.position.y,
          this.position.z + (Math.random() - 0.5) * 20
        );
      }
    }

    const moveTarget = this.target ?? this.wanderTarget;
    if (moveTarget) {
      const dir = new THREE.Vector3(moveTarget.x - this.position.x, 0, moveTarget.z - this.position.z);
      const dist = dir.length();
      if (dist > 1) {
        dir.normalize();
        this.velocity.x = dir.x * this.speed;
        this.velocity.z = dir.z * this.speed;
        this.rotation = Math.atan2(dir.x, dir.z);
      } else {
        this.velocity.x = 0; this.velocity.z = 0;
      }

      // Jump over obstacles
      if (this.onGround && isSolid(getBlock(
        Math.floor(this.position.x + dir.x),
        Math.floor(this.position.y),
        Math.floor(this.position.z + dir.z)
      ))) {
        this.velocity.y = 5;
        this.onGround = false;
      }
    }
  }

  private applyPhysics(dt: number, getBlock: (x: number, y: number, z: number) => number): void {
    this.velocity.y += GRAVITY * dt;
    this.velocity.y = Math.max(this.velocity.y, -30);

    // Y movement + ground check
    this.position.y += this.velocity.y * dt;
    const footY = Math.floor(this.position.y);
    if (isSolid(getBlock(Math.floor(this.position.x), footY, Math.floor(this.position.z)))) {
      this.position.y = footY + 1;
      this.velocity.y = 0;
      this.onGround = true;
    } else {
      this.onGround = false;
    }

    this.position.x += this.velocity.x * dt;
    this.position.z += this.velocity.z * dt;
  }

  takeDamage(amount: number): void {
    this.health -= amount;
    if (this.health <= 0) {
      this.health = 0;
      this.dead = true;
    }
  }

  canAttack(target: THREE.Vector3): boolean {
    return this.attackTimer <= 0 && this.position.distanceTo(target) <= this.attackRange;
  }

  attack(): number {
    this.attackTimer = this.attackCooldown;
    return this.attackDamage;
  }

  getDrop(): Array<{ id: number; count: number }> {
    return this.drops
      .filter(d => Math.random() < d.chance)
      .map(d => ({ id: d.id, count: d.min + Math.floor(Math.random() * (d.max - d.min + 1)) }));
  }
}
