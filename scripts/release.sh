#!/bin/bash

# Script de Release para BuscaLogo Desktop
# Autor: BuscaLogo Team
# Data: 2024-01-15

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para log colorido
log() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

step() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

# Verificar se estamos em um repositório git
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    error "Este diretório não é um repositório git!"
    exit 1
fi

# Verificar se há mudanças não commitadas
if [[ -n $(git status --porcelain) ]]; then
    error "Há mudanças não commitadas. Faça commit ou stash antes de continuar."
    git status --short
    exit 1
fi

# Verificar se estamos na branch main
CURRENT_BRANCH=$(git branch --show-current)
if [[ "$CURRENT_BRANCH" != "main" ]]; then
    warn "Você está na branch '$CURRENT_BRANCH'. É recomendado fazer release da branch 'main'."
    read -p "Continuar mesmo assim? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Verificar se o GitHub CLI está instalado
if ! command -v gh &> /dev/null; then
    error "GitHub CLI (gh) não está instalado. Instale em: https://cli.github.com/"
    exit 1
fi

# Verificar se está autenticado no GitHub
if ! gh auth status &> /dev/null; then
    error "Você não está autenticado no GitHub. Execute 'gh auth login' primeiro."
    exit 1
fi

# Função para mostrar ajuda
show_help() {
    echo "Uso: $0 [OPÇÕES]"
    echo ""
    echo "OPÇÕES:"
    echo "  -h, --help          Mostra esta ajuda"
    echo "  -v, --version       Mostra a versão atual"
    echo "  -p, --patch         Release patch (1.0.0 -> 1.0.1)"
    echo "  -m, --minor         Release minor (1.0.0 -> 1.1.0)"
    echo "  -M, --major         Release major (1.0.0 -> 2.0.0)"
    echo "  -d, --draft         Cria um release draft"
    echo "  -r, --prerelease    Cria um prerelease"
    echo "  -c, --check         Verifica se está tudo pronto para release"
    echo ""
    echo "EXEMPLOS:"
    echo "  $0 --patch          # Release patch"
    echo "  $0 --minor          # Release minor"
    echo "  $0 --major          # Release major"
    echo "  $0 --draft          # Release draft"
    echo "  $0 --check          # Verificar status"
}

# Função para verificar se está tudo pronto
check_release_readiness() {
    step "Verificando se está tudo pronto para release..."
    
    # Verificar dependências
    log "Verificando dependências..."
    if ! npm ci --dry-run &> /dev/null; then
        error "Problemas com dependências npm"
        return 1
    fi
    
    # Verificar lint
    log "Verificando qualidade do código..."
    if ! npm run lint &> /dev/null; then
        error "Problemas de lint encontrados"
        return 1
    fi
    
    # Verificar build
    log "Verificando build..."
    if ! npm run build:linux &> /dev/null; then
        error "Problemas no build"
        return 1
    fi
    
    # Verificar git status
    log "Verificando status do git..."
    if [[ -n $(git status --porcelain) ]]; then
        error "Há mudanças não commitadas"
        return 1
    fi
    
    log "✅ Tudo pronto para release!"
    return 0
}

# Função para criar release
create_release() {
    local release_type=$1
    local is_draft=$2
    local is_prerelease=$3
    
    step "Criando release $release_type..."
    
    # Atualizar versão
    log "Atualizando versão..."
    case $release_type in
        "patch")
            npm version patch --no-git-tag-version
            ;;
        "minor")
            npm version minor --no-git-tag-version
            ;;
        "major")
            npm version major --no-git-tag-version
            ;;
        *)
            error "Tipo de release inválido: $release_type"
            exit 1
            ;;
    esac
    
    # Ler nova versão
    NEW_VERSION=$(node -p "require('./package.json').version")
    log "Nova versão: $NEW_VERSION"
    
    # Atualizar arquivos de versão
    log "Atualizando arquivos de versão..."
    npm run update-version
    
    # Commit das mudanças
    log "Fazendo commit das mudanças..."
    git add .
    git commit -m "chore: bump version to $NEW_VERSION"
    
    # Criar tag
    log "Criando tag v$NEW_VERSION..."
    git tag "v$NEW_VERSION"
    
    # Push das mudanças e tag
    log "Fazendo push das mudanças e tag..."
    git push origin main
    git push origin "v$NEW_VERSION"
    
    # Aguardar um pouco para o GitHub processar
    log "Aguardando GitHub processar..."
    sleep 10
    
    # Verificar se o release foi criado automaticamente
    if gh release view "v$NEW_VERSION" &> /dev/null; then
        log "✅ Release v$NEW_VERSION criado automaticamente pelo GitHub Actions!"
    else
        log "Criando release manualmente..."
        
        # Criar release manualmente se necessário
        local gh_args=""
        if [[ "$is_draft" == "true" ]]; then
            gh_args="$gh_args --draft"
        fi
        if [[ "$is_prerelease" == "true" ]]; then
            gh_args="$gh_args --prerelease"
        fi
        
        gh release create "v$NEW_VERSION" \
            --title "BuscaLogo Desktop v$NEW_VERSION" \
            --notes "Release v$NEW_VERSION do BuscaLogo Desktop" \
            $gh_args
    fi
    
    log "🎉 Release v$NEW_VERSION criado com sucesso!"
    log "📦 Binários serão construídos automaticamente pelo GitHub Actions"
    log "🔗 Verifique: https://github.com/buscalogo/desktop-app/releases"
}

# Função principal
main() {
    local release_type=""
    local is_draft=false
    local is_prerelease=false
    
    # Parse de argumentos
    while [[ $# -gt 0 ]]; do
        case $1 in
            -h|--help)
                show_help
                exit 0
                ;;
            -v|--version)
                echo "BuscaLogo Desktop Release Script v1.0.0"
                exit 0
                ;;
            -p|--patch)
                release_type="patch"
                shift
                ;;
            -m|--minor)
                release_type="minor"
                shift
                ;;
            -M|--major)
                release_type="major"
                shift
                ;;
            -d|--draft)
                is_draft=true
                shift
                ;;
            -r|--prerelease)
                is_prerelease=true
                shift
                ;;
            -c|--check)
                check_release_readiness
                exit $?
                ;;
            *)
                error "Argumento desconhecido: $1"
                show_help
                exit 1
                ;;
        esac
    done
    
    # Se nenhum tipo foi especificado, mostrar ajuda
    if [[ -z "$release_type" ]]; then
        show_help
        exit 1
    fi
    
    # Verificar se está tudo pronto
    if ! check_release_readiness; then
        error "Release não pode ser criado. Corrija os problemas acima."
        exit 1
    fi
    
    # Criar release
    create_release "$release_type" "$is_draft" "$is_prerelease"
}

# Executar função principal
main "$@"
