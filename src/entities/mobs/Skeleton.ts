import * as THREE from 'three';
import { Mob, MobType } from '../Mob';
import { ItemId } from '../../inventory/ItemRegistry';

export class Skeleton extends Mob {
  speed = 2.0;
  attackDamage = 2;
  attackRange = 12; // ranged
  attackCooldown = 2.0;

  constructor(x: number, y: number, z: number) {
    super(MobType.SKELETON, x, y, z, 20, true, [
      { id: ItemId.BONE, min: 0, max: 2, chance: 0.8 },
      { id: ItemId.ARROW, min: 0, max: 2, chance: 0.8 },
    ]);
  }

  protected createMesh(): THREE.Group {
    const group = new THREE.Group();
    const body = this.createBoxMesh(0.5, 0.75, 0.25, 0xeeeecc);
    const head = this.createBoxMesh(0.45, 0.45, 0.45, 0xeeeecc);
    head.position.y = 0.6;
    const armL = this.createBoxMesh(0.2, 0.65, 0.2, 0xeeeecc);
    armL.position.set(-0.35, 0.05, 0);
    const armR = armL.clone();
    armR.position.x = 0.35;
    const legL = this.createBoxMesh(0.2, 0.65, 0.2, 0xddddbb);
    legL.position.set(-0.1, -0.7, 0);
    const legR = legL.clone();
    legR.position.x = 0.1;
    group.add(body, head, armL, armR, legL, legR);
    return group;
  }
}
