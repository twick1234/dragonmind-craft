# 🐉 DragonMind Craft

> A fully-featured Minecraft-inspired voxel game by the **Chu Collective**

[![CI](https://github.com/twick1234/dragonmind-craft/actions/workflows/ci.yml/badge.svg)](https://github.com/twick1234/dragonmind-craft/actions)

## Features

- **Infinite procedural world** with 10 biomes
- **63 block types** including ores, fluids, plants, and Dragon-exclusive blocks
- **Full crafting system** with 50+ recipes
- **8 mob types** — Zombie, Skeleton, Spider, Creeper, Cow, Pig, Sheep, Chicken
- **Survival mechanics** — health, hunger, armor, fall damage
- **Tools & weapons** in 5 tiers (Wood → Stone → Iron → Gold → Diamond)
- **Dragon Content** — Dragon Ore, Dragon Crystal, Dragon Sword, Dragon Armor
- **Day/night cycle** with dynamic lighting and sky colors
- **Save/load worlds** with multiple world slots
- **Cross-platform** — runs in browser or as native macOS/Windows app

## Quick Start

```bash
# Install dependencies
npm install

# Run in browser (hot reload)
npm run dev

# Run as Electron app
npm run dev:electron
```

Then open http://localhost:5173 (browser mode) or the Electron window.

## Build Installers

```bash
# macOS .dmg
npm run build:mac

# Windows .exe
npm run build:win

# Both platforms
npm run build:electron
```

Installers are output to the `release/` directory.

## Controls

| Key | Action |
|-----|--------|
| WASD | Move |
| Space | Jump |
| Shift | Sprint |
| Left Click (hold) | Break block |
| Right Click | Place block |
| E | Inventory |
| 1-9 | Hotbar slots |
| Scroll | Cycle hotbar |
| Esc | Pause |
| F11 | Fullscreen |

## Development

```bash
npm run test          # Run tests
npm run test:coverage # Coverage report
npm run lint          # ESLint
npm run format        # Prettier
```

## Architecture

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)

**Tech Stack:** TypeScript + Three.js + Vite + Electron

## The Chu Collective

| Bot | Role |
|-----|------|
| 🐒 ChuCoder | Core engine & implementation |
| 🔍 ChuScout | Research & competitive analysis |
| 👹 ChuOps | Health monitoring & DevOps |
| 🧠 ChuMemory | Architecture & documentation |
| 🐉 CustomerChu | Coordination & vision |

---

*Built with ❤️ by the Chu Collective — coordinated by DragonMind*
