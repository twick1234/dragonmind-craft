import * as THREE from 'three';
import { BlockType } from './blocks/BlockTypes';
import { isSolid, isTransparent, isFluid, getBlock } from './blocks/BlockRegistry';
import { CHUNK_SIZE, CHUNK_HEIGHT } from '../utils/Constants';

const FACES = [
  { dir: [0, 1, 0], corners: [[0,1,0],[1,1,0],[1,1,1],[0,1,1]], normal: [0,1,0] }, // top
  { dir: [0,-1, 0], corners: [[0,0,1],[1,0,1],[1,0,0],[0,0,0]], normal: [0,-1,0] }, // bottom
  { dir: [-1, 0, 0], corners: [[0,0,1],[0,1,1],[0,1,0],[0,0,0]], normal: [-1,0,0] }, // left
  { dir: [1,  0, 0], corners: [[1,0,0],[1,1,0],[1,1,1],[1,0,1]], normal: [1,0,0] }, // right
  { dir: [0,  0,-1], corners: [[1,0,0],[1,1,0],[0,1,0],[0,0,0]], normal: [0,0,-1] }, // front
  { dir: [0,  0, 1], corners: [[0,0,1],[0,1,1],[1,1,1],[1,0,1]], normal: [0,0,1] }, // back
];

export class Chunk {
  readonly cx: number;
  readonly cz: number;
  data: Uint8Array;
  mesh: THREE.Mesh | null = null;
  waterMesh: THREE.Mesh | null = null;
  dirty = true;
  generated = false;

  constructor(cx: number, cz: number) {
    this.cx = cx;
    this.cz = cz;
    this.data = new Uint8Array(CHUNK_SIZE * CHUNK_HEIGHT * CHUNK_SIZE);
  }

  getIdx(x: number, y: number, z: number): number {
    return x * CHUNK_HEIGHT * CHUNK_SIZE + y * CHUNK_SIZE + z;
  }

  getBlock(x: number, y: number, z: number): number {
    if (x < 0 || x >= CHUNK_SIZE || y < 0 || y >= CHUNK_HEIGHT || z < 0 || z >= CHUNK_SIZE) return 0;
    return this.data[this.getIdx(x, y, z)];
  }

  setBlock(x: number, y: number, z: number, type: BlockType): void {
    if (x < 0 || x >= CHUNK_SIZE || y < 0 || y >= CHUNK_HEIGHT || z < 0 || z >= CHUNK_SIZE) return;
    this.data[this.getIdx(x, y, z)] = type;
    this.dirty = true;
  }

  buildMesh(
    getNeighborBlock: (wx: number, y: number, wz: number) => number,
    textureAtlas: THREE.CanvasTexture
  ): void {
    const positions: number[] = [];
    const normals: number[] = [];
    const colors: number[] = [];
    const indices: number[] = [];
    const wPositions: number[] = [];
    const wNormals: number[] = [];
    const wColors: number[] = [];
    const wIndices: number[] = [];

    const worldX = this.cx * CHUNK_SIZE;
    const worldZ = this.cz * CHUNK_SIZE;

    for (let lx = 0; lx < CHUNK_SIZE; lx++) {
      for (let y = 0; y < CHUNK_HEIGHT; y++) {
        for (let lz = 0; lz < CHUNK_SIZE; lz++) {
          const blockId = this.getBlock(lx, y, lz);
          if (blockId === BlockType.AIR) continue;

          const blockDef = getBlock(blockId);
          const isWater = isFluid(blockId);

          for (const face of FACES) {
            const nx = lx + face.dir[0];
            const ny = y + face.dir[1];
            const nz = lz + face.dir[2];

            let neighborId: number;
            if (nx < 0 || nx >= CHUNK_SIZE || nz < 0 || nz >= CHUNK_SIZE) {
              neighborId = getNeighborBlock(worldX + nx, ny, worldZ + nz);
            } else {
              neighborId = ny < 0 || ny >= CHUNK_HEIGHT ? 0 : this.getBlock(nx, ny, nz);
            }

            // Skip face if blocked by opaque neighbor (unless neighbor is water and we're not water)
            if (isSolid(neighborId) && !isTransparent(neighborId)) continue;
            if (isWater && neighborId === blockId) continue;

            // Pick color based on face
            let hexColor = blockDef.color;
            if (face.dir[1] === 1 && blockDef.topColor) hexColor = blockDef.topColor;
            else if (face.dir[1] === -1 && blockDef.bottomColor) hexColor = blockDef.bottomColor;
            else if (blockDef.sideColor) hexColor = blockDef.sideColor;

            const r = ((hexColor >> 16) & 0xff) / 255;
            const g = ((hexColor >> 8) & 0xff) / 255;
            const b = (hexColor & 0xff) / 255;

            // Ambient occlusion shading
            const ao = face.dir[1] === 1 ? 1.0 : face.dir[1] === -1 ? 0.5 : 0.75;

            const posArr = isWater ? wPositions : positions;
            const normArr = isWater ? wNormals : normals;
            const colArr = isWater ? wColors : colors;
            const idxArr = isWater ? wIndices : indices;
            const baseIdx = isWater ? wPositions.length / 3 : positions.length / 3;

            for (const corner of face.corners) {
              posArr.push(worldX + lx + corner[0], y + corner[1], worldZ + lz + corner[2]);
              normArr.push(...face.normal);
              colArr.push(r * ao, g * ao, b * ao);
            }

            idxArr.push(baseIdx, baseIdx+1, baseIdx+2, baseIdx, baseIdx+2, baseIdx+3);
          }
        }
      }
    }

    // Build solid mesh
    if (positions.length > 0) {
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
      geo.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
      geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
      geo.setIndex(indices);
      geo.computeBoundingSphere();

      const mat = new THREE.MeshLambertMaterial({ vertexColors: true });
      if (this.mesh) this.mesh.geometry.dispose();
      this.mesh = new THREE.Mesh(geo, mat);
      this.mesh.castShadow = true;
      this.mesh.receiveShadow = true;
    }

    // Build water mesh
    if (wPositions.length > 0) {
      const wGeo = new THREE.BufferGeometry();
      wGeo.setAttribute('position', new THREE.Float32BufferAttribute(wPositions, 3));
      wGeo.setAttribute('normal', new THREE.Float32BufferAttribute(wNormals, 3));
      wGeo.setAttribute('color', new THREE.Float32BufferAttribute(wColors, 3));
      wGeo.setIndex(wIndices);
      wGeo.computeBoundingSphere();

      const wMat = new THREE.MeshLambertMaterial({
        vertexColors: true, transparent: true, opacity: 0.75,
        side: THREE.DoubleSide, depthWrite: false,
      });
      if (this.waterMesh) this.waterMesh.geometry.dispose();
      this.waterMesh = new THREE.Mesh(wGeo, wMat);
    }

    this.dirty = false;
  }

  dispose(): void {
    this.mesh?.geometry.dispose();
    this.waterMesh?.geometry.dispose();
  }
}
