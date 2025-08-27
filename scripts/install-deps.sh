#!/bin/bash

# Script de fallback para instalação de dependências
# Usado quando npm ci falha no GitHub Actions

set -e

echo "🔧 Instalando dependências com fallback..."

# Limpar caches
echo "🧹 Limpando caches..."
npm cache clean --force
rm -rf node_modules package-lock.json

# Tentar instalação limpa
echo "📦 Tentando instalação limpa..."
npm install --no-audit --no-fund

# Executar postinstall se existir
if npm run | grep -q "postinstall"; then
    echo "🔧 Executando postinstall..."
    npm run postinstall
fi

# Verificar se a instalação foi bem-sucedida
if [ -d "node_modules" ]; then
    echo "✅ Dependências instaladas com sucesso!"
    npm list --depth=0
else
    echo "❌ Falha na instalação das dependências"
    exit 1
fi
