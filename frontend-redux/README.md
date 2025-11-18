# 🔌 WebSocket Client com Redux Toolkit

Versão do WebSocket Client que utiliza **Redux Toolkit** para gerenciamento de estado, seguindo as melhores práticas recomendadas pela equipe do Redux.

## 🎯 Diferenças do Frontend Original

| Frontend Original               | Frontend Redux           |
| ------------------------------- | ------------------------ |
| `useState` e `useCallback`      | Redux Store centralizado |
| Hook customizado `useWebSocket` | Redux Slice + Middleware |
| Estado local no componente      | Estado global gerenciado |
| Lógica no hook                  | Lógica no middleware     |

## 🏗️ Arquitetura Redux Toolkit

### 📁 Estrutura de Diretórios

```
frontend-redux/
├── src/
│   ├── store/
│   │   ├── websocketSlice.ts      # Redux Slice (Actions + Reducer)
│   │   ├── store.ts                # Configuração do Store
│   │   ├── hooks.ts                # Hooks tipados (useAppDispatch, useAppSelector)
│   │   └── middleware/
│   │       └── websocketMiddleware.ts  # Middleware customizado para WebSocket
│   ├── hooks/
│   │   └── useAutoConnect.ts       # Hook para auto-conexão
│   ├── types/
│   │   └── websocket.types.ts      # Tipos TypeScript
│   ├── App.tsx                     # Componente principal
│   ├── App.css                     # Estilos
│   └── main.tsx                    # Entry point com Provider
```

## 🔧 Componentes Principais

### 1️⃣ **WebSocket Slice** (`websocketSlice.ts`)

Slice do Redux Toolkit que define:

- **Estado inicial**
- **Reducers** para atualizar o estado
- **Actions** para despachar eventos

```typescript
const websocketSlice = createSlice({
  name: "websocket",
  initialState,
  reducers: {
    connectRequest,
    connectSuccess,
    connectFailure,
    disconnectRequest,
    disconnected,
    sendMessage,
    messageReceived,
    clearMessages,
  },
});
```

### 2️⃣ **WebSocket Middleware** (`websocketMiddleware.ts`)

Middleware customizado que intercepta actions e gerencia a conexão WebSocket:

- Intercepta `connectRequest` → Cria conexão WebSocket
- Gerencia eventos do WebSocket (`onopen`, `onmessage`, `onerror`, `onclose`)
- Despacha actions apropriadas baseadas nos eventos
- Previne múltiplas conexões (Strict Mode)

```typescript
export const websocketMiddleware: Middleware =
  (store) => (next) => (action) => {
    if (connectRequest.match(action)) {
      // Criar conexão WebSocket
      // Configurar event listeners
      // Despachar connectSuccess ou connectFailure
    }
    return next(action);
  };
```

### 3️⃣ **Store** (`store.ts`)

Configuração do Redux Store com:

- Reducer do WebSocket
- Middleware customizado
- TypeScript types inferidos

```typescript
export const store = configureStore({
  reducer: {
    websocket: websocketReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["websocket/connectSuccess"],
        ignoredPaths: ["websocket.wsInstance"],
      },
    }).concat(websocketMiddleware),
});
```

### 4️⃣ **Hooks Tipados** (`hooks.ts`)

Hooks tipados para usar em toda aplicação:

```typescript
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
```

### 5️⃣ **App Component** (`App.tsx`)

Componente React que consome o estado do Redux:

```typescript
const { messages, connectionStatus, error } = useAppSelector(
  (state) => state.websocket
);

const handleConnect = () => {
  dispatch(connectRequest(WEBSOCKET_URL));
};
```

## 🚀 Como Executar

### 1️⃣ Instalar Dependências

```bash
cd frontend-redux
npm install
```

### 2️⃣ Executar em Desenvolvimento

```bash
npm run dev
```

Acesse: `http://localhost:3001`

### 3️⃣ Build para Produção

```bash
npm run build
```

## 📦 Dependências Principais

```json
{
  "@reduxjs/toolkit": "^2.0.1",
  "react-redux": "^9.0.4",
  "react": "^18.2.0",
  "typescript": "^5.2.2"
}
```

## 🎯 Melhores Práticas Implementadas

### ✅ Redux Toolkit

1. **`createSlice`** - Reduz boilerplate
2. **Immer** - Mutations "imutáveis" automáticas
3. **TypeScript** - Type-safe em todo código
4. **Middleware customizado** - Lógica de side effects

### ✅ TypeScript

1. **Tipos inferidos** - `RootState` e `AppDispatch`
2. **Hooks tipados** - `useAppDispatch` e `useAppSelector`
3. **Interfaces** - Para mensagens e estado

### ✅ React

1. **Strict Mode** - Detecta problemas
2. **Hooks** - `useCallback`, `useState`
3. **Provider** - Redux Provider no root

### ✅ Arquitetura

1. **Separação de responsabilidades**

   - UI (Components)
   - Estado (Redux Slice)
   - Side Effects (Middleware)
   - Tipos (Types)

2. **Single Source of Truth**

   - Todo estado em um único store

3. **Previsibilidade**
   - Actions descritivas
   - Reducers puros
   - Time-travel debugging possível

## 🔄 Fluxo de Dados

```
┌─────────────┐
│  Component  │
└──────┬──────┘
       │ dispatch(action)
       ▼
┌─────────────┐
│ Middleware  │◄──── WebSocket Events
└──────┬──────┘
       │ dispatch(action)
       ▼
┌─────────────┐
│   Reducer   │
└──────┬──────┘
       │ new state
       ▼
┌─────────────┐
│    Store    │
└──────┬──────┘
       │ useSelector
       ▼
┌─────────────┐
│  Component  │ (re-render)
└─────────────┘
```

## 🆚 Comparação: useState vs Redux

### Com useState (Frontend Original)

```typescript
const [messages, setMessages] = useState([]);
const [status, setStatus] = useState("disconnected");

// Lógica no hook customizado
const { messages, status, connect } = useWebSocket(url);
```

### Com Redux (Frontend Redux)

```typescript
// Estado global acessível de qualquer lugar
const { messages, status } = useAppSelector((state) => state.websocket);

// Actions despachadas
dispatch(connectRequest(url));
dispatch(sendMessage("Hello"));
```

### Vantagens do Redux

✅ Estado compartilhado entre componentes  
✅ DevTools para debug  
✅ Middleware para side effects  
✅ Previsibilidade e testabilidade  
✅ Time-travel debugging  
✅ Persistência fácil (redux-persist)

### Quando usar Redux?

- ✅ Estado compartilhado por muitos componentes
- ✅ Estado global complexo
- ✅ Lógica de atualização complexa
- ✅ Necessidade de debug avançado
- ❌ Apps pequenos e simples (overhead desnecessário)

## 📚 Recursos Adicionais

- [Redux Toolkit Docs](https://redux-toolkit.js.org/)
- [Redux Style Guide](https://redux.js.org/style-guide/)
- [React-Redux Hooks](https://react-redux.js.org/api/hooks)

## 🤝 Comparação com Frontend Original

Ambas as implementações têm a mesma funcionalidade:

- ✅ Conexão WebSocket automática
- ✅ Envio e recebimento de mensagens
- ✅ Status de conexão visual
- ✅ Suporte ao Strict Mode
- ✅ Cleanup adequado

A diferença está na **arquitetura de gerenciamento de estado**! 🎯
