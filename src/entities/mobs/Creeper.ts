import * as THREE from 'three';
import { Mob, MobType } from '../Mob';

export class Creeper extends Mob {
  speed = 2.8;
  attackDamage = 0; // explodes
  attackRange = 2.0;
  attackCooldown = 1.5;
  fuseLit = false;
  fuseTimer = 0;
  readonly FUSE_TIME = 1.5;

  constructor(x: number, y: number, z: number) {
    super(MobType.CREEPER, x, y, z, 20, true, [
      { id: 40 /* TNT */, min: 0, max: 1, chance: 0.3 },
    ]);
  }

  override update(dt: number, playerPos: THREE.Vector3, getBlock: (x:number,y:number,z:number)=>number): void {
    super.update(dt, playerPos, getBlock);
    if (this.fuseLit) {
      this.fuseTimer += dt;
      // Flash mesh
      const flashOn = Math.floor(this.fuseTimer * 8) % 2 === 0;
      this.mesh.traverse(c => {
        if (c instanceof THREE.Mesh) {
          (c.material as THREE.MeshLambertMaterial).emissive.setHex(flashOn ? 0xffffff : 0x000000);
        }
      });
    }
  }

  lightFuse(): void { this.fuseLit = true; this.fuseTimer = 0; }
  get exploding(): boolean { return this.fuseLit && this.fuseTimer >= this.FUSE_TIME; }

  protected createMesh(): THREE.Group {
    const group = new THREE.Group();
    const body = this.createBoxMesh(0.6, 0.75, 0.4, 0x2a8a20);
    const head = this.createBoxMesh(0.5, 0.5, 0.5, 0x2a8a20);
    head.position.y = 0.625;
    const legFL = this.createBoxMesh(0.25, 0.5, 0.25, 0x1a6a10);
    legFL.position.set(-0.175, -0.625, 0.175);
    const legFR = legFL.clone(); legFR.position.x = 0.175;
    const legBL = legFL.clone(); legBL.position.z = -0.175;
    const legBR = legFR.clone(); legBR.position.z = -0.175;
    group.add(body, head, legFL, legFR, legBL, legBR);
    return group;
  }
}
