# DragonMind Craft — Architecture

## Tech Stack

| Layer | Technology |
|-------|-----------|
| 3D Engine | Three.js |
| Language | TypeScript |
| Build | Vite |
| Desktop Shell | Electron |
| Packaging | electron-builder |
| Testing | Jest + ts-jest |
| Lint | ESLint + Prettier |

## System Architecture

```
┌─────────────────────────────────────────┐
│              Electron Shell              │
│  (Window management, menus, packaging)  │
├─────────────────────────────────────────┤
│               Game Engine               │
│  Engine.ts — main loop, coordinates     │
│  all systems at ~60fps                  │
├──────────┬──────────┬───────────────────┤
│  World   │  Player  │    Entities        │
│ WorldGen │ Physics  │ EntityManager      │
│ Chunk    │ Stats    │ Mob AI             │
│ Biome    │ Camera   │ 8 mob types        │
│ 63 blocks│ Inventory│ Pathfinding        │
├──────────┴──────────┴───────────────────┤
│                  UI                      │
│ HUD | MainMenu | Pause | Death | Inv     │
├─────────────────────────────────────────┤
│              Save System                 │
│ localStorage (chunks + player state)     │
└─────────────────────────────────────────┘
```

## Key Design Decisions

### Voxel Rendering
- Chunk-based (16x16x256 blocks per chunk)
- Greedy face culling — only render faces exposed to air/transparent blocks
- Vertex colors for block colors (no texture atlas required to run)
- Separate mesh for transparent/water blocks (sorted rendering)
- Shadow mapping with DirectionalLight

### World Generation
- Simplex noise with fractal Brownian motion (fbm) for terrain
- Temperature + humidity noise map for biome selection
- Separate cave noise (two overlapping 3D simplex noise channels)
- Ore placement via 3D noise thresholding
- Tree generation per column with biome-specific types

### Performance
- Chunk processing: max 2 chunks per frame to prevent frame drops
- Chunks beyond render distance + 2 are unloaded
- Frustum culling via Three.js (automatic)
- Water rendered last with depthWrite:false

### Entity System
- Max 40 hostile + 30 passive mobs active
- Spawns within 16-48 blocks of player, despawns at 96
- Simple physics: gravity + ground collision (no full AABB for mobs)
- State machine: wander (passive) or chase/attack (hostile)

### Crafting
- Shaped and shapeless recipes in AllRecipes.ts
- 50+ recipes covering tools, weapons, armor, blocks, food
- Pattern matching with normalized 3x3 grid

## File Structure

```
src/
├── engine/          # Game loop, renderer, input, audio
├── world/           # Voxel world, chunks, world gen, biomes
│   └── blocks/      # Block type definitions + registry
├── player/          # Physics, stats, camera
├── entities/        # Mob base class + 8 mob implementations
│   └── mobs/
├── inventory/       # Inventory, items, crafting
│   └── recipes/     # All crafting recipes
├── ui/              # All screens (HUD, menus, death)
├── save/            # World save/load via localStorage
└── utils/           # Math, noise, constants
```

## Platform Support

| Platform | Method | Output |
|----------|--------|--------|
| macOS | electron-builder --mac | .dmg installer |
| Windows | electron-builder --win | .exe NSIS installer |
| Browser | Vite build | Static HTML/JS |
| Development | Vite dev server | Hot reload |

## ADR-001: Three.js over Babylon.js
**Decision**: Three.js
**Reason**: Larger community, better TypeScript types, more examples for voxel games, lighter weight for basic rendering needs.

## ADR-002: Procedural vertex colors over texture atlas
**Decision**: Vertex colors
**Reason**: No asset loading required, works immediately in browser, easily customizable block colors. Texture atlas can be added as enhancement without architectural change.

## ADR-003: localStorage for saves
**Decision**: localStorage
**Reason**: Works in both browser and Electron without filesystem permissions. Electron version can be upgraded to native file system via IPC. 5MB limit sufficient for explored world chunks.
