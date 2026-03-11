import * as THREE from 'three';

export function worldToChunk(x: number, z: number, chunkSize: number): [number, number] {
  return [Math.floor(x / chunkSize), Math.floor(z / chunkSize)];
}

export function worldToLocal(x: number, y: number, z: number, chunkSize: number): [number, number, number] {
  return [
    ((x % chunkSize) + chunkSize) % chunkSize,
    y,
    ((z % chunkSize) + chunkSize) % chunkSize
  ];
}

export function chunkKey(cx: number, cz: number): string {
  return `${cx},${cz}`;
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}

export function smoothstep(t: number): number {
  return t * t * (3 - 2 * t);
}

export function raycastVoxel(
  origin: THREE.Vector3,
  direction: THREE.Vector3,
  maxDist: number,
  getBlock: (x: number, y: number, z: number) => number
): { pos: THREE.Vector3; normal: THREE.Vector3 } | null {
  let x = Math.floor(origin.x);
  let y = Math.floor(origin.y);
  let z = Math.floor(origin.z);

  const stepX = direction.x > 0 ? 1 : -1;
  const stepY = direction.y > 0 ? 1 : -1;
  const stepZ = direction.z > 0 ? 1 : -1;

  const tDeltaX = Math.abs(1 / direction.x);
  const tDeltaY = Math.abs(1 / direction.y);
  const tDeltaZ = Math.abs(1 / direction.z);

  let tMaxX = direction.x > 0 ? (x + 1 - origin.x) / direction.x : (origin.x - x) / -direction.x;
  let tMaxY = direction.y > 0 ? (y + 1 - origin.y) / direction.y : (origin.y - y) / -direction.y;
  let tMaxZ = direction.z > 0 ? (z + 1 - origin.z) / direction.z : (origin.z - z) / -direction.z;

  let face = 0;
  let dist = 0;

  while (dist < maxDist) {
    if (tMaxX < tMaxY) {
      if (tMaxX < tMaxZ) { x += stepX; dist = tMaxX; tMaxX += tDeltaX; face = 0; }
      else { z += stepZ; dist = tMaxZ; tMaxZ += tDeltaZ; face = 2; }
    } else {
      if (tMaxY < tMaxZ) { y += stepY; dist = tMaxY; tMaxY += tDeltaY; face = 1; }
      else { z += stepZ; dist = tMaxZ; tMaxZ += tDeltaZ; face = 2; }
    }
    if (dist > maxDist) break;
    if (getBlock(x, y, z) > 0) {
      const normal = new THREE.Vector3();
      if (face === 0) normal.x = -stepX;
      else if (face === 1) normal.y = -stepY;
      else normal.z = -stepZ;
      return { pos: new THREE.Vector3(x, y, z), normal };
    }
  }
  return null;
}

export function aabbIntersect(
  minA: THREE.Vector3, maxA: THREE.Vector3,
  minB: THREE.Vector3, maxB: THREE.Vector3
): boolean {
  return (
    minA.x < maxB.x && maxA.x > minB.x &&
    minA.y < maxB.y && maxA.y > minB.y &&
    minA.z < maxB.z && maxA.z > minB.z
  );
}
