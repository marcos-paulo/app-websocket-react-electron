import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Message, WebSocketState } from "../types/websocket.types";

const initialState: WebSocketState = {
  messages: [],
  connectionStatus: "disconnected",
  hasAttemptedConnection: false,
  isConnecting: false,
  isDisconnecting: false,
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
    connectSuccess: (state) => {
      state.connectionStatus = "connected";
      state.isConnecting = false;
      state.error = null;
      console.log("✅ Redux: Conectado com sucesso");
    },

    // Action quando conexão falha
    connectFailure: (state, action: PayloadAction<string>) => {
      state.connectionStatus = "error";
      state.isConnecting = false;
      state.error = action.payload;
      console.error("❌ Redux: Erro na conexão:", action.payload);
    },

    // Action para desconectar
    disconnectRequest: (state) => {
      state.connectionStatus = "disconnecting";
      state.isConnecting = false;
      state.isDisconnecting = true;
      console.log("🔌 Redux: Desconectando...");
    },

    // Action quando desconecta
    disconnected: (state) => {
      state.connectionStatus = "disconnected";
      state.isConnecting = false;
      state.isDisconnecting = false;
      console.log("❌ Redux: Desconectado");
    },

    // Action para enviar mensagem
    sendMessage: (_state, action: PayloadAction<string>) => {
      console.log("📤 Redux: Enviando mensagem:", action.payload);
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

    setHasAttemptedConnection: (state, action: PayloadAction<boolean>) => {
      state.hasAttemptedConnection = action.payload;
      console.log(
        "🔄 Redux: Atualizando hasAttemptedConnection:",
        action.payload
      );
    },
  },
});

type RawWebSocketSlicerActions = typeof websocketSlice.actions;

type ObjectActions = {
  [key in keyof RawWebSocketSlicerActions]: {
    type: `${typeof websocketSlice.name}/${key}`;
    payload: Parameters<RawWebSocketSlicerActions[key]>[0];
  };
};

type WebSocketSlicerActions = ObjectActions[keyof ObjectActions];

export type { WebSocketSlicerActions, WebSocketState };

export const {
  connectRequest,
  connectSuccess,
  connectFailure,
  disconnectRequest,
  disconnected,
  sendMessage,
  messageReceived,
  clearMessages,
} = websocketSlice.actions;

export default websocketSlice.reducer;
