import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  quit: () => ipcRenderer.send('app-quit'),
  onMenuNewWorld: (cb: () => void) => ipcRenderer.on('menu-new-world', cb),
  onMenuSave: (cb: () => void) => ipcRenderer.on('menu-save', cb),
  platform: process.platform,
  isElectron: true,
});
