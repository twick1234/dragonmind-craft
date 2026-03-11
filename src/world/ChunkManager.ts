import * as THREE from 'three';
import { Chunk } from './Chunk';
import { WorldGen } from './WorldGen';
import { chunkKey, worldToChunk } from '../utils/Math3D';
import { CHUNK_SIZE, RENDER_DISTANCE } from '../utils/Constants';
import { BlockType } from './blocks/BlockTypes';

export class ChunkManager {
  private chunks = new Map<string, Chunk>();
  private scene: THREE.Scene;
  private worldGen: WorldGen;
  private atlas: THREE.CanvasTexture;
  private loadQueue: Array<[number, number]> = [];
  private generating = false;

  constructor(scene: THREE.Scene, worldGen: WorldGen) {
    this.scene = scene;
    this.worldGen = worldGen;
    this.atlas = this.createAtlas();
  }

  private createAtlas(): THREE.CanvasTexture {
    // Simple placeholder atlas texture
    const canvas = document.createElement('canvas');
    canvas.width = 16; canvas.height = 16;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 16, 16);
    const tex = new THREE.CanvasTexture(canvas);
    tex.magFilter = THREE.NearestFilter;
    tex.minFilter = THREE.NearestFilter;
    return tex;
  }

  update(playerX: number, playerZ: number): void {
    const [pcx, pcz] = worldToChunk(playerX, playerZ, CHUNK_SIZE);

    // Unload distant chunks
    for (const [key, chunk] of this.chunks) {
      const dx = Math.abs(chunk.cx - pcx);
      const dz = Math.abs(chunk.cz - pcz);
      if (dx > RENDER_DISTANCE + 2 || dz > RENDER_DISTANCE + 2) {
        this.unloadChunk(key, chunk);
      }
    }

    // Queue nearby chunks
    for (let dx = -RENDER_DISTANCE; dx <= RENDER_DISTANCE; dx++) {
      for (let dz = -RENDER_DISTANCE; dz <= RENDER_DISTANCE; dz++) {
        const cx = pcx + dx, cz = pcz + dz;
        const key = chunkKey(cx, cz);
        if (!this.chunks.has(key)) {
          this.loadQueue.push([cx, cz]);
          // Placeholder chunk to avoid re-queuing
          const c = new Chunk(cx, cz);
          this.chunks.set(key, c);
        }
      }
    }

    // Process load queue
    this.processQueue();

    // Rebuild dirty meshes
    for (const chunk of this.chunks.values()) {
      if (chunk.dirty && chunk.generated) {
        chunk.buildMesh(
          (wx, y, wz) => this.getBlockWorld(wx, y, wz),
          this.atlas
        );
        if (chunk.mesh && !this.scene.children.includes(chunk.mesh)) {
          this.scene.add(chunk.mesh);
        }
        if (chunk.waterMesh && !this.scene.children.includes(chunk.waterMesh)) {
          this.scene.add(chunk.waterMesh);
        }
      }
    }
  }

  private processQueue(): void {
    // Process up to 2 chunks per frame
    let processed = 0;
    while (this.loadQueue.length > 0 && processed < 2) {
      const item = this.loadQueue.shift();
      if (!item) break;
      const [cx, cz] = item;
      const key = chunkKey(cx, cz);
      const chunk = this.chunks.get(key);
      if (chunk && !chunk.generated) {
        chunk.data = this.worldGen.generateChunk(cx, cz);
        chunk.generated = true;
        chunk.dirty = true;
        processed++;
      }
    }
  }

  private unloadChunk(key: string, chunk: Chunk): void {
    if (chunk.mesh) this.scene.remove(chunk.mesh);
    if (chunk.waterMesh) this.scene.remove(chunk.waterMesh);
    chunk.dispose();
    this.chunks.delete(key);
  }

  getChunk(cx: number, cz: number): Chunk | undefined {
    return this.chunks.get(chunkKey(cx, cz));
  }

  getBlockWorld(wx: number, y: number, wz: number): number {
    const [cx, cz] = worldToChunk(wx, wz, CHUNK_SIZE);
    const chunk = this.getChunk(cx, cz);
    if (!chunk || !chunk.generated) return 0;
    const lx = ((wx % CHUNK_SIZE) + CHUNK_SIZE) % CHUNK_SIZE;
    const lz = ((wz % CHUNK_SIZE) + CHUNK_SIZE) % CHUNK_SIZE;
    return chunk.getBlock(lx, y, lz);
  }

  setBlockWorld(wx: number, y: number, wz: number, type: BlockType): void {
    const [cx, cz] = worldToChunk(wx, wz, CHUNK_SIZE);
    const chunk = this.getChunk(cx, cz);
    if (!chunk || !chunk.generated) return;
    const lx = ((wx % CHUNK_SIZE) + CHUNK_SIZE) % CHUNK_SIZE;
    const lz = ((wz % CHUNK_SIZE) + CHUNK_SIZE) % CHUNK_SIZE;
    chunk.setBlock(lx, y, lz, type);

    // Mark neighbor chunks dirty if on border
    if (lx === 0) this.getChunk(cx - 1, cz)?.markDirty();
    if (lx === CHUNK_SIZE - 1) this.getChunk(cx + 1, cz)?.markDirty();
    if (lz === 0) this.getChunk(cx, cz - 1)?.markDirty();
    if (lz === CHUNK_SIZE - 1) this.getChunk(cx, cz + 1)?.markDirty();
  }

  dispose(): void {
    for (const [key, chunk] of this.chunks) {
      this.unloadChunk(key, chunk);
    }
  }
}

// Extend Chunk with markDirty
declare module './Chunk' {
  interface Chunk { markDirty(): void; }
}
Chunk.prototype.markDirty = function() { this.dirty = true; };
