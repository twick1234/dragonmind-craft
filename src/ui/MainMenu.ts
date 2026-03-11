export interface WorldSlot {
  name: string;
  seed: number;
  created: number;
  lastPlayed: number;
  playtime: number;
}

export class MainMenu {
  private container: HTMLElement;
  onNewWorld?: (name: string, seed: number) => void;
  onLoadWorld?: (slot: WorldSlot) => void;
  onSettings?: () => void;
  onQuit?: () => void;

  constructor(container: HTMLElement) {
    this.container = container;
  }

  show(worlds: WorldSlot[]): void {
    this.container.innerHTML = `
      <style>
        #main-menu {
          position:fixed; top:0; left:0; width:100%; height:100%;
          background:linear-gradient(135deg, #1a0a2e 0%, #0d1f4a 50%, #1a0a2e 100%);
          display:flex; flex-direction:column; align-items:center; justify-content:center;
          font-family:'Courier New',monospace; color:white;
          z-index:100;
        }
        .menu-title {
          font-size:56px; font-weight:bold; margin-bottom:8px;
          background:linear-gradient(135deg, #aa40cc, #4ae0e8, #ffd700);
          -webkit-background-clip:text; -webkit-text-fill-color:transparent;
          text-shadow:none; letter-spacing:4px;
        }
        .menu-subtitle { font-size:14px; color:#888; margin-bottom:48px; letter-spacing:2px; }
        .menu-btn {
          width:280px; padding:14px 24px; margin:6px; border:2px solid #444;
          background:rgba(255,255,255,0.05); color:white; font-family:inherit;
          font-size:16px; cursor:pointer; border-radius:4px; transition:all 0.15s;
          pointer-events:all;
        }
        .menu-btn:hover { background:rgba(170,64,204,0.3); border-color:#aa40cc; transform:scale(1.02); }
        .menu-btn.primary { border-color:#4ae0e8; }
        .menu-btn.primary:hover { background:rgba(74,224,232,0.2); }
        .world-list { max-height:200px; overflow-y:auto; width:280px; margin:8px; }
        .world-item {
          padding:10px 14px; background:rgba(255,255,255,0.05); border:1px solid #333;
          margin:4px 0; cursor:pointer; border-radius:3px; pointer-events:all;
        }
        .world-item:hover { background:rgba(255,255,255,0.1); border-color:#666; }
        .world-name { font-size:14px; font-weight:bold; }
        .world-meta { font-size:11px; color:#888; }
        .version { position:fixed; bottom:8px; right:12px; font-size:11px; color:#444; }
        .chu-tag { font-size:11px; color:#666; margin-top:24px; }
      </style>
      <div id="main-menu">
        <div class="menu-title">🐉 DragonMind Craft</div>
        <div class="menu-subtitle">BY THE CHU COLLECTIVE</div>
        <button class="menu-btn primary" id="btn-new">⚔️ New World</button>
        ${worlds.length > 0 ? `
          <div class="world-list">
            ${worlds.map((w, i) => `
              <div class="world-item" data-index="${i}">
                <div class="world-name">${w.name}</div>
                <div class="world-meta">Seed: ${w.seed} • ${new Date(w.lastPlayed).toLocaleDateString()}</div>
              </div>
            `).join('')}
          </div>
        ` : '<div style="color:#555;font-size:13px;margin:8px 0">No worlds yet</div>'}
        <button class="menu-btn" id="btn-settings">⚙️ Settings</button>
        <button class="menu-btn" id="btn-quit">✕ Quit</button>
        <div class="chu-tag">🐒 ChuCoder • 🔍 ChuScout • 👹 ChuOps • 🧠 ChuMemory • 🐉 CustomerChu</div>
        <div class="version">v1.0.0 — DragonMind Craft</div>
      </div>
    `;

    this.container.classList.add('interactive');

    document.getElementById('btn-new')?.addEventListener('click', () => this.showNewWorldDialog());
    document.getElementById('btn-settings')?.addEventListener('click', () => this.onSettings?.());
    document.getElementById('btn-quit')?.addEventListener('click', () => this.onQuit?.());

    document.querySelectorAll('.world-item').forEach((el) => {
      el.addEventListener('click', () => {
        const idx = parseInt((el as HTMLElement).dataset.index ?? '0');
        this.onLoadWorld?.(worlds[idx]);
      });
    });
  }

  private showNewWorldDialog(): void {
    const name = prompt('World Name:', `DragonWorld ${Date.now().toString().slice(-4)}`) ?? 'New World';
    const seedStr = prompt('Seed (leave blank for random):', '');
    const seed = seedStr ? parseInt(seedStr) || this.hash(seedStr) : Math.floor(Math.random() * 999999);
    this.onNewWorld?.(name, seed);
  }

  private hash(s: string): number {
    let h = 0;
    for (const c of s) h = (Math.imul(31, h) + c.charCodeAt(0)) | 0;
    return Math.abs(h);
  }

  hide(): void {
    this.container.innerHTML = '';
    this.container.classList.remove('interactive');
  }
}
