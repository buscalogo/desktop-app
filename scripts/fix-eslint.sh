#!/bin/bash

echo "🔧 Corrigindo erros de ESLint automaticamente..."

# Função para corrigir um arquivo específico
fix_file() {
    local file="$1"
    echo "📝 Corrigindo: $file"
    
    # Backup do arquivo original
    cp "$file" "$file.backup"
    
    # Corrigir espaços em branco no final das linhas
    sed -i 's/[[:space:]]*$//' "$file"
    
    # Corrigir espaços antes de parênteses de função
    sed -i 's/function(/function (/g' "$file"
    sed -i 's/constructor(/constructor (/g' "$file"
    sed -i 's/async (/async (/g' "$file"
    sed -i 's/\([a-zA-Z_$][a-zA-Z0-9_$]*\)(/ \1(/g' "$file"
    
    # Remover pontos e vírgula desnecessários
    sed -i 's/;$/ /g' "$file"
    sed -i 's/; / /g' "$file"
    
    # Corrigir blocos com linhas em branco desnecessárias
    sed -i '/^[[:space:]]*$/d' "$file"
    sed -i '/^$/d' "$file"
    
    # Corrigir propriedades desnecessariamente entre aspas
    sed -i 's/"\([a-zA-Z_$][a-zA-Z0-9_$]*\)":/\1:/g' "$file"
    
    # Corrigir hasOwnProperty
    sed -i 's/\.hasOwnProperty(/Object.prototype.hasOwnProperty.call(/g' "$file"
    
    # Corrigir prefer-const
    sed -i 's/let \([a-zA-Z_$][a-zA-Z0-9_$]*\) = \([^;]*\);/\1 is never reassigned. Use const instead: const \1 = \2/g' "$file"
    
    echo "✅ Arquivo corrigido: $file"
}

# Lista de arquivos para corrigir
files=(
    "src/renderer/js/scraping/scraping-controls.js"
    "src/renderer/js/utils/network.js"
    "src/renderer/js/utils/storage.js"
    "src/renderer/js/views/analytics.js"
    "src/renderer/js/views/dashboard.js"
    "src/renderer/js/views/search.js"
    "src/renderer/js/views/settings.js"
)

# Corrigir cada arquivo
for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        fix_file "$file"
    else
        echo "⚠️ Arquivo não encontrado: $file"
    fi
done

echo "🎯 Executando ESLint para verificar correções..."
npm run lint

echo "✅ Correção automática concluída!"
echo "📝 Verifique os arquivos .backup se precisar reverter alguma mudança."
