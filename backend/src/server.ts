import WebSocket, { WebSocketServer } from "ws";
import http from "http";

const PORT = 8080;

// Criar servidor HTTP
const server = http.createServer();

// Criar servidor WebSocket
const wss = new WebSocketServer({ server });

console.log(`🚀 WebSocket server iniciando na porta ${PORT}...`);

// Contador de clientes conectados
let clientCount = 0;

wss.on("connection", (ws: WebSocket) => {
  clientCount++;
  console.log(`✅ Cliente conectado! Total de clientes: ${clientCount}`);

  // Enviar mensagem de boas-vindas
  ws.send(
    JSON.stringify({
      type: "welcome",
      message: "Conectado ao servidor WebSocket!",
      timestamp: new Date().toISOString(),
    })
  );

  // Enviar mensagens periódicas ao cliente
  const interval = setInterval(() => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(
        JSON.stringify({
          type: "heartbeat",
          message: "Servidor está ativo",
          timestamp: new Date().toISOString(),
          serverUptime: process.uptime(),
        })
      );
    }
  }, 5000);

  // Receber mensagens do cliente
  ws.on("message", (data: Buffer) => {
    try {
      const message = JSON.parse(data.toString());
      console.log("📨 Mensagem recebida do cliente:", message);

      // Responder ao cliente
      ws.send(
        JSON.stringify({
          type: "response",
          message: `Servidor recebeu: ${message.text}`,
          timestamp: new Date().toISOString(),
        })
      );
    } catch (error) {
      console.error("❌ Erro ao processar mensagem:", error);
    }
  });

  // Quando o cliente desconecta
  ws.on("close", () => {
    clientCount--;
    console.log(`❌ Cliente desconectado! Total de clientes: ${clientCount}`);
    clearInterval(interval);

    // FINALIZAR O SERVIDOR QUANDO TODOS OS CLIENTES DESCONECTAREM
    if (clientCount === 0) {
      console.log("\n⚠️  Todos os clientes desconectaram!");
      console.log("🛑 Finalizando servidor WebSocket...");

      // Fechar o servidor WebSocket
      wss.close(() => {
        console.log("✅ Servidor WebSocket fechado");

        // Fechar o servidor HTTP
        server.close(() => {
          console.log("✅ Servidor HTTP fechado");
          console.log("👋 Encerrando processo...\n");

          // Finalizar o processo
          process.exit(0);
        });
      });
    }
  });

  // Tratar erros
  ws.on("error", (error) => {
    console.error("❌ Erro no WebSocket:", error);
  });
});

// Iniciar servidor HTTP
server.listen(PORT, () => {
  console.log(`✅ Servidor WebSocket rodando em ws://localhost:${PORT}`);
  console.log("📡 Aguardando conexões de clientes...\n");
});

// Tratar sinais de encerramento
process.on("SIGINT", () => {
  console.log("\n\n⚠️  Recebido sinal SIGINT (Ctrl+C)");
  console.log("🛑 Finalizando servidor graciosamente...");

  wss.close(() => {
    server.close(() => {
      console.log("✅ Servidor finalizado");
      process.exit(0);
    });
  });
});

process.on("SIGTERM", () => {
  console.log("\n\n⚠️  Recebido sinal SIGTERM");
  console.log("🛑 Finalizando servidor graciosamente...");

  wss.close(() => {
    server.close(() => {
      console.log("✅ Servidor finalizado");
      process.exit(0);
    });
  });
});
