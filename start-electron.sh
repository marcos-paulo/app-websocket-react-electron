#!/bin/bash

# Script para iniciar a aplicação Electron com o frontend

echo "🚀 Iniciando aplicação Electron..."
echo ""
echo "Este script irá:"
echo "1. Iniciar o backend (WebSocket server)"
echo "2. Iniciar o frontend (React app)"
echo "3. Iniciar o Electron (Desktop app)"
echo ""

cd "$(dirname "$0")"

# Executa todos os serviços incluindo o Electron
npm run dev:with-electron
