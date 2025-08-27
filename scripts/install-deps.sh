#!/bin/bash

# Script de fallback para instalação de dependências
# Usado quando npm ci falha no GitHub Actions

set -e

echo "🔧 Instalando dependências com fallback..."

# Limpar caches de forma mais segura
echo "🧹 Limpando caches..."
npm cache verify || true
rm -rf node_modules package-lock.json

# Configurar variáveis de ambiente para Puppeteer
export PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
export PUPPETEER_DOWNLOAD_BASE_URL=https://storage.googleapis.com
export PUPPETEER_CHROMIUM_REVISION=121.0.6167.139

# Tentar instalação limpa com --legacy-peer-deps
echo "📦 Tentando instalação com --legacy-peer-deps..."
timeout 600 npm install --no-audit --no-fund --prefer-offline --legacy-peer-deps || {
    echo "⚠️ Instalação com --legacy-peer-deps falhou, tentando sem timeout..."
    npm install --no-audit --no-fund --prefer-offline --legacy-peer-deps
}

# Executar postinstall se existir
if npm run | grep -q "postinstall"; then
    echo "🔧 Executando postinstall..."
    npm run postinstall
fi

# Verificar se a instalação foi bem-sucedida
if [ -d "node_modules" ]; then
    echo "✅ Dependências instaladas com sucesso!"
    echo "📊 Tamanho do node_modules:"
    du -sh node_modules
    echo "📦 Dependências instaladas:"
    npm list --depth=0 --silent | head -20
else
    echo "❌ Falha na instalação das dependências"
    exit 1
fi
