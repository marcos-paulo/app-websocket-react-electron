import { useCallback, useEffect, useState } from 'react';
import { useWebSocket } from './hooks/useWebSocket';
import './App.css';

const WEBSOCKET_URL = 'ws://localhost:8080';

function App() {
  const { messages, connectionStatus, sendMessage, connect, disconnect } = useWebSocket(WEBSOCKET_URL);
  const [inputMessage, setInputMessage] = useState('');

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      sendMessage(inputMessage);
      setInputMessage('');
    }
  };

  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'connected':
        return '#4ade80';
      case 'connecting':
        return '#fbbf24';
      case 'disconnected':
        return '#94a3b8';
      case 'error':
        return '#f87171';
      default:
        return '#94a3b8';
    }
  };

  const getStatusText = useCallback(() => {
    switch (connectionStatus) {
      case 'connected':
        return 'Conectado';
      case 'connecting':
        return 'Conectando...';
      case 'disconnected':
        return 'Desconectado';
      case 'error':
        return 'Erro na conexão';
      default:
        return 'Desconectado';
    }
  }, [connectionStatus]);

  useEffect(() => {
    // Conectar automaticamente ao carregar o componente
    connect();

    // Desconectar ao desmontar o componente
    return () => {
      disconnect();
    };
  }, []); 

  return (
    <div className="app">
      <header className="header">
        <h1>🔌 WebSocket Client</h1>
        <div className="status" style={{ backgroundColor: getStatusColor() }}>
          {getStatusText()}
        </div>
      </header>

      <div className="content">
        <div className="controls">
          <button
            onClick={connect}
            disabled={connectionStatus === 'connected' || connectionStatus === 'connecting'}
            className="btn btn-connect"
          >
            Conectar
          </button>
          <button
            onClick={disconnect}
            disabled={connectionStatus !== 'connected'}
            className="btn btn-disconnect"
          >
            Desconectar
          </button>
        </div>

        <div className="message-input">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Digite uma mensagem..."
            disabled={connectionStatus !== 'connected'}
            className="input"
          />
          <button
            onClick={handleSendMessage}
            disabled={connectionStatus !== 'connected' || !inputMessage.trim()}
            className="btn btn-send"
          >
            Enviar
          </button>
        </div>

        <div className="messages">
          <h2>Mensagens</h2>
          <div className="messages-list">
            {messages.length === 0 ? (
              <p className="empty-message">Nenhuma mensagem recebida ainda...</p>
            ) : (
              messages.map((msg, index) => (
                <div key={index} className={`message message-${msg.type}`}>
                  <div className="message-type">{msg.type}</div>
                  <div className="message-content">{msg.message}</div>
                  <div className="message-time">
                    {new Date(msg.timestamp).toLocaleTimeString('pt-BR')}
                    {msg.serverUptime && (
                      <span className="uptime">
                        {' '}• Uptime: {Math.floor(msg.serverUptime)}s
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="info">
          <h3>ℹ️ Informações</h3>
          <p>
            Este cliente WebSocket se conecta ao servidor em <code>{WEBSOCKET_URL}</code>
          </p>
          <p>
            <strong>Importante:</strong> Quando você fechar esta aba ou desconectar,
            o servidor backend será completamente finalizado.
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
