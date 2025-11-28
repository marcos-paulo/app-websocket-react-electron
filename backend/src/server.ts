import WebSocket, { WebSocketServer } from "ws";
import http from "http";
import fs from "fs";
import path from "path";

const PORT = process.env.PORT || 8080;
const NODE_ENV = process.env.NODE_ENV || "development";
const STATIC_DIR = path.join(__dirname, "../../frontend/dist");
// const STATIC_DIR = path.join(__dirname, "../../frontend-redux/dist");

// MIME types para servir arquivos estáticos
const MIME_TYPES: { [key: string]: string } = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
};

// Criar servidor HTTP que serve arquivos estáticos em produção
const server = http.createServer((req, res) => {
  // Em produção, servir arquivos estáticos
  if (NODE_ENV === "production") {
    console.log("modo produção");
    let filePath = path.join(
      STATIC_DIR,
      req.url === "/" ? "index.html" : req.url || ""
    );
    console.log("Requisição para:", filePath);

    // Se o arquivo não existir, servir index.html (SPA routing)
    if (!fs.existsSync(filePath)) {
      console.log("Arquivo não encontrado, servindo index.html");
      filePath = path.join(STATIC_DIR, "index.html");
    }

    const extname = String(path.extname(filePath)).toLowerCase();
    const contentType = MIME_TYPES[extname] || "application/octet-stream";

    fs.readFile(filePath, (error, content) => {
      if (error) {
        if (error.code === "ENOENT") {
          res.writeHead(404, { "Content-Type": "text/html" });
          res.end("<h1>404 - Página não encontrada</h1>", "utf-8");
        } else {
          res.writeHead(500);
          res.end(`Erro no servidor: ${error.code}`, "utf-8");
        }
      } else {
        res.writeHead(200, { "Content-Type": contentType });
        res.end(content, "utf-8");
      }
    });
  } else {
    console.log("modo desenvolvimento");
    // Em desenvolvimento, retornar mensagem
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(
      "<h1>WebSocket Server</h1><p>Servidor rodando em modo desenvolvimento. Use o frontend separadamente.</p>"
    );
  }
});

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
  ws.on("close", (data) => {
    clientCount--;
    console.log(`❌ Cliente desconectado! Total de clientes: ${clientCount}`);
    clearInterval(interval);

    // FINALIZAR O SERVIDOR QUANDO TODOS OS CLIENTES DESCONECTAREM
    // if (clientCount === 0) {
    //   console.log("\n⚠️  Todos os clientes desconectaram!");
    //   console.log("🛑 Finalizando servidor WebSocket...");

    //   // Fechar o servidor WebSocket
    //   wss.close(() => {
    //     console.log("✅ Servidor WebSocket fechado");

    //     // Fechar o servidor HTTP
    //     server.close(() => {
    //       console.log("✅ Servidor HTTP fechado");
    //       console.log("👋 Encerrando processo...\n");

    //       // Finalizar o processo
    //       process.exit(0);
    //     });
    //   });
    // }
  });

  // Tratar erros
  ws.on("error", (error) => {
    console.error("❌ Erro no WebSocket:", error);
  });
});

// Iniciar servidor HTTP
server.listen(PORT, () => {
  console.log(`✅ Servidor rodando em modo: ${NODE_ENV}`);
  console.log(`✅ Servidor HTTP rodando em http://localhost:${PORT}`);
  console.log(`✅ Servidor WebSocket rodando em ws://localhost:${PORT}`);

  if (NODE_ENV === "production") {
    try {
      fs.existsSync(STATIC_DIR);
      console.log(`📁 Servindo arquivos estáticos de: ${STATIC_DIR}`);
    } catch (error) {
      console.error("❌ Diretório estático não encontrado:", error);
      process.exit(1);
    }
  }

  console.log("📡 Aguardando conexões de clientes...\n");
});

// // Tratar sinais de encerramento
// process.on("SIGINT", () => {
//   console.log("\n\n⚠️  Recebido sinal SIGINT (Ctrl+C)");
//   console.log("🛑 Finalizando servidor graciosamente...");

//   wss.close(() => {
//     server.close(() => {
//       console.log("✅ Servidor finalizado");
//       process.exit(0);
//     });
//   });
// });

// process.on("SIGTERM", () => {
//   console.log("\n\n⚠️  Recebido sinal SIGTERM");
//   console.log("🛑 Finalizando servidor graciosamente...");

//   server.close(() => {
//     wss.close(() => {
//       console.log("✅ Servidor finalizado");
//       process.exit(0);
//     });
//   });
// });
