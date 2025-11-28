import { useState, useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { connectRequest, disconnectRequest, sendMessage, clearMessages } from './store/websocketSlice';
import { useAutoConnect } from './hooks/useAutoConnect';
import DisconnectedPage from './components/DisconnectedPage';
import './App.css';

// Em produção, usa a mesma origem (window.location)
// Em desenvolvimento, usa localhost:8080
const getWebSocketUrl = () => {
  if (import.meta.env.PROD) {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    return `${protocol}//${window.location.host}`;
  }
  return 'ws://localhost:8080';
};

const WEBSOCKET_URL = getWebSocketUrl();

function App() {
  const dispatch = useAppDispatch();
  
  // Selecionar estado do Redux
  const { messages, connectionStatus, error } = useAppSelector((state) => state.websocket);
  
  // Estado local para input de mensagem
  const [inputMessage, setInputMessage] = useState('');
  
  // Estado para controlar se deve mostrar a página de desconexão
  const [showDisconnectedPage, setShowDisconnectedPage] = useState(false);

  // Auto-conectar quando o componente montar
  useAutoConnect(WEBSOCKET_URL, true);

  // Detectar quando o usuário desconecta e mostrar a página de desconexão
  useEffect(() => {
    // Verifica se houve uma desconexão intencional (usuário clicou em desconectar)
    if (connectionStatus === 'disconnected' && showDisconnectedPage) {
      // Substitui a entrada atual do histórico para impedir voltar
      window.history.pushState(null, '', window.location.href);
      window.history.pushState(null, '', window.location.href);
      
      // Previne a navegação de volta
      const preventBack = () => {
        window.history.pushState(null, '', window.location.href);
      };
      
      window.addEventListener('popstate', preventBack);
      
      return () => {
        window.removeEventListener('popstate', preventBack);
      };
    }
  }, [connectionStatus, showDisconnectedPage]);

  // Handlers
  const handleConnect = useCallback(() => {
    dispatch(connectRequest(WEBSOCKET_URL));
  }, [dispatch]);

  const handleDisconnect = useCallback(() => {
    dispatch(disconnectRequest());
    // Ativa a página de desconexão após desconectar
    setTimeout(() => {
      setShowDisconnectedPage(true);
    }, 500); // Pequeno delay para permitir a animação de desconexão
  }, [dispatch]);

  const handleSendMessage = useCallback(() => {
    if (inputMessage.trim()) {
      dispatch(sendMessage(inputMessage));
      setInputMessage('');
    }
  }, [dispatch, inputMessage]);

  const handleClearMessages = useCallback(() => {
    dispatch(clearMessages());
  }, [dispatch]);

  const getStatusColor = useCallback(() => {
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
  }, [connectionStatus]);

  const getStatusText = useCallback(() => {
    switch (connectionStatus) {
      case 'connected':
        return 'Conectado';
      case 'connecting':
        return 'Conectando...';
      case 'disconnected':
        return 'Desconectado';
      case 'disconnecting':
        return 'Desconectando...';
      case 'error':
        return 'Erro na conexão';
      default:
        return 'Desconectado';
    }
  }, [connectionStatus]);

  // Handler para recarregar a aplicação
  const handleReload = useCallback(() => {
    setShowDisconnectedPage(false);
    window.location.href = '/';
  }, []);

  // Se deve mostrar a página de desconexão
  if (showDisconnectedPage) {
    return <DisconnectedPage onReload={handleReload} />;
  }

  return (
    <div className="app">
      <header className="header">
        <h1>
          🔌 WebSocket Client
          <span className="redux-badge">Redux Toolkit</span>
        </h1>
        <div className="status" style={{ backgroundColor: getStatusColor() }}>
          {getStatusText()}
        </div>
      </header>

      <div className="content">
        {/* Mostrar erro se houver */}
        {error && (
          <div style={{
            background: '#fee2e2',
            color: '#991b1b',
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '20px',
            fontSize: '14px',
          }}>
            ❌ Erro: {error}
          </div>
        )}

        <div className="controls">
          <button
            onClick={handleConnect}
            disabled={connectionStatus === 'connected' || connectionStatus === 'connecting'}
            className="btn btn-connect"
          >
            Conectar
          </button>
          <button
            onClick={handleDisconnect}
            disabled={connectionStatus !== 'connected'}
            className="btn btn-disconnect"
          >
            Desconectar
          </button>
          <button
            onClick={handleClearMessages}
            disabled={messages.length === 0}
            className="btn btn-clear"
          >
            Limpar Mensagens
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
          <h2>Mensagens ({messages.length})</h2>
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
            Este cliente WebSocket usa <strong>Redux Toolkit</strong> para gerenciamento de estado.
          </p>
          <p>
            Conecta ao servidor em <code>{WEBSOCKET_URL}</code>
          </p>
          <p>
            <strong>Importante:</strong> Quando você fechar esta aba ou desconectar,
            o servidor backend será completamente finalizado.
          </p>
          <p style={{ marginTop: '12px', fontSize: '12px', opacity: 0.8 }}>
            💡 Melhores práticas do Redux: Actions, Reducers, Middleware customizado, e Typed Hooks.
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
