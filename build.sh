#!/bin/bash

echo "🚀 Iniciando build e deploy..."

# Build do backend
echo "📦 Compilando backend..."
cd backend
npm run build

if [ $? -ne 0 ]; then
  echo "❌ Erro ao compilar backend"
  exit 1
fi

# Build do frontend
echo "📦 Compilando frontend..."
cd ../frontend
npm run build

if [ $? -ne 0 ]; then
  echo "❌ Erro ao compilar frontend"
  exit 1
fi

echo "✅ Build concluído com sucesso!"
echo ""
echo "Para iniciar o servidor em produção, execute:"
echo "  cd backend && npm start"
echo ""
echo "Ou com variável de ambiente:"
echo "  cd backend && NODE_ENV=production PORT=8080 npm start"
