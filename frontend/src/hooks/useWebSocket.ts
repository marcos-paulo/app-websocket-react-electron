import { useState, useEffect, useRef, useCallback } from "react";

interface Message {
  type: string;
  message: string;
  timestamp: string;
  serverUptime?: number;
}

interface WebSocketHookReturn {
  messages: Message[];
  connectionStatus: "connecting" | "connected" | "disconnected" | "error";
  sendMessage: (message: string) => void;
  connect: () => void;
  disconnect: () => void;
}

export const useWebSocket = (url: string): WebSocketHookReturn => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<
    "connecting" | "connected" | "disconnected" | "error"
  >("disconnected");
  const wsRef = useRef<WebSocket | null>(null);

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      console.log("WebSocket já está conectado");
      return;
    }

    console.log("Conectando ao WebSocket...");
    setConnectionStatus("connecting");

    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("✅ Conectado ao servidor WebSocket");
      setConnectionStatus("connected");
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
    };

    ws.onclose = () => {
      console.log("❌ Desconectado do servidor WebSocket");
      setConnectionStatus("disconnected");
      wsRef.current = null;
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

  // Cleanup na desmontagem do componente
  useEffect(() => {
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  return {
    messages,
    connectionStatus,
    sendMessage,
    connect,
    disconnect,
  };
};
