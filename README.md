# 🔌 Aplicação WebSocket com React e TypeScript

Esta é uma aplicação completa de WebSocket que demonstra comunicação bidirecional entre um servidor backend Node.js e um cliente frontend React, ambos escritos em TypeScript.

## 🎯 Característica Principal

**O servidor backend é completamente finalizado quando o último cliente desconecta** (por exemplo, quando o navegador é fechado). Esta é uma característica única desta implementação.

## 📁 Estrutura do Projeto

```
api-fake-web-socket-react/
├── backend/           # Servidor WebSocket (Node.js + TypeScript)
│   ├── src/
│   │   └── server.ts
│   ├── package.json
│   └── tsconfig.json
└── frontend/          # Cliente React (React + TypeScript + Vite)
    ├── src/
    │   ├── hooks/
    │   │   └── useWebSocket.ts
    │   ├── App.tsx
    │   ├── App.css
    │   └── main.tsx
    ├── package.json
    └── tsconfig.json
```

## 🚀 Como Executar

### Pré-requisitos

- Node.js (versão 16 ou superior)
- npm ou yarn

### 🔧 Modo Desenvolvimento

#### 1️⃣ Instalar Dependências

**Backend:**

```bash
cd backend
npm install
```

**Frontend:**

```bash
cd frontend
npm install
```

#### 2️⃣ Executar o Backend

Em um terminal, execute:

```bash
cd backend
npm run dev
```

O servidor WebSocket estará rodando em `ws://localhost:8080`

#### 3️⃣ Executar o Frontend

Em outro terminal, execute:

```bash
cd frontend
npm run dev
```

O cliente React estará acessível em `http://localhost:3000`

---

### 🚀 Modo Produção

Em produção, o backend serve os arquivos estáticos do frontend compilado.

#### 1️⃣ Build e Execução Completa

No diretório `backend`, execute:

```bash
cd backend
npm run start:prod
```

Este comando irá:

1. Compilar o backend TypeScript
2. Compilar o frontend React
3. Iniciar o servidor em modo produção na porta 8080

Acesse: `http://localhost:8080` (HTTP e WebSocket na mesma porta!)

#### 2️⃣ Build Manual (alternativo)

```bash
# Build do backend
cd backend
npm run build

# Build do frontend
cd ../frontend
npm run build

# Iniciar servidor em produção
cd ../backend
npm start
```

#### 3️⃣ Variáveis de Ambiente

Crie um arquivo `.env` no diretório `backend`:

```env
NODE_ENV=production
PORT=8080
```

## 💡 Como Usar

1. Abra o navegador em `http://localhost:3000`
2. Clique no botão "Conectar" para estabelecer conexão com o servidor WebSocket
3. O servidor enviará mensagens de heartbeat a cada 5 segundos
4. Digite mensagens no campo de texto e clique em "Enviar" para enviar ao servidor
5. O servidor responderá confirmando o recebimento
6. **Feche a aba do navegador ou clique em "Desconectar"** - o servidor backend será automaticamente finalizado!

## 🔧 Funcionalidades

### Backend (server.ts)

- ✅ Servidor WebSocket usando biblioteca `ws`
- ✅ Contador de clientes conectados
- ✅ Envio de heartbeat a cada 5 segundos
- ✅ Recebimento e resposta de mensagens do cliente
- ✅ **Finalização automática quando todos os clientes desconectam**
- ✅ Logs detalhados de conexões e mensagens

### Frontend (App.tsx)

- ✅ Hook customizado `useWebSocket` para gerenciar conexões
- ✅ Interface visual responsiva e moderna
- ✅ Status de conexão em tempo real
- ✅ Histórico de mensagens recebidas
- ✅ Envio de mensagens para o servidor
- ✅ Cleanup automático ao desmontar componente

## 📊 Fluxo de Comunicação

```
Cliente                          Servidor
  |                                 |
  |-------- Conectar -------------->|
  |<------- Welcome Message --------|
  |                                 |
  |<------- Heartbeat (5s) ---------|
  |<------- Heartbeat (5s) ---------|
  |                                 |
  |-------- Mensagem -------------->|
  |<------- Resposta ---------------|
  |                                 |
  |-------- Desconectar ----------->|
  |                                 |
  |                           [Finaliza]
```

## 🛠️ Scripts Disponíveis

### Backend

- `npm run dev` - Executa em modo desenvolvimento com ts-node
- `npm run build` - Compila TypeScript para JavaScript
- `npm start` - Executa versão compilada

### Frontend

- `npm run dev` - Inicia servidor de desenvolvimento Vite
- `npm run build` - Cria build de produção
- `npm run preview` - Visualiza build de produção

## 📦 Dependências Principais

### Backend

- `ws` - Biblioteca WebSocket para Node.js
- `typescript` - Suporte TypeScript
- `@types/ws` - Tipos TypeScript para ws

### Frontend

- `react` - Biblioteca UI
- `vite` - Build tool e dev server
- `typescript` - Suporte TypeScript

## 🎨 Características da Interface

- 🎨 Design moderno com gradiente
- 📊 Status de conexão visual (conectado/desconectado/erro)
- 💬 Histórico de mensagens com tipos diferenciados
- ⏱️ Timestamps em todas as mensagens
- 📱 Interface responsiva para mobile

## ⚠️ Comportamento Importante

Esta aplicação foi projetada para **finalizar o servidor backend automaticamente** quando o último cliente desconecta. Isto é útil para:

- Ambientes de desenvolvimento onde você quer que o servidor se encerre automaticamente
- Demonstrações e testes
- Aplicações que precisam ser reiniciadas a cada sessão

**Nota:** Em produção, normalmente você NÃO quer que o servidor finalize automaticamente. Remova o código de `process.exit(0)` no evento `close` do WebSocket para comportamento de produção.

## 📝 Licença

ISC

## 👨‍💻 Autor

Desenvolvido com ❤️ usando TypeScript, Node.js e React
