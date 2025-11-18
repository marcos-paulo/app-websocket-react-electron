# 📊 Comparação: useState vs Redux Toolkit

Este documento compara as duas implementações do WebSocket Client.

## 🗂️ Estrutura de Arquivos

### Frontend (useState)

```
frontend/
├── src/
│   ├── hooks/
│   │   └── useWebSocket.ts     # Toda lógica aqui
│   ├── App.tsx                 # UI + useState
│   └── App.css
```

### Frontend-Redux (Redux Toolkit)

```
frontend-redux/
├── src/
│   ├── store/
│   │   ├── websocketSlice.ts         # Actions + Reducers
│   │   ├── store.ts                  # Store config
│   │   ├── hooks.ts                  # Typed hooks
│   │   └── middleware/
│   │       └── websocketMiddleware.ts # WebSocket logic
│   ├── hooks/
│   │   └── useAutoConnect.ts
│   ├── types/
│   │   └── websocket.types.ts
│   ├── App.tsx                        # UI only
│   └── App.css
```

## 🔄 Fluxo de Conexão

### Frontend (useState)

```typescript
// 1. Hook customizado gerencia tudo
const useWebSocket = (url, autoConnect) => {
  const [messages, setMessages] = useState([]);
  const [status, setStatus] = useState("disconnected");
  const wsRef = useRef(null);

  const connect = useCallback(() => {
    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => setStatus("connected");
    ws.onmessage = (e) => setMessages((prev) => [...prev, data]);
    // ...
  }, [url]);

  return { messages, status, connect };
};

// 2. Componente usa o hook
const App = () => {
  const { messages, status, connect } = useWebSocket(url, true);
  return <div>...</div>;
};
```

### Frontend-Redux (Redux Toolkit)

```typescript
// 1. Define Slice (Actions + Reducer)
const websocketSlice = createSlice({
  name: "websocket",
  initialState: { messages: [], status: "disconnected" },
  reducers: {
    connectRequest: (state, action) => {
      state.status = "connecting";
    },
    connectSuccess: (state) => {
      state.status = "connected";
    },
    messageReceived: (state, action) => {
      state.messages.push(action.payload);
    },
  },
});

// 2. Middleware gerencia WebSocket
const websocketMiddleware = (store) => (next) => (action) => {
  if (connectRequest.match(action)) {
    const ws = new WebSocket(action.payload);

    ws.onopen = () => store.dispatch(connectSuccess());
    ws.onmessage = (e) => store.dispatch(messageReceived(data));
  }
  return next(action);
};

// 3. Componente despacha actions
const App = () => {
  const { messages, status } = useAppSelector((state) => state.websocket);
  const dispatch = useAppDispatch();

  const handleConnect = () => dispatch(connectRequest(url));

  return <div>...</div>;
};
```

## 📝 Código Comparativo

### Conectar ao WebSocket

#### useState

```typescript
const { connect } = useWebSocket(url);
connect();
```

#### Redux

```typescript
dispatch(connectRequest(url));
```

### Enviar Mensagem

#### useState

```typescript
const { sendMessage } = useWebSocket(url);
sendMessage("Hello");
```

#### Redux

```typescript
dispatch(sendMessage("Hello"));
```

### Acessar Mensagens

#### useState

```typescript
const { messages } = useWebSocket(url);
```

#### Redux

```typescript
const messages = useAppSelector((state) => state.websocket.messages);
```

## ⚖️ Prós e Contras

### Frontend (useState)

#### ✅ Vantagens

- Código mais simples e direto
- Menos arquivos
- Menos dependências
- Ideal para apps pequenos
- Lógica encapsulada no hook

#### ❌ Desvantagens

- Estado não compartilhável facilmente
- Sem DevTools integrados
- Difícil adicionar lógica complexa
- Sem time-travel debugging
- Estado recriado em cada uso do hook

### Frontend-Redux (Redux Toolkit)

#### ✅ Vantagens

- Estado global acessível de qualquer lugar
- Redux DevTools (debug visual)
- Middleware para side effects
- Actions descritivas (log automático)
- Time-travel debugging
- Fácil adicionar persistência
- Testabilidade superior
- Escalável para apps grandes

#### ❌ Desvantagens

- Mais boilerplate (porém mínimo com RTK)
- Curva de aprendizado
- Mais arquivos
- Overhead para apps simples
- Dependência extra

## 🎯 Quando Usar Cada Um?

### Use useState quando:

- ✅ App pequeno (1-3 componentes)
- ✅ Estado local suficiente
- ✅ Não precisa compartilhar estado
- ✅ Prototipagem rápida
- ✅ Simplicidade é prioridade

### Use Redux quando:

- ✅ App médio/grande (5+ componentes)
- ✅ Estado compartilhado entre componentes
- ✅ Lógica de negócio complexa
- ✅ Necessita debug avançado
- ✅ Time grande (padrões consistentes)
- ✅ Precisa persistir estado
- ✅ Muitas ações assíncronas

## 📊 Comparação de Performance

| Aspecto       | useState  | Redux                   |
| ------------- | --------- | ----------------------- |
| Bundle size   | Menor     | Maior (~15KB)           |
| Re-renders    | Otimizado | Otimizado               |
| Memory        | Menos     | Mais                    |
| Inicialização | Rápida    | Ligeiramente mais lenta |
| Runtime       | Similar   | Similar                 |

## 🧪 Testabilidade

### useState

```typescript
// Testar hook diretamente
import { renderHook } from "@testing-library/react-hooks";

test("useWebSocket connects", () => {
  const { result } = renderHook(() => useWebSocket(url));
  act(() => result.current.connect());
  expect(result.current.status).toBe("connected");
});
```

### Redux

```typescript
// Testar reducers (funções puras)
test("connectSuccess updates status", () => {
  const state = reducer(initialState, connectSuccess());
  expect(state.status).toBe("connected");
});

// Testar middleware isoladamente
test("middleware creates WebSocket", () => {
  const store = mockStore();
  store.dispatch(connectRequest(url));
  expect(WebSocket).toHaveBeenCalledWith(url);
});
```

## 💡 Recomendação

Para este projeto específico (WebSocket Client simples):

- 🟢 **useState é suficiente** para maioria dos casos
- 🟡 **Redux é overkill** mas demonstra melhores práticas

Para projetos maiores:

- 🟢 **Redux é recomendado** quando você tem:
  - Múltiplas fontes de dados
  - Estado compartilhado extensivamente
  - Lógica de negócio complexa
  - Time grande

## 🎓 Aprendizado

Ambas implementações são válidas! Escolha baseado em:

1. **Complexidade do projeto**
2. **Tamanho do time**
3. **Necessidade de debug**
4. **Familiaridade com Redux**

O importante é entender **ambos os padrões** para escolher a ferramenta certa para o trabalho! 🚀
