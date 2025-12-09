# 🔌 WebSocket App - Monorepo

Aplicação WebSocket completa com React e Node.js em TypeScript, organizada como **monorepo** usando **npm workspaces**.

## 🎯 Característica Principal

**O servidor backend é completamente finalizado quando o último cliente desconecta** (ex: quando o navegador é fechado).

## 📦 Estrutura do Monorepo

```
api-fake-web-socket-react/
├── package.json              ← Raiz (gerencia workspaces)
├── node_modules/             ← Compartilhado por todos
│
├── shared/             ← Tipos TypeScript compartilhados
│   ├── src/
│   │   ├── messages.ts       # Tipos de mensagens WebSocket
│   │   ├── guards.ts         # Type guards e validadores
│   │   ├── config.ts         # Interfaces de configuração
│   │   └── index.ts
│   └── package.json          # @app/shared
│
├── backend/                  ← Servidor WebSocket Node.js
│   ├── src/
│   │   └── server.ts
│   └── package.json
│
└── frontend-redux/           ← Cliente React com Redux Toolkit
    ├── src/
    │   ├── store/
    │   │   ├── websocketSlice.ts
    │   │   ├── store.ts
    │   │   └── middleware/
    │   │       └── websocketMiddleware.ts
    │   └── App.tsx
    └── package.json
```

## 🚀 Quick Start

### 1️⃣ Setup (Primeira vez)

```bash
./setup-monorepo.sh
```

Este comando irá:

- 🧹 Limpar instalações antigas (se existirem)
- 📦 Instalar todas as dependências de uma vez
- 🔗 Criar symlinks automáticos entre workspaces

### 2️⃣ Desenvolvimento

```bash
npm run dev:all
```

Isso inicia automaticamente:

- **SHARED** (cyan): Watch mode para shared
- **BACKEND** (green): WebSocket server (porta 8080)
- **FRONTEND** (blue): Vite dev server (porta 3001)

**URLs:**

- Frontend: `http://localhost:3001` (abre automaticamente no Firefox)
- Backend WebSocket: `ws://localhost:8080`

### 3️⃣ Produção

```bash
npm run start:prod
```

Acesse: `http://localhost:8080` (HTTP + WebSocket na mesma porta!)

## 📋 Comandos Disponíveis

```bash
# Instalação
npm install                    # Instala tudo de uma vez

# Desenvolvimento
npm run dev:all                # Todos os serviços em paralelo
npm run dev:shared             # Watch mode para shared
npm run dev:backend            # Backend dev server
npm run dev:frontend           # Frontend dev server

# Build
npm run build:all              # Build de todos os projetos
npm run build:shared           # Build apenas shared
npm run build:backend          # Build apenas backend
npm run build:frontend         # Build apenas frontend

# Produção
npm run start:prod             # Build + start backend

# Limpeza
npm run clean                  # Remove builds
./clean-monorepo.sh            # Limpeza completa + reinstalação
```

## 🎯 Vantagens do Monorepo

✅ **Instalação única** - `npm install` na raiz instala todas as dependências  
✅ **Symlinks automáticos** - Não precisa de `npm link` manual  
✅ **Tipos compartilhados** - `@app/shared` sincronizado automaticamente  
✅ **Dependências deduplicadas** - TypeScript, etc. instalados 1x, usados por todos  
✅ **Scripts centralizados** - Controle tudo da raiz  
✅ **Desenvolvimento paralelo** - `npm run dev:all` inicia todos os serviços

## 🔧 Como Adicionar Dependências

### Instalar em um workspace específico

```bash
# Da raiz
npm install express --workspace=@app/backend
npm install axios --workspace=@app/frontend-redux

# Ou dentro do workspace
cd backend
npm install express
```

### Instalar em todos os workspaces

```bash
npm install prettier --workspaces
```

### Instalar apenas na raiz

```bash
npm install husky --save-dev
```

## 📊 Fluxo de Comunicação WebSocket

```
Cliente (Redux)                 Servidor
     |                             |
     |------ connectRequest ------>|
     |<----- WelcomeMessage -------|
     |                             |
     |<----- Heartbeat (5s) -------|
     |<----- Heartbeat (5s) -------|
     |                             |
     |------ sendMessage --------->|
     |<----- ResponseMessage ------|
     |                             |
     |------ disconnect ---------->|
     |                             |
     |                       [Finaliza]
```

## 🔧 Funcionalidades

### Backend

- ✅ Servidor WebSocket com biblioteca `ws`
- ✅ Finalização automática ao desconectar clientes
- ✅ Heartbeat a cada 5 segundos
- ✅ Serve arquivos estáticos em produção
- ✅ Usa tipos de `@app/shared`

### Frontend-Redux

- ✅ Redux Toolkit para gerenciamento de estado
- ✅ Custom Middleware para WebSocket
- ✅ Auto-conexão ao carregar (suporte React Strict Mode)
- ✅ Interface moderna e responsiva
- ✅ Redux DevTools integration

### Shared-Types

- ✅ Tipos TypeScript para mensagens WebSocket
- ✅ Type guards e validadores
- ✅ Sincronização automática entre projetos
- ✅ Watch mode para desenvolvimento

## 🧪 Testar se funcionou

```bash
# 1. Verificar symlink
ls -la node_modules/@app/shared
# Deve mostrar: ... -> ../../shared

# 2. Iniciar desenvolvimento
npm run dev:all

# 3. Abrir navegador (abre automaticamente)
# http://localhost:3001

# 4. Conectar e enviar mensagens
```

## 📚 Documentação

- 📖 [MONOREPO_MIGRATION.md](./MONOREPO_MIGRATION.md) - Guia completo de migração
- 📖 [COMPARISON.md](./COMPARISON.md) - Comparação useState vs Redux
- 📖 [frontend-redux/README.md](./frontend-redux/README.md) - Docs do Redux

## 🛠️ Scripts Bash

```bash
./setup-monorepo.sh    # Setup completo (limpeza + instalação)
./clean-monorepo.sh    # Limpeza completa
./dev-all.sh           # Desenvolvimento em paralelo
```

## 🧰 Stack Tecnológica

### Backend

- Node.js 16+
- TypeScript 5.2
- ws (WebSocket)
- http (HTTP Server)

### Frontend

- React 18.2
- TypeScript 5.2
- Redux Toolkit 2.0
- Vite 5.0

### DevOps

- npm workspaces
- concurrently
- nodemon
- ts-node

## ⚠️ Nota sobre Auto-Terminação

Em **desenvolvimento**, o servidor finaliza automaticamente quando o último cliente desconecta.

Para **produção real**, você pode querer remover o `process.exit(0)` do evento `close` do WebSocket em `backend/src/server.ts`.

## 📝 Licença

ISC

## 👨‍💻 Autor

Desenvolvido com ❤️ usando TypeScript, Node.js, React e Redux Toolkit em monorepo!
