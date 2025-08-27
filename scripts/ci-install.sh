#!/bin/bash

# Script de instalação específico para CI/CD
# Otimizado para resolver problemas do Puppeteer

set -e

echo "🔧 Instalando dependências para CI/CD..."

# Configurar variáveis de ambiente para Puppeteer
export PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
export PUPPETEER_DOWNLOAD_BASE_URL=https://storage.googleapis.com
export PUPPETEER_CHROMIUM_REVISION=121.0.6167.139
export PUPPETEER_CACHE_DIR=~/.cache/puppeteer

# Limpar caches
echo "🧹 Limpando caches..."
npm cache clean --force

# Tentar instalação com npm ci primeiro
echo "📦 Tentando npm ci..."
if npm ci --prefer-offline --no-audit; then
    echo "✅ npm ci executado com sucesso!"
else
    echo "⚠️ npm ci falhou, tentando instalação limpa..."
    
    # Remover node_modules e package-lock
    rm -rf node_modules package-lock.json
    
    # Tentar instalação limpa
    echo "📦 Tentando instalação limpa..."
    if npm install --no-audit --no-fund; then
        echo "✅ Instalação limpa bem-sucedida!"
    else
        echo "⚠️ Instalação limpa falhou, tentando sem Puppeteer..."
        bash scripts/install-no-puppeteer.sh
        exit $?
    fi
    
    # Executar postinstall se existir
    if npm run | grep -q "postinstall"; then
        echo "🔧 Executando postinstall..."
        npm run postinstall
    fi
fi

# Verificar se a instalação foi bem-sucedida
if [ -d "node_modules" ]; then
    echo "✅ Dependências instaladas com sucesso!"
    echo "📦 Verificando Puppeteer..."
    
    # Verificar se Puppeteer está funcionando
    if [ -d "node_modules/puppeteer" ]; then
        echo "✅ Puppeteer instalado"
        npm list puppeteer
    else
        echo "❌ Puppeteer não encontrado"
        exit 1
    fi
else
    echo "❌ Falha na instalação das dependências"
    exit 1
fi
