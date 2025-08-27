# 🚀 GitHub Actions - BuscaLogo Desktop

Este documento explica como usar os workflows do GitHub Actions para builds e releases do BuscaLogo Desktop.

## 📋 Workflows Disponíveis

### 1. 🔍 CI - BuscaLogo Desktop (`ci.yml`)
**Trigger:** Push para `main`, `develop`, `feature/*` ou Pull Requests

**Jobs:**
- **🧪 Test and Lint**: Validação de código e build de teste
- **🛡️ Security Check**: Verificação de vulnerabilidades
- **🏗️ Build Matrix**: Builds para Linux, Windows e macOS
- **📊 Code Quality**: Análise de qualidade e tamanho do bundle

### 2. 🚀 Release - BuscaLogo Desktop (`release.yml`)
**Trigger:** Push de tags (ex: `v1.0.0`)

**Jobs:**
- **🚀 Build and Release**: Builds para todas as plataformas
- **📤 Publish Release**: Criação automática de release no GitHub

### 3. 🏗️ Platform-Specific Builds (`build-platforms.yml`)
**Trigger:** Manual (workflow_dispatch)

**Funcionalidade:** Build específico para uma plataforma escolhida

## 🔧 Configurações de Ambiente

### Variáveis Globais
```yaml
NODE_VERSION: '20'
ELECTRON_CACHE: '~/.cache/electron'
ELECTRON_BUILDER_CACHE: '~/.cache/electron-builder'
PUPPETEER_SKIP_CHROMIUM_DOWNLOAD: 'false'
PUPPETEER_DOWNLOAD_HOST: 'https://storage.googleapis.com'
PUPPETEER_CACHE_DIR: '~/.cache/puppeteer'
```

### Secrets Necessários (para releases)
- `APPLE_ID`: Apple ID para notarização macOS
- `APPLE_APP_SPECIFIC_PASSWORD`: Senha específica do app
- `APPLE_TEAM_ID`: Team ID da Apple Developer

## 🚀 Como Usar

### Build Automático (CI)
1. Faça push para uma branch configurada
2. O workflow será executado automaticamente
3. Verifique os resultados na aba Actions

### Build Manual
1. Vá para a aba Actions
2. Selecione "🏗️ Platform-Specific Builds"
3. Clique em "Run workflow"
4. Escolha a plataforma e versão
5. Clique em "Run workflow"

### Release
1. Crie uma tag: `git tag v1.0.0`
2. Push da tag: `git push origin v1.0.0`
3. O workflow de release será executado automaticamente

## 🔍 Troubleshooting

### Problemas Comuns

#### 1. Falha na Instalação de Dependências
**Sintoma:** Job falha em "Install dependencies"
**Solução:** O workflow usa fallback automático com `scripts/install-deps.sh`

#### 2. Falha no Build do Electron
**Sintoma:** Erro no build da aplicação
**Solução:** Verificar variáveis de cache e configurações do electron-builder

#### 3. Falha na Notarização macOS
**Sintoma:** Erro de notarização em builds macOS
**Solução:** Verificar secrets do Apple Developer

### Logs e Debug
- Verifique os logs completos na aba Actions
- Use `npm run build:linux` localmente para testar
- Verifique arquivos de configuração: `electron-builder.config.js`, `.npmrc`

## 📁 Arquivos de Configuração

- **`.github/workflows/ci.yml`**: Workflow principal de CI
- **`.github/workflows/release.yml`**: Workflow de release
- **`.github/workflows/build-platforms.yml`**: Builds específicos por plataforma
- **`electron-builder.config.js`**: Configuração do Electron Builder
- **`.npmrc`**: Configurações do npm
- **`scripts/install-deps.sh`**: Script de fallback para instalação

## 🔄 Atualizações

Para atualizar os workflows:
1. Modifique os arquivos `.yml` na pasta `.github/workflows/`
2. Faça commit e push
3. Os workflows serão executados automaticamente

## 📞 Suporte

Em caso de problemas:
1. Verifique os logs do workflow
2. Teste localmente com `npm run build:linux`
3. Abra uma issue no repositório
4. Consulte a documentação do Electron Builder
