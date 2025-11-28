import { app, BrowserWindow } from "electron";
import * as path from "path";

let mainWindow: BrowserWindow | null = null;

function createWindow(): void {
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

  // Carrega a aplicação frontend
  if (process.env.NODE_ENV === "production") {
    // Em produção, carrega o build estático
    // const frontendPath = path.join(
    //   __dirname,
    //   "../../frontend-redux/dist/index.html"
    // );
    // mainWindow.loadFile(frontendPath);
    // Em desenvolvimento, carrega do servidor Vite
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:8080";
    mainWindow.loadURL(frontendUrl);
  } else {
    // Em desenvolvimento, carrega do servidor Vite
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3001";
    mainWindow.loadURL(frontendUrl);
  }

  // Abre o DevTools em desenvolvimento
  if (process.env.NODE_ENV === "development") {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
