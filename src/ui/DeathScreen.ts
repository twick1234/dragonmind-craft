export class DeathScreen {
  private container: HTMLElement;
  onRespawn?: () => void;
  onQuit?: () => void;

  constructor(container: HTMLElement) {
    this.container = container;
  }

  show(message = 'You Died!'): void {
    this.container.innerHTML = `
      <style>
        #death-screen {
          position:fixed; top:0; left:0; width:100%; height:100%;
          background:rgba(140,0,0,0.6); display:flex; flex-direction:column;
          align-items:center; justify-content:center;
          font-family:'Courier New',monospace; color:white; z-index:60;
          animation:fadeIn 1s ease-in;
        }
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        .death-title { font-size:48px; color:#ff3333; margin-bottom:8px; text-shadow:0 0 20px #ff0000; }
        .death-msg { font-size:16px; color:#ffaaaa; margin-bottom:32px; }
        .death-btn {
          width:220px; padding:12px; margin:6px; border:2px solid #800;
          background:rgba(180,0,0,0.3); color:white; font-family:inherit;
          font-size:15px; cursor:pointer; border-radius:3px; transition:all 0.15s;
          pointer-events:all;
        }
        .death-btn:hover { background:rgba(200,0,0,0.5); }
      </style>
      <div id="death-screen">
        <div class="death-title">☠ ${message}</div>
        <div class="death-msg">Your items remain where you fell...</div>
        <button class="death-btn" id="d-respawn">♻ Respawn</button>
        <button class="death-btn" id="d-quit">🏠 Main Menu</button>
      </div>
    `;
    this.container.classList.add('interactive');

    document.getElementById('d-respawn')?.addEventListener('click', () => this.onRespawn?.());
    document.getElementById('d-quit')?.addEventListener('click', () => this.onQuit?.());
  }

  hide(): void {
    this.container.innerHTML = '';
    this.container.classList.remove('interactive');
  }
}
