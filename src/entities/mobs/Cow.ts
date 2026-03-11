import * as THREE from 'three';
import { Mob, MobType } from '../Mob';
import { ItemId } from '../../inventory/ItemRegistry';

export class Cow extends Mob {
  speed = 1.5;
  attackDamage = 0;
  attackRange = 0;
  attackCooldown = 99;

  constructor(x: number, y: number, z: number) {
    super(MobType.COW, x, y, z, 10, false, [
      { id: ItemId.LEATHER, min: 0, max: 2, chance: 1.0 },
      { id: ItemId.RAW_BEEF, min: 1, max: 3, chance: 1.0 },
    ]);
  }

  protected createMesh(): THREE.Group {
    const group = new THREE.Group();
    const body = this.createBoxMesh(0.9, 0.75, 1.4, 0xaa8866);
    const head = this.createBoxMesh(0.5, 0.5, 0.5, 0xaa8866);
    head.position.set(0, 0.2, 0.8);
    const legFL = this.createBoxMesh(0.3, 0.65, 0.3, 0x996655);
    legFL.position.set(-0.3, -0.7, 0.4);
    const legFR = legFL.clone(); legFR.position.x = 0.3;
    const legBL = legFL.clone(); legBL.position.z = -0.4;
    const legBR = legFR.clone(); legBR.position.z = -0.4;
    // Horns
    const hornL = this.createBoxMesh(0.08, 0.2, 0.08, 0xeeeecc);
    hornL.position.set(-0.15, 0.55, 0.8);
    const hornR = hornL.clone(); hornR.position.x = 0.15;
    group.add(body, head, legFL, legFR, legBL, legBR, hornL, hornR);
    return group;
  }
}
