# Guia Rápido - Aplicação Electron

## 📦 Estrutura do Monorepo

O projeto agora inclui **4 workspaces**:

1. **shared**: Tipos TypeScript compartilhados
2. **backend**: Servidor WebSocket (Node.js + TypeScript)
3. **frontend-redux**: Aplicação React com Redux
4. **electron-app**: Aplicação desktop Electron

## 🚀 Como usar o Electron

### Opção 1: Usando o script auxiliar

```bash
./start-electron.sh
```

Este script iniciará automaticamente:

- Backend (servidor WebSocket na porta 8080)
- Frontend (Vite dev server na porta 5173)
- Electron (aplicação desktop)

### Opção 2: Comandos individuais

#### Desenvolvimento com Electron

```bash
# Inicia tudo (backend + frontend + electron)
npm run dev:with-electron

# Ou inicie cada um separadamente:
npm run dev:backend    # Terminal 1
npm run dev:frontend   # Terminal 2
npm run dev:electron   # Terminal 3
```

#### Apenas o Electron (requer frontend já rodando)

```bash
npm run dev:electron
```

#### Build do Electron

```bash
npm run build:electron
```

#### Gerar executável

```bash
npm run package:electron
```

O executável será gerado em `workspaces/electron-app/release/`

## 🏗️ Estrutura do Projeto Electron

```
electron-app/
├── src/
│   ├── main.ts      # Processo principal do Electron
│   └── preload.ts   # Script de preload (ponte segura)
├── dist/            # Arquivos compilados
├── release/         # Executáveis gerados
├── package.json
├── tsconfig.json
└── README.md
```

## ⚙️ Características

### Processo Principal (main.ts)

- Cria a janela da aplicação (1200x800)
- Carrega o frontend do servidor Vite (dev) ou build (prod)
- Abre DevTools em desenvolvimento
- Gerencia o ciclo de vida da aplicação

### Preload Script (preload.ts)

- Expõe APIs seguras para o renderer process
- Fornece informações sobre a plataforma e versões
- Usa contextBridge para segurança

### Configuração

- **TypeScript**: Compilação strict
- **Context Isolation**: Habilitado (segurança)
- **Node Integration**: Desabilitado (segurança)
- **DevTools**: Habilitado em desenvolvimento

## 🔧 Variáveis de Ambiente

- `FRONTEND_URL`: URL do frontend (padrão: http://localhost:5173)
- `NODE_ENV`: Define o modo (development/production)

## 📝 Scripts Disponíveis

### No diretório raiz:

```bash
npm run dev:with-electron    # Dev: tudo incluindo Electron
npm run dev:electron          # Dev: apenas Electron
npm run build:electron        # Build: compila TypeScript
npm run package:electron      # Gera executável da aplicação
```

### No workspace electron-app:

```bash
npm run build     # Compila TypeScript
npm run dev       # Compila e inicia
npm run start     # Inicia (requer build)
npm run watch     # Compila em modo watch
npm run package   # Gera executável
```

## 🎯 Próximos Passos

1. **Teste a aplicação**:

   ```bash
   ./start-electron.sh
   ```

2. **Personalize a janela**: Edite `workspaces/electron-app/src/main.ts`

3. **Adicione funcionalidades**: Use IPC para comunicação entre processos

4. **Gere o executável**:
   ```bash
   npm run package:electron
   ```

## 🐛 Troubleshooting

### Electron não inicia

- Certifique-se de que o frontend está rodando na porta 5173
- Verifique se as dependências foram instaladas: `npm install`

### Build falha

- Execute: `npm run build:electron`
- Verifique erros de TypeScript

### Tela branca no Electron

- Verifique se o frontend está acessível em http://localhost:5173
- Abra o DevTools no Electron para ver erros (Ctrl+Shift+I)

## 📚 Recursos

- [Documentação Electron](https://www.electronjs.org/docs)
- [Electron Security](https://www.electronjs.org/docs/tutorial/security)
- [Electron Builder](https://www.electron.build/)
