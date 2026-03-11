import * as THREE from 'three';
import { Mob, MobType } from '../Mob';
import { ItemId } from '../../inventory/ItemRegistry';

const WOOL_COLORS = [0xeeeeee, 0x222222, 0x8b4513, 0xaaaaaa, 0xffaaaa, 0xee55ee, 0x4444cc, 0x66bbff];

export class Sheep extends Mob {
  speed = 1.5;
  attackDamage = 0;
  attackRange = 0;
  attackCooldown = 99;
  woolColor: number;
  sheared = false;

  constructor(x: number, y: number, z: number) {
    super(MobType.SHEEP, x, y, z, 8, false, [
      { id: ItemId.WOOL_WHITE, min: 1, max: 3, chance: 1.0 },
    ]);
    this.woolColor = WOOL_COLORS[Math.floor(Math.random() * WOOL_COLORS.length)];
  }

  protected createMesh(): THREE.Group {
    const group = new THREE.Group();
    const woolColor = this.sheared ? 0xffddcc : this.woolColor;
    const body = this.createBoxMesh(0.75, 0.75, 1.0, woolColor);
    const head = this.createBoxMesh(0.4, 0.4, 0.4, 0xffddcc);
    head.position.set(0, 0.2, 0.65);
    const legFL = this.createBoxMesh(0.2, 0.55, 0.2, 0xffddcc);
    legFL.position.set(-0.2, -0.65, 0.3);
    const legFR = legFL.clone(); legFR.position.x = 0.2;
    const legBL = legFL.clone(); legBL.position.z = -0.3;
    const legBR = legFR.clone(); legBR.position.z = -0.3;
    group.add(body, head, legFL, legFR, legBL, legBR);
    return group;
  }
}
