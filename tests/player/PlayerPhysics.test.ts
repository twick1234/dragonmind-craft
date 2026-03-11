import { PlayerPhysics } from '../../src/player/PlayerPhysics';
import * as THREE from 'three';

// Mock getBlock: solid floor at y=0
const solidFloor = (x: number, y: number, z: number) => (y <= 0 ? 1 : 0);
const noBlocks = () => 0;

describe('PlayerPhysics', () => {
  test('falls due to gravity', () => {
    const p = new PlayerPhysics(0, 5, 0);
    const move = new THREE.Vector3();
    p.update(0.1, move, 5, false, noBlocks);
    expect(p.position.y).toBeLessThan(5);
  });

  test('lands on solid floor', () => {
    const p = new PlayerPhysics(0, 2, 0);
    p.velocity.y = -20;
    for (let i = 0; i < 10; i++) {
      p.update(0.05, new THREE.Vector3(), 5, false, solidFloor);
    }
    expect(p.onGround).toBe(true);
    expect(p.position.y).toBeCloseTo(1, 0);
  });

  test('moves forward', () => {
    const p = new PlayerPhysics(0, 1, 0);
    p.onGround = true;
    p.velocity.y = 0;
    const move = new THREE.Vector3(1, 0, 0);
    p.update(0.1, move, 5, false, solidFloor);
    expect(p.position.x).toBeGreaterThan(0);
  });

  test('jumps when on ground', () => {
    const p = new PlayerPhysics(0, 1, 0);
    p.onGround = true;
    p.velocity.y = 0;
    p.update(0.016, new THREE.Vector3(), 5, true, solidFloor);
    expect(p.velocity.y).toBeGreaterThan(0);
  });

  test('does not jump when airborne', () => {
    const p = new PlayerPhysics(0, 10, 0);
    p.onGround = false;
    p.velocity.y = 0;
    p.update(0.016, new THREE.Vector3(), 5, true, noBlocks);
    // Should not get positive y from jump
    expect(p.velocity.y).toBeLessThanOrEqual(0);
  });

  test('velocity capped in water', () => {
    // Water fills y <= 5 so player stays submerged throughout test
    const waterBlocks = (x: number, y: number, z: number) => (y <= 5 ? 7 : 0);
    const p = new PlayerPhysics(0, 3, 0);
    for (let i = 0; i < 20; i++) {
      p.update(0.05, new THREE.Vector3(), 5, false, waterBlocks);
    }
    expect(p.velocity.y).toBeGreaterThan(-5);
  });

  test('fall damage threshold', () => {
    const p = new PlayerPhysics(0, 100, 0);
    p.velocity.y = -20;
    const dmg = p.getFallDamage();
    expect(dmg).toBeGreaterThan(0);
  });

  test('no fall damage from small falls', () => {
    const p = new PlayerPhysics(0, 5, 0);
    p.velocity.y = -5;
    expect(p.getFallDamage()).toBe(0);
  });
});
