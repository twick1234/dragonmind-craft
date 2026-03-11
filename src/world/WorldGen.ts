import { BlockType } from './blocks/BlockTypes';
import { SimplexNoise } from '../utils/noise/SimplexNoise';
import { BiomeManager, BiomeDef, Biome } from './BiomeManager';
import { CHUNK_SIZE, CHUNK_HEIGHT, SEA_LEVEL } from '../utils/Constants';

export class WorldGen {
  private heightNoise: SimplexNoise;
  private detailNoise: SimplexNoise;
  private caveNoise: SimplexNoise;
  private cave2Noise: SimplexNoise;
  private oreNoise: SimplexNoise;
  private biomeManager: BiomeManager;
  readonly seed: number;

  constructor(seed: number) {
    this.seed = seed;
    this.heightNoise = new SimplexNoise(seed);
    this.detailNoise = new SimplexNoise(seed + 1);
    this.caveNoise = new SimplexNoise(seed + 2);
    this.cave2Noise = new SimplexNoise(seed + 3);
    this.oreNoise = new SimplexNoise(seed + 4);
    this.biomeManager = new BiomeManager(seed);
  }

  getBiomeManager(): BiomeManager { return this.biomeManager; }

  /** Generate full chunk data - returns flat array [x][y][z] */
  generateChunk(chunkX: number, chunkZ: number): Uint8Array {
    const data = new Uint8Array(CHUNK_SIZE * CHUNK_HEIGHT * CHUNK_SIZE);

    const getIdx = (x: number, y: number, z: number) =>
      x * CHUNK_HEIGHT * CHUNK_SIZE + y * CHUNK_SIZE + z;

    const setBlock = (x: number, y: number, z: number, type: BlockType) => {
      if (y >= 0 && y < CHUNK_HEIGHT) data[getIdx(x, y, z)] = type;
    };

    // Pre-calculate surface heights and biomes for each column
    const surfaceHeights: number[][] = [];
    const biomes: BiomeDef[][] = [];

    for (let lx = 0; lx < CHUNK_SIZE; lx++) {
      surfaceHeights[lx] = [];
      biomes[lx] = [];
      for (let lz = 0; lz < CHUNK_SIZE; lz++) {
        const wx = chunkX * CHUNK_SIZE + lx;
        const wz = chunkZ * CHUNK_SIZE + lz;
        const biome = this.biomeManager.getBiome(wx, wz);
        biomes[lx][lz] = biome;
        surfaceHeights[lx][lz] = this.getSurfaceHeight(wx, wz, biome);
      }
    }

    // Fill terrain
    for (let lx = 0; lx < CHUNK_SIZE; lx++) {
      for (let lz = 0; lz < CHUNK_SIZE; lz++) {
        const wx = chunkX * CHUNK_SIZE + lx;
        const wz = chunkZ * CHUNK_SIZE + lz;
        const biome = biomes[lx][lz];
        const surfaceY = surfaceHeights[lx][lz];

        // Bedrock
        setBlock(lx, 0, lz, BlockType.BEDROCK);
        if (Math.random() < 0.5) setBlock(lx, 1, lz, BlockType.BEDROCK);

        for (let y = 2; y < CHUNK_HEIGHT; y++) {
          if (y > surfaceY) {
            // Air or water
            if (y <= SEA_LEVEL) setBlock(lx, y, lz, BlockType.WATER);
            continue;
          }

          // Cave check
          if (y > 5 && y < surfaceY - 1 && this.isCave(wx, y, wz)) continue;

          if (y === surfaceY) {
            setBlock(lx, y, lz, this.biomeManager.getSurfaceBlock(biome, y));
          } else if (y > surfaceY - 4) {
            setBlock(lx, y, lz, biome.subsurfaceBlock);
          } else {
            // Stone with ores
            const oreBlock = this.getOre(wx, y, wz);
            setBlock(lx, y, lz, oreBlock);
          }
        }

        // Dragon biome underground features
        if (surfaceY < 60) {
          const dragonNoise = this.oreNoise.noise3D(wx * 0.05, 20 * 0.05, wz * 0.05);
          if (dragonNoise > 0.7) {
            for (let y = 10; y < 30; y++) {
              if (data[getIdx(lx, y, lz)] === BlockType.STONE) {
                setBlock(lx, y, lz, BlockType.DRAGON_STONE);
              }
            }
          }
        }
      }
    }

    // Place surface features (trees, plants)
    for (let lx = 0; lx < CHUNK_SIZE; lx++) {
      for (let lz = 0; lz < CHUNK_SIZE; lz++) {
        const wx = chunkX * CHUNK_SIZE + lx;
        const wz = chunkZ * CHUNK_SIZE + lz;
        const biome = biomes[lx][lz];
        const surfaceY = surfaceHeights[lx][lz];

        if (surfaceY < SEA_LEVEL) continue;

        // Trees
        if (biome.treeType && Math.random() < biome.treeFrequency) {
          this.placeTree(data, lx, surfaceY + 1, lz, biome, getIdx, setBlock, CHUNK_SIZE);
        }

        // Tall grass
        if (biome.grassFrequency > 0 && Math.random() < biome.grassFrequency) {
          setBlock(lx, surfaceY + 1, lz, BlockType.TALL_GRASS);
        }

        // Flowers
        if (biome.flowerFrequency > 0 && Math.random() < biome.flowerFrequency) {
          setBlock(lx, surfaceY + 1, lz, Math.random() < 0.5 ? BlockType.FLOWER_RED : BlockType.FLOWER_YELLOW);
        }

        // Cactus in desert
        if (biome.name === Biome.DESERT && Math.random() < 0.005) {
          const height = 1 + Math.floor(Math.random() * 3);
          for (let cy = 0; cy < height; cy++) {
            setBlock(lx, surfaceY + 1 + cy, lz, BlockType.CACTUS);
          }
        }

        // Dragon crystals in dragon zones
        if (biome.name === Biome.MOUNTAINS && Math.random() < 0.002) {
          setBlock(lx, surfaceY + 1, lz, BlockType.DRAGON_CRYSTAL);
        }
      }
    }

    return data;
  }

  private getSurfaceHeight(wx: number, wz: number, biome: BiomeDef): number {
    const scale = 0.003;
    const detailScale = 0.015;
    const base = this.heightNoise.fbm(wx * scale, wz * scale, 4, 0.5, 2.0);
    const detail = this.detailNoise.noise2D(wx * detailScale, wz * detailScale) * 0.3;
    const combined = (base + detail) * biome.heightVariation + biome.baseHeight;
    return Math.max(2, Math.min(CHUNK_HEIGHT - 10, Math.floor(combined)));
  }

  private isCave(wx: number, y: number, wz: number): boolean {
    const scale = 0.05;
    const n1 = this.caveNoise.noise3D(wx * scale, y * scale, wz * scale);
    const n2 = this.cave2Noise.noise3D(wx * scale + 100, y * scale, wz * scale + 100);
    return Math.abs(n1) < 0.08 && Math.abs(n2) < 0.08;
  }

  private getOre(wx: number, y: number, wz: number): BlockType {
    const n = this.oreNoise.noise3D(wx * 0.1, y * 0.1, wz * 0.1);
    const abs = Math.abs(n);

    if (y < 16 && abs > 0.75) return BlockType.DIAMOND_ORE;
    if (y < 20 && abs > 0.72) return BlockType.GOLD_ORE;
    if (y < 30 && abs > 0.70) return BlockType.REDSTONE_ORE;
    if (y < 32 && abs > 0.68) return BlockType.LAPIS_ORE;
    if (y < 40 && abs > 0.65) return BlockType.EMERALD_ORE;
    if (y < 64 && abs > 0.60) return BlockType.IRON_ORE;
    if (abs > 0.55) return BlockType.COAL_ORE;
    if (y < 25 && abs > 0.78) return BlockType.DRAGON_ORE;

    return BlockType.STONE;
  }

  private placeTree(
    data: Uint8Array,
    lx: number, ly: number, lz: number,
    biome: BiomeDef,
    getIdx: (x: number, y: number, z: number) => number,
    setBlock: (x: number, y: number, z: number, type: BlockType) => void,
    chunkSize: number
  ) {
    if (!biome.treeType || !biome.treeLeaves) return;
    const trunkHeight = 4 + Math.floor(Math.random() * 3);

    // Trunk
    for (let ty = 0; ty < trunkHeight; ty++) {
      setBlock(lx, ly + ty, lz, biome.treeType);
    }

    // Leaves (within chunk bounds only for simplicity)
    const leafStart = ly + trunkHeight - 2;
    const leafEnd = ly + trunkHeight + 1;
    for (let ly2 = leafStart; ly2 <= leafEnd; ly2++) {
      const radius = ly2 < ly + trunkHeight ? 2 : 1;
      for (let dx = -radius; dx <= radius; dx++) {
        for (let dz = -radius; dz <= radius; dz++) {
          if (dx === 0 && dz === 0) continue;
          if (Math.abs(dx) + Math.abs(dz) <= radius + 1) {
            const nx = lx + dx, nz = lz + dz;
            if (nx >= 0 && nx < chunkSize && nz >= 0 && nz < chunkSize) {
              setBlock(nx, ly2, nz, biome.treeLeaves!);
            }
          }
        }
      }
    }
    // Top leaf
    setBlock(lx, ly + trunkHeight + 1, lz, biome.treeLeaves);
  }
}
