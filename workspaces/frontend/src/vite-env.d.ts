/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_WEBSOCKET_PORT: string;
  // adicione mais variáveis aqui...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
