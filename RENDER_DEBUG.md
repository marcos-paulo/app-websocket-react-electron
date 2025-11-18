# 🔍 Como Detectar Renderizações no React

## Método Simples - Adicionar no seu componente

```typescript
function App() {
  // Adicione estas 3 linhas
  const renderCount = useRef(0);
  renderCount.current++;
  console.log(`🎨 Render #${renderCount.current}`);

  // Resto do código...
}
```

## Detectar Montagens (useEffect)

```typescript
const mountCount = useRef(0);

useEffect(() => {
  mountCount.current++;
  console.log(`🏗️ Mount #${mountCount.current}`);

  return () => {
    console.log(`🧹 Unmount #${mountCount.current}`);
  };
}, []);
```

## O que você verá no Console (Strict Mode)

```
🎨 Render #1
🏗️ Mount #1
🧹 Unmount #1    ← Strict Mode desmonta
🎨 Render #2
🏗️ Mount #2      ← Strict Mode monta de novo
```

## Uso do Hook useRenderCount

```typescript
import { useRenderCount } from "./hooks/useRenderCount";

function App() {
  const { renderCount, mountCount, isFirstMount } = useRenderCount("App");

  console.log("É primeira montagem?", isFirstMount); // true ou false

  // Resto do código...
}
```

## Debug Visual na Tela

Adicione no JSX (apenas em desenvolvimento):

```typescript
{
  import.meta.env.DEV && (
    <div style={{ background: "yellow", padding: "10px" }}>
      Renderizações: {renderCount} | Montagens: {mountCount}
    </div>
  );
}
```

## Quando usar?

- ✅ Durante desenvolvimento para entender re-renders
- ✅ Para debugar problemas de performance
- ✅ Para entender comportamento do Strict Mode
- ❌ Remover antes de deploy em produção (ou usar import.meta.env.DEV)
