import { contextBridge, ipcRenderer } from "electron";

// Expõe APIs seguras para o renderer process
contextBridge.exposeInMainWorld("electronAPI", {
  nodeEnv: process.env.NODE_ENV,
  portWs: process.env.PORT_WS,

  platform: process.platform,
  versions: {
    node: process.versions.node,
    chrome: process.versions.chrome,
    electron: process.versions.electron,
  },

  // Controle da aplicação
  closeApp: () => ipcRenderer.send("close-app"),
  quitApp: () => ipcRenderer.send("quit-app"),
  minimizeApp: () => ipcRenderer.send("minimize-app"),

  // Ouvir eventos do main process
  onAppWillClose: (callback: () => void) => {
    ipcRenderer.on("app-will-close", callback);
  },

  // Remover listeners
  removeAllListeners: (channel: "app-will-close") => {
    ipcRenderer.removeAllListeners(channel);
  },
});

export {};
