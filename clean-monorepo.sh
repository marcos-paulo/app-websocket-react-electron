#!/bin/bash

echo "🧹 Limpando node_modules e arquivos de build..."
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
echo "💡 Execute './setup-monorepo.sh' para reinstalar"
echo ""
