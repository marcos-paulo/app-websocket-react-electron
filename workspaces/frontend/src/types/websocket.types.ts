// Tipos para o WebSocket
export type ConnectionStatus =
  | "connecting"
  | "connected"
  | "disconnecting"
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
  hasAttemptedConnection: boolean;
  isConnecting: boolean;
  isDisconnecting: boolean;
  error: string | null;
}

// Actions Payloads
export interface SendMessagePayload {
  text: string;
  timestamp: string;
}
