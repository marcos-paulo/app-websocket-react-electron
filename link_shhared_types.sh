#!/bin/bash

path_script=$(readlink -f $(dirname "$0"))


# 1. Instalar dependências e compilar
cd $path_script/shared-types
npm install
npm run build

echo "🔗 Removendo possível instalação anterior..."
npm uninstall @websocket-app/shared-types

# 2. Criar link simbólico
# npm link

# 3. Linkar no backend
cd $path_script/backend
echo "🔗 Removendo possível link anterior..."
npm unlink @websocket-app/shared-types
echo "🔗 Linkando @websocket-app/shared-types no backend..."
npm link @websocket-app/shared-types

# 4. Linkar no frontend-redux
cd $path_script/frontend-redux
echo "🔗 Removendo possível link anterior..."
npm unlink @websocket-app/shared-types
echo "🔗 Linkando @websocket-app/shared-types no frontend-redux..."
npm link @websocket-app/shared-types