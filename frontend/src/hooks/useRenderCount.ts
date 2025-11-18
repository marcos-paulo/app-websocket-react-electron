import { useEffect, useRef } from "react";

/**
 * Hook para contar e logar renderizações do componente
 * Útil para debug e entender o comportamento do Strict Mode
 */
export const useRenderCount = (componentName: string = "Component") => {
  const renderCount = useRef(0);
  const mountCount = useRef(0);

  // Incrementa a cada render (chamado em cada execução do componente)
  renderCount.current++;

  useEffect(() => {
    // Incrementa apenas quando o componente monta
    mountCount.current++;

    console.log(`
╔════════════════════════════════════════
║ ${componentName}
║ Montagens (useEffect): ${mountCount.current}
║ Renderizações (total): ${renderCount.current}
╚════════════════════════════════════════
    `);

    // Detectar se é Strict Mode
    if (mountCount.current === 1 && renderCount.current >= 2) {
      console.log(
        "⚠️ Strict Mode detectado - componente renderiza múltiplas vezes"
      );
    }

    return () => {
      console.log(
        `🧹 ${componentName} - Desmontando (montagem #${mountCount.current})`
      );
    };
  }, []); // Array vazio = executa apenas no mount/unmount

  return {
    renderCount: renderCount.current,
    mountCount: mountCount.current,
    isFirstMount: mountCount.current === 1,
    isFirstRender: renderCount.current === 1,
  };
};
