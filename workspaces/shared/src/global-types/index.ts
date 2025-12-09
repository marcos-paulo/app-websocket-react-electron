// Declaração de tipos para o TypeScript
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT_WS: number;
      NODE_ENV: "development" | "production" | "production-frontend-server";
      FRONTEND_URL?: string;
    }
  }

  interface Window {
    electronAPI?: {
      nodeEnv: "development" | "production" | "production-frontend-server";
      portWs: number;
      closeApp: () => void;
      quitApp: () => void;
      minimizeApp: () => void;
      onAppWillClose: (callback: () => void) => void;
      removeAllListeners: (channel: string) => void;
      platform: string;
      versions: {
        node: string;
        chrome: string;
        electron: string;
      };
    };
  }
}
export {};
