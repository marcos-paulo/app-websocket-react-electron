import { useState, useEffect, useRef, useCallback } from "react";

type ConnectionStatus = "connecting" | "connected" | "disconnected" | "error";

interface Message {
  type: string;
  message: string;
  timestamp: string;
  serverUptime?: number;
}

interface WebSocketHookReturn {
  messages: Message[];
  connectionStatus: ConnectionStatus;
  sendMessage: (message: string) => void;
  connect: () => void;
  disconnect: () => void;
}

export const useWebSocket = (
  url: string,
  autoConnect: boolean = false
): WebSocketHookReturn => {
  const [messages, setMessages] = useState<Message[]>([]);

  // prettier-ignore
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>("disconnected");
  // prettier-ignore
  const [connectionStatusHistory, setConnectionStatusHistory] = useState<ConnectionStatus[]>([]);

  const wsRef = useRef<WebSocket | null>(null);
  const wsRefHistory = useRef<WebSocket[]>([]); // Histórico de conexões WebSocket
  const isConnectingRef = useRef(false); // Previne múltiplas conexões no Strict Mode

  const connect = useCallback(() => {
    // Previne múltiplas conexões simultâneas (importante para Strict Mode)
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      console.log("WebSocket já está conectado");
      return;
    }

    if (isConnectingRef.current) {
      console.log("WebSocket já está em processo de conexão");
      return;
    }

    console.log("Conectando ao WebSocket...");
    isConnectingRef.current = true;
    setConnectionStatus("connecting");
    setConnectionStatusHistory((prev) => [...prev, "connecting"]);

    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("✅ Conectado ao servidor WebSocket");
      setConnectionStatus("connected");
      setConnectionStatusHistory((prev) => [...prev, "connected"]);
      isConnectingRef.current = false;
    };

    ws.onmessage = (event) => {
      try {
        const data: Message = JSON.parse(event.data);
        console.log("📨 Mensagem recebida:", data);
        setMessages((prev) => [...prev, data]);
      } catch (error) {
        console.error("Erro ao processar mensagem:", error);
      }
    };

    ws.onerror = (error) => {
      console.error("❌ Erro no WebSocket:", error);
      setConnectionStatus("error");
      setConnectionStatusHistory((prev) => [...prev, "error"]);
      isConnectingRef.current = false;
    };

    ws.onclose = () => {
      console.log("❌ Desconectado do servidor WebSocket");
      setConnectionStatus("disconnected");
      setConnectionStatusHistory((prev) => [...prev, "disconnected"]);
      wsRef.current = null;
      isConnectingRef.current = false;
    };
  }, [url]);

  const disconnect = useCallback(() => {
    if (wsRef.current) {
      console.log("Desconectando do WebSocket...");
      wsRef.current.close();
      wsRef.current = null;
    }
  }, []);

  const sendMessage = useCallback((message: string) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      const payload = {
        text: message,
        timestamp: new Date().toISOString(),
      };
      wsRef.current.send(JSON.stringify(payload));
      console.log("📤 Mensagem enviada:", payload);
    } else {
      console.warn("WebSocket não está conectado");
    }
  }, []);

  // Auto-conectar quando o componente montar (se autoConnect === true)
  useEffect(() => {
    console.log("useWebSocket: useEffect - autoConnect =", autoConnect);
    console.log("Environment:", import.meta.env);

    if (import.meta.env.PROD) {
      console.log("🔄 Ambiente de produção detectado");
      if (autoConnect) {
        console.log("🔄 Auto-conectando ao WebSocket...");
        connect();
      }
    } else {
      console.log("🔄 Ambiente de desenvolvimento detectado");
      if (autoConnect && !isConnectingRef.current && wsRef.current === null) {
        console.log("🔄 Auto-conectando ao WebSocket...");
        connect();
      }
    }

    // Cleanup na desmontagem do componente
    return () => {
      if (wsRef.current) {
        console.log("🧹 Limpando conexão WebSocket...");
        wsRef.current.close();
        wsRef.current = null;
        isConnectingRef.current = false;
      }
    };
  }, [autoConnect, connect]);

  return {
    messages,
    connectionStatus,
    sendMessage,
    connect,
    disconnect,
  };
};
