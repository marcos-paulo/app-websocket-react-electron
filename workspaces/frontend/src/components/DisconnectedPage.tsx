import './DisconnectedPage.css';

interface DisconnectedPageProps {
  onReload?: () => void;
}

function DisconnectedPage({ onReload }: DisconnectedPageProps) {
  const handleReload = () => {
    if (onReload) {
      onReload();
    } else {
      window.location.href = '/';
    }
  };

  return (
    <div className="disconnected-page">
      <div className="disconnected-container">
        <div className="disconnected-icon">
          <svg
            width="120"
            height="120"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M13 2L3 14H12L11 22L21 10H12L13 2Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <line
              x1="4"
              y1="20"
              x2="20"
              y2="4"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>

        <h1 className="disconnected-title">Desconectado do Servidor</h1>
        
        <p className="disconnected-message">
          A conexão com o servidor WebSocket foi encerrada.
        </p>

        <div className="disconnected-info">
          <div className="info-item">
            <span className="info-icon">🔌</span>
            <span>O servidor foi completamente finalizado</span>
          </div>
          <div className="info-item">
            <span className="info-icon">⏱️</span>
            <span>Sessão encerrada em {new Date().toLocaleTimeString('pt-BR')}</span>
          </div>
          <div className="info-item">
            <span className="info-icon">🔒</span>
            <span>Para continuar, você precisa reiniciar</span>
          </div>
        </div>

        <button onClick={handleReload} className="reload-button">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ marginRight: '8px' }}
          >
            <path
              d="M1 4V10H7"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M23 20V14H17"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M20.49 9C19.9828 7.56678 19.1209 6.28542 17.9845 5.27542C16.8482 4.26541 15.4745 3.55976 13.9917 3.22426C12.5089 2.88875 10.9652 2.93434 9.50481 3.35677C8.04437 3.77921 6.71475 4.56471 5.64 5.64L1 10M23 14L18.36 18.36C17.2853 19.4353 15.9556 20.2208 14.4952 20.6432C13.0348 21.0657 11.4911 21.1112 10.0083 20.7757C8.52547 20.4402 7.1518 19.7346 6.01547 18.7246C4.87913 17.7146 4.01717 16.4332 3.51 15"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Reiniciar Aplicação
        </button>

        <p className="disconnected-footer">
          Esta página não pode ser fechada ou ter navegação revertida.
        </p>
      </div>
    </div>
  );
}

export default DisconnectedPage;
