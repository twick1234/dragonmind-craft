import { app, BrowserWindow, Menu, ipcMain, shell, dialog } from 'electron';
import { join } from 'path';

let mainWindow: BrowserWindow | null = null;

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    minWidth: 800,
    minHeight: 600,
    title: 'DragonMind Craft',
    icon: join(__dirname, '../assets/icons/icon.png'),
    webPreferences: {
      preload: join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
    backgroundColor: '#0d1f4a',
    show: false,
  });

  if (process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
    mainWindow.webContents.openDevTools({ mode: 'detach' });
  } else {
    mainWindow.loadFile(join(__dirname, '../dist/index.html'));
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow!.show();
    mainWindow!.focus();
  });

  mainWindow.on('closed', () => { mainWindow = null; });

  // Block navigation
  mainWindow.webContents.on('will-navigate', (e) => e.preventDefault());

  buildMenu();
}

function buildMenu(): void {
  const template: Electron.MenuItemConstructorOptions[] = [
    {
      label: 'File',
      submenu: [
        { label: 'New World', accelerator: 'CmdOrCtrl+N', click: () => mainWindow?.webContents.send('menu-new-world') },
        { label: 'Save World', accelerator: 'CmdOrCtrl+S', click: () => mainWindow?.webContents.send('menu-save') },
        { type: 'separator' },
        { label: 'Quit', accelerator: 'CmdOrCtrl+Q', click: () => app.quit() },
      ]
    },
    {
      label: 'View',
      submenu: [
        { label: 'Toggle Fullscreen', accelerator: 'F11', click: () => {
          if (mainWindow) mainWindow.setFullScreen(!mainWindow.isFullScreen());
        }},
        { label: 'Developer Tools', accelerator: 'F12', click: () => mainWindow?.webContents.toggleDevTools() },
        { type: 'separator' },
        { label: 'Zoom In', accelerator: 'CmdOrCtrl+=', role: 'zoomIn' },
        { label: 'Zoom Out', accelerator: 'CmdOrCtrl+-', role: 'zoomOut' },
        { label: 'Reset Zoom', accelerator: 'CmdOrCtrl+0', role: 'resetZoom' },
      ]
    },
    {
      label: 'Help',
      submenu: [
        { label: 'Controls', click: () => {
          dialog.showMessageBox(mainWindow!, {
            title: 'Controls',
            message: 'DragonMind Craft Controls',
            detail: 'WASD - Move\nSpace - Jump\nShift - Sprint\nLeft Click - Break\nRight Click - Place\nE - Inventory\n1-9 - Hotbar\nScroll - Change slot\nEsc - Pause\nF11 - Fullscreen',
          });
        }},
        { label: 'About', click: () => {
          dialog.showMessageBox(mainWindow!, {
            title: 'About',
            message: 'DragonMind Craft v1.0.0',
            detail: 'A Minecraft-inspired voxel game by the Chu Collective.\n\n🐒 ChuCoder | 🔍 ChuScout | 👹 ChuOps | 🧠 ChuMemory | 🐉 CustomerChu',
          });
        }},
        { label: 'GitHub', click: () => shell.openExternal('https://github.com/twick1234/dragonmind-craft') },
      ]
    }
  ];

  if (process.platform === 'darwin') {
    template.unshift({ label: app.name, submenu: [{ role: 'about' }, { type: 'separator' }, { role: 'quit' }] });
  }

  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

// Handle quit from renderer
ipcMain.on('app-quit', () => app.quit());

app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
