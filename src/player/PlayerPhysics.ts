import * as THREE from 'three';
import { GRAVITY, JUMP_FORCE, PLAYER_HEIGHT, PLAYER_WIDTH } from '../utils/Constants';
import { isSolid, isFluid } from '../world/blocks/BlockRegistry';

export class PlayerPhysics {
  position: THREE.Vector3;
  velocity = new THREE.Vector3();
  onGround = false;
  inWater = false;
  wasInWater = false;

  private halfW = PLAYER_WIDTH / 2;

  constructor(x: number, y: number, z: number) {
    this.position = new THREE.Vector3(x, y, z);
  }

  update(
    dt: number,
    moveDir: THREE.Vector3,
    speed: number,
    jump: boolean,
    getBlock: (x: number, y: number, z: number) => number
  ): void {
    // Check water
    const feetY = Math.floor(this.position.y);
    const feetBlock = getBlock(Math.floor(this.position.x), feetY, Math.floor(this.position.z));
    const headBlock = getBlock(Math.floor(this.position.x), feetY + 1, Math.floor(this.position.z));
    this.wasInWater = this.inWater;
    this.inWater = isFluid(feetBlock) || isFluid(headBlock);

    // Apply gravity
    if (this.inWater) {
      this.velocity.y += GRAVITY * dt * 0.3;
      this.velocity.y = Math.max(this.velocity.y, -3);
    } else {
      this.velocity.y += GRAVITY * dt;
      this.velocity.y = Math.max(this.velocity.y, -50);
    }

    // Jump
    if (jump) {
      if (this.onGround) {
        this.velocity.y = JUMP_FORCE;
        this.onGround = false;
      } else if (this.inWater) {
        this.velocity.y = Math.min(this.velocity.y + 4 * dt, 4);
      }
    }

    // Horizontal movement
    if (moveDir.lengthSq() > 0) moveDir.normalize();
    const hSpeed = this.inWater ? speed * 0.6 : speed;
    this.velocity.x = moveDir.x * hSpeed;
    this.velocity.z = moveDir.z * hSpeed;

    // Move and collide
    this.moveAndCollide(dt, getBlock);
  }

  private moveAndCollide(dt: number, getBlock: (x: number, y: number, z: number) => number): void {
    // Y axis
    this.position.y += this.velocity.y * dt;
    this.onGround = false;
    this.resolveY(getBlock);

    // X axis
    this.position.x += this.velocity.x * dt;
    this.resolveX(getBlock);

    // Z axis
    this.position.z += this.velocity.z * dt;
    this.resolveZ(getBlock);
  }

  private resolveY(getBlock: (x: number, y: number, z: number) => number): void {
    const minX = Math.floor(this.position.x - this.halfW);
    const maxX = Math.floor(this.position.x + this.halfW);
    const minZ = Math.floor(this.position.z - this.halfW);
    const maxZ = Math.floor(this.position.z + this.halfW);

    if (this.velocity.y < 0) {
      const footY = Math.floor(this.position.y);
      for (let bx = minX; bx <= maxX; bx++) {
        for (let bz = minZ; bz <= maxZ; bz++) {
          if (isSolid(getBlock(bx, footY, bz))) {
            this.position.y = footY + 1;
            this.velocity.y = 0;
            this.onGround = true;
            return;
          }
        }
      }
    } else if (this.velocity.y > 0) {
      const headY = Math.floor(this.position.y + PLAYER_HEIGHT);
      for (let bx = minX; bx <= maxX; bx++) {
        for (let bz = minZ; bz <= maxZ; bz++) {
          if (isSolid(getBlock(bx, headY, bz))) {
            this.position.y = headY - PLAYER_HEIGHT - 0.001;
            this.velocity.y = 0;
            return;
          }
        }
      }
    }
  }

  private resolveX(getBlock: (x: number, y: number, z: number) => number): void {
    const dir = Math.sign(this.velocity.x);
    if (dir === 0) return;
    const checkX = Math.floor(this.position.x + dir * this.halfW);
    for (let y = Math.floor(this.position.y); y <= Math.floor(this.position.y + PLAYER_HEIGHT - 0.1); y++) {
      for (let z = Math.floor(this.position.z - this.halfW); z <= Math.floor(this.position.z + this.halfW); z++) {
        if (isSolid(getBlock(checkX, y, z))) {
          this.position.x = checkX - dir * this.halfW - dir * 0.001;
          this.velocity.x = 0;
          return;
        }
      }
    }
  }

  private resolveZ(getBlock: (x: number, y: number, z: number) => number): void {
    const dir = Math.sign(this.velocity.z);
    if (dir === 0) return;
    const checkZ = Math.floor(this.position.z + dir * this.halfW);
    for (let y = Math.floor(this.position.y); y <= Math.floor(this.position.y + PLAYER_HEIGHT - 0.1); y++) {
      for (let x = Math.floor(this.position.x - this.halfW); x <= Math.floor(this.position.x + this.halfW); x++) {
        if (isSolid(getBlock(x, y, checkZ))) {
          this.position.z = checkZ - dir * this.halfW - dir * 0.001;
          this.velocity.z = 0;
          return;
        }
      }
    }
  }

  getFallDamage(): number {
    if (this.velocity.y < -15) return Math.floor(Math.abs(this.velocity.y) - 15);
    return 0;
  }
}
