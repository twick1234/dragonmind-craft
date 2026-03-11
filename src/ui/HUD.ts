import { PlayerStats } from '../player/PlayerStats';
import { Inventory } from '../inventory/Inventory';
import { getBlock } from '../world/blocks/BlockRegistry';
import { HOTBAR_SIZE } from '../utils/Constants';

export class HUD {
  private container: HTMLElement;
  private hotbarEl: HTMLElement;
  private healthEl: HTMLElement;
  private hungerEl: HTMLElement;
  private xpEl: HTMLElement;
  private crosshairEl: HTMLElement;
  private posEl: HTMLElement;
  private tooltipEl: HTMLElement;

  constructor(container: HTMLElement) {
    this.container = container;
    this.container.innerHTML = this.getHTML();
    this.hotbarEl = container.querySelector('#hotbar')!;
    this.healthEl = container.querySelector('#health-bar')!;
    this.hungerEl = container.querySelector('#hunger-bar')!;
    this.xpEl = container.querySelector('#xp-bar')!;
    this.crosshairEl = container.querySelector('#crosshair')!;
    this.posEl = container.querySelector('#position')!;
    this.tooltipEl = container.querySelector('#tooltip')!;
  }

  private getHTML(): string {
    return `
      <style>
        #hud { position:fixed; top:0; left:0; width:100%; height:100%; pointer-events:none; font-family:'Courier New',monospace; }
        #crosshair { position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); color:white; font-size:24px; text-shadow:0 0 2px black; }
        #hotbar { position:absolute; bottom:20px; left:50%; transform:translateX(-50%); display:flex; gap:4px; }
        .hotbar-slot { width:44px; height:44px; border:2px solid #555; background:rgba(0,0,0,0.5); display:flex; align-items:center; justify-content:center; position:relative; }
        .hotbar-slot.active { border-color:#fff; }
        .slot-count { position:absolute; bottom:1px; right:2px; font-size:10px; color:white; text-shadow:1px 1px 0 black; }
        .slot-icon { width:32px; height:32px; border-radius:2px; }
        #status-bars { position:absolute; bottom:70px; left:50%; transform:translateX(-50%); display:flex; flex-direction:column; gap:2px; align-items:center; }
        #health-bar, #hunger-bar { display:flex; gap:2px; }
        .heart { color:#ff3333; font-size:14px; }
        .heart.empty { color:#333; }
        .drum { color:#cc8833; font-size:14px; }
        .drum.empty { color:#333; }
        #xp-bar { width:182px; height:5px; background:#333; margin-top:2px; }
        #xp-fill { height:100%; background:#80ff00; transition:width 0.2s; }
        #position { position:absolute; top:5px; left:5px; color:white; font-size:11px; text-shadow:1px 1px 0 black; background:rgba(0,0,0,0.3); padding:4px 6px; border-radius:3px; }
        #tooltip { position:absolute; bottom:68px; left:50%; transform:translateX(-50%); color:white; font-size:12px; text-shadow:1px 1px 0 black; white-space:nowrap; }
      </style>
      <div id="hud">
        <div id="crosshair">+</div>
        <div id="hotbar"></div>
        <div id="status-bars">
          <div id="health-bar"></div>
          <div id="hunger-bar"></div>
          <div id="xp-bar"><div id="xp-fill"></div></div>
        </div>
        <div id="position">X: 0 Y: 0 Z: 0</div>
        <div id="tooltip"></div>
      </div>
    `;
  }

  update(stats: PlayerStats, inventory: Inventory, x: number, y: number, z: number): void {
    // Health
    let healthHTML = '';
    for (let i = 0; i < 10; i++) {
      const filled = (i * 2) < stats.health;
      const half = !filled && (i * 2 + 1) <= stats.health;
      healthHTML += `<span class="heart ${filled ? '' : half ? '' : 'empty'}">${filled ? '♥' : half ? '♡' : '♡'}</span>`;
    }
    this.healthEl.innerHTML = healthHTML;

    // Hunger
    let hungerHTML = '';
    for (let i = 0; i < 10; i++) {
      const filled = (i * 2) < stats.hunger;
      hungerHTML += `<span class="drum ${filled ? '' : 'empty'}">🍗</span>`;
    }
    this.hungerEl.innerHTML = hungerHTML;

    // XP
    const xpFill = this.container.querySelector('#xp-fill') as HTMLElement;
    if (xpFill) xpFill.style.width = `${(stats.xp / stats.xpToNext) * 100}%`;

    // Hotbar
    let hotbarHTML = '';
    for (let i = 0; i < HOTBAR_SIZE; i++) {
      const slot = inventory.getSlot(i);
      const active = i === inventory.hotbarIndex ? 'active' : '';
      let icon = '';
      let count = '';
      if (slot) {
        const color = slot.id < 1000 ? '#' + getBlock(slot.id).color.toString(16).padStart(6,'0') : '#aaa';
        icon = `<div class="slot-icon" style="background:${color}"></div>`;
        if (slot.count > 1) count = `<span class="slot-count">${slot.count}</span>`;
      }
      hotbarHTML += `<div class="hotbar-slot ${active}">${icon}${count}</div>`;
    }
    this.hotbarEl.innerHTML = hotbarHTML;

    // Position
    this.posEl.textContent = `X:${Math.floor(x)} Y:${Math.floor(y)} Z:${Math.floor(z)}`;

    // Tooltip
    const heldItem = inventory.getHotbarItem();
    if (heldItem) {
      const name = heldItem.id < 1000 ? getBlock(heldItem.id).name : `Item ${heldItem.id}`;
      this.tooltipEl.textContent = name;
    } else {
      this.tooltipEl.textContent = '';
    }
  }

  show(): void { this.container.style.display = 'block'; }
  hide(): void { this.container.style.display = 'none'; }
}
