import * as THREE from 'three';
import { Mob, MobType } from '../Mob';
import { ItemId } from '../../inventory/ItemRegistry';

export class Pig extends Mob {
  speed = 1.8;
  attackDamage = 0;
  attackRange = 0;
  attackCooldown = 99;

  constructor(x: number, y: number, z: number) {
    super(MobType.PIG, x, y, z, 10, false, [
      { id: ItemId.RAW_PORK, min: 1, max: 3, chance: 1.0 },
    ]);
  }

  protected createMesh(): THREE.Group {
    const group = new THREE.Group();
    const body = this.createBoxMesh(0.75, 0.75, 1.0, 0xff9999);
    const head = this.createBoxMesh(0.5, 0.5, 0.5, 0xff9999);
    head.position.set(0, 0.1, 0.65);
    // Snout
    const snout = this.createBoxMesh(0.35, 0.25, 0.15, 0xffaaaa);
    snout.position.set(0, -0.05, 0.9);
    const legFL = this.createBoxMesh(0.25, 0.5, 0.25, 0xff8888);
    legFL.position.set(-0.25, -0.625, 0.3);
    const legFR = legFL.clone(); legFR.position.x = 0.25;
    const legBL = legFL.clone(); legBL.position.z = -0.3;
    const legBR = legFR.clone(); legBR.position.z = -0.3;
    group.add(body, head, snout, legFL, legFR, legBL, legBR);
    return group;
  }
}
