import WebSocket, { WebSocketServer } from "ws";
import http from "http";
import fs from "fs";
import path from "path";
import {
  ServerMessageType,
  isClientMessageType,
} from "@websocket-app/shared-types";

const a: ServerMessageType = "welcome";

isClientMessageType("message");

class Server {
  private PORT = process.env.PORT || 8080;
  private NODE_ENV = process.env.NODE_ENV || "development";
  private STATIC_DIR = path.join(__dirname, "../../frontend-redux/dist");
  private INDEX_FILE_NAME = "index.html";
  private INDEX_FILE_PATH = path.join(this.STATIC_DIR, this.INDEX_FILE_NAME);

  // MIME types para servir arquivos estáticos
  private MIME_TYPES: { [key: string]: string } = {
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

  server!: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>;

  static builder() {
    const server = new Server();
    server.criarServidor();
    server.criarServidorWebSocket();
    server.iniciarServidor();
    return server;
  }

  criarServidor() {
    console.info("⚙️ Configurando Servidor HTTP...");

    // Criar servidor HTTP que serve arquivos estáticos em produção
    this.server = http.createServer((req, res) => {
      // Em produção, servir arquivos estáticos
      if (this.NODE_ENV === "production") {
        let filePath = path.join(
          this.STATIC_DIR,
          req.url === "/" ? this.INDEX_FILE_NAME : req.url || ""
        );

        // Se o arquivo não existir, servir index.html (SPA routing)
        if (!fs.existsSync(filePath)) {
          console.log(
            `⚠️ Arquivo ${filePath} não encontrado, servindo index.html`
          );
          filePath = this.INDEX_FILE_PATH;
        }

        const extname = String(path.extname(filePath)).toLowerCase();
        const contentType =
          this.MIME_TYPES[extname] || "application/octet-stream";

        fs.readFile(filePath, (error, content) => {
          if (error) {
            if (error.code === "ENOENT") {
              res.writeHead(404, {
                "Content-Type": "text/html; charset=utf-8",
              });
              res.end("<h1>404 - Página não encontrada</h1>", "utf-8");
            } else {
              res.writeHead(500, {
                "Content-Type": "text/html; charset=utf-8",
              });
              res.end(`Erro no servidor: ${error.code}`, "utf-8");
            }
          } else {
            res.writeHead(200, { "Content-Type": contentType });
            res.end(content, "utf-8");
          }
        });
      } else {
        console.log("⚠️ Modo desenvolvimento");
        // Em desenvolvimento, retornar mensagem
        res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
        res.end(
          "<h1>WebSocket Server</h1><p>Servidor rodando em modo desenvolvimento. Use o frontend separadamente.</p>"
        );
      }
    });
  }

  private CLIENT_COUNT = 0;

  private wss!: WebSocketServer;

  sendMessageToAllClients(message: string) {
    this.wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }

  criarServidorWebSocket() {
    console.log(`⚙️ Configurando WebSocket server na porta ${this.PORT}...`);
    this.wss = new WebSocketServer({ server: this.server });

    this.wss.on("connection", (ws: WebSocket) => {
      this.CLIENT_COUNT++;
      console.log(
        `✅ Cliente conectado! Total de clientes: ${this.CLIENT_COUNT}`
      );

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
        this.CLIENT_COUNT--;
        console.log(
          `❌ Cliente desconectado! Total de clientes: ${this.CLIENT_COUNT}`
        );
        clearInterval(interval);

        // FINALIZAR O SERVIDOR QUANDO TODOS OS CLIENTES DESCONECTAREM
        // if (this.CLIENT_COUNT === 0) {
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
  }

  verificarExixtenciaArquivosEstaticos() {
    if (this.NODE_ENV === "production") {
      try {
        fs.existsSync(this.STATIC_DIR);
        console.log(`📁 Servindo arquivos estáticos de: ${this.STATIC_DIR}`);
      } catch (error) {
        console.error("❌ Diretório estático não encontrado:", error);
        process.exit(1);
      }

      try {
        fs.existsSync(this.INDEX_FILE_PATH);
      } catch (error) {
        console.error("❌ \x1b[31mArquivo index.html não encontrado:\x1b[0m");
        console.error(error);
        process.exit(1);
      }
    }
  }

  iniciarServidor() {
    // prettier-ignore
    this.server.listen(this.PORT, () => {
      console.log(`✅ Servidor rodando em modo: ${this.NODE_ENV}`);
      console.log(`✅ Servidor HTTP rodando em http://localhost:${this.PORT}`);
      console.log(`✅ Servidor WebSocket rodando em ws://localhost:${this.PORT}`);

      this.verificarExixtenciaArquivosEstaticos();

      console.log("📡 Aguardando conexões de clientes...\n");
    });
  }
}

Server.builder();

// Iniciar servidor HTTP

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
