import * as THREE from 'three';
import { Mob, MobType } from '../Mob';
import { ItemId } from '../../inventory/ItemRegistry';

export class Spider extends Mob {
  speed = 3.5;
  attackDamage = 2;
  attackRange = 1.8;
  attackCooldown = 1.0;

  constructor(x: number, y: number, z: number) {
    super(MobType.SPIDER, x, y, z, 16, true, [
      { id: ItemId.STRING, min: 0, max: 2, chance: 0.8 },
    ]);
  }

  protected createMesh(): THREE.Group {
    const group = new THREE.Group();
    const body = this.createBoxMesh(1.0, 0.4, 0.5, 0x222222);
    const head = this.createBoxMesh(0.4, 0.4, 0.4, 0x222222);
    head.position.set(0.5, 0, 0);
    // 8 legs
    for (let i = 0; i < 4; i++) {
      const side = i < 2 ? -1 : 1;
      const zOff = (i % 2 === 0 ? 0.2 : -0.2);
      const leg = this.createBoxMesh(0.5, 0.08, 0.08, 0x333333);
      leg.position.set(side * 0.7, -0.15, zOff);
      leg.rotation.z = side * Math.PI / 4;
      group.add(leg);
    }
    // Eyes
    const eyeL = this.createBoxMesh(0.08, 0.08, 0.05, 0xff0000);
    eyeL.position.set(0.65, 0.1, 0.1);
    const eyeR = eyeL.clone(); eyeR.position.z = -0.1;
    group.add(body, head, eyeL, eyeR);
    return group;
  }
}
