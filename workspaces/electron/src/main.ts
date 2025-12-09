import { app, BrowserWindow, ipcMain } from "electron";
import * as path from "path";

let mainWindow: BrowserWindow | null = null;

async function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  // Remove o menu da aplicação
  mainWindow.setMenu(null);

  // Abre o DevTools em desenvolvimento
  if (process.env.NODE_ENV === "development") {
    mainWindow.webContents.openDevTools();
  }
}

function addWebContentsHandlers() {
  console.log("🔧 Adicionando handlers de webContents");
  let handlerReceived: (
    details: Electron.OnHeadersReceivedListenerDetails,
    callback: (
      headersReceivedResponse: Electron.HeadersReceivedResponse
    ) => void
  ) => void = () => {};

  if (process.env.NODE_ENV === "development") {
    handlerReceived = (details, callback) => {
      callback({
        responseHeaders: {
          ...details.responseHeaders,
          "Content-Security-Policy": [
            "default-src 'self' 'unsafe-inline' 'unsafe-eval';" +
              "connect-src 'self' ws://localhost:* wss://localhost:* http://localhost:*;",
          ],
        },
      });
    };
  } else {
    handlerReceived = (details, callback) => {
      callback({
        responseHeaders: {
          ...details.responseHeaders,
          "Content-Security-Policy": [
            "default-src 'self';" +
              "script-src 'self';" +
              "style-src 'self' 'unsafe-inline';" +
              "connect-src 'self' ws://localhost:* wss://localhost:* ws: wss:;",
          ],
        },
      });
    };
  }

  mainWindow?.webContents.session.webRequest.onHeadersReceived(handlerReceived);

  // Log de erros da página
  if (process.env.NODE_ENV === "production") {
    mainWindow?.webContents.on(
      "did-fail-load",
      (event, errorCode, errorDescription) => {
        console.error("Falha ao carregar:", errorCode, errorDescription);
      }
    );

    mainWindow?.webContents.on("console-message", ({ level, message }) => {
      console.log("\x1b[34m[FRONTEND]\x1b[0m", message);
    });
  }

  mainWindow?.on("closed", () => {
    console.log("🗑️  Janela fechada");
    mainWindow = null;
  });
}

async function loadContent() {
  try {
    // Carrega a aplicação frontend
    if (process.env.NODE_ENV === "production") {
      const alternativePath = "../../frontend/dist/index.html";
      const frontendPath = path.join(__dirname, alternativePath);
      await mainWindow?.loadFile(frontendPath);
    } else if (process.env.NODE_ENV === "production-frontend-server") {
      const alternativeUrl = `http://localhost:${process.env.PORT_WS}`;
      const frontendUrl = process.env.FRONTEND_URL || alternativeUrl;
      await mainWindow?.loadURL(frontendUrl);
    } else {
      const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3001";
      await mainWindow?.loadURL(frontendUrl);
    }
  } catch (error) {
    console.error("Erro ao carregar a aplicação:", error);
  }
}

// Handlers IPC
ipcMain.on("close-app", () => {
  console.log("🛑 Solicitação de fechamento recebida do React");
  if (mainWindow) {
    mainWindow.close();
  }
});

ipcMain.on("quit-app", () => {
  console.log("🛑 Solicitação de encerramento recebida do React");
  app.quit();
});

ipcMain.on("minimize-app", () => {
  console.log("📉 Minimizando aplicação");
  if (mainWindow) {
    mainWindow.minimize();
  }
});

app.disableHardwareAcceleration();
app
  .whenReady()
  .then(async () => {
    createWindow();
    addWebContentsHandlers();
    await loadContent();
  })
  .catch((error) => {
    console.error("Erro ao iniciar o Electron:", error);
  });

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.on("before-quit", () => {
  console.log("👋 Aplicação encerrando...");
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
