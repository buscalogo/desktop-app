#!/bin/bash

# Script para build do BuscaLogo Desktop para todas as plataformas
# Autor: BuscaLogo Team
# Data: 2024-01-15

echo "🚀 Iniciando build do BuscaLogo Desktop..."

# Verificar se as dependências estão instaladas
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependências..."
    npm install
fi

# Limpar builds anteriores
echo "🧹 Limpando builds anteriores..."
rm -rf dist/

# Build para Linux (AppImage)
echo "🐧 Build para Linux..."
npm run build

# Build para Windows (se estiver no Windows ou usando WSL)
if command -v wine &> /dev/null; then
    echo "🪟 Build para Windows..."
    npm run build:win
else
    echo "⚠️  Wine não encontrado. Pulando build para Windows."
fi

# Build para macOS (se estiver no macOS)
if [[ "$OSTYPE" == "darwin"* ]]; then
    echo "🍎 Build para macOS..."
    npm run build:mac
else
    echo "⚠️  Não é macOS. Pulando build para macOS."
fi

echo "✅ Build concluído!"
echo "📁 Arquivos gerados em: dist/"

# Listar arquivos gerados
echo "📋 Arquivos gerados:"
ls -la dist/

echo ""
echo "🎉 Build do BuscaLogo Desktop concluído com sucesso!"
