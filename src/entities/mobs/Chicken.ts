import * as THREE from 'three';
import { Mob, MobType } from '../Mob';
import { ItemId } from '../../inventory/ItemRegistry';

export class Chicken extends Mob {
  speed = 1.8;
  attackDamage = 0;
  attackRange = 0;
  attackCooldown = 99;
  eggTimer = 0;

  constructor(x: number, y: number, z: number) {
    super(MobType.CHICKEN, x, y, z, 4, false, [
      { id: ItemId.FEATHER, min: 0, max: 2, chance: 1.0 },
      { id: ItemId.RAW_CHICKEN, min: 1, max: 1, chance: 1.0 },
      { id: ItemId.EGG, min: 0, max: 1, chance: 0.5 },
    ]);
  }

  override update(dt: number, playerPos: THREE.Vector3, getBlock: (x:number,y:number,z:number)=>number): void {
    super.update(dt, playerPos, getBlock);
    this.eggTimer += dt;
    // Lay egg every 5-10 minutes (simplified: every 30s for gameplay)
    if (this.eggTimer > 30) {
      this.eggTimer = 0;
      // Could emit egg item drop event here
    }
  }

  protected createMesh(): THREE.Group {
    const group = new THREE.Group();
    const body = this.createBoxMesh(0.4, 0.4, 0.5, 0xeeeeee);
    const head = this.createBoxMesh(0.25, 0.25, 0.25, 0xeeeeee);
    head.position.set(0, 0.3, 0.3);
    const beak = this.createBoxMesh(0.1, 0.1, 0.15, 0xffaa00);
    beak.position.set(0, 0.25, 0.5);
    const wattles = this.createBoxMesh(0.08, 0.1, 0.05, 0xff3333);
    wattles.position.set(0, 0.15, 0.48);
    const legL = this.createBoxMesh(0.08, 0.3, 0.08, 0xffaa00);
    legL.position.set(-0.1, -0.35, 0);
    const legR = legL.clone(); legR.position.x = 0.1;
    group.add(body, head, beak, wattles, legL, legR);
    return group;
  }
}
