# 🔄 Guia de Migração para Monorepo

## ✅ O que foi configurado

Seu projeto foi transformado em um **monorepo** usando **npm workspaces**!

### 📁 Estrutura

```
api-fake-web-socket-react/
├── package.json              ← RAIZ (gerencia workspaces)
├── node_modules/             ← Compartilhado por todos
├── shared-types/
│   ├── package.json
│   └── src/
├── backend/
│   ├── package.json
│   └── src/
└── frontend-redux/
    ├── package.json
    └── src/
```

### 🔗 Workspaces configurados

- `shared-types` → `@websocket-app/shared-types`
- `backend` → Agora usa `@websocket-app/shared-types` automaticamente
- `frontend-redux` → Agora usa `@websocket-app/shared-types` automaticamente

## 🚀 Próximos Passos

### 1️⃣ Execute o Setup (OBRIGATÓRIO)

```bash
./setup-monorepo.sh
```

Este script irá:

- 🧹 Limpar instalações antigas
- 📦 Instalar todas as dependências de uma vez
- 🔗 Criar symlinks automáticos entre workspaces

### 2️⃣ Verifique a instalação

```bash
ls -la node_modules/@websocket-app/
# Deve mostrar: shared-types -> ../../shared-types
```

### 3️⃣ Inicie o desenvolvimento

#### Opção A: Tudo em paralelo (Recomendado)

```bash
npm run dev:all
# ou
./dev-all.sh
```

#### Opção B: Individual

```bash
# Terminal 1
npm run dev:shared

# Terminal 2
npm run dev:backend

# Terminal 3
npm run dev:frontend
```

## 📋 Comandos Disponíveis

### Na raiz do projeto

```bash
# Instalação
npm install                  # Instala tudo de uma vez

# Desenvolvimento
npm run dev:all              # Todos os serviços em paralelo
npm run dev:shared           # Watch mode para shared-types
npm run dev:backend          # Backend dev server
npm run dev:frontend         # Frontend dev server

# Build
npm run build:all            # Build de todos os projetos
npm run build:shared         # Build apenas shared-types
npm run build:backend        # Build apenas backend
npm run build:frontend       # Build apenas frontend

# Produção
npm run start:prod           # Build tudo e inicia backend

# Limpeza
npm run clean                # Remove builds
./clean-monorepo.sh          # Limpeza completa
```

## 🔧 O que mudou

### ❌ ANTES (sem monorepo)

```bash
# Instalação separada
cd shared-types && npm install
cd backend && npm install
cd frontend-redux && npm install

# Link manual necessário
npm link @websocket-app/shared-types

# Desenvolvimento
cd backend && npm run dev        # Terminal 1
cd frontend-redux && npm run dev # Terminal 2
```

### ✅ DEPOIS (com monorepo)

```bash
# Instalação única
npm install

# Link automático (npm workspaces faz isso!)
# Nenhum comando necessário!

# Desenvolvimento
npm run dev:all  # Tudo de uma vez!
```

## 📦 Como funciona a instalação

```
Executa: npm install na RAIZ
    ↓
Lê todos os package.json:
- /package.json (raiz)
- /shared-types/package.json
- /backend/package.json
- /frontend-redux/package.json
    ↓
Instala tudo em: /node_modules/
    ↓
Cria symlink: /node_modules/@websocket-app/shared-types → ../../shared-types
    ↓
✅ Pronto! Todos os projetos acessam as dependências da raiz
```

## 🎯 Vantagens

✅ **Uma instalação** - `npm install` na raiz instala tudo  
✅ **Symlinks automáticos** - Não precisa mais de `npm link`  
✅ **Dependências deduplicadas** - TypeScript instalado 1x, usado por todos  
✅ **Scripts centralizados** - Rodar tudo com 1 comando  
✅ **Desenvolvimento paralelo** - `npm run dev:all` inicia tudo

## ⚠️ Importante

### ❌ NÃO faça mais:

```bash
cd backend && npm install express        # ❌ Evite
npm link @websocket-app/shared-types     # ❌ Não precisa
./link_shhared_types.sh                  # ❌ Obsoleto
```

### ✅ Faça assim:

```bash
# Instalar nova dependência no backend
npm install express --workspace=backend

# Ou dentro do workspace
cd backend
npm install express

# O package fica em /node_modules/express/
# E é registrado em backend/package.json
```

## 🧪 Teste se funcionou

```bash
# 1. Setup
./setup-monorepo.sh

# 2. Verificar symlink
ls -la node_modules/@websocket-app/shared-types
# Deve mostrar: ... -> ../../shared-types

# 3. Testar desenvolvimento
npm run dev:all

# 4. Verificar que todos os serviços iniciaram:
# - SHARED: Watching for file changes
# - BACKEND: WebSocket server rodando
# - FRONTEND: Vite dev server rodando
```

## 📝 Arquivos criados

- ✅ `/package.json` - Configuração do monorepo raiz
- ✅ `/setup-monorepo.sh` - Script de setup completo
- ✅ `/clean-monorepo.sh` - Script de limpeza
- ✅ `/dev-all.sh` - Script de desenvolvimento
- ✅ `/MONOREPO_MIGRATION.md` - Este guia

## 🗑️ Arquivos obsoletos

Estes arquivos não são mais necessários:

- ❌ `link_shhared_types.sh` - Substituído por npm workspaces

## 🆘 Problemas?

### Erro: "Cannot find module '@websocket-app/shared-types'"

```bash
./clean-monorepo.sh
./setup-monorepo.sh
```

### Erro: "concurrently: command not found"

```bash
npm install
```

### Serviços não iniciam com dev:all

Execute individualmente:

```bash
npm run dev:shared
npm run dev:backend
npm run dev:frontend
```

## 🎉 Pronto!

Seu projeto agora é um monorepo! Execute:

```bash
./setup-monorepo.sh
npm run dev:all
```

E comece a desenvolver! 🚀
