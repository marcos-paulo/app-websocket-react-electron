// Tipos para o WebSocket
export type ConnectionStatus =
  | "connecting"
  | "connected"
  | "disconnected"
  | "error";

export interface Message {
  type: string;
  message: string;
  timestamp: string;
  serverUptime?: number;
}

export interface WebSocketState {
  messages: Message[];
  connectionStatus: ConnectionStatus;
  wsInstance: WebSocket | null;
  isConnecting: boolean;
  error: string | null;
}

// Actions Payloads
export interface SendMessagePayload {
  text: string;
  timestamp: string;
}
