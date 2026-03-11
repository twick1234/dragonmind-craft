export class PauseMenu {
  private container: HTMLElement;
  onResume?: () => void;
  onSave?: () => void;
  onSettings?: () => void;
  onQuit?: () => void;

  constructor(container: HTMLElement) {
    this.container = container;
  }

  show(): void {
    this.container.innerHTML = `
      <style>
        #pause-menu {
          position:fixed; top:0; left:0; width:100%; height:100%;
          background:rgba(0,0,0,0.75); display:flex; flex-direction:column;
          align-items:center; justify-content:center;
          font-family:'Courier New',monospace; color:white; z-index:50;
        }
        .pause-title { font-size:32px; margin-bottom:32px; color:#aa40cc; }
        .pause-btn {
          width:240px; padding:12px; margin:5px; border:2px solid #555;
          background:rgba(255,255,255,0.08); color:white; font-family:inherit;
          font-size:15px; cursor:pointer; border-radius:3px; transition:all 0.15s;
          pointer-events:all;
        }
        .pause-btn:hover { background:rgba(255,255,255,0.2); border-color:#aaa; }
      </style>
      <div id="pause-menu">
        <div class="pause-title">⏸ Paused</div>
        <button class="pause-btn" id="p-resume">▶ Resume</button>
        <button class="pause-btn" id="p-save">💾 Save World</button>
        <button class="pause-btn" id="p-settings">⚙ Settings</button>
        <button class="pause-btn" id="p-quit">🏠 Main Menu</button>
      </div>
    `;
    this.container.classList.add('interactive');

    document.getElementById('p-resume')?.addEventListener('click', () => this.onResume?.());
    document.getElementById('p-save')?.addEventListener('click', () => this.onSave?.());
    document.getElementById('p-settings')?.addEventListener('click', () => this.onSettings?.());
    document.getElementById('p-quit')?.addEventListener('click', () => this.onQuit?.());
  }

  hide(): void {
    this.container.innerHTML = '';
    this.container.classList.remove('interactive');
  }
}
