/**
 * Tipos de mensagens que o SERVIDOR envia para o CLIENTE
 */
export type ServerMessageType =
  | "welcome"
  | "heartbeat"
  | "response"
  | "error"
  | "notification"
  | "disconnect";

/**
 * Tipos de mensagens que o CLIENTE envia para o SERVIDOR
 */
export type ClientMessageType = "message" | "ping" | "command" | "disconnect";

/**
 * Estrutura base de todas as mensagens do servidor
 */
export interface BaseServerMessage {
  type: ServerMessageType;
  timestamp: string;
}

/**
 * Estrutura base de todas as mensagens do cliente
 */
export interface BaseClientMessage {
  type: ClientMessageType;
  timestamp?: string;
}

/**
 * Mensagem de boas-vindas enviada quando cliente conecta
 */
export interface WelcomeMessage extends BaseServerMessage {
  type: "welcome";
  message: string;
}

/**
 * Mensagem de heartbeat (keep-alive) enviada periodicamente
 */
export interface HeartbeatMessage extends BaseServerMessage {
  type: "heartbeat";
  message: string;
  serverUptime: number;
}

/**
 * Mensagem de resposta do servidor a uma mensagem do cliente
 */
export interface ResponseMessage extends BaseServerMessage {
  type: "response";
  message: string;
  originalMessage?: string;
}

/**
 * Mensagem de erro do servidor
 */
export interface ErrorMessage extends BaseServerMessage {
  type: "error";
  error: string;
  code?: string;
}

/**
 * Notificação genérica do servidor
 */
export interface NotificationMessage extends BaseServerMessage {
  type: "notification";
  title: string;
  message: string;
  severity?: "info" | "warning" | "error" | "success";
}

/**
 * Mensagem de desconexão do servidor
 */
export interface ServerDisconnectMessage extends BaseServerMessage {
  type: "disconnect";
  reason: string;
}

/**
 * União de todos os tipos de mensagens que o servidor pode enviar
 */
export type ServerMessage =
  | WelcomeMessage
  | HeartbeatMessage
  | ResponseMessage
  | ErrorMessage
  | NotificationMessage
  | ServerDisconnectMessage;

/**
 * Mensagem de texto do cliente
 */
export interface ClientTextMessage extends BaseClientMessage {
  type: "message";
  text: string;
  userId?: string;
}

/**
 * Mensagem de ping do cliente (keep-alive)
 */
export interface ClientPingMessage extends BaseClientMessage {
  type: "ping";
}

/**
 * Comando enviado pelo cliente
 */
export interface ClientCommandMessage extends BaseClientMessage {
  type: "command";
  command: string;
  params?: Record<string, any>;
}

/**
 * Mensagem de desconexão do cliente
 */
export interface ClientDisconnectMessage extends BaseClientMessage {
  type: "disconnect";
  reason?: string;
}

/**
 * União de todos os tipos de mensagens que o cliente pode enviar
 */
export type ClientMessage =
  | ClientTextMessage
  | ClientPingMessage
  | ClientCommandMessage
  | ClientDisconnectMessage;

/**
 * Status de conexão WebSocket
 */
export type ConnectionStatus =
  | "connecting"
  | "connected"
  | "disconnected"
  | "error";

/**
 * Estados do WebSocket (valores numéricos do WebSocket.readyState)
 */
export enum WebSocketReadyState {
  CONNECTING = 0,
  OPEN = 1,
  CLOSING = 2,
  CLOSED = 3,
}

/**
 * Códigos de fechamento WebSocket (RFC 6455)
 */
export enum WebSocketCloseCode {
  NORMAL_CLOSURE = 1000,
  GOING_AWAY = 1001,
  PROTOCOL_ERROR = 1002,
  UNSUPPORTED_DATA = 1003,
  NO_STATUS_RECEIVED = 1005,
  ABNORMAL_CLOSURE = 1006,
  INVALID_FRAME_PAYLOAD = 1007,
  POLICY_VIOLATION = 1008,
  MESSAGE_TOO_BIG = 1009,
  MISSING_EXTENSION = 1010,
  INTERNAL_ERROR = 1011,
  SERVICE_RESTART = 1012,
  TRY_AGAIN_LATER = 1013,
  BAD_GATEWAY = 1014,
  TLS_HANDSHAKE = 1015,
}
