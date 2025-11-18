import { Middleware } from "@reduxjs/toolkit";
import {
  connectRequest,
  disconnectRequest,
  connectSuccess,
  connectFailure,
  disconnected,
  messageReceived,
  updateWsInstance,
} from "../websocketSlice";
import { Message } from "../../types/websocket.types";

let wsInstance: WebSocket | null = null;
let isConnectingFlag = false; // Previne múltiplas conexões simultâneas (Strict Mode)

/**
 * Middleware do Redux para gerenciar conexões WebSocket
 * Segue o padrão de melhores práticas do Redux Toolkit
 */
export const websocketMiddleware: Middleware =
  (store) => (next) => (action) => {
    // Permite que a action passe pelo reducer primeiro
    const result = next(action);

    // Lidar com a action de conexão
    if (connectRequest.match(action)) {
      const url = action.payload;

      // Prevenir múltiplas conexões (importante para Strict Mode)
      if (wsInstance?.readyState === WebSocket.OPEN) {
        console.log("⚠️ Middleware: WebSocket já está conectado");
        return result;
      }

      if (isConnectingFlag) {
        console.log("⚠️ Middleware: WebSocket já está em processo de conexão");
        return result;
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
          store.dispatch(connectSuccess(ws));
          store.dispatch(updateWsInstance(ws));
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
          store.dispatch(updateWsInstance(null));
        };
      } catch (error) {
        console.error("❌ Middleware: Erro ao criar WebSocket:", error);
        isConnectingFlag = false;
        store.dispatch(connectFailure((error as Error).message));
      }
    }

    // Lidar com a action de desconexão
    if (disconnectRequest.match(action)) {
      console.log("🔌 Middleware: Fechando conexão WebSocket...");
      if (wsInstance) {
        wsInstance.close();
        wsInstance = null;
        isConnectingFlag = false;
      }
    }

    return result;
  };
