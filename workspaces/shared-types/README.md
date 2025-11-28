# @websocket-app/shared-types

Tipos TypeScript compartilhados para comunicação WebSocket entre frontend e backend.

## 📦 Instalação

Este pacote é usado localmente através de link simbólico:

```bash
# No diretório shared-types
npm install
npm run build

# Criar link simbólico
npm link

# No backend
cd ../backend
npm link @websocket-app/shared-types

# No frontend
cd ../frontend
npm link @websocket-app/shared-types

# No frontend-redux
cd ../frontend-redux
npm link @websocket-app/shared-types
```

## 🎯 Uso

### Backend (Node.js)

```typescript
import {
  ServerMessage,
  ClientMessage,
  WelcomeMessage,
  isClientMessageType,
  createTimestamp,
} from "@websocket-app/shared-types";

// Enviar mensagem tipada
const welcomeMsg: WelcomeMessage = {
  type: "welcome",
  message: "Bem-vindo!",
  timestamp: createTimestamp(),
};

ws.send(JSON.stringify(welcomeMsg));

// Receber e validar mensagem
ws.on("message", (data: Buffer) => {
  const message: ClientMessage = JSON.parse(data.toString());

  if (isClientMessageType(message.type)) {
    // Mensagem válida
  }
});
```

### Frontend (React + TypeScript)

```typescript
import {
  ClientMessage,
  ServerMessage,
  ClientTextMessage,
  isServerMessageType,
} from "@websocket-app/shared-types";

// Enviar mensagem tipada
const message: ClientTextMessage = {
  type: "message",
  text: "Olá servidor!",
  timestamp: new Date().toISOString(),
};

ws.send(JSON.stringify(message));

// Receber mensagem
ws.onmessage = (event) => {
  const data: ServerMessage = JSON.parse(event.data);

  switch (data.type) {
    case "welcome":
      console.log(data.message);
      break;
    case "heartbeat":
      console.log("Uptime:", data.serverUptime);
      break;
  }
};
```

## 📋 Tipos Disponíveis

### Mensagens do Servidor → Cliente

- `WelcomeMessage` - Boas-vindas ao conectar
- `HeartbeatMessage` - Keep-alive periódico
- `ResponseMessage` - Resposta a uma mensagem do cliente
- `ErrorMessage` - Mensagem de erro
- `NotificationMessage` - Notificação genérica
- `ServerDisconnectMessage` - Aviso de desconexão

### Mensagens do Cliente → Servidor

- `ClientTextMessage` - Mensagem de texto
- `ClientPingMessage` - Ping (keep-alive)
- `ClientCommandMessage` - Comando
- `ClientDisconnectMessage` - Aviso de desconexão

### Enums

- `WebSocketReadyState` - Estados do WebSocket (0-3)
- `WebSocketCloseCode` - Códigos de fechamento RFC 6455

### Helpers

- `isServerMessageType()` - Valida tipo de mensagem do servidor
- `isClientMessageType()` - Valida tipo de mensagem do cliente
- `isValidMessage()` - Valida estrutura básica de mensagem
- `createTimestamp()` - Gera timestamp ISO

## 🔧 Scripts

```bash
npm run build   # Compilar TypeScript
npm run watch   # Compilar em modo watch
npm run clean   # Limpar diretório dist
```

## 📁 Estrutura

```
shared-types/
├── src/
│   ├── index.ts       # Export principal
│   ├── messages.ts    # Tipos de mensagens
│   ├── guards.ts      # Type guards e helpers
│   └── config.ts      # Configurações e interfaces
├── dist/              # Arquivos compilados
├── package.json
└── tsconfig.json
```

## 🎯 Benefícios

✅ **Type-safety** - Tipos compartilhados entre front e back  
✅ **Consistência** - Uma única fonte de verdade  
✅ **Autocomplete** - IntelliSense completo no VS Code  
✅ **Validação** - Type guards para runtime validation  
✅ **Documentação** - JSDoc em todos os tipos  
✅ **Manutenibilidade** - Mudanças em um único lugar

## 📝 Licença

ISC
