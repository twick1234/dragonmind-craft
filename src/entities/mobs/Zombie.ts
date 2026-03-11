import * as THREE from 'three';
import { Mob, MobType } from '../Mob';
import { ItemId } from '../../inventory/ItemRegistry';

export class Zombie extends Mob {
  speed = 2.5;
  attackDamage = 3;
  attackRange = 1.5;
  attackCooldown = 1.0;

  constructor(x: number, y: number, z: number) {
    super(MobType.ZOMBIE, x, y, z, 20, true, [
      { id: ItemId.LEATHER, min: 0, max: 2, chance: 0.5 },
      { id: ItemId.IRON_INGOT, min: 0, max: 1, chance: 0.1 },
    ]);
  }

  protected createMesh(): THREE.Group {
    const group = new THREE.Group();
    const body = this.createBoxMesh(0.6, 0.9, 0.3, 0x2a7a2a);
    const head = this.createBoxMesh(0.5, 0.5, 0.5, 0x2a7a2a);
    head.position.y = 0.7;
    const armL = this.createBoxMesh(0.25, 0.7, 0.25, 0x2a7a2a);
    armL.position.set(-0.45, 0.1, 0);
    armL.rotation.x = -Math.PI / 4; // arms outstretched
    const armR = armL.clone();
    armR.position.x = 0.45;
    const legL = this.createBoxMesh(0.25, 0.7, 0.25, 0x1a4a1a);
    legL.position.set(-0.15, -0.8, 0);
    const legR = legL.clone();
    legR.position.x = 0.15;
    group.add(body, head, armL, armR, legL, legR);
    return group;
  }
}
