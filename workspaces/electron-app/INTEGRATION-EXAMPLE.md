// Exemplo de como detectar e usar as APIs do Electron no frontend

// Verificar se está rodando no Electron
export const isElectron = (): boolean => {
return !!(window as any).electronAPI;
};

// Obter informações do Electron (se disponível)
export const getElectronInfo = () => {
if (isElectron()) {
const electronAPI = (window as any).electronAPI;
return {
platform: electronAPI.platform,
versions: electronAPI.versions,
};
}
return null;
};

// Exemplo de uso no componente
/\*
import { isElectron, getElectronInfo } from './utils/electron';

function App() {
useEffect(() => {
if (isElectron()) {
const info = getElectronInfo();
console.log('Rodando no Electron!', info);
} else {
console.log('Rodando no navegador');
}
}, []);

return (
<div>
{isElectron() && (
<div>
Esta aplicação está rodando no Electron
</div>
)}
</div>
);
}
\*/
