# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/lang/pt-BR/).

## [Unreleased]

### Added
- System tray functionality for background execution
- GitHub Actions CI/CD workflows
- Automated release system
- Conventional commits configuration
- Automated version management

### Changed
- Improved window management behavior
- Enhanced build configuration for multiple platforms

### Fixed
- Application closing immediately after startup
- Multiple instance prevention logic

## [1.0.0] - 2024-01-15

### Added
- Initial release of BuscaLogo Desktop
- Electron-based desktop application
- Integration with BuscaLogo Chrome extension
- P2P networking capabilities
- Web content scraping and analysis
- Dark/light theme support
- Responsive user interface
- Multi-platform support (Windows, macOS, Linux)

### Features
- Dashboard with analytics and statistics
- Advanced search functionality
- Content management system
- Real-time P2P synchronization
- Extension data synchronization
- File import/export capabilities
- System integration and shortcuts

### Technical
- Electron 28.0.0 framework
- Vue.js frontend components
- Tailwind CSS styling
- IndexedDB local storage
- WebSocket P2P communication
- Cross-platform build system
- Automated testing and linting

---

## Tipos de Mudanças

- **Added** para novas funcionalidades
- **Changed** para mudanças em funcionalidades existentes
- **Deprecated** para funcionalidades que serão removidas
- **Removed** para funcionalidades removidas
- **Fixed** para correções de bugs
- **Security** para correções de vulnerabilidades

## Convenções de Versionamento

Este projeto segue o [Semantic Versioning](https://semver.org/lang/pt-BR/):

- **MAJOR**: Mudanças incompatíveis com versões anteriores
- **MINOR**: Novas funcionalidades compatíveis
- **PATCH**: Correções de bugs compatíveis

## Processo de Release

1. **Desenvolvimento**: Commits seguindo Conventional Commits
2. **CI/CD**: GitHub Actions executam testes e builds
3. **Release**: Tag de versão dispara release automático
4. **Distribuição**: Binários para todas as plataformas
5. **Documentação**: Changelog e notas de release atualizados

---

**Nota**: Este changelog é mantido automaticamente pelo sistema de release do GitHub.
