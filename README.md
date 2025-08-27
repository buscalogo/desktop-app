# 🔍 BuscaLogo Desktop

Aplicativo desktop nativo para o BuscaLogo, construído com Electron, oferecendo uma interface rica para gerenciar e analisar conteúdo web coletado.

## ✨ Características

- **Interface Nativa**: Aplicativo desktop nativo para Windows, macOS e Linux
- **Sincronização com Extensão**: Integração completa com a extensão Chrome
- **Rede P2P**: Conecta-se à rede descentralizada BuscaLogo
- **Analytics Avançados**: Visualizações e análises detalhadas dos dados
- **Gerenciamento de Conteúdo**: Interface completa para gerenciar páginas capturadas
- **Busca Inteligente**: Sistema de busca avançado em todo o conteúdo
- **Temas**: Suporte a temas claro, escuro e automático
- **Configurações Flexíveis**: Personalização completa do comportamento
- **System Tray**: Execução em segundo plano com ícone na bandeja do sistema

## 🚀 Instalação

### Pré-requisitos

- Node.js 18+ 
- npm ou yarn
- Git

### Passos de Instalação

1. **Clone o repositório**
   ```bash
   git clone https://github.com/buscalogo/desktop-app.git
   cd desktop-app
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Execute em modo de desenvolvimento**
   ```bash
   npm run dev
   ```

4. **Para produção, construa o aplicativo**
   ```bash
   npm run build
   ```

## 🏗️ Estrutura do Projeto

```
desktop-app/
├── src/
│   ├── main.js              # Processo principal do Electron
│   ├── preload.js           # Script de pré-carregamento
│   └── renderer/            # Interface do usuário
│       ├── index.html       # HTML principal
│       ├── styles/          # Arquivos CSS
│       │   ├── main.css     # Estilos principais
│       │   ├── components.css # Estilos de componentes
│       │   └── themes.css   # Estilos de temas
│       └── js/              # JavaScript da interface
│           ├── app.js       # Aplicação principal
│           ├── views/       # Views específicas
│           ├── components/  # Componentes reutilizáveis
│           └── utils/       # Utilitários
├── assets/                  # Recursos estáticos
├── package.json             # Configurações do projeto
└── README.md               # Este arquivo
```

## 🎯 Funcionalidades

### Dashboard
- Visão geral das estatísticas
- Atividade recente
- Ações rápidas
- Status da conexão P2P

### Busca
- Busca avançada em todo o conteúdo
- Filtros por tipo, período e host
- Resultados em tempo real

### Conteúdo
- Gerenciamento de páginas capturadas
- Filtros e organização
- Visualização detalhada

### Analytics
- Gráficos de captura por período
- Top hosts
- Dados estatísticos detalhados

### Rede P2P
- Status da conexão
- Gerenciamento de peers
- Configurações de rede

### Configurações
- Preferências gerais

## 🚀 Sistema de Release

O BuscaLogo Desktop possui um sistema completo de release automático integrado com GitHub Actions.

### **Release Automático**
```bash
# Patch release (1.0.0 → 1.0.1)
./scripts/release.sh --patch

# Minor release (1.0.0 → 1.1.0)
./scripts/release.sh --minor

# Major release (1.0.0 → 2.0.0)
./scripts/release.sh --major
```

### **Verificar Status**
```bash
./scripts/release.sh --check
```

### **Documentação Completa**
Veja o [RELEASE_README.md](RELEASE_README.md) para informações detalhadas sobre o sistema de release.
- Configurações P2P
- Gerenciamento de dados

## 🔧 Desenvolvimento

### Scripts Disponíveis

- `npm start` - Executa o aplicativo
### **Desenvolvimento**
- `npm run dev` - Executa em modo de desenvolvimento
- `npm run start` - Executa a aplicação
- `npm run lint` - Executa linting
- `npm run lint:fix` - Corrige problemas de linting

### **Build**
- `npm run build` - Constrói para todas as plataformas
- `npm run build:win` - Constrói para Windows
- `npm run build:mac` - Constrói para macOS
- `npm run build:linux` - Constrói para Linux
- `npm run pack` - Empacota sem distribuir

### **Release**
- `npm run release:patch` - Release patch (1.0.0 → 1.0.1)
- `npm run release:minor` - Release minor (1.0.0 → 1.1.0)
- `npm run release:major` - Release major (1.0.0 → 2.0.0)
- `npm run draft` - Cria release draft
- `npm run prerelease` - Cria prerelease
- `npm run update-version` - Atualiza arquivos de versão

### **Scripts Avançados**
- `./scripts/release.sh --patch` - Release patch via script
- `./scripts/release.sh --check` - Verifica status para release
- `./scripts/update-version.js` - Atualiza versão em arquivos

## 🎯 System Tray

O BuscaLogo Desktop inclui um **system tray** que permite que a aplicação continue rodando em segundo plano:

### **Funcionalidades**
- **🔄 Minimização para Tray**: Feche a janela e a aplicação continua rodando
- **🎯 Menu de Contexto**: Acesso rápido às funcionalidades principais
- **⚡ Restauração Rápida**: Clique no ícone para restaurar a janela
- **💾 Persistência**: Dados e estado são mantidos em segundo plano

### **Como Usar**
- **Minimizar**: Feche a janela principal (X)
- **Restaurar**: Clique no ícone do tray
- **Sair**: Use "Sair" no menu ou Ctrl+Q/Cmd+Q

### **Suporte por Plataforma**
- ✅ **Windows**: System tray funcional
- ✅ **macOS**: System tray funcional  
- ✅ **Linux**: System tray funcional

*Para mais detalhes, consulte [TRAY_README.md](TRAY_README.md)*

### Tecnologias Utilizadas

- **Electron**: Framework para aplicativos desktop
- **HTML5/CSS3**: Interface moderna e responsiva
- **JavaScript ES6+**: Lógica da aplicação
- **WebSocket**: Comunicação P2P
- **IndexedDB**: Armazenamento local

### Padrões de Código

- **ESLint**: Configuração padrão para qualidade
- **Modularização**: Código organizado em módulos
- **Event-Driven**: Arquitetura baseada em eventos
- **Responsive Design**: Interface adaptável

## 🌐 Integração

### Extensão Chrome
O app desktop se integra perfeitamente com a extensão BuscaLogo:
- Sincronização automática de dados
- Detecção automática da extensão
- Compartilhamento de configurações

### Servidor P2P
- Conexão automática ao servidor de sinalização
- Heartbeat para manter conexão ativa
- Comunicação em tempo real

## 📱 Plataformas Suportadas

- **Windows**: Windows 10/11 (x64)
- **macOS**: macOS 10.15+ (Intel/Apple Silicon)
- **Linux**: Ubuntu 18.04+, Debian 10+, Fedora 30+

## 🚀 Distribuição

### Build Automático
O aplicativo é construído automaticamente para todas as plataformas:
- Windows: Instalador NSIS (.exe)
- macOS: Pacote DMG (.dmg)
- Linux: AppImage (.AppImage)

### Atualizações
- Sistema de atualizações automáticas
- Verificação de novas versões
- Download e instalação automática

## 🤝 Contribuição

### Como Contribuir

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

### Diretrizes de Contribuição

- Siga os padrões de código estabelecidos
- Teste suas mudanças localmente
- Documente novas funcionalidades
- Mantenha a compatibilidade com a extensão

## 📄 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 🆘 Suporte

### Documentação
- [Documentação da API](https://buscalogo.com/docs)
- [Guia de Desenvolvimento](https://buscalogo.com/dev)
- [FAQ](https://buscalogo.com/faq)

### Comunidade
- [Discord](https://discord.gg/AJjDJUc8bn)
- [GitHub Issues](https://github.com/buscalogo/desktop-app/issues)
- [Email](mailto:support@buscalogo.com)

### Roadmap
- [Funcionalidades Planejadas](https://buscalogo.com/roadmap)
- [Sprints](https://buscalogo.com/sprints)

## 🙏 Agradecimentos

- **Equipe BuscaLogo**: Desenvolvimento e manutenção
- **Contribuidores**: Comunidade open source
- **Usuários**: Feedback e sugestões valiosas

---

**Desenvolvido com ❤️ pela equipe BuscaLogo**

*Transformando a forma como coletamos e analisamos conteúdo web*
