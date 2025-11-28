/**
 * Configurações do WebSocket
 */
export interface WebSocketConfig {
  /**
   * URL do servidor WebSocket
   */
  url: string;

  /**
   * Intervalo de heartbeat em milissegundos
   * @default 5000
   */
  heartbeatInterval?: number;

  /**
   * Timeout de reconexão em milissegundos
   * @default 3000
   */
  reconnectTimeout?: number;

  /**
   * Número máximo de tentativas de reconexão
   * @default 5
   */
  maxReconnectAttempts?: number;

  /**
   * Habilitar auto-reconexão
   * @default true
   */
  autoReconnect?: boolean;

  /**
   * Protocolos WebSocket
   */
  protocols?: string | string[];
}

/**
 * Estatísticas de conexão
 */
export interface ConnectionStats {
  /**
   * Número de mensagens enviadas
   */
  messagesSent: number;

  /**
   * Número de mensagens recebidas
   */
  messagesReceived: number;

  /**
   * Timestamp da última mensagem recebida
   */
  lastMessageReceived?: string;

  /**
   * Timestamp da última mensagem enviada
   */
  lastMessageSent?: string;

  /**
   * Tempo de conexão ativo (em segundos)
   */
  uptime: number;

  /**
   * Número de reconexões
   */
  reconnectCount: number;
}
