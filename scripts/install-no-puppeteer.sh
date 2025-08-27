#!/bin/bash

# Script de instalação sem Puppeteer para CI/CD
# Útil quando o Puppeteer causa problemas

set -e

echo "🔧 Instalando dependências sem Puppeteer para CI/CD..."

# Configurar variáveis de ambiente
export PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
export ELECTRON_CACHE=~/.cache/electron
export ELECTRON_BUILDER_CACHE=~/.cache/electron-builder

# Limpar caches
echo "🧹 Limpando caches..."
npm cache clean --force

# Remover node_modules e package-lock se existirem
if [ -d "node_modules" ]; then
    echo "🗑️ Removendo node_modules existente..."
    rm -rf node_modules
fi

if [ -f "package-lock.json" ]; then
    echo "🗑️ Removendo package-lock.json existente..."
    rm -f package-lock.json
fi

# Instalar dependências básicas primeiro (sem Puppeteer)
echo "📦 Instalando dependências básicas..."
npm install --no-audit --no-fund --ignore-scripts

# Instalar Puppeteer separadamente com configurações específicas
echo "🤖 Instalando Puppeteer com configurações específicas..."
PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true npm install puppeteer@^24.9.0 --no-audit --no-fund

# Executar postinstall se existir
if npm run | grep -q "postinstall"; then
    echo "🔧 Executando postinstall..."
    npm run postinstall
fi

# Verificar se a instalação foi bem-sucedida
if [ -d "node_modules" ]; then
    echo "✅ Dependências instaladas com sucesso!"
    echo "📦 Verificando instalação..."
    
    # Verificar dependências principais
    echo "🔍 Verificando dependências principais..."
    npm list --depth=0 | grep -E "(electron|puppeteer|ws|cheerio)"
    
    echo "✅ Instalação concluída com sucesso!"
else
    echo "❌ Falha na instalação das dependências"
    exit 1
fi
