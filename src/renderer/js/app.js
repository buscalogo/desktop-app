/**
 * BuscaLogo Desktop App - Main Application
 * 
 * Gerencia a aplicação principal, navegação entre views e comunicação
 * com o processo principal do Electron.
 */

class BuscaLogoDesktop {
  constructor() {
    this.currentView = 'dashboard';
    this.systemInfo = null;
    this.settings = {};
    
    this.init();
  }
  
  /**
   * Inicializa a aplicação
   */
  async init() {
    try {
      console.log('🚀 BuscaLogo Desktop iniciando...');
      
      // Carrega informações do sistema
      await this.loadSystemInfo();
      
      // Carrega configurações
      await this.loadSettings();
      
      // Configura event listeners
      this.setupEventListeners();
      
      // Configura navegação
      this.setupNavigation();
      
      // Inicializa componentes
      await this.initComponents();
      
      // Carrega dados iniciais
      await this.loadInitialData();
      
      // Configura tema
      this.setupTheme();
      
      // Configura sincronização com extensão
      this.setupExtensionSync();
      
      // Configura atualização automática de estatísticas
      this.setupStatsAutoRefresh();
      
      console.log('✅ BuscaLogo Desktop iniciado com sucesso');
      
    } catch (error) {
      console.error('❌ Erro ao inicializar aplicação:', error);
      this.showError('Erro de Inicialização', error.message);
    }
  }
  
  /**
   * Carrega informações do sistema
   */
  async loadSystemInfo() {
    try {
      this.systemInfo = await window.electronAPI.getSystemInfo();
      console.log('📊 Informações do sistema carregadas:', this.systemInfo);
      
      // Atualiza versão no header
      const versionElement = document.querySelector('.logo-version');
      if (versionElement) {
        versionElement.textContent = `Desktop v${this.systemInfo.appVersion}`;
      }
      
    } catch (error) {
      console.error('❌ Erro ao carregar informações do sistema:', error);
    }
  }
  
  /**
   * Carrega configurações
   */
  async loadSettings() {
    try {
      const result = window.storageAPI.loadData('buscalogo-settings');
      if (result.success && result.data) {
        this.settings = { ...this.getDefaultSettings(), ...result.data };
      } else {
        this.settings = this.getDefaultSettings();
      }
      
      console.log('⚙️ Configurações carregadas:', this.settings);
      
    } catch (error) {
      console.error('❌ Erro ao carregar configurações:', error);
      this.settings = this.getDefaultSettings();
    }
  }
  
  /**
   * Retorna configurações padrão
   */
  getDefaultSettings() {
    return {
      theme: 'auto',
      startupView: 'dashboard',
      autoSync: true,

      maxStorageSize: 1000,
      autoCleanup: true,
      cleanupInterval: 30
    };
  }
  
  /**
   * Configura event listeners
   */
  setupEventListeners() {
    // Busca principal
    const mainSearch = document.getElementById('mainSearch');
    const searchButton = document.getElementById('searchButton');
    
    if (mainSearch) {
      mainSearch.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          this.performSearch();
        }
      });
    }
    
    if (searchButton) {
      searchButton.addEventListener('click', () => {
        this.performSearch();
      });
    }
    
    // Botões do header
    const themeToggle = document.getElementById('themeToggle');
    const settingsButton = document.getElementById('settingsButton');
    const syncButton = document.getElementById('syncButton');
    
    if (themeToggle) {
      themeToggle.addEventListener('click', () => {
        this.toggleTheme();
      });
    }
    
    if (settingsButton) {
      settingsButton.addEventListener('click', () => {
        this.showView('settings');
      });
    }
    
    if (syncButton) {
      syncButton.addEventListener('click', () => {
        this.syncWithExtension();
      });
    }
    

    
    // Eventos do menu
    window.electronAPI.onMenuAction((action) => {
      this.handleMenuAction(action);
    });
    
    // Eventos de erro
    window.electronAPI.onError((error) => {
      this.handleError(error);
    });
    
    console.log('🔌 Event listeners configurados');
  }
  
  /**
   * Configura navegação
   */
  setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        
        const view = link.getAttribute('data-view');
        if (view) {
          this.showView(view);
        }
      });
    });
    
    console.log('🧭 Navegação configurada');
  }
  
  /**
   * Inicializa componentes
   */
  async initComponents() {
    try {
      // Inicializa sistema de scraping primeiro
      await this.initScraping();
      
      // Inicializa outros componentes
      this.initDashboard();
      this.initSearch();
      this.initAnalytics();
      this.initSettings();
      
      console.log('🧩 Componentes inicializados');
      
    } catch (error) {
      console.error('❌ Erro ao inicializar componentes:', error);
    }
  }
  
  /**
   * Carrega dados iniciais
   */
  async loadInitialData() {
    try {
      // Carrega estatísticas gerais primeiro
      await this.loadStats();
      
      // Carrega atividade recente
      await this.loadRecentActivity();
      
      // Carrega estatísticas de scraping (status da API)
      await this.loadScrapingStats();
      
      console.log('📊 Dados iniciais carregados');
      
    } catch (error) {
      console.error('❌ Erro ao carregar dados iniciais:', error);
    }
  }
  
  /**
   * Configura tema
   */
  setupTheme() {
    const theme = this.settings.theme;
    
    if (theme === 'auto') {
      this.setAutoTheme();
    } else {
      this.setTheme(theme);
    }
    
    // Atualiza ícone do botão de tema
    this.updateThemeIcon();
    
    console.log('🎨 Tema configurado:', theme);
  }
  
  /**
   * Define tema automático
   */
  setAutoTheme() {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    this.setTheme(prefersDark ? 'dark' : 'light');
    
    // Escuta mudanças na preferência do sistema
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      this.setTheme(e.matches ? 'dark' : 'light');
    });
  }
  
  /**
   * Define tema específico
   */
  setTheme(theme) {
    document.body.className = `theme-${theme}`;
    this.settings.theme = theme;
    
    // Salva configuração
    window.storageAPI.saveData('buscalogo-settings', this.settings);
    
    // Atualiza ícone
    this.updateThemeIcon();
  }
  
  /**
   * Atualiza ícone do botão de tema
   */
  updateThemeIcon() {
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
      const themeIcon = themeToggle.querySelector('.theme-icon');
      if (themeIcon) {
        const currentTheme = document.body.className.replace('theme-', '');
        themeIcon.textContent = currentTheme === 'dark' ? '☀️' : '🌙';
      }
    }
  }
  
  /**
   * Alterna tema
   */
  toggleTheme() {
    const currentTheme = document.body.className.replace('theme-', '');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    this.setTheme(newTheme);
  }
  
  /**
   * Configura sincronização com extensão
   */
  setupExtensionSync() {
    // Verifica se a extensão está instalada
    window.extensionAPI.checkExtensionInstalled().then(result => {
      if (result.installed) {
        console.log('✅ Extensão BuscaLogo detectada');
        this.updateExtensionStatus(true);
        
        // Sincroniza dados se configurado
        if (this.settings.autoSync) {
          this.syncWithExtension();
        }
      } else {
        console.log('⚠️ Extensão BuscaLogo não detectada');
        this.updateExtensionStatus(false);
      }
    }).catch(error => {
      console.error('❌ Erro ao verificar extensão:', error);
      this.updateExtensionStatus(false);
    });
  }
  
  /**
   * Atualiza status da extensão
   */
  updateExtensionStatus(installed) {
    const syncButton = document.getElementById('syncButton');
    if (syncButton) {
      const syncIcon = syncButton.querySelector('.sync-icon');
      if (syncIcon) {
        syncIcon.textContent = installed ? '✅' : '❌';
        syncButton.title = installed ? 'Sincronizar com extensão' : 'Extensão não instalada';
      }
    }
  }
  
  /**
   * Sincroniza com extensão
   */
  async syncWithExtension() {
    try {
      console.log('🔄 Iniciando sincronização com extensão...');
      
      const result = await window.extensionAPI.syncWithExtension();
      
      if (result.success) {
        console.log('✅ Sincronização bem-sucedida:', result.data);
        
        // Processa dados sincronizados
        await this.processExtensionData(result.data);
        
        // Atualiza interface
        await this.loadStats();
        await this.loadRecentActivity();
        
        this.showSuccess('Sincronização', 'Dados sincronizados com sucesso!');
        
      } else {
        throw new Error(result.message);
      }
      
    } catch (error) {
      console.error('❌ Erro na sincronização:', error);
      this.showError('Erro de Sincronização', error.message);
    }
  }
  
  /**
   * Processa dados da extensão
   */
  async processExtensionData(data) {
    try {
      // Processa páginas
      if (data.pages) {
        const pages = JSON.parse(data.pages);
        await this.importPages(pages);
      }
      
      // Processa configurações
      if (data.settings) {
        const settings = JSON.parse(data.settings);
        this.settings = { ...this.settings, ...settings };
        await this.saveSettings();
      }
      
      // Processa histórico
      if (data.history) {
        const history = JSON.parse(data.history);
        await this.importHistory(history);
      }
      
      console.log('📊 Dados da extensão processados');
      
    } catch (error) {
      console.error('❌ Erro ao processar dados da extensão:', error);
      throw error;
    }
  }
  
  /**
   * Mostra view específica
   */
  showView(viewName) {
    // Esconde todas as views
    const views = document.querySelectorAll('.view-content');
    views.forEach(view => {
      view.classList.remove('active');
    });
    
    // Mostra view selecionada
    const targetView = document.getElementById(viewName);
    if (targetView) {
      targetView.classList.add('active');
      this.currentView = viewName;
      
      // Atualiza navegação
      this.updateNavigation(viewName);
      
      // Carrega dados específicos da view
      this.loadViewData(viewName);
      
      // Inicializa view específica se necessário
      if (viewName === 'scraping') {
        this.initScrapingView();
      }
      
      console.log(`📱 View alterada para: ${viewName}`);
    }
  }
  
  /**
   * Atualiza navegação
   */
  updateNavigation(activeView) {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('data-view') === activeView) {
        link.classList.add('active');
      }
    });
  }
  
  /**
   * Carrega dados específicos da view
   */
  loadViewData(viewName) {
    switch (viewName) {
      case 'dashboard':
        this.loadDashboardData();
        break;
      case 'search':
        this.loadSearchData();
        break;
      
      case 'analytics':
        this.loadAnalyticsData();
        break;
      case 'scraping':
        this.loadScrapingData();
        break;
      case 'settings':
        this.loadSettingsData();
        break;
    }
  }
  
  /**
   * Executa busca
   */
  performSearch() {
    const searchInput = document.getElementById('mainSearch');
    const query = searchInput.value.trim();
    
    if (query) {
      // Muda para view de busca
      this.showView('search');
      
      // Executa busca
      this.executeSearch(query);
      
      // Limpa input
      searchInput.value = '';
    }
  }
  
  /**
   * Executa busca específica
   */
  executeSearch(query) {
    // Implementar lógica de busca
    console.log('🔍 Executando busca:', query);
  }
  

  

  
  /**
   * Trata ações do menu
   */
  handleMenuAction(action) {
    switch (action) {
      case 'new-search':
        this.showView('search');
        break;
      case 'open-dashboard':
        this.showView('dashboard');
        break;
      case 'open-preferences':
        this.showView('settings');
        break;
      case 'sync-extension':
        this.syncWithExtension();
        break;
      case 'check-updates':
        this.checkForUpdates();
        break;
      case 'show-logs':
        this.showLogs();
        break;
      case 'show-about':
        this.showAbout();
        break;
    }
  }
  
  /**
   * Trata erros
   */
  handleError(error) {
    console.error('❌ Erro capturado:', error);
    
    let title = 'Erro';
    let message = 'Ocorreu um erro inesperado';
    
    switch (error.type) {
      case 'uncaught':
        title = 'Erro Não Capturado';
        message = error.message;
        break;
      case 'unhandled-rejection':
        title = 'Promise Rejeitada';
        message = error.reason?.message || error.reason || 'Promise rejeitada não tratada';
        break;
    }
    
    this.showError(title, message);
  }
  
  /**
   * Mostra mensagem de erro
   */
  showError(title, message) {
    window.electronAPI.showErrorDialog(title, message);
  }
  
  /**
   * Mostra mensagem de sucesso
   */
  showSuccess(title, message) {
    window.electronAPI.showInfoDialog(title, message);
  }
  
  /**
   * Verifica atualizações
   */
  checkForUpdates() {
    console.log('🔄 Verificando atualizações...');
    // Implementar verificação de atualizações
  }
  
  /**
   * Mostra logs
   */
  showLogs() {
    console.log('📋 Mostrando logs...');
    // Implementar visualização de logs
  }
  
  /**
   * Mostra informações sobre o app
   */
  showAbout() {
    const aboutInfo = {
      title: 'Sobre BuscaLogo Desktop',
      content: `
        <div style="text-align: center; padding: 20px;">
          <h2>🔍 BuscaLogo Desktop</h2>
          <p><strong>Versão:</strong> ${this.systemInfo?.appVersion || '1.0.0'}</p>
          <p><strong>Plataforma:</strong> ${this.systemInfo?.platform || 'Unknown'}</p>
          <p><strong>Node.js:</strong> ${this.systemInfo?.version || 'Unknown'}</p>
          <p><strong>Arquitetura:</strong> ${this.systemInfo?.arch || 'Unknown'}</p>
          <br>
          <p>BuscaLogo é uma plataforma inteligente para coleta e análise de conteúdo web.</p>
          <p>Desenvolvido com ❤️ pela equipe BuscaLogo</p>
        </div>
      `
    };
    
    // Mostra modal com informações
    this.showModal(aboutInfo.title, aboutInfo.content);
  }
  
  /**
   * Mostra modal
   */
  showModal(title, content) {
    const modalTitle = document.getElementById('modalTitle');
    const modalContent = document.getElementById('modalContent');
    const modalOverlay = document.getElementById('modalOverlay');
    
    if (modalTitle && modalContent && modalOverlay) {
      modalTitle.textContent = title;
      modalContent.innerHTML = content;
      modalOverlay.classList.remove('hidden');
    }
  }
  
  /**
   * Esconde modal
   */
  hideModal() {
    const modalOverlay = document.getElementById('modalOverlay');
    if (modalOverlay) {
      modalOverlay.classList.add('hidden');
    }
  }
  
  /**
   * Salva configurações
   */
  async saveSettings() {
    try {
      const result = window.storageAPI.saveData('buscalogo-settings', this.settings);
      
      if (result.success) {
        console.log('✅ Configurações salvas');
        return true;
      } else {
        throw new Error(result.message);
      }
      
    } catch (error) {
      console.error('❌ Erro ao salvar configurações:', error);
      return false;
    }
  }
  
  /**
   * Verifica se o scraper está inicializado
   */
  isScraperReady() {
    return this.scraper && this.scraper.db && this.scraper.db.objectStoreNames.length > 0;
  }
  
  /**
   * Carrega estatísticas
   */
  async loadStats() {
    try {
      // Carrega estatísticas gerais
      console.log('📊 Carregando estatísticas...');
      
      // Verifica se o scraper está pronto
      if (!this.isScraperReady()) {
        console.log('⏳ Aguardando inicialização do scraper...');
        return;
      }
      
      // Obtém estatísticas do scraper se disponível
      let stats = null;
      if (this.scraper) {
        console.log('🎯 Scraper disponível, obtendo estatísticas...');
        stats = await this.scraper.getStats();
        console.log('📊 Estatísticas obtidas do scraper:', stats);
      } else {
        console.log('⚠️ Scraper não disponível ainda');
      }
      
      // Atualiza estatísticas do dashboard
      const totalPagesElement = document.getElementById('totalPages');
      const uniqueHostsElement = document.getElementById('uniqueHosts');
      const totalSizeElement = document.getElementById('totalSize');
      const activePeersElement = document.getElementById('activePeers');
      
      console.log('🔍 Elementos do dashboard encontrados:', {
        totalPages: !!totalPagesElement,
        uniqueHosts: !!uniqueHostsElement,
        totalSize: !!totalSizeElement,
        activePeers: !!activePeersElement
      });
      
      if (totalPagesElement) {
        const value = stats ? stats.totalPages : '0';
        totalPagesElement.textContent = value;
        console.log('📄 Total de páginas atualizado:', value);
      }
      
      if (uniqueHostsElement) {
        const value = stats ? stats.uniqueHosts : '0';
        uniqueHostsElement.textContent = value;
        console.log('🌐 Hosts únicos atualizados:', value);
      }
      
      if (totalSizeElement) {
        let value = '0 MB';
        if (stats && stats.totalSize > 0) {
          value = `${stats.totalSize} MB`;
        }
        totalSizeElement.textContent = value;
        console.log('📊 Tamanho total atualizado:', value);
      }
      
      if (activePeersElement) {
        // Mostra status da API como "peers ativos"
        let value = '0 peers';
        if (stats && stats.apiConnected) {
          value = '1 peer';
        }
        activePeersElement.textContent = value;
        console.log('🔗 Peers ativos atualizados:', value);
      }
      
      console.log('✅ Estatísticas do dashboard atualizadas com sucesso');
      
    } catch (error) {
      console.error('❌ Erro ao carregar estatísticas:', error);
    }
  }
  
  /**
   * Carrega estatísticas de scraping
   */
  async loadScrapingStats() {
    try {
      const stats = await this.getScrapingStats();
      
      if (stats) {
        // Atualiza estatísticas do dashboard de scraping
        const totalPagesElement = document.getElementById('totalPages');
        const capturedPagesElement = document.getElementById('capturedPages');
        const failedPagesElement = document.getElementById('failedPages');
        const successRateElement = document.getElementById('successRate');
        
        // Atualiza total de páginas
        if (totalPagesElement) {
          totalPagesElement.textContent = stats.totalPages || 0;
        }
        
        // Atualiza páginas capturadas
        if (capturedPagesElement) {
          capturedPagesElement.textContent = stats.capturedPages || 0;
        }
        
        // Calcula páginas com erro (diferença entre total e capturadas)
        const failedPages = Math.max(0, (stats.totalPages || 0) - (stats.capturedPages || 0));
        if (failedPagesElement) {
          failedPagesElement.textContent = failedPages;
        }
        
        // Calcula taxa de sucesso
        let successRate = 0;
        if (stats.totalPages && stats.totalPages > 0) {
          successRate = Math.round(((stats.capturedPages || 0) / stats.totalPages) * 100);
        }
        if (successRateElement) {
          successRateElement.textContent = `${successRate}%`;
        }
        
        // Atualiza status da conexão se disponível
        const connectionStatusElement = document.getElementById('connectionStatus');
        if (connectionStatusElement) {
          if (stats.apiConnected) {
            connectionStatusElement.textContent = 'Conectado';
            connectionStatusElement.className = 'status-text connected';
          } else {
            connectionStatusElement.textContent = 'Desconectado';
            connectionStatusElement.className = 'status-text disconnected';
          }
        }
        
        // Atualiza status dos dados se disponível
        const dataStatusElement = document.getElementById('dataStatus');
        if (dataStatusElement) {
          dataStatusElement.textContent = `${stats.totalPages || 0} páginas`;
        }
        
        console.log('📊 Estatísticas de scraping atualizadas:', {
          totalPages: stats.totalPages,
          capturedPages: stats.capturedPages,
          failedPages,
          successRate: `${successRate}%`,
          apiConnected: stats.apiConnected
        });
      }
      
    } catch (error) {
      console.error('❌ Erro ao carregar estatísticas de scraping:', error);
    }
  }
  
  /**
   * Carrega atividade recente
   */
  async loadRecentActivity() {
    // Implementar carregamento de atividade recente
    console.log('📅 Carregando atividade recente...');
  }
  
  /**
   * Importa páginas
   */
  async importPages(pages) {
    // Implementar importação de páginas
    console.log('📄 Importando páginas:', pages.length);
  }
  
  /**
   * Importa histórico
   */
  async importHistory(history) {
    // Implementar importação de histórico
    console.log('📚 Importando histórico:', history.length);
  }
  
  // Métodos de inicialização das views (serão implementados nos arquivos específicos)
  initDashboard() {
    try {
      if (window.DashboardView) {
        this.dashboardView = new window.DashboardView();
        console.log('🏠 Dashboard view inicializada');
      }
    } catch (error) {
      console.error('❌ Erro ao inicializar dashboard:', error);
    }
  }
  
  initSearch() {
    try {
      if (window.SearchView) {
        this.searchView = new window.SearchView();
        console.log('🔍 Search view inicializada');
      }
    } catch (error) {
      console.error('❌ Erro ao inicializar search:', error);
    }
  }

  async initAnalytics() {
    try {
      // Verifica se a view de analytics está disponível
      if (window.AnalyticsView) {
        this.analyticsView = new window.AnalyticsView();
        await this.analyticsView.init();
        console.log('📊 View de analytics inicializada e configurada');
      } else {
        console.warn('⚠️ View de analytics não disponível');
      }
    } catch (error) {
      console.error('❌ Erro ao inicializar analytics:', error);
    }
  }
  
  initScraping() {}
  
  initSettings() {
    try {
      if (window.SettingsView) {
        this.settingsView = new window.SettingsView();
        console.log('⚙️ Settings view inicializada');
      }
    } catch (error) {
      console.error('❌ Erro ao inicializar settings:', error);
    }
  }
  
  loadDashboardData() {}
  loadSearchData() {}

  loadAnalyticsData() {}
  loadScrapingData() {}
  loadSettingsData() {}
  
  /**
   * Inicializa sistema de scraping
   */
  async initScraping() {
    try {
      // Verifica se o sistema de scraping está disponível
      if (window.BuscaLogoScraper) {
        this.scraper = new window.BuscaLogoScraper();
        await this.scraper.init();
        
        // Adiciona listener para atualizações da fila
        this.scraper.addQueueUpdateListener(() => {
          this.refreshStats();
        });
        
        // NOTA: Sincronização automática com servidor foi desabilitada
        // para evitar envio desnecessário de mensagens PAGE_CAPTURED
        // O desktop app funciona independentemente do servidor
        
        console.log('🎯 Sistema de scraping inicializado');
      } else {
        console.warn('⚠️ Sistema de scraping não disponível');
      }
    } catch (error) {
      console.error('❌ Erro ao inicializar scraping:', error);
    }
  }
  
  /**
   * Inicializa controles de scraping quando a view for mostrada
   */
  initScrapingView() {
    try {
      if (this.scraper && window.ScrapingControls) {
        // Inicializa controles apenas se não foram inicializados
        if (!this.scrapingControls) {
          this.scrapingControls = new window.ScrapingControls(this.scraper);
          console.log('🎛️ Controles de scraping inicializados');
        }
      }
    } catch (error) {
      console.error('❌ Erro ao inicializar controles de scraping:', error);
    }
  }
  
  /**
   * Adiciona URL para captura
   */
  async addUrlForCapture(url, options = {}) {
    try {
      if (!this.scraper) {
        throw new Error('Sistema de scraping não inicializado');
      }
      
      const priority = options.priority || 'normal';
      const success = this.scraper.addUrlForCapture(url, priority);
      
      if (success) {
        this.showSuccess('URL Adicionada', 'URL adicionada à fila de captura com sucesso');
        return { success: true, message: 'URL adicionada com sucesso' };
      } else {
        throw new Error('Falha ao adicionar URL à fila');
      }
      
    } catch (error) {
      console.error('❌ Erro ao adicionar URL:', error);
      this.showError('Erro ao Adicionar URL', error.message);
      return { success: false, error: error.message };
    }
  }
  
  /**
   * Obtém estatísticas de scraping
   */
  async getScrapingStats() {
    try {
      if (!this.scraper) {
        return null;
      }
      
      return await this.scraper.getStats();
      
    } catch (error) {
      console.error('❌ Erro ao obter estatísticas de scraping:', error);
      return null;
    }
  }
  
  /**
   * Abre interface de scraping
   */
  openScrapingInterface() {
    // Mostra a view de scraping no app principal
    this.showView('scraping');
  }

  /**
   * Atualiza estatísticas em tempo real
   */
  async refreshStats() {
    try {
      // Verifica se o scraper está pronto antes de atualizar
      if (!this.isScraperReady()) {
        console.log('⏳ Scraper não está pronto, aguardando...');
        return;
      }
      
      await this.loadStats();
      await this.loadScrapingStats();
      console.log('🔄 Estatísticas atualizadas');
    } catch (error) {
      console.error('❌ Erro ao atualizar estatísticas:', error);
    }
  }
  
  /**
   * Configura atualização automática de estatísticas
   */
  setupStatsAutoRefresh() {
    // Atualiza estatísticas a cada 30 segundos
    setInterval(async () => {
      // Só atualiza se o scraper estiver pronto
      if (this.isScraperReady()) {
        await this.refreshStats();
      } else {
        console.log('⏳ Aguardando scraper estar pronto para atualizar estatísticas...');
      }
    }, 30000);
    
    // Tenta carregar estatísticas a cada 5 segundos até o scraper estar pronto
    const statsRetryInterval = setInterval(async () => {
      if (this.isScraperReady()) {
        console.log('🎯 Scraper está pronto, carregando estatísticas...');
        await this.loadStats();
        clearInterval(statsRetryInterval);
      }
    }, 5000);
    
    console.log('⏰ Atualização automática de estatísticas configurada');
  }
}

// Inicializa a aplicação quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
  // Configura fechamento do modal
  const modalOverlay = document.getElementById('modalOverlay');
  const modalClose = document.getElementById('modalClose');
  
  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        window.buscalogoApp.hideModal();
      }
    });
  }
  
  if (modalClose) {
    modalClose.addEventListener('click', () => {
      window.buscalogoApp.hideModal();
    });
  }
  
  // Inicializa aplicação
  window.buscalogoApp = new BuscaLogoDesktop();
});

console.log('🚀 BuscaLogo Desktop App carregado');
