import { WorldGen } from '../../src/world/WorldGen';
import { BlockType } from '../../src/world/blocks/BlockTypes';
import { CHUNK_SIZE, CHUNK_HEIGHT, SEA_LEVEL } from '../../src/utils/Constants';

describe('WorldGen', () => {
  let worldGen: WorldGen;

  beforeEach(() => {
    worldGen = new WorldGen(42);
  });

  test('generates chunk of correct size', () => {
    const data = worldGen.generateChunk(0, 0);
    expect(data.length).toBe(CHUNK_SIZE * CHUNK_HEIGHT * CHUNK_SIZE);
  });

  test('bedrock at y=0', () => {
    const data = worldGen.generateChunk(0, 0);
    // Check first column
    expect(data[0 * CHUNK_HEIGHT * CHUNK_SIZE + 0 * CHUNK_SIZE + 0]).toBe(BlockType.BEDROCK);
  });

  test('air above surface', () => {
    const data = worldGen.generateChunk(0, 0);
    // y = CHUNK_HEIGHT - 1 should be air for most columns
    let airCount = 0;
    for (let x = 0; x < CHUNK_SIZE; x++) {
      for (let z = 0; z < CHUNK_SIZE; z++) {
        const idx = x * CHUNK_HEIGHT * CHUNK_SIZE + (CHUNK_HEIGHT - 1) * CHUNK_SIZE + z;
        if (data[idx] === BlockType.AIR) airCount++;
      }
    }
    expect(airCount).toBeGreaterThan(CHUNK_SIZE * CHUNK_SIZE * 0.9);
  });

  test('no floating bedrock above y=2', () => {
    const data = worldGen.generateChunk(5, 5);
    for (let x = 0; x < CHUNK_SIZE; x++) {
      for (let z = 0; z < CHUNK_SIZE; z++) {
        for (let y = 3; y < CHUNK_HEIGHT; y++) {
          const idx = x * CHUNK_HEIGHT * CHUNK_SIZE + y * CHUNK_SIZE + z;
          expect(data[idx]).not.toBe(BlockType.BEDROCK);
        }
      }
    }
  });

  test('different seeds produce different chunks', () => {
    const gen2 = new WorldGen(999);
    const d1 = worldGen.generateChunk(0, 0);
    const d2 = gen2.generateChunk(0, 0);
    let diff = 0;
    for (let i = 0; i < d1.length; i++) { if (d1[i] !== d2[i]) diff++; }
    expect(diff).toBeGreaterThan(100);
  });

  test('same seed produces same chunk', () => {
    const gen2 = new WorldGen(42);
    const d1 = worldGen.generateChunk(3, 7);
    const d2 = gen2.generateChunk(3, 7);
    expect(d1).toEqual(d2);
  });

  test('ore blocks exist at appropriate depths', () => {
    const data = worldGen.generateChunk(0, 0);
    let hasCoal = false, hasDiamond = false;
    for (let x = 0; x < CHUNK_SIZE; x++) {
      for (let z = 0; z < CHUNK_SIZE; z++) {
        for (let y = 2; y < 20; y++) {
          const id = data[x * CHUNK_HEIGHT * CHUNK_SIZE + y * CHUNK_SIZE + z];
          if (id === BlockType.DIAMOND_ORE) hasDiamond = true;
        }
        for (let y = 20; y < 64; y++) {
          const id = data[x * CHUNK_HEIGHT * CHUNK_SIZE + y * CHUNK_SIZE + z];
          if (id === BlockType.COAL_ORE) hasCoal = true;
        }
      }
    }
    // At least one of these should exist in a 16x16 chunk
    expect(hasCoal || hasDiamond).toBe(true);
  });
});
