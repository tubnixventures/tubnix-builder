import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  openFolderDialog: () => ipcRenderer.invoke('dialog:openFolder'),
  saveFileDialog: (defaultPath: string) => ipcRenderer.invoke('dialog:saveFile', defaultPath),
  readFile: (filePath: string) => ipcRenderer.invoke('fs:readFile', filePath),
  writeFile: (filePath: string, data: string) => ipcRenderer.invoke('fs:writeFile', filePath, data),
  executeCommand: (cmd: string) => ipcRenderer.invoke('shell:execute', cmd),
  onTerminalOutput: (callback: (data: string) => void) => {
    ipcRenderer.on('terminal:output', (_event: IpcRendererEvent, data: string) => callback(data));
  },
});
