import { BlockType } from './blocks/BlockTypes';
import { SimplexNoise } from '../utils/noise/SimplexNoise';
import { SEA_LEVEL } from '../utils/Constants';

export enum Biome {
  PLAINS = 'plains',
  FOREST = 'forest',
  BIRCH_FOREST = 'birch_forest',
  SPRUCE_FOREST = 'spruce_forest',
  DESERT = 'desert',
  MOUNTAINS = 'mountains',
  SNOWY_TUNDRA = 'snowy_tundra',
  OCEAN = 'ocean',
  JUNGLE = 'jungle',
  SAVANNA = 'savanna',
}

export interface BiomeDef {
  name: Biome;
  baseHeight: number;
  heightVariation: number;
  temperature: number;   // 0=cold, 1=hot
  humidity: number;      // 0=dry, 1=wet
  surfaceBlock: BlockType;
  subsurfaceBlock: BlockType;
  fillerBlock: BlockType;
  treeType: BlockType | null;
  treeLeaves: BlockType | null;
  treeFrequency: number;   // 0-1
  grassFrequency: number;
  flowerFrequency: number;
  skyColor: number;
  fogColor: number;
}

export const BIOMES: Record<Biome, BiomeDef> = {
  [Biome.PLAINS]: {
    name: Biome.PLAINS, baseHeight: 68, heightVariation: 4,
    temperature: 0.8, humidity: 0.4,
    surfaceBlock: BlockType.GRASS, subsurfaceBlock: BlockType.DIRT, fillerBlock: BlockType.STONE,
    treeType: BlockType.OAK_LOG, treeLeaves: BlockType.OAK_LEAVES, treeFrequency: 0.003,
    grassFrequency: 0.15, flowerFrequency: 0.02,
    skyColor: 0x7ab4f5, fogColor: 0xc0d8ff,
  },
  [Biome.FOREST]: {
    name: Biome.FOREST, baseHeight: 70, heightVariation: 6,
    temperature: 0.7, humidity: 0.8,
    surfaceBlock: BlockType.GRASS, subsurfaceBlock: BlockType.DIRT, fillerBlock: BlockType.STONE,
    treeType: BlockType.OAK_LOG, treeLeaves: BlockType.OAK_LEAVES, treeFrequency: 0.04,
    grassFrequency: 0.3, flowerFrequency: 0.03,
    skyColor: 0x6aacf0, fogColor: 0xa8d0e8,
  },
  [Biome.BIRCH_FOREST]: {
    name: Biome.BIRCH_FOREST, baseHeight: 70, heightVariation: 5,
    temperature: 0.6, humidity: 0.6,
    surfaceBlock: BlockType.GRASS, subsurfaceBlock: BlockType.DIRT, fillerBlock: BlockType.STONE,
    treeType: BlockType.BIRCH_LOG, treeLeaves: BlockType.BIRCH_LEAVES, treeFrequency: 0.05,
    grassFrequency: 0.2, flowerFrequency: 0.04,
    skyColor: 0x7ab4f5, fogColor: 0xb8d8f8,
  },
  [Biome.SPRUCE_FOREST]: {
    name: Biome.SPRUCE_FOREST, baseHeight: 72, heightVariation: 8,
    temperature: 0.3, humidity: 0.8,
    surfaceBlock: BlockType.GRASS, subsurfaceBlock: BlockType.DIRT, fillerBlock: BlockType.STONE,
    treeType: BlockType.SPRUCE_LOG, treeLeaves: BlockType.SPRUCE_LEAVES, treeFrequency: 0.06,
    grassFrequency: 0.1, flowerFrequency: 0.01,
    skyColor: 0x6090c0, fogColor: 0x90b0c8,
  },
  [Biome.DESERT]: {
    name: Biome.DESERT, baseHeight: 66, heightVariation: 8,
    temperature: 1.0, humidity: 0.0,
    surfaceBlock: BlockType.SAND, subsurfaceBlock: BlockType.SAND, fillerBlock: BlockType.STONE,
    treeType: null, treeLeaves: null, treeFrequency: 0.0,
    grassFrequency: 0.0, flowerFrequency: 0.0,
    skyColor: 0xe0c060, fogColor: 0xf0e080,
  },
  [Biome.MOUNTAINS]: {
    name: Biome.MOUNTAINS, baseHeight: 80, heightVariation: 40,
    temperature: 0.2, humidity: 0.3,
    surfaceBlock: BlockType.STONE, subsurfaceBlock: BlockType.STONE, fillerBlock: BlockType.STONE,
    treeType: BlockType.SPRUCE_LOG, treeLeaves: BlockType.SPRUCE_LEAVES, treeFrequency: 0.01,
    grassFrequency: 0.05, flowerFrequency: 0.005,
    skyColor: 0x80b0e0, fogColor: 0xc0d8f0,
  },
  [Biome.SNOWY_TUNDRA]: {
    name: Biome.SNOWY_TUNDRA, baseHeight: 65, heightVariation: 5,
    temperature: 0.0, humidity: 0.5,
    surfaceBlock: BlockType.SNOW, subsurfaceBlock: BlockType.DIRT, fillerBlock: BlockType.STONE,
    treeType: BlockType.SPRUCE_LOG, treeLeaves: BlockType.SPRUCE_LEAVES, treeFrequency: 0.008,
    grassFrequency: 0.0, flowerFrequency: 0.0,
    skyColor: 0x90b8d8, fogColor: 0xd8eaf8,
  },
  [Biome.OCEAN]: {
    name: Biome.OCEAN, baseHeight: 44, heightVariation: 8,
    temperature: 0.5, humidity: 1.0,
    surfaceBlock: BlockType.SAND, subsurfaceBlock: BlockType.SAND, fillerBlock: BlockType.STONE,
    treeType: null, treeLeaves: null, treeFrequency: 0.0,
    grassFrequency: 0.0, flowerFrequency: 0.0,
    skyColor: 0x4a90d8, fogColor: 0x80b8e8,
  },
  [Biome.JUNGLE]: {
    name: Biome.JUNGLE, baseHeight: 72, heightVariation: 10,
    temperature: 0.95, humidity: 0.9,
    surfaceBlock: BlockType.GRASS, subsurfaceBlock: BlockType.DIRT, fillerBlock: BlockType.STONE,
    treeType: BlockType.JUNGLE_LOG, treeLeaves: BlockType.JUNGLE_LEAVES, treeFrequency: 0.08,
    grassFrequency: 0.5, flowerFrequency: 0.05,
    skyColor: 0x5aaa60, fogColor: 0x80cc80,
  },
  [Biome.SAVANNA]: {
    name: Biome.SAVANNA, baseHeight: 67, heightVariation: 4,
    temperature: 0.9, humidity: 0.1,
    surfaceBlock: BlockType.GRASS, subsurfaceBlock: BlockType.DIRT, fillerBlock: BlockType.STONE,
    treeType: BlockType.OAK_LOG, treeLeaves: BlockType.OAK_LEAVES, treeFrequency: 0.005,
    grassFrequency: 0.08, flowerFrequency: 0.01,
    skyColor: 0xe0c860, fogColor: 0xf0e090,
  },
};

export class BiomeManager {
  private tempNoise: SimplexNoise;
  private humidNoise: SimplexNoise;

  constructor(seed: number) {
    this.tempNoise = new SimplexNoise(seed * 0.1);
    this.humidNoise = new SimplexNoise(seed * 0.2 + 1000);
  }

  getBiome(worldX: number, worldZ: number): BiomeDef {
    const scale = 0.002;
    const temp = (this.tempNoise.noise2D(worldX * scale, worldZ * scale) + 1) / 2;
    const humid = (this.humidNoise.noise2D(worldX * scale, worldZ * scale) + 1) / 2;

    // Ocean check via separate noise
    const continentalScale = 0.001;
    const continental = (this.tempNoise.noise2D(worldX * continentalScale + 5000, worldZ * continentalScale) + 1) / 2;
    if (continental < 0.3) return BIOMES[Biome.OCEAN];

    // Mountain check
    if (continental > 0.85) return BIOMES[Biome.MOUNTAINS];

    // Temperature + humidity matrix
    if (temp < 0.2) {
      return BIOMES[Biome.SNOWY_TUNDRA];
    } else if (temp < 0.4) {
      return humid > 0.5 ? BIOMES[Biome.SPRUCE_FOREST] : BIOMES[Biome.PLAINS];
    } else if (temp < 0.6) {
      if (humid > 0.7) return BIOMES[Biome.BIRCH_FOREST];
      if (humid > 0.4) return BIOMES[Biome.FOREST];
      return BIOMES[Biome.PLAINS];
    } else if (temp < 0.8) {
      if (humid > 0.6) return BIOMES[Biome.FOREST];
      if (humid < 0.2) return BIOMES[Biome.SAVANNA];
      return BIOMES[Biome.PLAINS];
    } else {
      if (humid > 0.7) return BIOMES[Biome.JUNGLE];
      if (humid < 0.2) return BIOMES[Biome.DESERT];
      return BIOMES[Biome.SAVANNA];
    }
  }

  getSurfaceBlock(biome: BiomeDef, height: number): BlockType {
    if (height <= SEA_LEVEL + 2 && biome.name === Biome.OCEAN) return BlockType.SAND;
    if (biome.temperature < 0.15 && height > SEA_LEVEL + 5) return BlockType.SNOW;
    return biome.surfaceBlock;
  }
}
