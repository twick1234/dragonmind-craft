import { BlockType, BlockDef, ToolType } from './BlockTypes';

const B = BlockType;

export const BLOCKS: Record<number, BlockDef> = {
  [B.AIR]:            { id:B.AIR, name:'Air', solid:false, transparent:true, fluid:false, luminance:0, hardness:0, toolRequired:null, drops:[], color:0x000000, flammable:false, stackSize:0 },
  [B.GRASS]:          { id:B.GRASS, name:'Grass', solid:true, transparent:false, fluid:false, luminance:0, hardness:0.6, toolRequired:null, drops:[B.DIRT], color:0x5a8a3c, topColor:0x5a8a3c, sideColor:0x866743, bottomColor:0x866743, flammable:false, stackSize:64 },
  [B.DIRT]:           { id:B.DIRT, name:'Dirt', solid:true, transparent:false, fluid:false, luminance:0, hardness:0.5, toolRequired:null, drops:[B.DIRT], color:0x866743, flammable:false, stackSize:64 },
  [B.STONE]:          { id:B.STONE, name:'Stone', solid:true, transparent:false, fluid:false, luminance:0, hardness:1.5, toolRequired:ToolType.PICKAXE, drops:[B.COBBLESTONE], color:0x808080, flammable:false, stackSize:64 },
  [B.SAND]:           { id:B.SAND, name:'Sand', solid:true, transparent:false, fluid:false, luminance:0, hardness:0.5, toolRequired:null, drops:[B.SAND], color:0xd4c272, flammable:false, stackSize:64 },
  [B.GRAVEL]:         { id:B.GRAVEL, name:'Gravel', solid:true, transparent:false, fluid:false, luminance:0, hardness:0.6, toolRequired:null, drops:[B.GRAVEL], color:0x9a9a9a, flammable:false, stackSize:64 },
  [B.BEDROCK]:        { id:B.BEDROCK, name:'Bedrock', solid:true, transparent:false, fluid:false, luminance:0, hardness:Infinity, toolRequired:null, drops:[], color:0x404040, flammable:false, stackSize:64 },
  [B.WATER]:          { id:B.WATER, name:'Water', solid:false, transparent:true, fluid:true, luminance:0, hardness:100, toolRequired:null, drops:[], color:0x1a6bbb, flammable:false, stackSize:1 },
  [B.LAVA]:           { id:B.LAVA, name:'Lava', solid:false, transparent:false, fluid:true, luminance:15, hardness:100, toolRequired:null, drops:[], color:0xff4500, flammable:false, stackSize:1 },
  [B.ICE]:            { id:B.ICE, name:'Ice', solid:true, transparent:true, fluid:false, luminance:0, hardness:0.5, toolRequired:ToolType.PICKAXE, drops:[], color:0xaaddff, flammable:false, stackSize:64 },
  [B.SNOW]:           { id:B.SNOW, name:'Snow', solid:true, transparent:false, fluid:false, luminance:0, hardness:0.2, toolRequired:ToolType.SHOVEL, drops:[B.SNOW], color:0xffffff, flammable:false, stackSize:64 },
  [B.CLAY]:           { id:B.CLAY, name:'Clay', solid:true, transparent:false, fluid:false, luminance:0, hardness:0.6, toolRequired:null, drops:[B.CLAY], color:0xa8a8c0, flammable:false, stackSize:64 },
  [B.OAK_LOG]:        { id:B.OAK_LOG, name:'Oak Log', solid:true, transparent:false, fluid:false, luminance:0, hardness:2.0, toolRequired:ToolType.AXE, drops:[B.OAK_LOG], color:0x7a5c2e, topColor:0x9c7a40, flammable:true, stackSize:64 },
  [B.BIRCH_LOG]:      { id:B.BIRCH_LOG, name:'Birch Log', solid:true, transparent:false, fluid:false, luminance:0, hardness:2.0, toolRequired:ToolType.AXE, drops:[B.BIRCH_LOG], color:0xd0d0d0, topColor:0xc8b460, flammable:true, stackSize:64 },
  [B.SPRUCE_LOG]:     { id:B.SPRUCE_LOG, name:'Spruce Log', solid:true, transparent:false, fluid:false, luminance:0, hardness:2.0, toolRequired:ToolType.AXE, drops:[B.SPRUCE_LOG], color:0x4a3520, topColor:0x7a5c2e, flammable:true, stackSize:64 },
  [B.JUNGLE_LOG]:     { id:B.JUNGLE_LOG, name:'Jungle Log', solid:true, transparent:false, fluid:false, luminance:0, hardness:2.0, toolRequired:ToolType.AXE, drops:[B.JUNGLE_LOG], color:0x6b5030, topColor:0x8a7040, flammable:true, stackSize:64 },
  [B.OAK_LEAVES]:     { id:B.OAK_LEAVES, name:'Oak Leaves', solid:true, transparent:true, fluid:false, luminance:0, hardness:0.2, toolRequired:null, drops:[], color:0x2d6e1f, flammable:true, stackSize:64 },
  [B.BIRCH_LEAVES]:   { id:B.BIRCH_LEAVES, name:'Birch Leaves', solid:true, transparent:true, fluid:false, luminance:0, hardness:0.2, toolRequired:null, drops:[], color:0x50a030, flammable:true, stackSize:64 },
  [B.SPRUCE_LEAVES]:  { id:B.SPRUCE_LEAVES, name:'Spruce Leaves', solid:true, transparent:true, fluid:false, luminance:0, hardness:0.2, toolRequired:null, drops:[], color:0x1a4a10, flammable:true, stackSize:64 },
  [B.JUNGLE_LEAVES]:  { id:B.JUNGLE_LEAVES, name:'Jungle Leaves', solid:true, transparent:true, fluid:false, luminance:0, hardness:0.2, toolRequired:null, drops:[], color:0x1e7a10, flammable:true, stackSize:64 },
  [B.COAL_ORE]:       { id:B.COAL_ORE, name:'Coal Ore', solid:true, transparent:false, fluid:false, luminance:0, hardness:3.0, toolRequired:ToolType.PICKAXE, drops:[B.COAL_ORE], color:0x505050, flammable:false, stackSize:64 },
  [B.IRON_ORE]:       { id:B.IRON_ORE, name:'Iron Ore', solid:true, transparent:false, fluid:false, luminance:0, hardness:3.0, toolRequired:ToolType.PICKAXE, drops:[B.IRON_ORE], color:0x8f6e5a, flammable:false, stackSize:64 },
  [B.GOLD_ORE]:       { id:B.GOLD_ORE, name:'Gold Ore', solid:true, transparent:false, fluid:false, luminance:0, hardness:3.0, toolRequired:ToolType.PICKAXE, drops:[B.GOLD_ORE], color:0x9f8420, flammable:false, stackSize:64 },
  [B.DIAMOND_ORE]:    { id:B.DIAMOND_ORE, name:'Diamond Ore', solid:true, transparent:false, fluid:false, luminance:0, hardness:3.0, toolRequired:ToolType.PICKAXE, drops:[B.DIAMOND_ORE], color:0x4a9fa0, flammable:false, stackSize:64 },
  [B.EMERALD_ORE]:    { id:B.EMERALD_ORE, name:'Emerald Ore', solid:true, transparent:false, fluid:false, luminance:0, hardness:3.0, toolRequired:ToolType.PICKAXE, drops:[B.EMERALD_ORE], color:0x2a8a30, flammable:false, stackSize:64 },
  [B.REDSTONE_ORE]:   { id:B.REDSTONE_ORE, name:'Redstone Ore', solid:true, transparent:false, fluid:false, luminance:0, hardness:3.0, toolRequired:ToolType.PICKAXE, drops:[B.REDSTONE_ORE], color:0x8a0000, flammable:false, stackSize:64 },
  [B.LAPIS_ORE]:      { id:B.LAPIS_ORE, name:'Lapis Ore', solid:true, transparent:false, fluid:false, luminance:0, hardness:3.0, toolRequired:ToolType.PICKAXE, drops:[B.LAPIS_ORE], color:0x1a3a8a, flammable:false, stackSize:64 },
  [B.COBBLESTONE]:    { id:B.COBBLESTONE, name:'Cobblestone', solid:true, transparent:false, fluid:false, luminance:0, hardness:2.0, toolRequired:ToolType.PICKAXE, drops:[B.COBBLESTONE], color:0x6a6a6a, flammable:false, stackSize:64 },
  [B.OAK_PLANKS]:     { id:B.OAK_PLANKS, name:'Oak Planks', solid:true, transparent:false, fluid:false, luminance:0, hardness:2.0, toolRequired:ToolType.AXE, drops:[B.OAK_PLANKS], color:0xba9757, flammable:true, stackSize:64 },
  [B.BIRCH_PLANKS]:   { id:B.BIRCH_PLANKS, name:'Birch Planks', solid:true, transparent:false, fluid:false, luminance:0, hardness:2.0, toolRequired:ToolType.AXE, drops:[B.BIRCH_PLANKS], color:0xd4c27a, flammable:true, stackSize:64 },
  [B.SPRUCE_PLANKS]:  { id:B.SPRUCE_PLANKS, name:'Spruce Planks', solid:true, transparent:false, fluid:false, luminance:0, hardness:2.0, toolRequired:ToolType.AXE, drops:[B.SPRUCE_PLANKS], color:0x7a5a30, flammable:true, stackSize:64 },
  [B.BRICKS]:         { id:B.BRICKS, name:'Bricks', solid:true, transparent:false, fluid:false, luminance:0, hardness:2.0, toolRequired:ToolType.PICKAXE, drops:[B.BRICKS], color:0xa0503a, flammable:false, stackSize:64 },
  [B.STONE_BRICKS]:   { id:B.STONE_BRICKS, name:'Stone Bricks', solid:true, transparent:false, fluid:false, luminance:0, hardness:1.5, toolRequired:ToolType.PICKAXE, drops:[B.STONE_BRICKS], color:0x8a8a8a, flammable:false, stackSize:64 },
  [B.GLASS]:          { id:B.GLASS, name:'Glass', solid:true, transparent:true, fluid:false, luminance:0, hardness:0.3, toolRequired:null, drops:[], color:0xaaddff, flammable:false, stackSize:64 },
  [B.IRON_BLOCK]:     { id:B.IRON_BLOCK, name:'Iron Block', solid:true, transparent:false, fluid:false, luminance:0, hardness:5.0, toolRequired:ToolType.PICKAXE, drops:[B.IRON_BLOCK], color:0xd0d0d8, flammable:false, stackSize:64 },
  [B.GOLD_BLOCK]:     { id:B.GOLD_BLOCK, name:'Gold Block', solid:true, transparent:false, fluid:false, luminance:0, hardness:3.0, toolRequired:ToolType.PICKAXE, drops:[B.GOLD_BLOCK], color:0xffd700, flammable:false, stackSize:64 },
  [B.DIAMOND_BLOCK]:  { id:B.DIAMOND_BLOCK, name:'Diamond Block', solid:true, transparent:false, fluid:false, luminance:0, hardness:5.0, toolRequired:ToolType.PICKAXE, drops:[B.DIAMOND_BLOCK], color:0x4ae0e8, flammable:false, stackSize:64 },
  [B.EMERALD_BLOCK]:  { id:B.EMERALD_BLOCK, name:'Emerald Block', solid:true, transparent:false, fluid:false, luminance:0, hardness:5.0, toolRequired:ToolType.PICKAXE, drops:[B.EMERALD_BLOCK], color:0x00a040, flammable:false, stackSize:64 },
  [B.GLOWSTONE]:      { id:B.GLOWSTONE, name:'Glowstone', solid:true, transparent:false, fluid:false, luminance:15, hardness:0.3, toolRequired:null, drops:[B.GLOWSTONE], color:0xffec80, flammable:false, stackSize:64 },
  [B.OBSIDIAN]:       { id:B.OBSIDIAN, name:'Obsidian', solid:true, transparent:false, fluid:false, luminance:0, hardness:50.0, toolRequired:ToolType.PICKAXE, drops:[B.OBSIDIAN], color:0x150520, flammable:false, stackSize:64 },
  [B.TNT]:            { id:B.TNT, name:'TNT', solid:true, transparent:false, fluid:false, luminance:0, hardness:0.0, toolRequired:null, drops:[B.TNT], color:0xcc2222, flammable:true, stackSize:64 },
  [B.TALL_GRASS]:     { id:B.TALL_GRASS, name:'Tall Grass', solid:false, transparent:true, fluid:false, luminance:0, hardness:0.0, toolRequired:null, drops:[], color:0x4a8a20, flammable:true, stackSize:64 },
  [B.FERN]:           { id:B.FERN, name:'Fern', solid:false, transparent:true, fluid:false, luminance:0, hardness:0.0, toolRequired:null, drops:[], color:0x2a7010, flammable:true, stackSize:64 },
  [B.FLOWER_RED]:     { id:B.FLOWER_RED, name:'Red Flower', solid:false, transparent:true, fluid:false, luminance:0, hardness:0.0, toolRequired:null, drops:[B.FLOWER_RED], color:0xff2020, flammable:false, stackSize:64 },
  [B.FLOWER_YELLOW]:  { id:B.FLOWER_YELLOW, name:'Yellow Flower', solid:false, transparent:true, fluid:false, luminance:0, hardness:0.0, toolRequired:null, drops:[B.FLOWER_YELLOW], color:0xffff20, flammable:false, stackSize:64 },
  [B.CACTUS]:         { id:B.CACTUS, name:'Cactus', solid:true, transparent:false, fluid:false, luminance:0, hardness:0.4, toolRequired:null, drops:[B.CACTUS], color:0x2a7020, flammable:false, stackSize:64 },
  [B.CRAFTING_TABLE]: { id:B.CRAFTING_TABLE, name:'Crafting Table', solid:true, transparent:false, fluid:false, luminance:0, hardness:2.5, toolRequired:ToolType.AXE, drops:[B.CRAFTING_TABLE], color:0x8b5e2a, flammable:true, stackSize:64 },
  [B.FURNACE]:        { id:B.FURNACE, name:'Furnace', solid:true, transparent:false, fluid:false, luminance:0, hardness:3.5, toolRequired:ToolType.PICKAXE, drops:[B.FURNACE], color:0x707070, flammable:false, stackSize:64 },
  [B.CHEST]:          { id:B.CHEST, name:'Chest', solid:true, transparent:false, fluid:false, luminance:0, hardness:2.5, toolRequired:ToolType.AXE, drops:[B.CHEST], color:0xa07040, flammable:true, stackSize:64 },
  [B.TORCH]:          { id:B.TORCH, name:'Torch', solid:false, transparent:true, fluid:false, luminance:14, hardness:0.0, toolRequired:null, drops:[B.TORCH], color:0xffcc44, flammable:false, stackSize:64 },
  [B.DRAGON_STONE]:   { id:B.DRAGON_STONE, name:'Dragon Stone', solid:true, transparent:false, fluid:false, luminance:0, hardness:4.0, toolRequired:ToolType.PICKAXE, drops:[B.DRAGON_STONE], color:0x3a0a4a, flammable:false, stackSize:64 },
  [B.DRAGON_ORE]:     { id:B.DRAGON_ORE, name:'Dragon Ore', solid:true, transparent:false, fluid:false, luminance:3, hardness:5.0, toolRequired:ToolType.PICKAXE, drops:[B.DRAGON_ORE], color:0x6a0a7a, flammable:false, stackSize:64 },
  [B.DRAGON_CRYSTAL]: { id:B.DRAGON_CRYSTAL, name:'Dragon Crystal', solid:true, transparent:true, fluid:false, luminance:8, hardness:3.0, toolRequired:ToolType.PICKAXE, drops:[B.DRAGON_CRYSTAL], color:0xaa40cc, flammable:false, stackSize:64 },
  [B.DRAGON_SCALE_BLOCK]:{ id:B.DRAGON_SCALE_BLOCK, name:'Dragon Scale Block', solid:true, transparent:false, fluid:false, luminance:5, hardness:8.0, toolRequired:ToolType.PICKAXE, drops:[B.DRAGON_SCALE_BLOCK], color:0x7a0a8a, flammable:false, stackSize:64 },
  [B.NETHER_RACK]:    { id:B.NETHER_RACK, name:'Netherrack', solid:true, transparent:false, fluid:false, luminance:0, hardness:0.4, toolRequired:ToolType.PICKAXE, drops:[B.NETHER_RACK], color:0x7a2020, flammable:true, stackSize:64 },
  [B.SOUL_SAND]:      { id:B.SOUL_SAND, name:'Soul Sand', solid:true, transparent:false, fluid:false, luminance:0, hardness:0.5, toolRequired:ToolType.SHOVEL, drops:[B.SOUL_SAND], color:0x3a2a1a, flammable:false, stackSize:64 },
  [B.MAGMA_BLOCK]:    { id:B.MAGMA_BLOCK, name:'Magma Block', solid:true, transparent:false, fluid:false, luminance:3, hardness:0.5, toolRequired:ToolType.PICKAXE, drops:[B.MAGMA_BLOCK], color:0xbb3300, flammable:false, stackSize:64 },
};

export function getBlock(id: number): BlockDef {
  return BLOCKS[id] ?? BLOCKS[BlockType.AIR];
}

export function isSolid(id: number): boolean {
  return BLOCKS[id]?.solid ?? false;
}

export function isTransparent(id: number): boolean {
  return BLOCKS[id]?.transparent ?? true;
}

export function isFluid(id: number): boolean {
  return BLOCKS[id]?.fluid ?? false;
}

export function getLuminance(id: number): number {
  return BLOCKS[id]?.luminance ?? 0;
}
