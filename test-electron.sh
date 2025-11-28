#!/bin/bash

# Script para testar apenas o Electron (requer frontend rodando)

echo "🖥️  Testando aplicação Electron..."
echo ""
echo "⚠️  IMPORTANTE: Este script assume que o frontend já está rodando!"
echo "   Se não estiver, execute em outro terminal: npm run dev:frontend"
echo ""
echo "Iniciando Electron em 3 segundos..."
sleep 3

cd "$(dirname "$0")"

# Apenas inicia o Electron
npm run dev:electron
