# 🚀 Sistema de Release - BuscaLogo Desktop

## 📋 Visão Geral

O BuscaLogo Desktop possui um sistema completo de release automático integrado com GitHub Actions, que automatiza todo o processo de criação de releases, desde o versionamento até a distribuição de binários para todas as plataformas.

## ✨ Funcionalidades

### **🏗️ Build Automático**
- **Multi-plataforma**: Windows, macOS e Linux
- **Artefatos**: AppImage, NSIS installer, DMG
- **Cache**: Dependências e builds otimizados

### **📝 Release Notes Automáticas**
- **Conventional Commits**: Parsing automático de commits
- **Categorização**: Features, fixes, docs, etc.
- **Changelog**: Atualização automática do CHANGELOG.md

### **🔄 CI/CD Pipeline**
- **Testes**: Lint, build validation, security checks
- **Qualidade**: Verificação de vulnerabilidades
- **Deploy**: Release automático no GitHub

## 🚀 Como Fazer um Release

### **1. Release Automático (Recomendado)**

#### **Patch Release (1.0.0 → 1.0.1)**
```bash
./scripts/release.sh --patch
```

#### **Minor Release (1.0.0 → 1.1.0)**
```bash
./scripts/release.sh --minor
```

#### **Major Release (1.0.0 → 2.0.0)**
```bash
./scripts/release.sh --major
```

### **2. Release Manual**

#### **Verificar Status**
```bash
./scripts/release.sh --check
```

#### **Release Draft**
```bash
./scripts/release.sh --patch --draft
```

#### **Prerelease**
```bash
./scripts/release.sh --patch --prerelease
```

### **3. Scripts NPM**

#### **Release Patch**
```bash
npm run release:patch
```

#### **Release Minor**
```bash
npm run release:minor
```

#### **Release Major**
```bash
npm run release:major
```

#### **Release Draft**
```bash
npm run draft
```

#### **Prerelease**
```bash
npm run prerelease
```

## 🔧 Pré-requisitos

### **1. GitHub CLI**
```bash
# Ubuntu/Debian
sudo apt install gh

# macOS
brew install gh

# Windows
winget install GitHub.cli
```

### **2. Autenticação GitHub**
```bash
gh auth login
```

### **3. Dependências**
```bash
npm install
```

## 📁 Estrutura de Arquivos

```
.github/
├── workflows/
│   ├── ci.yml              # CI/CD pipeline
│   ├── release.yml         # Release workflow
│   └── release-drafter.yml # Release notes
├── release-drafter.yml     # Configuração do drafter
└── commit-convention.yml   # Convenções de commit

scripts/
├── release.sh              # Script de release
└── update-version.js       # Atualização de versão

CHANGELOG.md                 # Histórico de mudanças
```

## 🎯 Workflows do GitHub Actions

### **CI (Continuous Integration)**
- **Trigger**: Push em qualquer branch
- **Jobs**: Test, Security, Build Matrix, Quality
- **Artefatos**: Builds de validação

### **Release**
- **Trigger**: Push de tag (v*)
- **Jobs**: Build para todas as plataformas
- **Output**: Release com binários

### **Release Drafter**
- **Trigger**: Push em main/develop ou PR
- **Output**: Release notes atualizadas

## 📝 Convenções de Commit

### **Formato**
```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

### **Tipos**
- **feat**: Nova funcionalidade
- **fix**: Correção de bug
- **docs**: Documentação
- **style**: Formatação
- **refactor**: Refatoração
- **perf**: Performance
- **test**: Testes
- **chore**: Manutenção

### **Escopos**
- **desktop**: Funcionalidades do app
- **ui**: Interface do usuário
- **system-tray**: System tray
- **build**: Sistema de build
- **electron**: Electron específico
- **icons**: Ícones e assets
- **docs**: Documentação
- **ci**: CI/CD
- **release**: Processo de release

### **Exemplos**
```bash
git commit -m "feat(desktop): add system tray functionality"
git commit -m "fix(ui): resolve dark mode toggle issue"
git commit -m "docs: update installation instructions"
git commit -m "chore(build): update electron-builder config"
git commit -m "ci: add GitHub Actions workflow"
```

## 🔄 Processo de Release

### **1. Desenvolvimento**
```bash
# Fazer commits seguindo Conventional Commits
git add .
git commit -m "feat(desktop): add new feature"
git push origin feature/new-feature
```

### **2. Pull Request**
- Criar PR para `main`
- CI roda automaticamente
- Code review e aprovação

### **3. Merge**
- Merge para `main`
- CI roda novamente
- Release Drafter atualiza notas

### **4. Release**
```bash
# Criar release
./scripts/release.sh --patch

# Script automaticamente:
# - Atualiza versão
# - Atualiza arquivos
# - Cria commit e tag
# - Push para GitHub
# - GitHub Actions cria release
```

### **5. Distribuição**
- Binários construídos para todas as plataformas
- Release notes geradas automaticamente
- Downloads disponíveis no GitHub

## 🐛 Solução de Problemas

### **Release Falhou**
```bash
# Verificar status
./scripts/release.sh --check

# Verificar logs do GitHub Actions
gh run list --workflow=release.yml

# Verificar última execução
gh run view --log
```

### **Problemas de Build**
```bash
# Limpar builds anteriores
rm -rf dist/ node_modules/

# Reinstalar dependências
npm ci

# Testar build local
npm run build:linux
```

### **Problemas de Git**
```bash
# Verificar status
git status

# Verificar branch
git branch --show-current

# Verificar remotes
git remote -v
```

### **Problemas de GitHub CLI**
```bash
# Verificar autenticação
gh auth status

# Reautenticar se necessário
gh auth login

# Verificar permissões
gh repo view
```

## 📊 Monitoramento

### **GitHub Actions**
- **Status**: https://github.com/buscalogo/desktop-app/actions
- **Releases**: https://github.com/buscalogo/desktop-app/releases
- **Issues**: https://github.com/buscalogo/desktop-app/issues

### **Métricas**
- **Build Time**: Tempo médio de build
- **Success Rate**: Taxa de sucesso dos builds
- **Release Frequency**: Frequência de releases

## 🔒 Segurança

### **Secrets Necessários**
- `GITHUB_TOKEN`: Token automático do GitHub
- `NPM_TOKEN`: Para publicação no npm (se aplicável)

### **Verificações de Segurança**
- **npm audit**: Verificação de vulnerabilidades
- **Dependabot**: Atualizações automáticas
- **CodeQL**: Análise estática de código

## 📚 Referências

- [GitHub Actions](https://docs.github.com/en/actions)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Release Drafter](https://github.com/release-drafter/release-drafter)
- [Electron Builder](https://www.electron.build/)
- [GitHub CLI](https://cli.github.com/)

## 🤝 Contribuição

### **Reportar Bugs**
- Use as [GitHub Issues](https://github.com/buscalogo/desktop-app/issues)
- Inclua logs e informações do sistema

### **Sugerir Melhorias**
- Crie uma issue com label `enhancement`
- Descreva o problema e a solução proposta

### **Contribuir Código**
- Fork o repositório
- Crie uma branch para sua feature
- Siga as convenções de commit
- Abra um Pull Request

---

**Nota**: Este sistema de release é mantido pela equipe BuscaLogo e segue as melhores práticas da indústria para CI/CD e automação de releases.
