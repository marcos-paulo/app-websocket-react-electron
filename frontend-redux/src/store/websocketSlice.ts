import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { WebSocketState, Message } from "../types/websocket.types";

const initialState: WebSocketState = {
  messages: [],
  connectionStatus: "disconnected",
  wsInstance: null,
  isConnecting: false,
  error: null,
};

const websocketSlice = createSlice({
  name: "websocket",
  initialState,
  reducers: {
    // Action para iniciar conexão
    connectRequest: (state, action: PayloadAction<string>) => {
      state.connectionStatus = "connecting";
      state.isConnecting = true;
      state.error = null;
      console.log("🔄 Redux: Iniciando conexão...", action.payload);
    },

    // Action quando conexão é estabelecida
    connectSuccess: (state, action: PayloadAction<WebSocket>) => {
      state.connectionStatus = "connected";
      state.isConnecting = false;
      state.wsInstance = action.payload;
      state.error = null;
      console.log("✅ Redux: Conectado com sucesso");
    },

    // Action quando conexão falha
    connectFailure: (state, action: PayloadAction<string>) => {
      state.connectionStatus = "error";
      state.isConnecting = false;
      state.wsInstance = null;
      state.error = action.payload;
      console.error("❌ Redux: Erro na conexão:", action.payload);
    },

    // Action para desconectar
    disconnectRequest: (state) => {
      console.log("🔌 Redux: Desconectando...");
      if (state.wsInstance) {
        state.wsInstance.close();
      }
    },

    // Action quando desconecta
    disconnected: (state) => {
      state.connectionStatus = "disconnected";
      state.wsInstance = null;
      state.isConnecting = false;
      console.log("❌ Redux: Desconectado");
    },

    // Action para enviar mensagem
    sendMessage: (state, action: PayloadAction<string>) => {
      if (state.wsInstance && state.connectionStatus === "connected") {
        const payload = {
          text: action.payload,
          timestamp: new Date().toISOString(),
        };
        state.wsInstance.send(JSON.stringify(payload));
        console.log("📤 Redux: Mensagem enviada:", payload);
      } else {
        console.warn("⚠️ Redux: WebSocket não está conectado");
      }
    },

    // Action quando mensagem é recebida
    messageReceived: (state, action: PayloadAction<Message>) => {
      state.messages.push(action.payload);
      console.log("📨 Redux: Mensagem recebida:", action.payload);
    },

    // Action para limpar mensagens
    clearMessages: (state) => {
      state.messages = [];
      console.log("🗑️ Redux: Mensagens limpas");
    },

    // Action para atualizar instância do WebSocket
    updateWsInstance: (state, action: PayloadAction<WebSocket | null>) => {
      state.wsInstance = action.payload;
    },
  },
});

export const {
  connectRequest,
  connectSuccess,
  connectFailure,
  disconnectRequest,
  disconnected,
  sendMessage,
  messageReceived,
  clearMessages,
  updateWsInstance,
} = websocketSlice.actions;

export default websocketSlice.reducer;
