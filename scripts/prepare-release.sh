#!/bin/bash

# Script para preparar arquivos para release
# Remove arquivos desnecessários e mantém apenas os executáveis

set -e

echo "🔧 Preparando arquivos para release..."

# Função para limpar diretório
clean_directory() {
    local dir=$1
    local platform=$2
    
    echo "🧹 Limpando $platform..."
    
    if [ -d "$dir" ]; then
        # Manter apenas arquivos essenciais
        case $platform in
            "linux")
                # Manter apenas AppImage e arquivos de metadados
                find "$dir" -type f ! -name "*.AppImage" ! -name "*.yml" ! -name "*.blockmap" -delete
                find "$dir" -type d -empty -delete
                ;;
            "win"|"windows")
                # Manter apenas executáveis e arquivos de metadados
                find "$dir" -type f ! -name "*.exe" ! -name "*.blockmap" -delete
                find "$dir" -type d -empty -delete
                ;;
            "mac"|"macos")
                # Manter apenas arquivos zip e metadados
                find "$dir" -type f ! -name "*.zip" ! -name "*.blockmap" -delete
                find "$dir" -type d -empty -delete
                ;;
        esac
        
        echo "✅ $platform limpo"
        echo "📁 Arquivos restantes em $dir:"
        find "$dir" -type f | head -10
    else
        echo "⚠️ Diretório $dir não encontrado"
    fi
}

# Limpar cada diretório de artifacts
clean_directory "artifacts/linux-release" "linux"
clean_directory "artifacts/windows-release" "win"
clean_directory "artifacts/macos-release" "mac"

echo "🎯 Release preparado com sucesso!"
echo "📦 Arquivos que serão enviados:"
find artifacts/ -type f | sort
