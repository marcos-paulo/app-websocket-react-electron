#!/bin/bash

path_script=$(readlink -f $(dirname "$0"))


# 1. Instalar dependências e compilar
cd $path_script/shared
npm install
npm run build

echo "🔗 Removendo possível instalação anterior..."
npm uninstall @websocket-app/shared

# 2. Criar link simbólico
# npm link

# 3. Linkar no backend
cd $path_script/backend
echo "🔗 Removendo possível link anterior..."
npm unlink @websocket-app/shared
echo "🔗 Linkando @websocket-app/shared no backend..."
npm link @websocket-app/shared

# 4. Linkar no frontend-redux
cd $path_script/frontend-redux
echo "🔗 Removendo possível link anterior..."
npm unlink @websocket-app/shared
echo "🔗 Linkando @websocket-app/shared no frontend-redux..."
npm link @websocket-app/shared