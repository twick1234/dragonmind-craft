import * as THREE from 'three';
import { Renderer } from './Renderer';
import { InputManager } from './InputManager';
import { AudioManager } from './AudioManager';
import { ChunkManager } from '../world/ChunkManager';
import { WorldGen } from '../world/WorldGen';
import { PlayerPhysics } from '../player/PlayerPhysics';
import { PlayerStats } from '../player/PlayerStats';
import { Camera } from '../player/Camera';
import { Inventory } from '../inventory/Inventory';
import { EntityManager } from '../entities/EntityManager';
import { HUD } from '../ui/HUD';
import { PauseMenu } from '../ui/PauseMenu';
import { DeathScreen } from '../ui/DeathScreen';
import { SaveManager } from '../save/SaveManager';
import { WorldSlot } from '../ui/MainMenu';
import { raycastVoxel } from '../utils/Math3D';
import { isSolid, getBlock as getBlockDef } from '../world/blocks/BlockRegistry';
import { BlockType, ToolType } from '../world/blocks/BlockTypes';
import { PLAYER_HEIGHT, PLAYER_SPEED, SPRINT_MULTIPLIER, REACH_DISTANCE, DAY_LENGTH } from '../utils/Constants';
import { ItemId } from '../inventory/ItemRegistry';

export class Engine {
  private renderer: Renderer;
  private input: InputManager;
  private audio: AudioManager;
  private camera: Camera;
  private physics: PlayerPhysics;
  private stats: PlayerStats;
  private inventory: Inventory;
  private chunkManager: ChunkManager;
  private entityManager: EntityManager;
  private worldGen: WorldGen;
  private hud: HUD;
  private pauseMenu: PauseMenu;
  private deathScreen: DeathScreen;
  private saveManager: SaveManager;
  private uiLayer: HTMLElement;

  private animId = 0;
  private lastTime = 0;
  private timeOfDay = 0.3; // 0-1 (0.25=dawn, 0.5=noon)
  private paused = false;
  private gameStarted = false;
  private worldSlot: WorldSlot | null = null;
  private breakProgress = 0;
  private breakTarget: THREE.Vector3 | null = null;
  private breakBlock = 0;
  private highlightMesh: THREE.LineSegments | null = null;
  private footstepTimer = 0;
  private autoSaveTimer = 0;

  constructor(canvas: HTMLCanvasElement, uiLayer: HTMLElement) {
    this.uiLayer = uiLayer;
    this.renderer = new Renderer(canvas);
    this.input = new InputManager(canvas);
    this.audio = new AudioManager();
    this.camera = new Camera();
    this.physics = new PlayerPhysics(0, 80, 0);
    this.stats = new PlayerStats();
    this.inventory = new Inventory();
    this.worldGen = new WorldGen(12345);
    this.chunkManager = new ChunkManager(this.renderer.scene, this.worldGen);
    this.entityManager = new EntityManager(this.renderer.scene);
    this.saveManager = new SaveManager();

    // Create HUD container
    const hudContainer = document.createElement('div');
    this.uiLayer.appendChild(hudContainer);
    this.hud = new HUD(hudContainer);

    const pauseContainer = document.createElement('div');
    this.uiLayer.appendChild(pauseContainer);
    this.pauseMenu = new PauseMenu(pauseContainer);

    const deathContainer = document.createElement('div');
    this.uiLayer.appendChild(deathContainer);
    this.deathScreen = new DeathScreen(deathContainer);

    this.createHighlight();
    this.bindInput();
    this.audio.init();
    this.hud.hide();
  }

  private createHighlight(): void {
    const geo = new THREE.EdgesGeometry(new THREE.BoxGeometry(1.001, 1.001, 1.001));
    const mat = new THREE.LineBasicMaterial({ color: 0x000000, linewidth: 2 });
    this.highlightMesh = new THREE.LineSegments(geo, mat);
    this.highlightMesh.visible = false;
    this.renderer.scene.add(this.highlightMesh);
  }

  private bindInput(): void {
    this.input.onMouseMove = (dx, dy) => {
      if (!this.paused && this.gameStarted) this.camera.onMouseMove(dx, dy);
    };

    this.input.onAttack = () => {
      if (this.paused || !this.gameStarted) return;
      this.startBreaking();
    };

    this.input.onPlace = () => {
      if (this.paused || !this.gameStarted) return;
      this.placeBlock();
    };

    this.input.onScroll = (delta) => {
      this.inventory.scrollHotbar(delta);
    };

    this.input.onHotbar = (index) => {
      this.inventory.selectHotbar(index);
    };

    this.input.onInventory = () => {
      // TODO: open inventory screen
    };

    this.input.onPause = () => {
      if (!this.gameStarted) return;
      if (this.paused) this.resume();
      else this.pause();
    };

    this.input.onFullscreen = () => {
      if (!document.fullscreenElement) document.documentElement.requestFullscreen();
      else document.exitFullscreen();
    };
  }

  startGame(seed: number, slot: WorldSlot, loadData?: Record<string, unknown>): void {
    this.worldSlot = slot;
    this.worldGen = new WorldGen(seed);
    this.chunkManager = new ChunkManager(this.renderer.scene, this.worldGen);
    this.entityManager = new EntityManager(this.renderer.scene);

    if (loadData) {
      // TODO: restore from save
    }

    // Give starter items
    this.inventory.addItem(BlockType.OAK_LOG, 10);
    this.inventory.addItem(ItemId.WOOD_PICKAXE, 1);
    this.inventory.addItem(ItemId.COOKED_BEEF, 5);
    this.inventory.addItem(BlockType.TORCH, 20);

    this.physics = new PlayerPhysics(0, 90, 0);
    this.stats = new PlayerStats();
    this.gameStarted = true;
    this.paused = false;
    this.hud.show();
    this.input.requestPointerLock();
    this.start();
  }

  private startBreaking(): void {
    const hit = this.raycast();
    if (!hit) return;
    const { x, y, z } = hit.pos;
    const blockId = this.chunkManager.getBlockWorld(x, y, z);
    if (blockId === 0 || blockId === BlockType.BEDROCK) return;

    const def = getBlockDef(blockId);
    if (def.hardness === 0) {
      // Instant break
      this.chunkManager.setBlockWorld(x, y, z, BlockType.AIR);
      this.inventory.addItem(def.drops[0] ?? blockId, 1);
      this.audio.playBlockBreak(blockId);
      this.stats.addXP(1);
    }
    // Progressive breaking handled in update loop
    this.breakTarget = hit.pos.clone();
    this.breakBlock = blockId;
    this.breakProgress = 0;
  }

  private placeBlock(): void {
    const hit = this.raycast();
    if (!hit) return;
    const placePos = hit.pos.clone().add(hit.normal);
    const { x, y, z } = placePos;

    // Don't place inside player
    const pp = this.physics.position;
    if (Math.abs(x - pp.x) < 0.5 && y >= pp.y && y < pp.y + PLAYER_HEIGHT && Math.abs(z - pp.z) < 0.5) return;

    const heldItem = this.inventory.getHotbarItem();
    if (!heldItem || heldItem.id >= 1000) return; // Items >= 1000 are not placeable blocks

    const blockId = heldItem.id;
    if (!isSolid(blockId)) return;

    this.chunkManager.setBlockWorld(x, y, z, blockId);
    this.inventory.removeItem(blockId, 1);
    this.audio.playBlockPlace();
  }

  private raycast(): { pos: THREE.Vector3; normal: THREE.Vector3 } | null {
    const origin = this.camera.camera.position.clone();
    const dir = this.camera.getDirection();
    return raycastVoxel(origin, dir, REACH_DISTANCE, (x, y, z) => this.chunkManager.getBlockWorld(x, y, z));
  }

  private pause(): void {
    this.paused = true;
    this.input.exitPointerLock();
    this.pauseMenu.show();
    this.pauseMenu.onResume = () => this.resume();
    this.pauseMenu.onSave = () => { this.saveWorld(); this.resume(); };
    this.pauseMenu.onQuit = () => window.location.reload();
    this.audio.suspend();
  }

  private resume(): void {
    this.paused = false;
    this.pauseMenu.hide();
    this.input.requestPointerLock();
    this.audio.resume();
  }

  private saveWorld(): void {
    if (!this.worldSlot) return;
    const chunks = new Map<string, Uint8Array>(); // simplified
    this.saveManager.save(this.worldSlot, this.physics.position, this.stats, this.inventory, this.timeOfDay, chunks);
  }

  start(): void {
    this.lastTime = performance.now();
    this.loop();
  }

  private loop(): void {
    this.animId = requestAnimationFrame(() => this.loop());
    const now = performance.now();
    const dt = Math.min((now - this.lastTime) / 1000, 0.05);
    this.lastTime = now;

    if (!this.paused && this.gameStarted) {
      this.update(dt);
    }

    this.renderer.render(this.camera.camera);
  }

  private update(dt: number): void {
    const keys = this.input.keys;

    // Player movement
    const forward = this.camera.getForwardXZ();
    const right = this.camera.getRightXZ();
    const moveDir = new THREE.Vector3();
    if (keys.forward) moveDir.add(forward);
    if (keys.back) moveDir.sub(forward);
    if (keys.right) moveDir.add(right);
    if (keys.left) moveDir.sub(right);

    const isMoving = moveDir.lengthSq() > 0;
    const speed = keys.sprint ? PLAYER_SPEED * SPRINT_MULTIPLIER : PLAYER_SPEED;

    // Sprint FOV
    const targetFOV = keys.sprint && isMoving ? 85 : 75;
    this.camera.camera.fov += (targetFOV - this.camera.camera.fov) * dt * 8;
    this.camera.camera.updateProjectionMatrix();

    this.physics.update(dt, moveDir, speed, keys.jump, (x, y, z) => this.chunkManager.getBlockWorld(x, y, z));

    // Camera follows player
    const head = this.physics.position.clone().add(new THREE.Vector3(0, PLAYER_HEIGHT * 0.85, 0));
    this.camera.setPosition(head.x, head.y, head.z);

    // Stats update
    this.stats.update(dt, isMoving);

    // Fall damage
    if (this.physics.onGround && !this.physics.wasOnGround) {
      const dmg = this.physics.getFallDamage();
      if (dmg > 0) { this.stats.takeDamage(dmg); this.audio.playHurt(); }
      this.audio.playLand();
    }
    (this.physics as any).wasOnGround = this.physics.onGround;

    // Footsteps
    if (isMoving && this.physics.onGround) {
      this.footstepTimer += dt;
      if (this.footstepTimer > (keys.sprint ? 0.3 : 0.45)) {
        this.footstepTimer = 0;
        const footBlock = this.chunkManager.getBlockWorld(
          Math.floor(this.physics.position.x),
          Math.floor(this.physics.position.y - 0.1),
          Math.floor(this.physics.position.z)
        );
        this.audio.playFootstep(footBlock);
      }
    }

    // Block breaking (hold attack)
    if (keys.attack && this.breakTarget) {
      const hit = this.raycast();
      if (hit && hit.pos.equals(this.breakTarget)) {
        const def = getBlockDef(this.breakBlock);
        const breakTime = def.hardness;
        this.breakProgress += dt / Math.max(0.05, breakTime);
        if (this.breakProgress >= 1) {
          const { x, y, z } = this.breakTarget;
          this.chunkManager.setBlockWorld(x, y, z, BlockType.AIR);
          def.drops.forEach(d => this.inventory.addItem(d, 1));
          if (def.drops.length === 0 && def.solid) this.inventory.addItem(this.breakBlock, 1);
          this.audio.playBlockBreak(this.breakBlock);
          this.stats.addXP(1);
          this.breakTarget = null;
          this.breakProgress = 0;
        }
      } else {
        this.breakTarget = null;
        this.breakProgress = 0;
      }
    } else if (!keys.attack) {
      this.breakTarget = null;
      this.breakProgress = 0;
    }

    // Block highlight
    const hit = this.raycast();
    if (hit && this.highlightMesh) {
      this.highlightMesh.visible = true;
      this.highlightMesh.position.set(hit.pos.x + 0.5, hit.pos.y + 0.5, hit.pos.z + 0.5);
    } else if (this.highlightMesh) {
      this.highlightMesh.visible = false;
    }

    // Chunk loading
    this.chunkManager.update(this.physics.position.x, this.physics.position.z);

    // Entity update
    const isDaytime = this.timeOfDay > 0.25 && this.timeOfDay < 0.75;
    const result = this.entityManager.update(dt, this.physics.position, this.stats, (x,y,z) => this.chunkManager.getBlockWorld(x,y,z), isDaytime);
    if (result.damage > 0) {
      this.stats.takeDamage(result.damage);
      this.audio.playHurt();
    }
    result.drops.forEach(d => this.inventory.addItem(d.id, d.count));

    // Day/night
    this.timeOfDay = (this.timeOfDay + dt / DAY_LENGTH) % 1;
    this.renderer.updateDayNight(this.timeOfDay);

    // Death
    if (this.stats.dead && !this.paused) {
      this.input.exitPointerLock();
      this.deathScreen.show();
      this.deathScreen.onRespawn = () => {
        this.stats.respawn();
        this.physics.position.set(0, 90, 0);
        this.physics.velocity.set(0, 0, 0);
        this.deathScreen.hide();
        this.input.requestPointerLock();
      };
      this.deathScreen.onQuit = () => window.location.reload();
    }

    // Auto-save every 5 min
    this.autoSaveTimer += dt;
    if (this.autoSaveTimer > 300) {
      this.autoSaveTimer = 0;
      this.saveWorld();
    }

    // HUD
    this.hud.update(this.stats, this.inventory, this.physics.position.x, this.physics.position.y, this.physics.position.z);

    // Ambient audio
    this.audio.playAmbient();
  }

  dispose(): void {
    cancelAnimationFrame(this.animId);
    this.chunkManager.dispose();
    this.entityManager.dispose();
    this.renderer.dispose();
    this.input.destroy();
  }
}
