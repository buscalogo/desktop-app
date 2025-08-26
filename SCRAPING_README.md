# 🎯 Sistema de Scraping - BuscaLogo Desktop

Sistema completo de captura e indexação de sites para o BuscaLogo Desktop, integrando com a API do BuscaLogo e armazenando dados localmente no IndexedDB.

## ✨ Funcionalidades

### **🎯 Captura Inteligente**
- **Captura Automática**: Sistema de fila para processar múltiplas URLs
- **Processamento Inteligente**: Extrai conteúdo principal, metadados, imagens e links
- **Priorização**: Sistema de prioridades (alta, normal, baixa) para URLs
- **Retry Automático**: Tentativas automáticas para páginas com erro
- **Rate Limiting**: Controle de velocidade para não sobrecarregar servidores

### **💾 Armazenamento Local**
- **IndexedDB**: Banco de dados local para armazenar páginas capturadas
- **Metadados Completos**: Título, descrição, keywords, Open Graph, Twitter Cards
- **Conteúdo Processado**: Texto limpo e estruturado
- **Histórico de Capturas**: Log completo de todas as operações
- **Metadados de Sites**: Estatísticas e informações dos domínios

### **🌐 Integração com API**
- **Sincronização Automática**: Envia dados capturados para a API do BuscaLogo
- **Status de Sincronização**: Controle de quais dados foram enviados
- **Fallback Local**: Funciona offline, sincroniza quando conectado
- **API RESTful**: Endpoints padronizados para integração

### **⚙️ Configuração Avançada**
- **Performance**: Controle de capturas simultâneas e delays
- **Limpeza Automática**: Remove dados antigos automaticamente
- **User Agents**: Configuração de identificadores de navegador
- **Filtros de Conteúdo**: Controle sobre o que capturar
- **Validação**: Verificação de URLs e conteúdo

## 🏗️ Arquitetura

### **Estrutura de Arquivos**
```
js/scraping/
├── scraping-config.js    # Configurações e constantes
├── scraper.js            # Sistema principal de scraping
└── scraping-controls.js  # Controles de interface
```

### **Componentes Principais**

#### **1. BuscaLogoScraper**
- **Gerenciamento de Fila**: Processa URLs em ordem de prioridade
- **Captura de Páginas**: Faz requisições HTTP e processa HTML
- **Processamento de Conteúdo**: Extrai e limpa dados
- **Armazenamento**: Salva no IndexedDB local
- **Sincronização**: Envia para API do BuscaLogo

#### **2. ScrapingControls**
- **Interface de Usuário**: Controles para gerenciar scraping
- **Monitoramento**: Status em tempo real da fila
- **Configurações**: Ajuste de parâmetros do sistema
- **Estatísticas**: Métricas de performance

#### **3. Configuração**
- **Configurações Padrão**: Valores recomendados para produção
- **Validação**: Verificação de configurações válidas
- **Ambientes**: Configurações específicas por ambiente

## 🚀 Como Usar

### **1. Adicionar URLs para Captura**
```javascript
// Adiciona URL com prioridade alta
await scraper.addToCaptureQueue('https://exemplo.com', {
  priority: 'high',
  captureImages: true,
  captureLinks: true
});
```

### **2. Monitorar Status da Fila**
```javascript
// Obtém estatísticas em tempo real
const stats = await scraper.getScrapingStats();
console.log('Páginas capturadas:', stats.capturedPages);
console.log('Itens na fila:', stats.queueLength);
```

### **3. Configurar Comportamento**
```javascript
// Ajusta configurações de performance
await scraper.saveScrapingSettings({
  maxConcurrentCaptures: 5,
  captureDelay: 500,
  maxRetries: 5
});
```

## 📊 Banco de Dados

### **Stores do IndexedDB**

#### **1. Pages Store**
```javascript
{
  id: 'unique_id',
  url: 'https://exemplo.com',
  host: 'exemplo.com',
  title: 'Título da Página',
  content: 'Conteúdo processado...',
  metadata: {
    description: 'Descrição da página',
    keywords: 'palavra1, palavra2',
    author: 'Autor',
    language: 'pt-BR'
  },
  images: [
    {
      src: 'https://exemplo.com/imagem.jpg',
      alt: 'Descrição da imagem',
      title: 'Título da imagem'
    }
  ],
  links: [
    {
      url: 'https://exemplo.com/link',
      text: 'Texto do link',
      title: 'Título do link'
    }
  ],
  status: 'captured',
  timestamp: 1234567890,
  captureTime: 1500,
  size: 10240,
  synced: true,
  syncTimestamp: 1234567890
}
```

#### **2. ScrapingSettings Store**
```javascript
{
  id: 'default',
  maxConcurrentCaptures: 3,
  captureDelay: 1000,
  maxRetries: 3,
  timeout: 30000,
  userAgent: 'BuscaLogo-Desktop/1.0.0',
  captureImages: true,
  captureLinks: true,
  maxContentSize: 10485760,
  autoCleanup: true,
  cleanupInterval: 86400000
}
```

#### **3. CaptureHistory Store**
```javascript
{
  id: 'unique_id',
  url: 'https://exemplo.com',
  status: 'success',
  timestamp: 1234567890,
  pageId: 'page_id',
  message: 'Página capturada com sucesso'
}
```

#### **4. SiteMetadata Store**
```javascript
{
  host: 'exemplo.com',
  lastVisit: 1234567890,
  visitCount: 5,
  firstVisit: 1234567890,
  lastStatus: 'success'
}
```

## 🔧 Configuração

### **Configurações Padrão**
```javascript
const defaultSettings = {
  maxConcurrentCaptures: 3,    // Capturas simultâneas
  captureDelay: 1000,          // Delay entre capturas (ms)
  maxRetries: 3,               // Tentativas para páginas com erro
  timeout: 30000,              // Timeout para cada captura (ms)
  userAgent: 'BuscaLogo-Desktop/1.0.0',
  captureImages: true,          // Capturar imagens
  captureLinks: true,           // Capturar links
  maxContentSize: 10485760,    // Tamanho máximo de conteúdo (10MB)
  autoCleanup: true,           // Limpeza automática
  cleanupInterval: 86400000     // Intervalo de limpeza (24h)
};
```

### **Configurações de Performance**
```javascript
const performanceConfig = {
  concurrency: {
    min: 1,        // Mínimo de capturas simultâneas
    max: 10,       // Máximo de capturas simultâneas
    default: 3     // Valor padrão
  },
  delays: {
    min: 0,        // Delay mínimo entre capturas
    max: 10000,    // Delay máximo entre capturas
    default: 1000  // Valor padrão
  }
};
```

## 🌐 Integração com API

### **Endpoints da API**
```javascript
const apiEndpoints = {
  pages: '/api/pages',           // Enviar páginas capturadas
  sites: '/api/sites',           // Informações de sites
  analytics: '/api/analytics'    // Dados analíticos
};
```

### **Formato de Dados Enviados**
```javascript
const apiData = {
  url: 'https://exemplo.com',
  host: 'exemplo.com',
  title: 'Título da Página',
  content: 'Conteúdo processado...',
  metadata: { /* metadados */ },
  images: [ /* lista de imagens */ ],
  links: [ /* lista de links */ ],
  timestamp: 1234567890,
  source: 'desktop-app',
  version: '1.0.0'
};
```

## 📈 Monitoramento e Analytics

### **Métricas Disponíveis**
- **Total de Páginas**: Número total de páginas capturadas
- **Taxa de Sucesso**: Porcentagem de capturas bem-sucedidas
- **Tempo de Captura**: Tempo médio para capturar cada página
- **Status da Fila**: Número de itens aguardando processamento
- **Erros**: Contagem e tipos de erros encontrados

### **Logs e Histórico**
- **Histórico de Capturas**: Log completo de todas as operações
- **Metadados de Sites**: Informações sobre domínios visitados
- **Performance**: Métricas de tempo e recursos utilizados
- **Erros**: Detalhes de falhas e tentativas de retry

## 🛡️ Segurança e Boas Práticas

### **Headers de Requisição**
```javascript
const headers = {
  'User-Agent': 'BuscaLogo-Desktop/1.0.0',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9',
  'Accept-Language': 'pt-BR,pt;q=0.9,en;q=0.8',
  'DNT': '1',
  'Connection': 'keep-alive'
};
```

### **Validação de URLs**
- **Protocolos Permitidos**: Apenas HTTP e HTTPS
- **Domínios Bloqueados**: Localhost e IPs privados
- **Tamanho Máximo**: Limite de 2048 caracteres
- **Formato Válido**: Verificação de estrutura de URL

### **Rate Limiting**
- **Delays Configuráveis**: Tempo entre capturas
- **Concorrência Limitada**: Máximo de capturas simultâneas
- **Respeito a Robots.txt**: Verificação de permissões
- **User Agent Consistente**: Identificação clara do bot

## 🔄 Sincronização e Backup

### **Sincronização Automática**
- **Envio Imediato**: Dados enviados após captura bem-sucedida
- **Status de Sincronização**: Controle de quais dados foram enviados
- **Retry de Sincronização**: Tentativas automáticas para falhas
- **Fallback Local**: Funciona offline, sincroniza quando conectado

### **Backup e Exportação**
- **Exportação JSON**: Dados em formato padrão
- **Exportação CSV**: Para análise em planilhas
- **Compressão**: Reduz tamanho de arquivos grandes
- **Validação**: Verificação de integridade dos dados

## 🚨 Tratamento de Erros

### **Tipos de Erro**
- **Erros de Rede**: Timeout, conexão recusada
- **Erros HTTP**: 4xx, 5xx, redirecionamentos
- **Erros de Conteúdo**: HTML inválido, tamanho excessivo
- **Erros de Banco**: Falhas no IndexedDB

### **Estratégias de Recuperação**
- **Retry Automático**: Tentativas com delay crescente
- **Fallback de Configurações**: Valores padrão em caso de erro
- **Logging Detalhado**: Registro de todos os erros
- **Notificações ao Usuário**: Alertas sobre problemas

## 📱 Interface de Usuário

### **Dashboard de Scraping**
- **Formulário de Captura**: Adicionar URLs com opções
- **Status da Fila**: Monitoramento em tempo real
- **Lista de Itens**: Visualização e gerenciamento da fila
- **Estatísticas**: Métricas de performance
- **Configurações**: Ajuste de parâmetros

### **Controles de Fila**
- **Pausar/Resumir**: Controle de execução
- **Limpar Fila**: Remover todos os itens
- **Priorizar Itens**: Ajustar ordem de processamento
- **Remover Itens**: Excluir URLs específicas

## 🔮 Roadmap e Melhorias

### **Funcionalidades Planejadas**
- **Captura com Puppeteer**: Suporte a JavaScript e SPAs
- **OCR de Imagens**: Extração de texto de imagens
- **Análise de Sentimento**: Classificação de conteúdo
- **Machine Learning**: Detecção automática de conteúdo relevante
- **API de Webhooks**: Notificações em tempo real

### **Melhorias de Performance**
- **Cache Inteligente**: Evita recaptura de conteúdo similar
- **Compressão de Dados**: Reduz uso de armazenamento
- **Processamento Paralelo**: Otimização de recursos
- **Lazy Loading**: Carregamento sob demanda

## 🤝 Contribuição

### **Como Contribuir**
1. **Fork do Projeto**: Clone e fa suas modificações
2. **Testes**: Verifique funcionamento em diferentes cenários
3. **Documentação**: Atualize documentação conforme necessário
4. **Pull Request**: Envie suas melhorias para revisão

### **Padrões de Código**
- **ESLint**: Configuração padrão para qualidade
- **JSDoc**: Documentação de funções e classes
- **Testes**: Cobertura de testes para funcionalidades críticas
- **Performance**: Otimização de algoritmos e recursos

---

**Desenvolvido com ❤️ pela equipe BuscaLogo**

*Transformando a forma como coletamos e analisamos conteúdo web*
