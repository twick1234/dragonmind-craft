/**
 * DragonMind Craft - Main Game Script
 * Based on the proven minecraft-threejs-clone engine
 * Enhanced with DragonMind branding and additional features
 */

import * as THREE from 'three';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';
import { SimplexNoise } from 'three/examples/jsm/math/SimplexNoise.js';

// ============================================================
// CANVAS TEXTURE GENERATION (no external texture files needed)
// ============================================================

function makePixelCanvas(size, drawFn) {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  drawFn(ctx, size);
  const tex = new THREE.CanvasTexture(canvas);
  tex.magFilter = THREE.NearestFilter;
  tex.minFilter = THREE.NearestFilter;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function noise2d(x, y) {
  // Simple deterministic noise for texture generation
  const a = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return a - Math.floor(a);
}

function pixelNoise(ctx, size, r, g, b, variance) {
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const n = (noise2d(x, y) - 0.5) * variance;
      const cr = Math.min(255, Math.max(0, r + n));
      const cg = Math.min(255, Math.max(0, g + n));
      const cb = Math.min(255, Math.max(0, b + n));
      ctx.fillStyle = `rgb(${Math.round(cr)},${Math.round(cg)},${Math.round(cb)})`;
      ctx.fillRect(x, y, 1, 1);
    }
  }
}

const TEXTURE_SIZE = 16;

const generatedTextures = {
  grass: makePixelCanvas(TEXTURE_SIZE, (ctx, s) => {
    // Green top with noise
    for (let y = 0; y < s; y++) {
      for (let x = 0; x < s; x++) {
        const n = (noise2d(x, y) - 0.5) * 30;
        ctx.fillStyle = `rgb(${Math.round(80 + n)},${Math.round(140 + n)},${Math.round(40 + n)})`;
        ctx.fillRect(x, y, 1, 1);
      }
    }
  }),

  grassSide: makePixelCanvas(TEXTURE_SIZE, (ctx, s) => {
    // Bottom half dirt, top strip green
    const half = Math.floor(s * 0.7);
    for (let y = 0; y < s; y++) {
      for (let x = 0; x < s; x++) {
        const n = (noise2d(x + 10, y + 5) - 0.5) * 25;
        if (y < s - half) {
          // grass strip at top
          ctx.fillStyle = `rgb(${Math.round(80 + n)},${Math.round(140 + n)},${Math.round(40 + n)})`;
        } else {
          // dirt
          ctx.fillStyle = `rgb(${Math.round(134 + n)},${Math.round(96 + n)},${Math.round(67 + n)})`;
        }
        ctx.fillRect(x, y, 1, 1);
      }
    }
  }),

  dirt: makePixelCanvas(TEXTURE_SIZE, (ctx, s) => {
    pixelNoise(ctx, s, 134, 96, 67, 30);
    // Add some dark specks
    for (let i = 0; i < 8; i++) {
      const x = Math.floor(noise2d(i, 0) * s);
      const y = Math.floor(noise2d(0, i) * s);
      ctx.fillStyle = 'rgba(80,50,30,0.4)';
      ctx.fillRect(x, y, 2, 1);
    }
  }),

  stone: makePixelCanvas(TEXTURE_SIZE, (ctx, s) => {
    pixelNoise(ctx, s, 125, 125, 125, 20);
    // Add cracks
    ctx.strokeStyle = 'rgba(80,80,80,0.3)';
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.moveTo(3, 3); ctx.lineTo(8, 6); ctx.lineTo(5, 12);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(10, 2); ctx.lineTo(13, 8);
    ctx.stroke();
  }),

  sand: makePixelCanvas(TEXTURE_SIZE, (ctx, s) => {
    pixelNoise(ctx, s, 220, 200, 130, 20);
    // Slightly different grain effect
    for (let i = 0; i < 12; i++) {
      const x = Math.floor(noise2d(i * 3, i) * s);
      const y = Math.floor(noise2d(i, i * 2) * s);
      ctx.fillStyle = 'rgba(180,160,90,0.4)';
      ctx.fillRect(x, y, 1, 1);
    }
  }),

  wood: makePixelCanvas(TEXTURE_SIZE, (ctx, s) => {
    // Wood side with grain
    for (let y = 0; y < s; y++) {
      for (let x = 0; x < s; x++) {
        const ring = Math.sin((x - s / 2) * 0.8 + y * 0.2) * 15;
        const n = (noise2d(x + 20, y + 3) - 0.5) * 15;
        ctx.fillStyle = `rgb(${Math.round(150 + ring + n)},${Math.round(100 + ring * 0.7 + n)},${Math.round(60 + ring * 0.5 + n)})`;
        ctx.fillRect(x, y, 1, 1);
      }
    }
  }),

  woodTop: makePixelCanvas(TEXTURE_SIZE, (ctx, s) => {
    // Wood top with rings
    const cx = s / 2, cy = s / 2;
    for (let y = 0; y < s; y++) {
      for (let x = 0; x < s; x++) {
        const r = Math.sqrt((x - cx) * (x - cx) + (y - cy) * (y - cy));
        const ring = Math.sin(r * 1.2) * 15;
        const n = (noise2d(x * 2, y * 2) - 0.5) * 10;
        ctx.fillStyle = `rgb(${Math.round(160 + ring + n)},${Math.round(110 + ring * 0.7 + n)},${Math.round(65 + ring * 0.5 + n)})`;
        ctx.fillRect(x, y, 1, 1);
      }
    }
  }),

  leaves: makePixelCanvas(TEXTURE_SIZE, (ctx, s) => {
    ctx.fillStyle = '#2d6b2d';
    ctx.fillRect(0, 0, s, s);
    for (let y = 0; y < s; y++) {
      for (let x = 0; x < s; x++) {
        const n = noise2d(x + 7, y + 13);
        if (n > 0.6) {
          ctx.fillStyle = '#1a4a1a';
          ctx.fillRect(x, y, 1, 1);
        } else if (n < 0.2) {
          ctx.fillStyle = '#3d8a3d';
          ctx.fillRect(x, y, 1, 1);
        }
      }
    }
  }),

  coalOre: makePixelCanvas(TEXTURE_SIZE, (ctx, s) => {
    pixelNoise(ctx, s, 125, 125, 125, 15);
    // Add coal spots
    const spots = [[3,3],[7,9],[12,5],[5,12],[10,2],[14,11],[2,8],[9,14]];
    for (const [x, y] of spots) {
      ctx.fillStyle = '#1a1a1a';
      ctx.fillRect(x, y, 2, 2);
      ctx.fillStyle = '#2d2d2d';
      ctx.fillRect(x + 1, y, 1, 1);
    }
  }),

  ironOre: makePixelCanvas(TEXTURE_SIZE, (ctx, s) => {
    pixelNoise(ctx, s, 125, 125, 125, 15);
    // Add iron spots (orange-ish)
    const spots = [[3,3],[8,8],[12,4],[4,12],[10,1],[13,10],[1,7],[9,13]];
    for (const [x, y] of spots) {
      ctx.fillStyle = '#cc8844';
      ctx.fillRect(x, y, 2, 2);
      ctx.fillStyle = '#ddaa66';
      ctx.fillRect(x + 1, y, 1, 1);
    }
  }),

  gold: makePixelCanvas(TEXTURE_SIZE, (ctx, s) => {
    pixelNoise(ctx, s, 125, 125, 125, 15);
    const spots = [[2,4],[7,7],[11,3],[5,11],[10,2],[13,9],[1,8],[8,13],[4,1],[12,12]];
    for (const [x, y] of spots) {
      ctx.fillStyle = '#ffcc00';
      ctx.fillRect(x, y, 2, 2);
      ctx.fillStyle = '#ffee44';
      ctx.fillRect(x + 1, y, 1, 1);
    }
  }),

  diamond: makePixelCanvas(TEXTURE_SIZE, (ctx, s) => {
    pixelNoise(ctx, s, 105, 115, 125, 12);
    const spots = [[3,5],[8,9],[12,2],[5,12],[10,1],[13,8],[2,7],[9,14],[6,3],[11,11]];
    for (const [x, y] of spots) {
      ctx.fillStyle = '#44eeff';
      ctx.fillRect(x, y, 2, 2);
      ctx.fillStyle = '#88ffff';
      ctx.fillRect(x + 1, y, 1, 1);
    }
  }),

  glass: makePixelCanvas(TEXTURE_SIZE, (ctx, s) => {
    ctx.fillStyle = 'rgba(180, 230, 255, 0.3)';
    ctx.fillRect(0, 0, s, s);
    // Frame
    ctx.strokeStyle = 'rgba(200, 230, 255, 0.8)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(1, 1, s - 2, s - 2);
    // Cross dividers
    ctx.beginPath();
    ctx.moveTo(s / 2, 1); ctx.lineTo(s / 2, s - 1);
    ctx.moveTo(1, s / 2); ctx.lineTo(s - 1, s / 2);
    ctx.stroke();
  }),

  snow: makePixelCanvas(TEXTURE_SIZE, (ctx, s) => {
    pixelNoise(ctx, s, 235, 240, 250, 15);
  }),

  snowSide: makePixelCanvas(TEXTURE_SIZE, (ctx, s) => {
    const half = Math.floor(s * 0.7);
    for (let y = 0; y < s; y++) {
      for (let x = 0; x < s; x++) {
        const n = (noise2d(x + 30, y + 15) - 0.5) * 25;
        if (y < s - half) {
          ctx.fillStyle = `rgb(${Math.round(235 + n)},${Math.round(240 + n)},${Math.round(250 + n)})`;
        } else {
          ctx.fillStyle = `rgb(${Math.round(134 + n)},${Math.round(96 + n)},${Math.round(67 + n)})`;
        }
        ctx.fillRect(x, y, 1, 1);
      }
    }
  }),

  jungleWood: makePixelCanvas(TEXTURE_SIZE, (ctx, s) => {
    for (let y = 0; y < s; y++) {
      for (let x = 0; x < s; x++) {
        const ring = Math.sin((x - s / 2) * 0.8 + y * 0.2) * 12;
        const n = (noise2d(x + 50, y + 30) - 0.5) * 15;
        ctx.fillStyle = `rgb(${Math.round(100 + ring + n)},${Math.round(80 + ring * 0.7 + n)},${Math.round(40 + ring * 0.5 + n)})`;
        ctx.fillRect(x, y, 1, 1);
      }
    }
  }),

  jungleLeaves: makePixelCanvas(TEXTURE_SIZE, (ctx, s) => {
    ctx.fillStyle = '#1a6b1a';
    ctx.fillRect(0, 0, s, s);
    for (let y = 0; y < s; y++) {
      for (let x = 0; x < s; x++) {
        const n = noise2d(x + 20, y + 25);
        if (n > 0.65) {
          ctx.fillStyle = '#0d3d0d';
          ctx.fillRect(x, y, 1, 1);
        } else if (n < 0.2) {
          ctx.fillStyle = '#2d8a2d';
          ctx.fillRect(x, y, 1, 1);
        }
      }
    }
  }),

  cactus: makePixelCanvas(TEXTURE_SIZE, (ctx, s) => {
    for (let y = 0; y < s; y++) {
      for (let x = 0; x < s; x++) {
        const n = (noise2d(x + 40, y + 60) - 0.5) * 15;
        // Green with darker edges
        const edgeFactor = (x < 2 || x > s - 3) ? 0.7 : 1.0;
        ctx.fillStyle = `rgb(${Math.round((60 + n) * edgeFactor)},${Math.round((130 + n) * edgeFactor)},${Math.round((30 + n) * edgeFactor)})`;
        ctx.fillRect(x, y, 1, 1);
      }
    }
    // Spine marks
    for (let y = 2; y < s; y += 4) {
      ctx.fillStyle = '#ddcc88';
      ctx.fillRect(1, y, 1, 1);
      ctx.fillRect(s - 2, y, 1, 1);
    }
  }),

  cloud: makePixelCanvas(TEXTURE_SIZE, (ctx, s) => {
    ctx.fillStyle = '#f0f0f8';
    ctx.fillRect(0, 0, s, s);
    for (let y = 0; y < s; y++) {
      for (let x = 0; x < s; x++) {
        if (noise2d(x * 2, y * 2) > 0.6) {
          ctx.fillStyle = '#e0e0ee';
          ctx.fillRect(x, y, 1, 1);
        }
      }
    }
  }),

  dragon: makePixelCanvas(TEXTURE_SIZE, (ctx, s) => {
    // Purple dragon-scale block
    for (let y = 0; y < s; y++) {
      for (let x = 0; x < s; x++) {
        const n = (noise2d(x + 100, y + 200) - 0.5) * 30;
        const scale = (Math.floor(x / 4) + Math.floor(y / 4)) % 2 === 0;
        const base = scale ? 120 : 90;
        ctx.fillStyle = `rgb(${Math.round(base * 0.6 + n)},${Math.round(base * 0.2 + n)},${Math.round(base + n)})`;
        ctx.fillRect(x, y, 1, 1);
      }
    }
    // Scale highlight edges
    for (let gx = 0; gx < s; gx += 4) {
      for (let gy = 0; gy < s; gy += 4) {
        ctx.fillStyle = 'rgba(180,80,255,0.3)';
        ctx.fillRect(gx, gy, 4, 1);
        ctx.fillRect(gx, gy, 1, 4);
      }
    }
  }),
};

// ============================================================
// RNG
// ============================================================
class RNG {
  constructor(seed) {
    this.m_w = (123456789 + seed) & 0xffffffff;
    this.m_z = (987654321 - seed) & 0xffffffff;
    this.mask = 0xffffffff;
  }

  random() {
    this.m_z = (36969 * (this.m_z & 65535) + (this.m_z >> 16)) & this.mask;
    this.m_w = (18000 * (this.m_w & 65535) + (this.m_w >> 16)) & this.mask;
    let result = ((this.m_z << 16) + (this.m_w & 65535)) >>> 0;
    result /= 4294967296;
    return result;
  }
}

// ============================================================
// DATA STORE
// ============================================================
class DataStore {
  constructor() {
    this.data = {};
  }

  clear() { this.data = {}; }

  contains(chunkX, chunkZ, bx, by, bz) {
    return this.data[`${chunkX},${chunkZ},${bx},${by},${bz}`] !== undefined;
  }

  get(chunkX, chunkZ, bx, by, bz) {
    return this.data[`${chunkX},${chunkZ},${bx},${by},${bz}`];
  }

  set(chunkX, chunkZ, bx, by, bz, blockId) {
    this.data[`${chunkX},${chunkZ},${bx},${by},${bz}`] = blockId;
  }
}

// ============================================================
// BLOCKS DEFINITION
// ============================================================
const T = generatedTextures;

const blocks = {
  empty: { id: 0, name: 'empty', visible: false },
  grass: {
    id: 1, name: 'Grass',
    iconTexture: 'grass',
    material: [
      new THREE.MeshLambertMaterial({ map: T.grassSide }),
      new THREE.MeshLambertMaterial({ map: T.grassSide }),
      new THREE.MeshLambertMaterial({ map: T.grass }),
      new THREE.MeshLambertMaterial({ map: T.dirt }),
      new THREE.MeshLambertMaterial({ map: T.grassSide }),
      new THREE.MeshLambertMaterial({ map: T.grassSide }),
    ]
  },
  dirt: {
    id: 2, name: 'Dirt', iconTexture: 'dirt',
    material: new THREE.MeshLambertMaterial({ map: T.dirt })
  },
  stone: {
    id: 3, name: 'Stone', iconTexture: 'stone',
    material: new THREE.MeshLambertMaterial({ map: T.stone }),
    scale: { x: 30, y: 30, z: 30 }, scarcity: 0.8
  },
  coalOre: {
    id: 4, name: 'Coal', iconTexture: 'coalOre',
    material: new THREE.MeshLambertMaterial({ map: T.coalOre }),
    scale: { x: 20, y: 20, z: 20 }, scarcity: 0.8
  },
  ironOre: {
    id: 5, name: 'Iron', iconTexture: 'ironOre',
    material: new THREE.MeshLambertMaterial({ map: T.ironOre }),
    scale: { x: 40, y: 40, z: 40 }, scarcity: 0.9
  },
  tree: {
    id: 6, name: 'Wood', iconTexture: 'wood',
    material: [
      new THREE.MeshLambertMaterial({ map: T.wood }),
      new THREE.MeshLambertMaterial({ map: T.wood }),
      new THREE.MeshLambertMaterial({ map: T.woodTop }),
      new THREE.MeshLambertMaterial({ map: T.woodTop }),
      new THREE.MeshLambertMaterial({ map: T.wood }),
      new THREE.MeshLambertMaterial({ map: T.wood }),
    ]
  },
  leaves: {
    id: 7, name: 'Leaves', iconTexture: 'leaves',
    material: new THREE.MeshLambertMaterial({ map: T.leaves })
  },
  sand: {
    id: 8, name: 'Sand', iconTexture: 'sand',
    material: new THREE.MeshLambertMaterial({ map: T.sand })
  },
  cloud: {
    id: 9, name: 'cloud', visible: true,
    material: new THREE.MeshBasicMaterial({ color: 0xf0f0f8 })
  },
  snow: {
    id: 10, name: 'Snow', iconTexture: 'snow',
    material: [
      new THREE.MeshLambertMaterial({ map: T.snowSide }),
      new THREE.MeshLambertMaterial({ map: T.snowSide }),
      new THREE.MeshLambertMaterial({ map: T.snow }),
      new THREE.MeshLambertMaterial({ map: T.dirt }),
      new THREE.MeshLambertMaterial({ map: T.snowSide }),
      new THREE.MeshLambertMaterial({ map: T.snowSide }),
    ]
  },
  jungleTree: {
    id: 11, name: 'Jungle Wood', iconTexture: 'jungleWood',
    material: [
      new THREE.MeshLambertMaterial({ map: T.jungleWood }),
      new THREE.MeshLambertMaterial({ map: T.jungleWood }),
      new THREE.MeshLambertMaterial({ map: T.woodTop }),
      new THREE.MeshLambertMaterial({ map: T.woodTop }),
      new THREE.MeshLambertMaterial({ map: T.jungleWood }),
      new THREE.MeshLambertMaterial({ map: T.jungleWood }),
    ]
  },
  jungleLeaves: {
    id: 12, name: 'Jungle Leaves', iconTexture: 'jungleLeaves',
    material: new THREE.MeshLambertMaterial({ map: T.jungleLeaves })
  },
  cactus: {
    id: 13, name: 'Cactus', iconTexture: 'cactus',
    material: [
      new THREE.MeshLambertMaterial({ map: T.cactus }),
      new THREE.MeshLambertMaterial({ map: T.cactus }),
      new THREE.MeshLambertMaterial({ map: T.cactus }),
      new THREE.MeshLambertMaterial({ map: T.cactus }),
      new THREE.MeshLambertMaterial({ map: T.cactus }),
      new THREE.MeshLambertMaterial({ map: T.cactus }),
    ]
  },
  jungleGrass: {
    id: 14, name: 'Jungle Grass', iconTexture: 'jungleLeaves',
    material: [
      new THREE.MeshLambertMaterial({ color: 0x80c080, map: T.grassSide }),
      new THREE.MeshLambertMaterial({ color: 0x80c080, map: T.grassSide }),
      new THREE.MeshLambertMaterial({ color: 0x80c080, map: T.grass }),
      new THREE.MeshLambertMaterial({ color: 0x80c080, map: T.dirt }),
      new THREE.MeshLambertMaterial({ color: 0x80c080, map: T.grassSide }),
      new THREE.MeshLambertMaterial({ color: 0x80c080, map: T.grassSide }),
    ]
  },
  gold: {
    id: 15, name: 'Gold', iconTexture: 'gold',
    material: new THREE.MeshLambertMaterial({ map: T.gold }),
    scale: { x: 40, y: 40, z: 40 }, scarcity: 0.92
  },
  diamond: {
    id: 16, name: 'Diamond', iconTexture: 'diamond',
    material: new THREE.MeshLambertMaterial({ map: T.diamond }),
    scale: { x: 30, y: 30, z: 30 }, scarcity: 0.95
  },
  glass: {
    id: 17, name: 'Glass', iconTexture: 'glass',
    material: new THREE.MeshLambertMaterial({
      map: T.glass,
      transparent: true,
      opacity: 0.6,
      side: THREE.DoubleSide
    })
  },
  dragonBlock: {
    id: 18, name: 'Dragon', iconTexture: 'dragon',
    material: new THREE.MeshLambertMaterial({ map: T.dragon, emissive: 0x220033, emissiveIntensity: 0.3 })
  },
};

const resources = [
  blocks.stone,
  blocks.coalOre,
  blocks.ironOre,
  blocks.gold,
  blocks.diamond,
];

// ============================================================
// WORLD CHUNK
// ============================================================
const chunkGeometry = new THREE.BoxGeometry();

class WorldChunk extends THREE.Group {
  constructor(size, params, dataStore) {
    super();
    this.loaded = false;
    this.size = size;
    this.params = params;
    this.dataStore = dataStore;
    this.data = [];
  }

  generate() {
    const rng = new RNG(this.params.seed);
    this.initializeTerrain();
    this.generateTerrain(rng);
    this.generateClouds(rng);
    this.loadPlayerChanges();
    this.generateMeshes();
    this.loaded = true;
  }

  initializeTerrain() {
    this.data = [];
    for (let x = 0; x < this.size.width; x++) {
      const slice = [];
      for (let y = 0; y < this.size.height; y++) {
        const row = [];
        for (let z = 0; z < this.size.width; z++) {
          row.push({ id: blocks.empty.id, instanceId: null });
        }
        slice.push(row);
      }
      this.data.push(slice);
    }
  }

  getBiome(simplex, x, z) {
    let noise = 0.5 * simplex.noise(
      (this.position.x + x) / this.params.biomes.scale,
      (this.position.z + z) / this.params.biomes.scale
    ) + 0.5;

    noise += this.params.biomes.variation.amplitude * (simplex.noise(
      (this.position.x + x) / this.params.biomes.variation.scale,
      (this.position.z + z) / this.params.biomes.variation.scale
    ));

    if (noise < this.params.biomes.tundraToTemperate) return 'Tundra';
    if (noise < this.params.biomes.temperateToJungle) return 'Temperate';
    if (noise < this.params.biomes.jungleToDesert) return 'Jungle';
    return 'Desert';
  }

  generateTerrain(rng) {
    const simplex = new SimplexNoise(rng);
    for (let x = 0; x < this.size.width; x++) {
      for (let z = 0; z < this.size.width; z++) {
        const biome = this.getBiome(simplex, x, z);
        const value = simplex.noise(
          (this.position.x + x) / this.params.terrain.scale,
          (this.position.z + z) / this.params.terrain.scale
        );
        const scaledNoise = this.params.terrain.offset + this.params.terrain.magnitude * value;
        let height = Math.max(0, Math.min(Math.floor(scaledNoise), this.size.height - 1));

        for (let y = this.size.height; y >= 0; y--) {
          if (y <= this.params.terrain.waterOffset && y === height) {
            this.setBlockId(x, y, z, blocks.sand.id);
          } else if (y === height) {
            let groundBlock;
            if (biome === 'Desert') groundBlock = blocks.sand.id;
            else if (biome === 'Jungle') groundBlock = blocks.jungleGrass.id;
            else if (biome === 'Tundra') groundBlock = blocks.snow.id;
            else groundBlock = blocks.grass.id;

            this.setBlockId(x, y, z, groundBlock);

            if (rng.random() < this.params.trees.frequency) {
              this.generateTree(rng, biome, x, height + 1, z);
            }
          } else if (y < height && this.getBlock(x, y, z)?.id === blocks.empty.id) {
            this.generateResourceIfNeeded(simplex, x, y, z);
          }
        }
      }
    }
  }

  generateResourceIfNeeded(simplex, x, y, z) {
    this.setBlockId(x, y, z, blocks.dirt.id);
    for (const resource of resources) {
      if (!resource.scale) continue;
      const value = simplex.noise3d(
        (this.position.x + x) / resource.scale.x,
        (this.position.y + y) / resource.scale.y,
        (this.position.z + z) / resource.scale.z
      );
      if (value > resource.scarcity) {
        this.setBlockId(x, y, z, resource.id);
      }
    }
  }

  generateTree(rng, biome, x, y, z) {
    const minH = this.params.trees.trunk.minHeight;
    const maxH = this.params.trees.trunk.maxHeight;
    const h = Math.round(minH + (maxH - minH) * rng.random());

    for (let ty = y; ty < y + h; ty++) {
      if (biome === 'Desert') {
        this.setBlockId(x, ty, z, blocks.cactus.id);
      } else if (biome === 'Jungle') {
        this.setBlockId(x, ty, z, blocks.jungleTree.id);
      } else {
        this.setBlockId(x, ty, z, blocks.tree.id);
      }
    }

    if (biome !== 'Desert') {
      this.generateTreeCanopy(biome, x, y + h, z, rng);
    }
  }

  generateTreeCanopy(biome, cx, cy, cz, rng) {
    const minR = this.params.trees.canopy.minRadius;
    const maxR = this.params.trees.canopy.maxRadius;
    const r = Math.round(minR + (maxR - minR) * rng.random());

    for (let dx = -r; dx <= r; dx++) {
      for (let dy = -r; dy <= r; dy++) {
        for (let dz = -r; dz <= r; dz++) {
          if (dx * dx + dy * dy + dz * dz > r * r) continue;
          const block = this.getBlock(cx + dx, cy + dy, cz + dz);
          if (block && block.id !== blocks.empty.id) continue;
          if (rng.random() < this.params.trees.canopy.density) {
            const leafBlock = biome === 'Jungle' ? blocks.jungleLeaves.id : blocks.leaves.id;
            this.setBlockId(cx + dx, cy + dy, cz + dz, leafBlock);
          }
        }
      }
    }
  }

  generateClouds(rng) {
    const simplex = new SimplexNoise(rng);
    for (let x = 0; x < this.size.width; x++) {
      for (let z = 0; z < this.size.width; z++) {
        const value = (simplex.noise(
          (this.position.x + x) / this.params.clouds.scale,
          (this.position.z + z) / this.params.clouds.scale
        ) + 1) * 0.5;
        if (value < this.params.clouds.density) {
          this.setBlockId(x, this.size.height - 1, z, blocks.cloud.id);
        }
      }
    }
  }

  loadPlayerChanges() {
    for (let x = 0; x < this.size.width; x++) {
      for (let y = 0; y < this.size.height; y++) {
        for (let z = 0; z < this.size.width; z++) {
          if (this.dataStore.contains(this.position.x, this.position.z, x, y, z)) {
            const blockId = this.dataStore.get(this.position.x, this.position.z, x, y, z);
            this.setBlockId(x, y, z, blockId);
          }
        }
      }
    }
  }

  generateMeshes() {
    this.clear();

    // Water plane
    const waterMat = new THREE.MeshLambertMaterial({
      color: 0x5588cc,
      transparent: true,
      opacity: 0.45,
      side: THREE.DoubleSide
    });
    const waterMesh = new THREE.Mesh(new THREE.PlaneGeometry(), waterMat);
    waterMesh.rotateX(-Math.PI / 2);
    waterMesh.position.set(
      this.size.width / 2,
      this.params.terrain.waterOffset + 0.4,
      this.size.width / 2
    );
    waterMesh.scale.set(this.size.width, this.size.width, 1);
    waterMesh.layers.set(1);
    this.add(waterMesh);

    const maxCount = this.size.width * this.size.width * this.size.height;
    const meshes = {};

    Object.values(blocks)
      .filter(b => b.id !== blocks.empty.id)
      .forEach(blockType => {
        const mesh = new THREE.InstancedMesh(chunkGeometry, blockType.material, maxCount);
        mesh.name = blockType.id;
        mesh.count = 0;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        meshes[blockType.id] = mesh;
      });

    const matrix = new THREE.Matrix4();
    for (let x = 0; x < this.size.width; x++) {
      for (let y = 0; y < this.size.height; y++) {
        for (let z = 0; z < this.size.width; z++) {
          const blockId = this.getBlock(x, y, z)?.id;
          if (!blockId || blockId === blocks.empty.id) continue;

          const mesh = meshes[blockId];
          if (!mesh) continue;
          const instanceId = mesh.count;

          if (!this.isBlockObscured(x, y, z)) {
            matrix.setPosition(x, y, z);
            mesh.setMatrixAt(instanceId, matrix);
            this.setBlockInstanceId(x, y, z, instanceId);
            mesh.count++;
          }
        }
      }
    }

    this.add(...Object.values(meshes));
  }

  getBlock(x, y, z) {
    if (this.inBounds(x, y, z)) return this.data[x][y][z];
    return null;
  }

  addBlock(x, y, z, blockId) {
    if (this.getBlock(x, y, z)?.id === blocks.empty.id) {
      this.setBlockId(x, y, z, blockId);
      this.addBlockInstance(x, y, z);
      this.dataStore.set(this.position.x, this.position.z, x, y, z, blockId);
    }
  }

  removeBlock(x, y, z) {
    const block = this.getBlock(x, y, z);
    if (block && block.id !== blocks.empty.id) {
      this.deleteBlockInstance(x, y, z);
      this.setBlockId(x, y, z, blocks.empty.id);
      this.dataStore.set(this.position.x, this.position.z, x, y, z, blocks.empty.id);
    }
  }

  deleteBlockInstance(x, y, z) {
    const block = this.getBlock(x, y, z);
    if (!block || block.id === blocks.empty.id || block.instanceId === null) return;

    const mesh = this.children.find(m => m.name === block.id);
    if (!mesh) return;
    const instanceId = block.instanceId;

    const lastMatrix = new THREE.Matrix4();
    mesh.getMatrixAt(mesh.count - 1, lastMatrix);

    const v = new THREE.Vector3();
    v.applyMatrix4(lastMatrix);
    this.setBlockInstanceId(v.x, v.y, v.z, instanceId);

    mesh.setMatrixAt(instanceId, lastMatrix);
    mesh.count--;
    mesh.instanceMatrix.needsUpdate = true;
    mesh.computeBoundingSphere();

    this.setBlockInstanceId(x, y, z, null);
  }

  addBlockInstance(x, y, z) {
    const block = this.getBlock(x, y, z);
    if (!block || block.id === blocks.empty.id || block.instanceId !== null) return;

    const mesh = this.children.find(m => m.name === block.id);
    if (!mesh) return;

    const instanceId = mesh.count++;
    this.setBlockInstanceId(x, y, z, instanceId);

    const matrix = new THREE.Matrix4();
    matrix.setPosition(x, y, z);
    mesh.setMatrixAt(instanceId, matrix);
    mesh.instanceMatrix.needsUpdate = true;
    mesh.computeBoundingSphere();
  }

  setBlockId(x, y, z, id) {
    if (this.inBounds(x, y, z)) this.data[x][y][z].id = id;
  }

  setBlockInstanceId(x, y, z, instanceId) {
    if (this.inBounds(x, y, z)) this.data[x][y][z].instanceId = instanceId;
  }

  inBounds(x, y, z) {
    return x >= 0 && x < this.size.width &&
      y >= 0 && y < this.size.height &&
      z >= 0 && z < this.size.width;
  }

  isBlockObscured(x, y, z) {
    const up = this.getBlock(x, y + 1, z)?.id ?? blocks.empty.id;
    const down = this.getBlock(x, y - 1, z)?.id ?? blocks.empty.id;
    const left = this.getBlock(x + 1, y, z)?.id ?? blocks.empty.id;
    const right = this.getBlock(x - 1, y, z)?.id ?? blocks.empty.id;
    const forward = this.getBlock(x, y, z + 1)?.id ?? blocks.empty.id;
    const back = this.getBlock(x, y, z - 1)?.id ?? blocks.empty.id;

    return !(
      up === blocks.empty.id || down === blocks.empty.id ||
      left === blocks.empty.id || right === blocks.empty.id ||
      forward === blocks.empty.id || back === blocks.empty.id
    );
  }

  disposeInstances() {
    this.traverse(obj => { if (obj.dispose) obj.dispose(); });
    this.clear();
  }
}

// ============================================================
// WORLD
// ============================================================
class World extends THREE.Group {
  constructor() {
    super();
    this.asyncLoading = true;
    this.drawDistance = 3;
    this.chunkSize = { width: 32, height: 32 };
    this.params = {
      seed: 0,
      terrain: { scale: 100, magnitude: 8, offset: 6, waterOffset: 4 },
      biomes: {
        scale: 500,
        variation: { amplitude: 0.2, scale: 50 },
        tundraToTemperate: 0.25,
        temperateToJungle: 0.5,
        jungleToDesert: 0.75
      },
      trees: {
        trunk: { minHeight: 4, maxHeight: 7 },
        canopy: { minRadius: 3, maxRadius: 3, density: 0.7 },
        frequency: 0.005
      },
      clouds: { scale: 30, density: 0.3 }
    };
    this.dataStore = new DataStore();

    document.addEventListener('keydown', (ev) => {
      if (ev.code === 'F1') this.save();
      if (ev.code === 'F2') this.load();
    });
  }

  save() {
    localStorage.setItem('dragonmind_params', JSON.stringify(this.params));
    localStorage.setItem('dragonmind_data', JSON.stringify(this.dataStore.data));
    showStatus('GAME SAVED');
  }

  load() {
    const savedParams = localStorage.getItem('dragonmind_params');
    const savedData = localStorage.getItem('dragonmind_data');
    if (savedParams) this.params = JSON.parse(savedParams);
    if (savedData) this.dataStore.data = JSON.parse(savedData);
    showStatus('GAME LOADED');
    this.generate();
  }

  generate(clearCache = false) {
    if (clearCache) this.dataStore.clear();
    this.disposeChunks();
    for (let x = -this.drawDistance; x <= this.drawDistance; x++) {
      for (let z = -this.drawDistance; z <= this.drawDistance; z++) {
        this.generateChunk(x, z);
      }
    }
  }

  update(player) {
    const visibleChunks = this.getVisibleChunks(player);
    const chunksToAdd = this.getChunksToAdd(visibleChunks);
    this.removeUnusedChunks(visibleChunks);
    for (const chunk of chunksToAdd) {
      this.generateChunk(chunk.x, chunk.z);
    }
  }

  getVisibleChunks(player) {
    const coords = this.worldToChunkCoords(player.position.x, player.position.y, player.position.z);
    const { x: cx, z: cz } = coords.chunk;
    const result = [];
    for (let x = cx - this.drawDistance; x <= cx + this.drawDistance; x++) {
      for (let z = cz - this.drawDistance; z <= cz + this.drawDistance; z++) {
        result.push({ x, z });
      }
    }
    return result;
  }

  getChunksToAdd(visibleChunks) {
    return visibleChunks.filter(vc =>
      !this.children.some(c => c.userData.x === vc.x && c.userData.z === vc.z)
    );
  }

  removeUnusedChunks(visibleChunks) {
    const toRemove = this.children.filter(chunk =>
      !visibleChunks.some(vc => vc.x === chunk.userData.x && vc.z === chunk.userData.z)
    );
    for (const chunk of toRemove) {
      chunk.disposeInstances?.();
      this.remove(chunk);
    }
  }

  generateChunk(x, z) {
    const chunk = new WorldChunk(this.chunkSize, this.params, this.dataStore);
    chunk.position.set(x * this.chunkSize.width, 0, z * this.chunkSize.width);
    chunk.userData = { x, z };

    if (this.asyncLoading) {
      requestIdleCallback(chunk.generate.bind(chunk), { timeout: 1000 });
    } else {
      chunk.generate();
    }

    this.add(chunk);
  }

  getBlock(x, y, z) {
    const coords = this.worldToChunkCoords(x, y, z);
    const chunk = this.getChunk(coords.chunk.x, coords.chunk.z);
    if (chunk?.loaded) {
      return chunk.getBlock(coords.block.x, coords.block.y, coords.block.z);
    }
    return null;
  }

  worldToChunkCoords(x, y, z) {
    const chunkX = Math.floor(x / this.chunkSize.width);
    const chunkZ = Math.floor(z / this.chunkSize.width);
    return {
      chunk: { x: chunkX, z: chunkZ },
      block: {
        x: x - this.chunkSize.width * chunkX,
        y,
        z: z - this.chunkSize.width * chunkZ
      }
    };
  }

  getChunk(cx, cz) {
    return this.children.find(c => c.userData.x === cx && c.userData.z === cz);
  }

  disposeChunks() {
    this.traverse(chunk => { if (chunk.disposeInstances) chunk.disposeInstances(); });
    this.clear();
  }

  addBlock(x, y, z, blockId) {
    const coords = this.worldToChunkCoords(x, y, z);
    const chunk = this.getChunk(coords.chunk.x, coords.chunk.z);
    if (chunk) {
      chunk.addBlock(coords.block.x, coords.block.y, coords.block.z, blockId);
      this.hideBlock(x - 1, y, z); this.hideBlock(x + 1, y, z);
      this.hideBlock(x, y - 1, z); this.hideBlock(x, y + 1, z);
      this.hideBlock(x, y, z - 1); this.hideBlock(x, y, z + 1);
    }
  }

  removeBlock(x, y, z) {
    const coords = this.worldToChunkCoords(x, y, z);
    const chunk = this.getChunk(coords.chunk.x, coords.chunk.z);
    if (coords.block.y === 0) return;
    if (chunk) {
      chunk.removeBlock(coords.block.x, coords.block.y, coords.block.z);
      this.revealBlock(x - 1, y, z); this.revealBlock(x + 1, y, z);
      this.revealBlock(x, y - 1, z); this.revealBlock(x, y + 1, z);
      this.revealBlock(x, y, z - 1); this.revealBlock(x, y, z + 1);
    }
  }

  revealBlock(x, y, z) {
    const coords = this.worldToChunkCoords(x, y, z);
    const chunk = this.getChunk(coords.chunk.x, coords.chunk.z);
    if (chunk) chunk.addBlockInstance(coords.block.x, coords.block.y, coords.block.z);
  }

  hideBlock(x, y, z) {
    const coords = this.worldToChunkCoords(x, y, z);
    const chunk = this.getChunk(coords.chunk.x, coords.chunk.z);
    if (chunk?.isBlockObscured(coords.block.x, coords.block.y, coords.block.z)) {
      chunk.deleteBlockInstance(coords.block.x, coords.block.y, coords.block.z);
    }
  }
}

// ============================================================
// PHYSICS
// ============================================================
class Physics {
  constructor(scene) {
    this.gravity = 32;
    this.simulationRate = 250;
    this.stepSize = 1 / this.simulationRate;
    this.accumulator = 0;
    this.helpers = new THREE.Group();
    this.helpers.visible = false;
    scene.add(this.helpers);
  }

  update(dt, player, world) {
    this.accumulator += dt;
    while (this.accumulator >= this.stepSize) {
      player.velocity.y -= this.gravity * this.stepSize;
      player.applyInputs(this.stepSize);
      this.detectCollisions(player, world);
      this.accumulator -= this.stepSize;
    }
  }

  detectCollisions(player, world) {
    player.onGround = false;
    this.helpers.clear();
    const candidates = this.broadPhase(player, world);
    const collisions = this.narrowPhase(candidates, player);
    if (collisions.length > 0) this.resolveCollisions(collisions, player);
  }

  broadPhase(player, world) {
    const candidates = [];
    const minX = Math.floor(player.position.x - player.radius);
    const maxX = Math.ceil(player.position.x + player.radius);
    const minY = Math.floor(player.position.y - player.height);
    const maxY = Math.ceil(player.position.y);
    const minZ = Math.floor(player.position.z - player.radius);
    const maxZ = Math.ceil(player.position.z + player.radius);

    for (let x = minX; x <= maxX; x++) {
      for (let y = minY; y <= maxY; y++) {
        for (let z = minZ; z <= maxZ; z++) {
          const blockId = world.getBlock(x, y, z)?.id;
          if (blockId && blockId !== blocks.empty.id) {
            candidates.push({ x, y, z });
          }
        }
      }
    }
    return candidates;
  }

  narrowPhase(candidates, player) {
    const collisions = [];
    for (const block of candidates) {
      const closestPoint = {
        x: Math.max(block.x - 0.5, Math.min(player.position.x, block.x + 0.5)),
        y: Math.max(block.y - 0.5, Math.min(player.position.y - (player.height / 2), block.y + 0.5)),
        z: Math.max(block.z - 0.5, Math.min(player.position.z, block.z + 0.5))
      };

      const dx = closestPoint.x - player.position.x;
      const dy = closestPoint.y - (player.position.y - (player.height / 2));
      const dz = closestPoint.z - player.position.z;

      if (this.pointInPlayerBoundingCylinder(closestPoint, player)) {
        const overlapY = (player.height / 2) - Math.abs(dy);
        const overlapXZ = player.radius - Math.sqrt(dx * dx + dz * dz);

        let normal, overlap;
        if (overlapY < overlapXZ) {
          normal = new THREE.Vector3(0, -Math.sign(dy), 0);
          overlap = overlapY;
          player.onGround = true;
        } else {
          normal = new THREE.Vector3(-dx, 0, -dz).normalize();
          overlap = overlapXZ;
        }

        collisions.push({ block, contactPoint: closestPoint, normal, overlap });
      }
    }
    return collisions;
  }

  resolveCollisions(collisions, player) {
    collisions.sort((a, b) => a.overlap - b.overlap);
    for (const collision of collisions) {
      if (!this.pointInPlayerBoundingCylinder(collision.contactPoint, player)) continue;
      const deltaPos = collision.normal.clone().multiplyScalar(collision.overlap);
      player.position.add(deltaPos);
      const magnitude = player.worldVelocity.dot(collision.normal);
      const velAdj = collision.normal.clone().multiplyScalar(magnitude);
      player.applyWorldDeltaVelocity(velAdj.negate());
    }
  }

  pointInPlayerBoundingCylinder(p, player) {
    const dx = p.x - player.position.x;
    const dy = p.y - (player.position.y - (player.height / 2));
    const dz = p.z - player.position.z;
    return (Math.abs(dy) < player.height / 2) && (dx * dx + dz * dz < player.radius * player.radius);
  }
}

// ============================================================
// PLAYER
// ============================================================
class Player {
  constructor(scene, world) {
    this.world = world;
    this.height = 1.75;
    this.radius = 0.5;
    this.maxSpeed = 5;
    this.jumpSpeed = 10;
    this.sprinting = false;
    this.onGround = false;
    this.debugMode = false;

    this.input = new THREE.Vector3();
    this.velocity = new THREE.Vector3();
    this._worldVelocity = new THREE.Vector3();

    this.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 150);
    this.controls = new PointerLockControls(this.camera, document.body);
    this.controls.addEventListener('lock', () => this.onCameraLock());
    this.controls.addEventListener('unlock', () => this.onCameraUnlock());

    this.raycaster = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(), 0, 4);
    this.raycaster.layers.set(0);
    this.camera.layers.enable(1);

    this.selectedCoords = null;
    this.activeBlockId = blocks.empty.id;
    this.activeSlot = 0;

    // Selection highlight
    const selMat = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.25, color: 0xffffff });
    const selGeo = new THREE.BoxGeometry(1.005, 1.005, 1.005);
    this.selectionHelper = new THREE.Mesh(selGeo, selMat);
    scene.add(this.selectionHelper);

    // Selection outline
    const edgesGeo = new THREE.EdgesGeometry(new THREE.BoxGeometry(1.01, 1.01, 1.01));
    const edgesMat = new THREE.LineBasicMaterial({ color: 0x000000 });
    this.selectionOutline = new THREE.LineSegments(edgesGeo, edgesMat);
    scene.add(this.selectionOutline);

    this.position.set(32, 32, 32);
    scene.add(this.camera);

    document.addEventListener('keydown', this.onKeyDown.bind(this));
    document.addEventListener('keyup', this.onKeyUp.bind(this));
    document.addEventListener('mousedown', this.onMouseDown.bind(this));
    document.addEventListener('mouseup', this.onMouseUp.bind(this));
    document.addEventListener('contextmenu', e => e.preventDefault());

    // Break progress tracking
    this.breakTarget = null;
    this.breakProgress = 0;
    this.breakBlock = 0;
    this.mouseHeld = false;
    this.rightMouseHeld = false;
    this.placeDelay = 0;

    this.buildHotbarUI();
  }

  buildHotbarUI() {
    const hotbar = document.getElementById('hotbar');
    hotbar.innerHTML = '';
    this.hotbarSlotEls = [];

    const slotDefs = [
      { id: 0, name: 'Break', iconKey: null },
      { id: 1, name: 'Grass', iconKey: 'grass' },
      { id: 2, name: 'Dirt', iconKey: 'dirt' },
      { id: 3, name: 'Stone', iconKey: 'stone' },
      { id: 6, name: 'Wood', iconKey: 'wood' },
      { id: 7, name: 'Leaves', iconKey: 'leaves' },
      { id: 8, name: 'Sand', iconKey: 'sand' },
      { id: 17, name: 'Glass', iconKey: 'glass' },
      { id: 15, name: 'Gold', iconKey: 'gold' },
    ];

    this.slotBlockIds = slotDefs.map(s => s.id);

    for (let i = 0; i < slotDefs.length; i++) {
      const def = slotDefs[i];
      const slot = document.createElement('div');
      slot.className = 'hotbar-slot' + (i === 0 ? ' selected' : '');
      slot.id = `hotbar-slot-${i}`;

      if (def.iconKey && generatedTextures[def.iconKey]) {
        const iconCanvas = document.createElement('canvas');
        iconCanvas.width = 40;
        iconCanvas.height = 40;
        const ctx = iconCanvas.getContext('2d');
        ctx.imageSmoothingEnabled = false;
        // Draw the texture onto the icon canvas
        const img = generatedTextures[def.iconKey].image;
        if (img) ctx.drawImage(img, 0, 0, 40, 40);
        slot.appendChild(iconCanvas);
      } else {
        // Break mode: draw pickaxe icon
        const iconCanvas = document.createElement('canvas');
        iconCanvas.width = 40;
        iconCanvas.height = 40;
        const ctx = iconCanvas.getContext('2d');
        ctx.strokeStyle = '#aaa';
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        // Pickaxe handle
        ctx.beginPath();
        ctx.moveTo(8, 32); ctx.lineTo(28, 12);
        ctx.stroke();
        // Pickaxe head
        ctx.fillStyle = '#999';
        ctx.beginPath();
        ctx.moveTo(22, 8); ctx.lineTo(32, 8); ctx.lineTo(32, 18); ctx.lineTo(28, 14);
        ctx.closePath();
        ctx.fill();
        slot.appendChild(iconCanvas);
      }

      const label = document.createElement('span');
      label.className = 'slot-label';
      label.textContent = def.name;
      slot.appendChild(label);

      hotbar.appendChild(slot);
      this.hotbarSlotEls.push(slot);
    }

    this.activeSlot = 0;
    this.activeBlockId = 0;
  }

  setActiveSlot(slotIndex) {
    const prevEl = this.hotbarSlotEls[this.activeSlot];
    if (prevEl) prevEl.classList.remove('selected');

    this.activeSlot = Math.max(0, Math.min(slotIndex, this.hotbarSlotEls.length - 1));
    this.activeBlockId = this.slotBlockIds[this.activeSlot];

    const newEl = this.hotbarSlotEls[this.activeSlot];
    if (newEl) newEl.classList.add('selected');
  }

  onCameraLock() {
    document.getElementById('overlay').style.display = 'none';
    document.getElementById('crosshair').style.display = 'block';
    document.getElementById('hotbar-container').style.display = 'flex';
    document.getElementById('hud-coords').style.display = 'block';
  }

  onCameraUnlock() {
    // Don't show overlay when unlocking from game (only show on start)
  }

  update(world) {
    this.updateRaycaster(world);
  }

  updateRaycaster(world) {
    this.raycaster.setFromCamera(new THREE.Vector2(), this.camera);
    const intersections = this.raycaster.intersectObject(world, true);

    if (intersections.length > 0) {
      const intersection = intersections[0];
      const chunk = intersection.object.parent;

      const blockMatrix = new THREE.Matrix4();
      intersection.object.getMatrixAt(intersection.instanceId, blockMatrix);

      this.selectedCoords = chunk.position.clone();
      this.selectedCoords.applyMatrix4(blockMatrix);

      if (this.activeBlockId !== blocks.empty.id) {
        this.selectedCoords.add(intersection.normal);
      }

      this.selectionHelper.position.copy(this.selectedCoords);
      this.selectionHelper.visible = true;
      this.selectionOutline.position.copy(this.selectedCoords);
      this.selectionOutline.visible = true;
    } else {
      this.selectedCoords = null;
      this.selectionHelper.visible = false;
      this.selectionOutline.visible = false;
    }
  }

  applyInputs(dt) {
    if (this.controls.isLocked) {
      this.velocity.x = this.input.x * (this.sprinting ? 1.8 : 1);
      this.velocity.z = this.input.z * (this.sprinting ? 1.8 : 1);
      this.controls.moveRight(this.velocity.x * dt);
      this.controls.moveForward(this.velocity.z * dt);
      this.position.y += this.velocity.y * dt;

      if (this.position.y < 0) {
        this.position.y = 0;
        this.velocity.y = 0;
      }
    }

    // Update coords display
    const hudCoords = document.getElementById('hud-coords');
    if (hudCoords) {
      hudCoords.innerHTML =
        `X: ${this.position.x.toFixed(1)} &nbsp; Y: ${this.position.y.toFixed(1)} &nbsp; Z: ${this.position.z.toFixed(1)}<br>` +
        `Block: ${blocks[Object.keys(blocks).find(k => blocks[k].id === this.activeBlockId)]?.name ?? 'Break'}<br>` +
        `${this.onGround ? 'grounded' : 'airborne'} &nbsp; ${this.sprinting ? 'sprinting' : ''}`;
    }
  }

  get position() {
    return this.camera.position;
  }

  get worldVelocity() {
    this._worldVelocity.copy(this.velocity);
    this._worldVelocity.applyEuler(new THREE.Euler(0, this.camera.rotation.y, 0));
    return this._worldVelocity;
  }

  applyWorldDeltaVelocity(dv) {
    dv.applyEuler(new THREE.Euler(0, -this.camera.rotation.y, 0));
    this.velocity.add(dv);
  }

  onKeyDown(event) {
    if (!this.controls.isLocked) {
      this.controls.lock();
      return;
    }

    switch (event.code) {
      case 'Digit0': this.setActiveSlot(0); break;
      case 'Digit1': this.setActiveSlot(1); break;
      case 'Digit2': this.setActiveSlot(2); break;
      case 'Digit3': this.setActiveSlot(3); break;
      case 'Digit4': this.setActiveSlot(4); break;
      case 'Digit5': this.setActiveSlot(5); break;
      case 'Digit6': this.setActiveSlot(6); break;
      case 'Digit7': this.setActiveSlot(7); break;
      case 'Digit8': this.setActiveSlot(8); break;
      case 'KeyW': this.input.z = this.maxSpeed; break;
      case 'KeyA': this.input.x = -this.maxSpeed; break;
      case 'KeyS': this.input.z = -this.maxSpeed; break;
      case 'KeyD': this.input.x = this.maxSpeed; break;
      case 'ShiftLeft':
      case 'ShiftRight': this.sprinting = true; break;
      case 'Space':
        if (this.onGround) this.velocity.y += this.jumpSpeed;
        break;
      case 'KeyR':
        this.position.set(32, 40, 32);
        this.velocity.set(0, 0, 0);
        break;
      case 'KeyF':
        this.debugMode = !this.debugMode;
        break;
    }
  }

  onKeyUp(event) {
    switch (event.code) {
      case 'KeyW': this.input.z = 0; break;
      case 'KeyA': this.input.x = 0; break;
      case 'KeyS': this.input.z = 0; break;
      case 'KeyD': this.input.x = 0; break;
      case 'ShiftLeft':
      case 'ShiftRight': this.sprinting = false; break;
    }
  }

  onMouseDown(event) {
    if (!this.controls.isLocked) return;

    if (event.button === 0) {
      this.mouseHeld = true;
      if (this.selectedCoords && this.activeBlockId === blocks.empty.id) {
        // Instant break (pickaxe mode)
        this.world.removeBlock(this.selectedCoords.x, this.selectedCoords.y, this.selectedCoords.z);
      }
    } else if (event.button === 2) {
      // Right click: place block
      if (this.selectedCoords && this.activeBlockId !== blocks.empty.id) {
        this.world.addBlock(
          this.selectedCoords.x,
          this.selectedCoords.y,
          this.selectedCoords.z,
          this.activeBlockId
        );
      }
    }
  }

  onMouseUp(event) {
    if (event.button === 0) {
      this.mouseHeld = false;
      this.breakTarget = null;
      this.breakProgress = 0;
    }
  }
}

// ============================================================
// STATUS DISPLAY
// ============================================================
function showStatus(msg) {
  const el = document.getElementById('status');
  if (el) {
    el.textContent = msg;
    setTimeout(() => { el.textContent = ''; }, 3000);
  }
}

// ============================================================
// SCENE SETUP
// ============================================================
const canvas = document.getElementById('game-canvas');

const renderer = new THREE.WebGLRenderer({ canvas, antialias: false });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x87ceeb);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const scene = new THREE.Scene();
scene.fog = new THREE.Fog(0x87ceeb, 60, 100);

const world = new World();
world.generate();
scene.add(world);

const player = new Player(scene, world);
const physics = new Physics(scene);

// Lights
let sun;
function setupLights() {
  sun = new THREE.DirectionalLight(0xfffaf0, 1.5);
  sun.position.set(50, 50, 50);
  sun.castShadow = true;
  sun.shadow.camera.left = -50;
  sun.shadow.camera.right = 50;
  sun.shadow.camera.top = 50;
  sun.shadow.camera.bottom = -50;
  sun.shadow.camera.near = 0.1;
  sun.shadow.camera.far = 200;
  sun.shadow.bias = -0.0001;
  sun.shadow.mapSize.set(2048, 2048);
  scene.add(sun);
  scene.add(sun.target);

  const ambient = new THREE.AmbientLight(0xaabbff, 0.4);
  scene.add(ambient);
}
setupLights();

// Day/night cycle
let timeOfDay = 0.3; // 0 = midnight, 0.25 = dawn, 0.5 = noon, 0.75 = dusk
const DAY_LENGTH = 600; // seconds for a full cycle

function updateDayNight(dt) {
  timeOfDay = (timeOfDay + dt / DAY_LENGTH) % 1;

  // Sun position in arc
  const angle = timeOfDay * Math.PI * 2;
  const sunX = Math.cos(angle) * 80;
  const sunY = Math.sin(angle) * 80;

  sun.position.copy(player.camera.position);
  sun.position.add(new THREE.Vector3(sunX, sunY, 30));
  sun.target.position.copy(player.camera.position);

  // Sky and light color based on time
  const noon = Math.max(0, Math.sin(angle));
  const r = THREE.MathUtils.lerp(0.05, 0.53, noon);
  const g = THREE.MathUtils.lerp(0.02, 0.81, noon);
  const b = THREE.MathUtils.lerp(0.15, 0.92, noon);
  const skyColor = new THREE.Color(r, g, b);
  renderer.setClearColor(skyColor);
  scene.fog.color.copy(skyColor);
  sun.intensity = noon * 1.5 + 0.1;
}

// ============================================================
// SETTINGS UI (dev panel, press U)
// ============================================================
let settingsVisible = false;
let settingsPanel = null;

function createSettingsPanel() {
  if (settingsPanel) return;

  settingsPanel = document.createElement('div');
  settingsPanel.style.cssText = `
    position: fixed; top: 10px; right: 10px;
    background: rgba(0,0,0,0.85);
    border: 2px solid #8844cc;
    padding: 15px;
    color: white;
    font-family: Minecraft, monospace;
    font-size: 13px;
    z-index: 50;
    min-width: 220px;
    display: none;
  `;
  settingsPanel.innerHTML = `
    <div style="color:#cc88ff;font-size:15px;margin-bottom:10px;">&#x2699; Settings</div>
    <div>Draw Distance: <input id="s-drawdist" type="range" min="1" max="5" value="3" style="width:100px"></div>
    <div style="margin-top:6px">Seed: <input id="s-seed" type="number" value="0" style="width:80px;background:#333;color:white;border:1px solid #666;padding:2px"></div>
    <button id="s-regen" style="margin-top:8px;padding:6px 12px;background:#5a2080;border:1px solid #8844cc;color:white;font-family:Minecraft,monospace;cursor:pointer">Regenerate World</button>
    <div style="margin-top:10px;color:#886699;font-size:11px">U - toggle &nbsp; Esc - exit pointer lock</div>
  `;
  document.body.appendChild(settingsPanel);

  document.getElementById('s-regen').addEventListener('click', () => {
    const dd = parseInt(document.getElementById('s-drawdist').value);
    const seed = parseInt(document.getElementById('s-seed').value) || 0;
    world.drawDistance = dd;
    world.params.seed = seed;
    world.generate(true);
    showStatus('World regenerated!');
  });

  document.getElementById('s-drawdist').addEventListener('input', (e) => {
    world.drawDistance = parseInt(e.target.value);
  });
}

document.addEventListener('keydown', (ev) => {
  if (ev.code === 'KeyU') {
    createSettingsPanel();
    settingsVisible = !settingsVisible;
    settingsPanel.style.display = settingsVisible ? 'block' : 'none';
  }
});

// ============================================================
// RENDER LOOP
// ============================================================
let previousTime = performance.now();
let frameCount = 0;

function animate() {
  requestAnimationFrame(animate);

  const currentTime = performance.now();
  const dt = Math.min((currentTime - previousTime) / 1000, 0.05);
  previousTime = currentTime;

  if (player.controls.isLocked) {
    physics.update(dt, player, world);
    player.update(world);
    world.update(player);
    updateDayNight(dt);
  }

  renderer.render(scene, player.camera);
  frameCount++;
}

window.addEventListener('resize', () => {
  player.camera.aspect = window.innerWidth / window.innerHeight;
  player.camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// ============================================================
// MAIN MENU BUTTONS
// ============================================================
document.getElementById('btn-play').addEventListener('click', () => {
  player.controls.lock();
  document.getElementById('overlay').style.display = 'none';
  document.getElementById('crosshair').style.display = 'block';
  document.getElementById('hotbar-container').style.display = 'flex';
  document.getElementById('hud-coords').style.display = 'block';
});

document.getElementById('btn-load').addEventListener('click', () => {
  world.load();
  player.controls.lock();
  document.getElementById('overlay').style.display = 'none';
  document.getElementById('crosshair').style.display = 'block';
  document.getElementById('hotbar-container').style.display = 'flex';
  document.getElementById('hud-coords').style.display = 'block';
});

// Pressing Escape shows menu again
document.addEventListener('keydown', (ev) => {
  if (ev.code === 'Escape' && !player.controls.isLocked) {
    // Show a resume option on overlay
    const overlay = document.getElementById('overlay');
    if (overlay.style.display === 'none' || overlay.style.display === '') {
      // Already hidden, show resume
      overlay.style.display = 'flex';
      document.getElementById('menu-title').textContent = '\u{1F409} DragonMind Craft';
      document.getElementById('btn-play').textContent = '\u25BA Resume';
    }
  }
});

console.log('%c\u{1F409} DragonMind Craft v1.0 loaded!', 'color: #cc44ff; font-size: 16px; font-weight: bold;');
console.log('Controls: WASD move, Space jump, Shift sprint, Left click break, Right click place, 1-8 hotbar, U settings, R reset, F1 save, F2 load');

// Start the game loop
animate();
