import { Engine } from './engine/Engine';
import { MainMenu } from './ui/MainMenu';
import { SaveManager } from './save/SaveManager';

const canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
const uiLayer = document.getElementById('ui-layer') as HTMLElement;

const saveManager = new SaveManager();
const engine = new Engine(canvas, uiLayer);

// Show main menu
const menuContainer = document.createElement('div');
uiLayer.appendChild(menuContainer);
const mainMenu = new MainMenu(menuContainer);

mainMenu.onNewWorld = (name, seed) => {
  const slot = {
    name,
    seed,
    created: Date.now(),
    lastPlayed: Date.now(),
    playtime: 0,
  };
  mainMenu.hide();
  engine.startGame(seed, slot);
};

mainMenu.onLoadWorld = (slot) => {
  const data = saveManager.load(slot.name);
  mainMenu.hide();
  engine.startGame(slot.seed, slot, data ?? undefined);
};

mainMenu.onQuit = () => {
  // Electron quit
  if ((window as any).electronAPI?.quit) {
    (window as any).electronAPI.quit();
  }
};

mainMenu.show(saveManager.getSlots());

// Prevent right-click menu in game
document.addEventListener('contextmenu', e => e.preventDefault());

// Handle window resize
window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

console.log('🐉 DragonMind Craft v1.0.0 - By the Chu Collective');
console.log('🐒 ChuCoder | 🔍 ChuScout | 👹 ChuOps | 🧠 ChuMemory | 🐉 CustomerChu');
