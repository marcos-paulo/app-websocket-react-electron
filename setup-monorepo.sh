#!/bin/bash

echo "🧹 Limpando instalações anteriores..."
echo ""

path_script=$(readlink -f $(dirname "$0"))
cd "$path_script"

# Remover node_modules
echo "🗑️  Removendo node_modules..."
rm -rf node_modules
rm -rf backend/node_modules
rm -rf frontend-redux/node_modules
rm -rf shared-types/node_modules

# Remover builds
echo "🗑️  Removendo builds..."
rm -rf backend/dist
rm -rf frontend-redux/dist
rm -rf shared-types/dist

# Remover package-lock
echo "🗑️  Removendo package-lock.json..."
rm -f package-lock.json
rm -f backend/package-lock.json
rm -f frontend-redux/package-lock.json
rm -f shared-types/package-lock.json

echo ""
echo "✅ Limpeza concluída!"
echo ""
echo "🚀 Configurando Monorepo..."
echo "📦 Instalando todas as dependências..."
echo ""

npm install

echo ""
echo "✅ Monorepo configurado com sucesso!"
echo ""
echo "📋 Comandos disponíveis:"
echo "  npm run build:all       - Build de todos os projetos"
echo "  npm run dev:backend     - Executar backend em modo dev"
echo "  npm run dev:frontend    - Executar frontend em modo dev"
echo "  npm run dev:shared      - Watch mode para shared-types"
echo "  npm run dev:all         - Executar tudo em paralelo"
echo "  npm run start:prod      - Build e executar em produção"
echo ""
echo "💡 Para desenvolvimento simultâneo:"
echo "  npm run dev:all"
echo ""

npm run dev:all