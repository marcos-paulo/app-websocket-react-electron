# Electron App

Aplicação Electron simples para empacotar o frontend React como aplicação desktop.

## Estrutura

- **src/main.ts**: Processo principal do Electron (main process)
- **src/preload.ts**: Script de preload para comunicação segura entre main e renderer

## Scripts

- `npm run build`: Compila o TypeScript
- `npm run dev`: Compila e inicia a aplicação em modo desenvolvimento
- `npm start`: Inicia a aplicação (requer build prévio)
- `npm run watch`: Compila em modo watch
- `npm run package`: Gera o executável da aplicação

## Como usar

### Desenvolvimento

1. Certifique-se de que o frontend está rodando:

   ```bash
   npm run dev:frontend
   ```

2. Em outro terminal, execute o Electron:
   ```bash
   npm run dev --workspace=@websocket-app/electron-app
   ```

### Produção

Para gerar o executável:

```bash
npm run package --workspace=@websocket-app/electron-app
```

O executável será gerado em `workspaces/electron-app/release/`.

## Configuração

A aplicação carrega o frontend do servidor de desenvolvimento (http://localhost:5173) por padrão.
Para alterar a URL, defina a variável de ambiente `FRONTEND_URL`.
