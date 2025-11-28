import { ServerMessageType, ClientMessageType } from "./messages";

/**
 * Type guard para verificar se uma string é um tipo válido de mensagem do servidor
 */
export function isServerMessageType(type: string): type is ServerMessageType {
  return [
    "welcome",
    "heartbeat",
    "response",
    "error",
    "notification",
    "disconnect",
  ].includes(type);
}

/**
 * Type guard para verificar se uma string é um tipo válido de mensagem do cliente
 */
export function isClientMessageType(type: string): type is ClientMessageType {
  return ["message", "ping", "command", "disconnect"].includes(type);
}

/**
 * Valida se um objeto tem a estrutura mínima de uma mensagem
 */
export function isValidMessage(
  obj: any
): obj is { type: string; timestamp?: string } {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "type" in obj &&
    typeof obj.type === "string"
  );
}

/**
 * Helper para criar timestamp ISO
 */
export function createTimestamp(): string {
  return new Date().toISOString();
}
