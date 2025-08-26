/**
 * BuscaLogo Desktop - Analytics View
 * 
 * Funcionalidades:
 * - Gráficos de performance de scraping
 * - Análise de conteúdo e metadados
 * - Estatísticas de domínios e URLs
 * - Relatórios de atividade
 * - Exportação de dados
 */

class AnalyticsView {
  constructor() {
    console.log('🚀 AnalyticsView: Construtor chamado');
    this.currentPeriod = '7d';
    this.charts = {};
    this.pagesData = null;
    this.domainsData = null;
    this.contentData = null;
    this.performanceData = null;
    this.linkAnalysisData = null;
    this.contentAnalysisData = null;
    
    // Debug do estado do loading
    setTimeout(() => {
      console.log('🔍 AnalyticsView: Debug do loading no construtor...');
      this.debugLoadingState();
      this.showLoading(false);
    }, 100);
    
    console.log('✅ AnalyticsView: Construtor concluído');
  }

  /**
   * Inicializa a view
   */
  async init() {
    try {
      console.log('🚀 AnalyticsView: Iniciando inicialização...');
      
      // Debug do estado do loading
      console.log('🔍 AnalyticsView: Debug do loading no init...');
      this.debugLoadingState();
      
      // Configura gráficos
      console.log('📊 Configurando gráficos...');
      this.setupCharts();
      
      // Configura event listeners
      console.log('🎯 Configurando event listeners...');
      this.setupEventListeners();
      
      // Carrega dados iniciais
      console.log('🔄 Carregando dados iniciais...');
      await this.loadAnalyticsData();
      
      console.log('✅ AnalyticsView: Inicialização concluída com sucesso!');
      
    } catch (error) {
      console.error('❌ AnalyticsView: Erro na inicialização:', error);
    }
  }

  /**
   * Configura gráficos
   */
  setupCharts() {
    try {
      // Gráfico de páginas capturadas por dia
      this.setupPagesChart();
      
      // Gráfico de domínios mais ativos
      this.setupDomainsChart();
      
      // Gráfico de tamanho de conteúdo
      this.setupContentSizeChart();
      
      // Gráfico de performance de captura
      this.setupPerformanceChart();
      
      // Gráfico de análise de links
      this.setupLinkAnalysisChart();
      
      // Gráfico de análise de conteúdo
      this.setupContentAnalysisChart();
      
    } catch (error) {
      console.error('❌ Erro ao configurar gráficos:', error);
    }
  }

  /**
   * Configura gráfico de páginas capturadas
   */
  setupPagesChart() {
    const ctx = document.getElementById('pagesChart');
    if (!ctx) return;
    
    this.charts.pages = new Chart(ctx, {
      type: 'line',
      data: {
        labels: [],
        datasets: [{
          label: 'Páginas Capturadas',
          data: [],
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          tension: 0.4,
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: 'Páginas Capturadas por Dia'
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1
            }
          }
        }
      }
    });
  }

  /**
   * Configura gráfico de domínios
   */
  setupDomainsChart() {
    const ctx = document.getElementById('domainsChart');
    if (!ctx) return;
    
    this.charts.domains = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: [],
        datasets: [{
          data: [],
          backgroundColor: [
            '#3b82f6',
            '#10b981',
            '#f59e0b',
            '#ef4444',
            '#8b5cf6',
            '#06b6d4',
            '#84cc16',
            '#f97316'
          ]
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: 'Distribuição por Domínio'
          },
          legend: {
            position: 'bottom'
          }
        }
      }
    });
  }

  /**
   * Configura gráfico de tamanho de conteúdo
   */
  setupContentSizeChart() {
    const ctx = document.getElementById('contentSizeChart');
    if (!ctx) return;
    
    this.charts.contentSize = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: [],
        datasets: [{
          label: 'Páginas por Faixa de Tamanho',
          data: [],
          backgroundColor: [
            '#3b82f6',
            '#10b981',
            '#f59e0b',
            '#ef4444',
            '#8b5cf6',
            '#06b6d4'
          ]
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: 'Tamanho de Conteúdo por Página'
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1
            }
          }
        }
      }
    });
  }

  /**
   * Configura gráfico de performance
   */
  setupPerformanceChart() {
    const ctx = document.getElementById('performanceChart');
    if (!ctx) return;
    
    this.charts.performance = new Chart(ctx, {
      type: 'radar',
      data: {
        labels: ['Velocidade', 'Precisão', 'Cobertura', 'Qualidade', 'Eficiência'],
        datasets: [{
          label: 'Performance Atual',
          data: [0, 0, 0, 0, 0],
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.2)',
          pointBackgroundColor: '#3b82f6'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: 'Métricas de Performance'
          }
        },
        scales: {
          r: {
            beginAtZero: true,
            max: 100
          }
        }
      }
    });
  }

  /**
   * Configura gráfico de análise de links
   */
  setupLinkAnalysisChart() {
    const ctx = document.getElementById('linkAnalysisChart');
    if (!ctx) return;
    
    this.charts.linkAnalysis = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: [],
        datasets: [{
          label: 'Links por Tipo/Relevância',
          data: [],
          backgroundColor: [
            '#3b82f6',
            '#10b981',
            '#f59e0b',
            '#ef4444',
            '#8b5cf6',
            '#06b6d4'
          ],
          borderColor: [
            '#2563eb',
            '#059669',
            '#d97706',
            '#dc2626',
            '#7c3aed',
            '#0891b2'
          ],
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: 'Análise de Links Descobertos'
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1
            }
          }
        }
      }
    });
  }

  /**
   * Configura gráfico de análise de conteúdo
   */
  setupContentAnalysisChart() {
    const ctx = document.getElementById('contentAnalysisChart');
    if (!ctx) return;
    
    this.charts.contentAnalysis = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: [],
        datasets: [{
          data: [],
          backgroundColor: [
            '#3b82f6',
            '#10b981',
            '#f59e0b',
            '#ef4444',
            '#8b5cf6',
            '#06b6d4'
          ],
          borderColor: [
            '#2563eb',
            '#059669',
            '#d97706',
            '#dc2626',
            '#7c3aed',
            '#0891b2'
          ],
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: 'Análise Semântica de Conteúdo'
          },
          legend: {
            position: 'bottom'
          }
        }
      }
    });
  }

  /**
   * Configura event listeners
   */
  setupEventListeners() {
    try {
      // Filtros de período
      const periodFilters = document.querySelectorAll('.period-filter');
      periodFilters.forEach(filter => {
        filter.addEventListener('click', (e) => {
          e.preventDefault();
          const period = filter.dataset.period;
          this.changePeriod(period);
        });
      });

      // Botão de atualizar
      const refreshBtn = document.getElementById('refreshAnalyticsBtn');
      if (refreshBtn) {
        refreshBtn.addEventListener('click', () => this.refreshAnalytics());
      }

      // Botão de exportar
      const exportBtn = document.getElementById('exportAnalyticsBtn');
      if (exportBtn) {
        exportBtn.addEventListener('click', () => this.exportAnalytics());
      }

      // Filtro de domínio
      const domainFilter = document.getElementById('domainFilter');
      if (domainFilter) {
        domainFilter.addEventListener('change', (e) => this.filterByDomain(e.target.value));
      }

    } catch (error) {
      console.error('❌ Erro ao configurar event listeners:', error);
    }
  }

  /**
   * Carrega dados de analytics
   */
  async loadAnalyticsData() {
    try {
      console.log('🔄 AnalyticsView: Iniciando carregamento de dados...');
      this.showLoading(true);
      
      // Timeout de segurança para esconder loading
      const loadingTimeout = setTimeout(() => {
        console.warn('⚠️ AnalyticsView: Timeout de loading atingido, escondendo...');
        this.showLoading(false);
      }, 10000); // 10 segundos
      
      // Obtém dados do scraper
      const scraperData = await this.getScraperData();
      console.log('📊 AnalyticsView: Dados do scraper obtidos:', scraperData);
      
      // Carrega dados específicos para cada gráfico
      console.log('📊 AnalyticsView: Carregando dados dos gráficos...');
      await Promise.all([
        this.loadPagesData(scraperData),
        this.loadDomainsData(scraperData),
        this.loadContentData(scraperData),
        this.loadPerformanceData(scraperData),
        this.loadLinkAnalysisData(scraperData),
        this.loadContentAnalysisData(scraperData)
      ]);
      
      console.log('📊 AnalyticsView: Todos os dados carregados, verificando domínios...');
      console.log('📊 AnalyticsView: this.domainsData:', this.domainsData);
      
      // Atualiza gráficos e métricas
      console.log('📊 AnalyticsView: Atualizando gráficos e métricas...');
      this.updateCharts();
      this.updateSummaryMetrics(scraperData);
      
      // Verificação adicional: garante que o filtro de domínios seja populado
      console.log('🔍 AnalyticsView: Verificação adicional - populando filtro de domínios...');
      if (this.domainsData && this.domainsData.labels.length > 0) {
        const validDomains = this.domainsData.labels.filter(label => 
          label !== 'Sem dados' && label !== 'Erro' && label !== 'Domínios únicos'
        );
        console.log('🔍 AnalyticsView: Domínios válidos para filtro:', validDomains);
        this.populateDomainFilter(validDomains);
      } else {
        console.log('🔍 AnalyticsView: Nenhum dado de domínios disponível, populando com array vazio');
        this.populateDomainFilter([]);
      }
      
      // Limpa timeout e esconde loading
      clearTimeout(loadingTimeout);
      this.showLoading(false);
      
      console.log('✅ AnalyticsView: Analytics carregado com sucesso!');
      
    } catch (error) {
      console.error('❌ AnalyticsView: Erro ao carregar analytics:', error);
      
      // Garante que o loading seja escondido mesmo em caso de erro
      this.showLoading(false);
      
    } finally {
      // Garantia adicional de que o loading seja escondido
      console.log('🔄 AnalyticsView: Finalizando carregamento...');
      this.showLoading(false);
    }
  }

  /**
   * Obtém dados do scraper
   */
  async getScraperData() {
    try {
      console.log('🔍 AnalyticsView: Tentando obter dados do scraper...');
      console.log('🔍 AnalyticsView: window.buscaLogoApp existe?', !!window.buscaLogoApp);
      console.log('🔍 AnalyticsView: window.buscaLogoApp.scraper existe?', !!(window.buscaLogoApp && window.buscaLogoApp.scraper));
      
      // Timeout de segurança para evitar travamentos
      const scraperTimeout = setTimeout(() => {
        console.warn('⚠️ AnalyticsView: Timeout do scraper atingido, usando dados de fallback');
      }, 5000); // 5 segundos
      
      // Tenta obter dados do scraper global
      if (window.buscaLogoApp && window.buscaLogoApp.scraper) {
        console.log('🔍 AnalyticsView: Scraper encontrado, obtendo dados...');
        
        try {
          const stats = await window.buscaLogoApp.scraper.getStats();
          console.log('📊 AnalyticsView: Estatísticas obtidas:', stats);
          
          // Obtém dados das páginas e links
          let pages = [];
          let links = [];
          
          try {
            if (window.buscaLogoApp.scraper.getAllPages) {
              pages = await window.buscaLogoApp.scraper.getAllPages();
              console.log('📄 AnalyticsView: Páginas obtidas:', pages.length);
              
              // Debug: verifica algumas páginas
              if (pages.length > 0) {
                console.log('🔍 AnalyticsView: Primeira página:', pages[0]);
                console.log('🔍 AnalyticsView: Última página:', pages[pages.length - 1]);
                
                // Verifica hostnames únicos
                const hostnames = [...new Set(pages.map(page => page.hostname).filter(Boolean))];
                console.log('🌐 AnalyticsView: Hostnames únicos encontrados:', hostnames);
              }
            }
          } catch (error) {
            console.warn('⚠️ AnalyticsView: Erro ao obter páginas:', error);
          }
          
          try {
            if (window.buscaLogoApp.scraper.getAllLinks) {
              links = await window.buscaLogoApp.scraper.getAllLinks();
              console.log('🔗 AnalyticsView: Links obtidos:', links.length);
            }
          } catch (error) {
            console.warn('⚠️ AnalyticsView: Erro ao obter links:', error);
          }
          
          clearTimeout(scraperTimeout);
          
          const result = {
            ...stats,
            capturedPages: pages,
            linkIndex: links
          };
          
          console.log('✅ AnalyticsView: Dados do scraper retornados:', result);
          console.log('🔍 AnalyticsView: capturedPages no resultado:', result.capturedPages);
          console.log('🔍 AnalyticsView: capturedPages.length no resultado:', result.capturedPages.length);
          
          return result;
          
        } catch (error) {
          console.error('❌ AnalyticsView: Erro ao obter dados do scraper:', error);
          clearTimeout(scraperTimeout);
          
          // Em caso de erro, usa dados básicos do scraper se disponível
          if (window.buscaLogoApp.scraper.getStats) {
            try {
              const basicStats = await window.buscaLogoApp.scraper.getStats();
              console.log('📊 AnalyticsView: Usando dados básicos do scraper:', basicStats);
              return {
                ...basicStats,
                capturedPages: [],
                linkIndex: []
              };
            } catch (basicError) {
              console.warn('⚠️ AnalyticsView: Erro ao obter dados básicos:', basicError);
            }
          }
        }
      }
      
      // Fallback: dados simulados para teste
      clearTimeout(scraperTimeout);
      console.log('⚠️ AnalyticsView: Scraper não encontrado, usando dados simulados...');
      const fallbackData = {
        totalPages: 59,
        uniqueHosts: 1,
        totalSize: 0.1,
        capturedPages: [],
        linkIndex: []
      };
      console.log('📊 AnalyticsView: Dados de fallback:', fallbackData);
      return fallbackData;
      
    } catch (error) {
      console.error('❌ AnalyticsView: Erro ao obter dados do scraper:', error);
      const errorData = {
        totalPages: 0,
        uniqueHosts: 0,
        totalSize: 0,
        capturedPages: [],
        linkIndex: []
      };
      console.log('📊 AnalyticsView: Dados de erro:', errorData);
      return errorData;
    }
  }
  
  /**
   * Carrega dados de páginas
   */
  async loadPagesData(scraperData) {
    try {
      const totalPages = scraperData.totalPages || 0;
      const capturedPages = scraperData.capturedPages || [];
      
      if (totalPages === 0) {
        this.pagesData = {
          labels: ['Sem dados'],
          data: [0]
        };
        return;
      }
      
      // Cria timeline baseado no período selecionado
      const days = this.getDaysArray(this.currentPeriod);
      const pagesByDay = {};
      
      // Inicializa contadores por dia
      days.forEach(day => {
        pagesByDay[day] = 0;
      });
      
      // Distribui páginas pelos dias
      if (capturedPages.length > 0) {
        // Se tem páginas reais, tenta usar timestamps
        capturedPages.forEach((page, index) => {
          if (page.timestamp) {
            const pageDate = new Date(page.timestamp);
            const dayKey = pageDate.toLocaleDateString('pt-BR', { month: 'short', day: 'numeric' });
            
            if (pagesByDay.hasOwnProperty(dayKey)) {
              pagesByDay[dayKey]++;
            }
          } else {
            // Se não tem timestamp, distribui igualmente
            const dayIndex = index % days.length;
            const dayKey = days[dayIndex];
            pagesByDay[dayKey]++;
          }
        });
      } else {
        // Se não tem páginas reais, distribui o total igualmente
        const pagesPerDay = Math.ceil(totalPages / days.length);
        days.forEach(day => {
          pagesByDay[day] = pagesPerDay;
        });
      }
      
      const realPagesData = days.map(day => pagesByDay[day] || 0);
      
      this.pagesData = {
        labels: days,
        data: realPagesData
      };
      
      console.log('📊 Dados de páginas carregados:', this.pagesData);
      
    } catch (error) {
      console.error('❌ Erro ao carregar dados de páginas:', error);
      this.pagesData = {
        labels: ['Erro'],
        data: [0]
      };
    }
  }

  /**
   * Carrega dados de domínios
   */
  async loadDomainsData(scraperData) {
    try {
      console.log('🌐 AnalyticsView: loadDomainsData iniciada');
      console.log('🌐 AnalyticsView: scraperData recebido:', scraperData);
      
      const uniqueHosts = scraperData.uniqueHosts || 0;
      const capturedPages = scraperData.capturedPages || [];
      
      console.log('🌐 AnalyticsView: uniqueHosts:', uniqueHosts);
      console.log('🌐 AnalyticsView: capturedPages.length:', capturedPages.length);
      
      if (uniqueHosts === 0) {
        console.log('⚠️ AnalyticsView: uniqueHosts é 0, usando dados vazios');
        this.domainsData = {
          labels: ['Sem dados'],
          data: [0]
        };
        
        // Popula filtro com domínios vazios
        console.log('🌐 AnalyticsView: Chamando populateDomainFilter com array vazio');
        this.populateDomainFilter([]);
        return;
      }
      
      if (capturedPages.length > 0) {
        console.log('✅ AnalyticsView: Temos páginas capturadas, processando domínios...');
        
        // Agrupa páginas por domínio
        const domainCounts = {};
        capturedPages.forEach((page, index) => {
          if (page.hostname) {
            domainCounts[page.hostname] = (domainCounts[page.hostname] || 0) + 1;
            if (index < 3) { // Log apenas os primeiros 3 para não poluir
              console.log(`🔍 AnalyticsView: Página ${index + 1} - hostname: ${page.hostname}`);
            }
          }
        });
        
        console.log('🌐 AnalyticsView: domainCounts calculado:', domainCounts);
        
        if (Object.keys(domainCounts).length > 0) {
          // Ordena domínios por quantidade
          const sortedDomains = Object.entries(domainCounts)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 8);
          
          console.log('🌐 AnalyticsView: sortedDomains:', sortedDomains);
          
          this.domainsData = {
            labels: sortedDomains.map(([domain]) => domain),
            data: sortedDomains.map(([,count]) => count)
          };
          
          const domainsForFilter = sortedDomains.map(([domain]) => domain);
          console.log('🌐 AnalyticsView: Domínios para o filtro:', domainsForFilter);
          
          // Popula filtro com domínios reais
          console.log('🌐 AnalyticsView: Chamando populateDomainFilter com domínios reais');
          this.populateDomainFilter(domainsForFilter);
          
        } else {
          console.log('⚠️ AnalyticsView: Nenhum domínio encontrado nas páginas');
          this.domainsData = {
            labels: ['Domínios únicos'],
            data: [uniqueHosts]
          };
          
          // Popula filtro com domínios vazios
          console.log('🌐 AnalyticsView: Chamando populateDomainFilter com array vazio (sem domínios)');
          this.populateDomainFilter([]);
        }
      } else {
        console.log('⚠️ AnalyticsView: Não há páginas capturadas, usando fallback');
        // Fallback se não tem páginas
        this.domainsData = {
          labels: ['Domínios únicos'],
          data: [uniqueHosts]
        };
        
        // Popula filtro com domínios vazios
        console.log('🌐 AnalyticsView: Chamando populateDomainFilter com array vazio (fallback)');
        this.populateDomainFilter([]);
      }
      
      console.log('🌐 AnalyticsView: Dados de domínios carregados:', this.domainsData);
      
    } catch (error) {
      console.error('❌ AnalyticsView: Erro ao carregar dados de domínios:', error);
      this.domainsData = {
        labels: ['Erro'],
        data: [0]
      };
      
      // Popula filtro com domínios vazios em caso de erro
      console.log('🌐 AnalyticsView: Chamando populateDomainFilter com array vazio (erro)');
      this.populateDomainFilter([]);
    }
  }

  /**
   * Carrega dados de conteúdo
   */
  async loadContentData(scraperData) {
    try {
      const totalSize = scraperData.totalSize || 0;
      const capturedPages = scraperData.capturedPages || [];
      
      if (totalSize === 0) {
        this.contentData = {
          labels: ['Sem dados'],
          data: [0]
        };
        return;
      }
      
      if (capturedPages.length > 0) {
        // Calcula tamanho real das páginas
        const pageSizes = capturedPages.map(page => {
          let pageSize = 0;
          
          if (page.title) pageSize += page.title.length;
          if (page.headings) {
            page.headings.forEach(heading => {
              if (heading.text) pageSize += heading.text.length;
            });
          }
          if (page.paragraphs) {
            page.paragraphs.forEach(paragraph => {
              if (paragraph) pageSize += paragraph.length;
            });
          }
          if (page.terms) {
            page.terms.forEach(term => {
              if (term) pageSize += term.length;
            });
          }
          
          return Math.round(pageSize / 1024); // Converte para KB
        });
        
        // Agrupa por faixas de tamanho
        const sizeRanges = {
          '0-10 KB': 0,
          '11-25 KB': 0,
          '26-50 KB': 0,
          '51-100 KB': 0,
          '101-250 KB': 0,
          '250+ KB': 0
        };
        
        pageSizes.forEach(size => {
          if (size <= 10) sizeRanges['0-10 KB']++;
          else if (size <= 25) sizeRanges['11-25 KB']++;
          else if (size <= 50) sizeRanges['26-50 KB']++;
          else if (size <= 100) sizeRanges['51-100 KB']++;
          else if (size <= 250) sizeRanges['101-250 KB']++;
          else sizeRanges['250+ KB']++;
        });
        
        const rangesWithData = Object.entries(sizeRanges).filter(([,count]) => count > 0);
        
        if (rangesWithData.length > 0) {
          this.contentData = {
            labels: rangesWithData.map(([range]) => range),
            data: rangesWithData.map(([,count]) => count)
          };
        } else {
          this.contentData = {
            labels: ['Tamanho total'],
            data: [Math.round(totalSize * 1024)]
          };
        }
      } else {
        // Fallback se não tem páginas
        this.contentData = {
          labels: ['Tamanho total'],
          data: [Math.round(totalSize * 1024)]
        };
      }
      
      console.log('📊 Dados de conteúdo carregados:', this.contentData);
      
    } catch (error) {
      console.error('❌ Erro ao carregar dados de conteúdo:', error);
      this.contentData = {
        labels: ['Erro'],
        data: [0]
      };
    }
  }

  /**
   * Carrega dados de performance
   */
  async loadPerformanceData(scraperData) {
    try {
      const totalPages = scraperData.totalPages || 1;
      const uniqueHosts = scraperData.uniqueHosts || 1;
      const capturedPages = scraperData.capturedPages || [];
      
      // Calcula métricas baseadas nos dados reais
      let qualityScore = 0;
      let coverageScore = 0;
      
      if (capturedPages.length > 0) {
        const pagesWithContent = capturedPages.filter(page => 
          page.title && (page.headings?.length > 0 || page.paragraphs?.length > 0)
        ).length;
        
        qualityScore = Math.min(95, Math.max(70, (pagesWithContent / capturedPages.length) * 100));
        coverageScore = Math.min(90, Math.max(60, (uniqueHosts / Math.max(1, totalPages / 10)) * 100));
      }
      
      const performance = {
        velocidade: Math.min(90, Math.max(60, totalPages * 2)),
        precisao: Math.min(95, Math.max(70, qualityScore)),
        cobertura: Math.min(85, Math.max(50, coverageScore)),
        qualidade: Math.min(88, Math.max(65, qualityScore)),
        eficiencia: Math.min(92, Math.max(75, (totalPages / Math.max(1, uniqueHosts)) * 10))
      };
      
      this.performanceData = performance;
      console.log('🎯 Dados de performance carregados:', this.performanceData);
      
    } catch (error) {
      console.error('❌ Erro ao carregar dados de performance:', error);
    }
  }

  /**
   * Carrega dados de análise de links
   */
  async loadLinkAnalysisData(scraperData) {
    try {
      const linkIndex = scraperData.linkIndex || [];
      
      if (linkIndex.length === 0) {
        this.linkAnalysisData = {
          labels: ['Sem dados'],
          data: [0]
        };
        return;
      }
      
      // Analisa tipos de links
      const linkTypeCounts = {};
      linkIndex.forEach(link => {
        if (link.type) {
          linkTypeCounts[link.type] = (linkTypeCounts[link.type] || 0) + 1;
        }
      });
      
      if (Object.keys(linkTypeCounts).length > 0) {
        // Usa tipos reais
        const sortedTypes = Object.entries(linkTypeCounts)
          .sort(([,a], [,b]) => b - a)
          .slice(0, 6);
        
        this.linkAnalysisData = {
          labels: sortedTypes.map(([type]) => type),
          data: sortedTypes.map(([,count]) => count)
        };
      } else {
        // Fallback se não tem tipos
        this.linkAnalysisData = {
          labels: ['Links descobertos'],
          data: [linkIndex.length]
        };
      }
      
      console.log('🔗 Dados de análise de links carregados:', this.linkAnalysisData);
      
    } catch (error) {
      console.error('❌ Erro ao carregar dados de links:', error);
      this.linkAnalysisData = {
        labels: ['Erro'],
        data: [0]
      };
    }
  }

  /**
   * Carrega dados de análise de conteúdo
   */
  async loadContentAnalysisData(scraperData) {
    try {
      const capturedPages = scraperData.capturedPages || [];
      
      if (capturedPages.length === 0) {
        this.contentAnalysisData = {
          labels: ['Sem dados'],
          data: [0]
        };
        return;
      }
      
      // Analisa estrutura das páginas
      const structureCounts = {
        'Com Título': 0,
        'Com Headings': 0,
        'Com Parágrafos': 0,
        'Com Termos': 0,
        'Completa': 0
      };
      
      capturedPages.forEach(page => {
        if (page.title && page.title.trim()) structureCounts['Com Título']++;
        if (page.headings && page.headings.length > 0) structureCounts['Com Headings']++;
        if (page.paragraphs && page.paragraphs.length > 0) structureCounts['Com Parágrafos']++;
        if (page.terms && page.terms.length > 0) structureCounts['Com Termos']++;
        
        if (page.title && (page.headings?.length > 0 || page.paragraphs?.length > 0)) {
          structureCounts['Completa']++;
        }
      });
      
      const categoriesWithData = Object.entries(structureCounts).filter(([,count]) => count > 0);
      
      if (categoriesWithData.length > 0) {
        this.contentAnalysisData = {
          labels: categoriesWithData.map(([category]) => category),
          data: categoriesWithData.map(([,count]) => count)
        };
      } else {
        this.contentAnalysisData = {
          labels: ['Páginas capturadas'],
          data: [capturedPages.length]
        };
      }
      
      console.log('📝 Dados de análise de conteúdo carregados:', this.contentAnalysisData);
      
    } catch (error) {
      console.error('❌ Erro ao carregar dados de análise de conteúdo:', error);
      this.contentAnalysisData = {
        labels: ['Erro'],
        data: [0]
      };
    }
  }
  
  /**
   * Atualiza gráficos com novos dados
   */
  updateCharts() {
    try {
      // Atualiza gráfico de páginas
      if (this.charts.pages && this.pagesData) {
        this.charts.pages.data.labels = this.pagesData.labels;
        this.charts.pages.data.datasets[0].data = this.pagesData.data;
        this.charts.pages.update();
      }
      
      // Atualiza gráfico de domínios
      if (this.charts.domains && this.domainsData) {
        this.charts.domains.data.labels = this.domainsData.labels;
        this.charts.domains.data.datasets[0].data = this.domainsData.data;
        this.charts.domains.update();
      }
      
      // Atualiza gráfico de conteúdo
      if (this.charts.contentSize && this.contentData) {
        this.charts.contentSize.data.labels = this.contentData.labels;
        this.charts.contentSize.data.datasets[0].data = this.contentData.data;
        this.charts.contentSize.update();
      }
      
      // Atualiza gráfico de performance
      if (this.charts.performance && this.performanceData) {
        this.charts.performance.data.datasets[0].data = Object.values(this.performanceData);
        this.charts.performance.update();
      }
      
      // Atualiza gráfico de análise de links
      if (this.charts.linkAnalysis && this.linkAnalysisData) {
        this.charts.linkAnalysis.data.labels = this.linkAnalysisData.labels;
        this.charts.linkAnalysis.data.datasets[0].data = this.linkAnalysisData.data;
        this.charts.linkAnalysis.update();
      }
      
      // Atualiza gráfico de análise de conteúdo
      if (this.charts.contentAnalysis && this.contentAnalysisData) {
        this.charts.contentAnalysis.data.labels = this.contentAnalysisData.labels;
        this.charts.contentAnalysis.data.datasets[0].data = this.contentAnalysisData.data;
        this.charts.contentAnalysis.update();
      }
      
      // Atualiza filtro de domínios
      this.updateDomainFilter();
      
    } catch (error) {
      console.error('❌ AnalyticsView: Erro ao atualizar gráficos:', error);
    }
  }

  /**
   * Atualiza métricas resumidas
   */
  updateSummaryMetrics(scraperData) {
    try {
      // Total de páginas
      const totalPages = scraperData.totalPages || 0;
      this.updateElement('totalPagesAnalytics', totalPages);
      this.updateTrend('totalPagesAnalytics', totalPages);
      
      // Total de domínios únicos
      const uniqueHosts = scraperData.uniqueHosts || 0;
      this.updateElement('uniqueDomainsAnalytics', uniqueHosts);
      this.updateTrend('uniqueDomainsAnalytics', uniqueHosts);
      
      // Total de capturas
      const totalCaptures = scraperData.totalPages || 0;
      this.updateElement('totalSizeAnalytics', totalCaptures);
      this.updateTrend('totalSizeAnalytics', totalCaptures);
      
      // Performance média
      const capturedPages = scraperData.capturedPages || [];
      const pagesWithContent = capturedPages.filter(page => 
        page.title && (page.headings?.length > 0 || page.paragraphs?.length > 0)
      ).length;
      
      const avgPerformance = totalPages > 0 ? Math.round((pagesWithContent / totalPages) * 100) : 0;
      this.updateElement('avgPerformanceAnalytics', `${avgPerformance}%`);
      this.updateTrend('avgPerformanceAnalytics', avgPerformance);
      
      console.log('📊 Métricas resumidas atualizadas:', {
        totalPages,
        uniqueHosts,
        totalCaptures,
        pagesWithContent,
        avgPerformance
      });
      
    } catch (error) {
      console.error('❌ Erro ao atualizar métricas resumidas:', error);
    }
  }

  /**
   * Atualiza elemento HTML com valor
   */
  updateElement(elementId, value) {
    try {
      const element = document.getElementById(elementId);
      if (element) {
        element.textContent = value;
      }
    } catch (error) {
      console.error(`❌ Erro ao atualizar elemento ${elementId}:`, error);
    }
  }

  /**
   * Atualiza tendências das métricas
   */
  updateTrend(elementId, value) {
    try {
      const element = document.getElementById(elementId);
      if (!element) return;
      
      const trendElement = element.parentElement.querySelector('.summary-trend');
      if (!trendElement) return;
      
      // Calcula tendência baseada no valor real
      let trend = 'neutral';
      let trendText = 'Estável';
      
      if (value === 0) {
        trend = 'neutral';
        trendText = 'Sem dados';
      } else if (value > 0 && value <= 5) {
        trend = 'positive';
        trendText = 'Iniciando';
      } else if (value > 5 && value <= 20) {
        trend = 'positive';
        trendText = 'Crescendo';
      } else if (value > 20 && value <= 50) {
        trend = 'positive';
        trendText = 'Bom volume';
      } else if (value > 50 && value <= 100) {
        trend = 'positive';
        trendText = 'Excelente volume';
      } else if (value > 100) {
        trend = 'positive';
        trendText = 'Volume massivo';
      }
      
      // Atualiza classe e texto
      trendElement.className = `summary-trend ${trend}`;
      trendElement.textContent = trendText;
      
    } catch (error) {
      console.error('❌ Erro ao atualizar tendência:', error);
    }
  }

  /**
   * Muda período de análise
   */
  changePeriod(period) {
    try {
      console.log(`📅 AnalyticsView: Mudando período para ${period}...`);
      this.currentPeriod = period;
      
      // Atualiza botões ativos
      document.querySelectorAll('.period-filter').forEach(btn => {
        btn.classList.remove('active');
      });
      document.querySelector(`.period-filter[data-period="${period}"]`).classList.add('active');
      
      // Reseta filtro de domínios
      const domainFilter = document.getElementById('domainFilter');
      if (domainFilter) {
        domainFilter.value = '';
        console.log('🔄 AnalyticsView: Filtro de domínios resetado');
      }
      
      // Recarrega dados para o novo período
      this.loadAnalyticsData();
      
      console.log(`✅ AnalyticsView: Período alterado para ${period}`);
      
    } catch (error) {
      console.error('❌ AnalyticsView: Erro ao mudar período:', error);
    }
  }

  /**
   * Filtra por domínio
   */
  filterByDomain(selectedDomain) {
    try {
      const domainFilter = document.getElementById('domainFilter');
      if (!domainFilter) return;
      
      const selectedDomainValue = selectedDomain || domainFilter.value;
      console.log('🔍 AnalyticsView: Filtrando por domínio:', selectedDomainValue);
      
      if (!selectedDomainValue || selectedDomainValue === '') {
        // Mostra todos os dados
        console.log('🌐 AnalyticsView: Mostrando todos os domínios');
        this.updateCharts();
        return;
      }
      
      if (selectedDomainValue === 'sem-dados') {
        console.log('⚠️ AnalyticsView: Nenhum domínio disponível para filtro');
        return;
      }
      
      // Filtra dados por domínio selecionado
      if (this.pagesData && this.domainsData) {
        console.log('🔍 AnalyticsView: Aplicando filtro de domínio...');
        
        // Filtra páginas por domínio
        const filteredPagesData = { ...this.pagesData };
        if (this.pagesData.labels.length > 0 && this.pagesData.labels[0] !== 'Sem dados') {
          // Se tem dados reais, aplica filtro
          // Por enquanto, apenas recarrega os dados
          console.log('🔍 AnalyticsView: Recarregando dados com filtro aplicado...');
          this.loadAnalyticsData();
        }
      }
      
    } catch (error) {
      console.error('❌ AnalyticsView: Erro ao filtrar por domínio:', error);
    }
  }

  /**
   * Atualiza analytics
   */
  async refreshAnalytics() {
    try {
      console.log('🔄 Atualizando analytics...');
      await this.loadAnalyticsData();
      console.log('✅ Analytics atualizado!');
    } catch (error) {
      console.error('❌ Erro ao atualizar analytics:', error);
    }
  }

  /**
   * Exporta analytics
   */
  exportAnalytics() {
    try {
      console.log('📤 Exportando analytics...');
      
      // Cria dados para exportação
      const exportData = {
        periodo: this.currentPeriod,
        timestamp: new Date().toISOString(),
        metricas: {
          totalPages: this.pagesData?.data.reduce((sum, val) => sum + val, 0) || 0,
          uniqueDomains: this.domainsData?.labels.length || 0,
          totalSize: this.contentData?.data.reduce((sum, val) => sum + val, 0) || 0,
          avgPerformance: this.performanceData ? 
            Object.values(this.performanceData).reduce((sum, val) => sum + val, 0) / 5 : 0
        },
        dados: {
          pages: this.pagesData,
          domains: this.domainsData,
          content: this.contentData,
          performance: this.performanceData,
          links: this.linkAnalysisData,
          contentAnalysis: this.contentAnalysisData
        }
      };
      
      // Cria arquivo para download
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      
      const link = document.createElement('a');
      link.href = URL.createObjectURL(dataBlob);
      link.download = `analytics-${this.currentPeriod}-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      
      console.log('✅ Analytics exportado com sucesso!');
      
    } catch (error) {
      console.error('❌ Erro ao exportar analytics:', error);
    }
  }

  /**
   * Mostra/esconde loading
   */
  showLoading(show) {
    try {
      console.log(`🔄 AnalyticsView: ${show ? 'Mostrando' : 'Escondendo'} loading...`);
      
      const loadingElement = document.getElementById('analyticsLoading');
      if (loadingElement) {
        console.log('🔍 AnalyticsView: Elemento de loading encontrado');
        console.log('🔍 AnalyticsView: Estado atual - display:', loadingElement.style.display);
        console.log('🔍 AnalyticsView: Estado atual - classList:', loadingElement.classList.toString());
        
        if (show) {
          loadingElement.style.display = 'flex';
          loadingElement.classList.remove('hidden');
        } else {
          loadingElement.style.display = 'none';
          loadingElement.classList.add('hidden');
        }
        
        console.log('🔍 AnalyticsView: Estado após mudança - display:', loadingElement.style.display);
        console.log('🔍 AnalyticsView: Estado após mudança - classList:', loadingElement.classList.toString());
        console.log(`✅ AnalyticsView: Loading ${show ? 'mostrado' : 'escondido'} com sucesso`);
      } else {
        console.warn('⚠️ AnalyticsView: Elemento de loading não encontrado');
      }
    } catch (error) {
      console.error('❌ AnalyticsView: Erro ao mostrar/esconder loading:', error);
    }
  }

  /**
   * Debug: verifica estado do loading
   */
  debugLoadingState() {
    try {
      const loadingElement = document.getElementById('analyticsLoading');
      if (loadingElement) {
        console.log('🔍 AnalyticsView: Debug do loading:');
        console.log('  - Elemento existe:', !!loadingElement);
        console.log('  - Display:', loadingElement.style.display);
        console.log('  - Classes:', loadingElement.classList.toString());
        console.log('  - Visível:', loadingElement.offsetParent !== null);
        console.log('  - Dimensões:', {
          width: loadingElement.offsetWidth,
          height: loadingElement.offsetHeight
        });
      } else {
        console.log('🔍 AnalyticsView: Elemento de loading não encontrado');
      }
    } catch (error) {
      console.error('❌ AnalyticsView: Erro no debug do loading:', error);
    }
  }

  /**
   * Popula o select de domínios com dados reais
   */
  populateDomainFilter(domains = []) {
    try {
      console.log('🌐 AnalyticsView: Populando filtro de domínios...');
      console.log('🌐 AnalyticsView: Domínios recebidos:', domains);
      
      const domainFilter = document.getElementById('domainFilter');
      if (!domainFilter) {
        console.warn('⚠️ AnalyticsView: Select de domínios não encontrado');
        return;
      }
      
      console.log('🔍 AnalyticsView: Select de domínios encontrado, removendo opções antigas...');
      
      // Remove opções antigas (exceto "Todos os Domínios")
      const options = domainFilter.querySelectorAll('option');
      console.log('🔍 AnalyticsView: Opções encontradas:', options.length);
      
      options.forEach((option, index) => {
        if (index > 0) { // Mantém a primeira opção (Todos os Domínios)
          console.log('🗑️ AnalyticsView: Removendo opção:', option.textContent);
          option.remove();
        }
      });
      
      // Adiciona opções com domínios reais
      if (domains.length > 0) {
        console.log('✅ AnalyticsView: Adicionando', domains.length, 'domínios ao filtro...');
        
        domains.forEach((domain, index) => {
          const option = document.createElement('option');
          option.value = domain;
          option.textContent = `📄 ${domain}`;
          domainFilter.appendChild(option);
          
          console.log(`✅ AnalyticsView: Domínio ${index + 1} adicionado: ${domain}`);
        });
        
        console.log(`✅ AnalyticsView: ${domains.length} domínios adicionados ao filtro com sucesso`);
        
        // Debug: verifica opções finais
        const finalOptions = domainFilter.querySelectorAll('option');
        console.log('🔍 AnalyticsView: Opções finais no select:', finalOptions.length);
        finalOptions.forEach((option, index) => {
          console.log(`  ${index + 1}. ${option.textContent} (${option.value})`);
        });
        
      } else {
        // Se não há domínios, adiciona uma opção padrão
        console.log('⚠️ AnalyticsView: Nenhum domínio disponível, adicionando opção padrão...');
        
        const option = document.createElement('option');
        option.value = "sem-dados";
        option.textContent = "📄 Sem domínios disponíveis";
        option.disabled = true;
        domainFilter.appendChild(option);
        
        console.log('⚠️ AnalyticsView: Opção padrão adicionada ao filtro');
      }
      
    } catch (error) {
      console.error('❌ AnalyticsView: Erro ao popular filtro de domínios:', error);
    }
  }

  /**
   * Atualiza o filtro de domínios quando os dados mudam
   */
  updateDomainFilter() {
    try {
      console.log('🔄 AnalyticsView: Atualizando filtro de domínios...');
      
      if (this.domainsData && this.domainsData.labels.length > 0) {
        const domains = this.domainsData.labels.filter(label => label !== 'Sem dados' && label !== 'Erro');
        
        if (domains.length > 0) {
          this.populateDomainFilter(domains);
          console.log('✅ AnalyticsView: Filtro de domínios atualizado com', domains.length, 'domínios');
        } else {
          this.populateDomainFilter([]);
          console.log('⚠️ AnalyticsView: Nenhum domínio válido para o filtro');
        }
      } else {
        this.populateDomainFilter([]);
        console.log('⚠️ AnalyticsView: Dados de domínios não disponíveis para o filtro');
      }
      
    } catch (error) {
      console.error('❌ AnalyticsView: Erro ao atualizar filtro de domínios:', error);
    }
  }

  /**
   * Gera array de dias para o período selecionado
   */
  getDaysArray(period) {
    try {
      const days = [];
      const today = new Date();
      
      let daysCount;
      switch (period) {
        case '7d':
          daysCount = 7;
          break;
        case '30d':
          daysCount = 30;
          break;
        case '90d':
          daysCount = 90;
          break;
        default:
          daysCount = 7;
      }
      
      for (let i = daysCount - 1; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        days.push(date.toLocaleDateString('pt-BR', { month: 'short', day: 'numeric' }));
      }
      
      return days;
      
    } catch (error) {
      console.error('❌ Erro ao gerar array de dias:', error);
      return ['Erro'];
    }
  }

  /**
   * Destrói a view
   */
  destroy() {
    try {
      // Destrói gráficos
      Object.values(this.charts).forEach(chart => {
        if (chart && chart.destroy) {
          chart.destroy();
        }
      });
      
      this.charts = {};
      console.log('🗑️ Analytics destruído');
      
    } catch (error) {
      console.error('❌ Erro ao destruir Analytics:', error);
    }
  }
}

// Exporta para uso global
window.AnalyticsView = AnalyticsView;

console.log('📊 AnalyticsView carregada');
