import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { connectRequest } from "../store/websocketSlice";

/**
 * Hook customizado para auto-conectar ao WebSocket quando o componente monta
 * Lida corretamente com o Strict Mode do React
 */
export const useAutoConnect = (url: string, autoConnect: boolean = false) => {
  const dispatch = useAppDispatch();
  const { connectionStatus, isConnecting } = useAppSelector(
    (state) => state.websocket
  );
  const hasAttemptedConnection = useRef(false);

  useEffect(() => {
    if (!autoConnect) return;

    // Prevenir múltiplas tentativas de conexão (Strict Mode)
    if (hasAttemptedConnection.current) {
      console.log("⚠️ useAutoConnect: Já tentou conectar, ignorando...");
      return;
    }

    // Não tentar conectar se já está conectado ou conectando
    if (connectionStatus === "connected" || isConnecting) {
      console.log(
        "⚠️ useAutoConnect: Já conectado ou conectando, ignorando..."
      );
      return;
    }

    console.log("🔄 useAutoConnect: Iniciando auto-conexão...");
    hasAttemptedConnection.current = true;
    dispatch(connectRequest(url));

    // Cleanup
    return () => {
      console.log("🧹 useAutoConnect: Limpando...");
      // Não resetar hasAttemptedConnection aqui para evitar reconexão no Strict Mode
    };
  }, [autoConnect, url, dispatch, connectionStatus, isConnecting]);
};
