import { Dispatch, Middleware, MiddlewareAPI } from "@reduxjs/toolkit";
import { Message } from "../../types/websocket.types";
import { RootReducer } from "../store";
import {
  connectFailure,
  connectRequest,
  connectSuccess,
  disconnected,
  disconnectRequest,
  messageReceived,
  sendMessage,
  WebSocketSlicerActions,
} from "../websocketSlice";

let wsInstance: WebSocket | null = null;
let isConnectingFlag = false; // Previne múltiplas conexões simultâneas (Strict Mode)

type MiddlewareType = Middleware<
  {},
  RootReducer,
  Dispatch<WebSocketSlicerActions>
>;

type Store = MiddlewareAPI<Dispatch<WebSocketSlicerActions>, RootReducer>;

/**
 * Middleware do Redux para gerenciar conexões WebSocket
 * Segue o padrão de melhores práticas do Redux Toolkit
 */
export const websocketMiddleware: MiddlewareType =
  (store) => (next) => (action) => {
    // Permite que a action passe pelo reducer primeiro
    const result = next(action);

    // Lidar com a action de conexão
    if (connectRequest.match(action)) {
      openWebSocketConnection(store, action);
    }

    // Lidar com a action de envio de mensagem
    if (sendMessage.match(action)) {
      sendMessageToWebsoket(store, action);
    }

    // Lidar com a action de desconexão
    if (disconnectRequest.match(action)) {
      closeWebSocketConnection();
    }

    return result;
  };

function openWebSocketConnection(
  store: Store,
  action: ReturnType<typeof connectRequest>
) {
  const url = action.payload;

  // Prevenir múltiplas conexões (importante para Strict Mode)
  if (wsInstance?.readyState === WebSocket.OPEN) {
    console.log("⚠️ Middleware: WebSocket já está conectado");
    return;
  }

  if (isConnectingFlag) {
    console.log("⚠️ Middleware: WebSocket já está em processo de conexão");
    return;
  }

  console.log("🔌 Middleware: Criando conexão WebSocket...", url);
  isConnectingFlag = true;

  try {
    const ws = new WebSocket(url);
    wsInstance = ws;

    // Quando a conexão é aberta
    ws.onopen = () => {
      console.log("✅ Middleware: Conexão WebSocket estabelecida");
      isConnectingFlag = false;
      store.dispatch(connectSuccess());
    };

    // Quando recebe uma mensagem
    ws.onmessage = (event) => {
      try {
        const data: Message = JSON.parse(event.data);
        console.log("📨 Middleware: Mensagem recebida:", data);
        store.dispatch(messageReceived(data));
      } catch (error) {
        console.error("❌ Middleware: Erro ao processar mensagem:", error);
      }
    };

    // Quando ocorre um erro
    ws.onerror = (error) => {
      console.error("❌ Middleware: Erro no WebSocket:", error);
      isConnectingFlag = false;
      store.dispatch(connectFailure("Erro na conexão WebSocket"));
    };

    // Quando a conexão é fechada
    ws.onclose = () => {
      console.log("❌ Middleware: Conexão WebSocket fechada");
      isConnectingFlag = false;
      wsInstance = null;
      store.dispatch(disconnected());
    };
  } catch (error) {
    console.error("❌ Middleware: Erro ao criar WebSocket:", error);
    isConnectingFlag = false;
    store.dispatch(connectFailure((error as Error).message));
  }
}

function closeWebSocketConnection() {
  console.log("🔌 Middleware: Fechando conexão WebSocket...");
  if (wsInstance) {
    wsInstance.close();
    wsInstance = null;
    isConnectingFlag = false;
  }
}

function sendMessageToWebsoket(
  store: Store,
  action: ReturnType<typeof sendMessage>
) {
  const { connectionStatus } = store.getState().websocket;
  if (wsInstance && connectionStatus === "connected") {
    const payload = {
      text: action.payload,
      timestamp: new Date().toISOString(),
    };
    wsInstance.send(JSON.stringify(payload));
    console.log("📤 Middleware: Mensagem enviada:", payload);
  } else {
    console.warn("⚠️ Middleware: WebSocket não está conectado");
  }

  // if (wsInstance && wsInstance.readyState === WebSocket.OPEN) {
  //   console.log("📤 Middleware: Enviando mensagem:", action.payload);
  //   wsInstance.send(message);
  // } else {
  //   console.warn("⚠️ Middleware: WebSocket não está conectado");
  // }
}
