/**
 * BuscaLogo Desktop - Sistema de Scraping Simplificado
 *
 * Funcionalidades:
 * - Captura de páginas web
 * - Armazenamento no IndexedDB
 * - Conexão WebSocket com API do BuscaLogo
 */

class BuscaLogoScraper {
  constructor () {
    this.db = null
    this.isCapturing = false
    this.apiClient = null
    this.captureQueue = []

    this.init()
  }

  /**
   * Inicializa o scraper
   */
  async init () {
    try {
      console.log('🚀 Inicializando sistema de scraping...')

      // Inicializa banco de dados
      await this.initDatabase()

      // Inicializa cliente da API
      await this.initAPIClient()

      // Verifica se há dados no banco, se não, adiciona dados de teste
      const pages = await this.getAllPages()
      if (pages.length === 0) {
        console.log('📝 Banco vazio, adicionando dados de teste...')
        await this.addTestData()
      } else {
        console.log(`📊 Banco já contém ${pages.length} páginas`)
      }

      console.log('✅ Sistema de scraping inicializado')
    } catch (error) {
      console.error('❌ Erro ao inicializar scraping:', error)
    }
  }

  /**
   * Inicializa banco de dados IndexedDB
   */
  async initDatabase () {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('BuscaLogoDB', 1)

      request.onerror = () => reject(request.error)

      request.onsuccess = () => {
        this.db = request.result
        console.log('💾 Banco de dados IndexedDB aberto')
        console.log('✅ Stores disponíveis:', this.db.objectStoreNames)
        resolve()
      }

      request.onupgradeneeded = (event) => {
        const db = event.target.result

        // Store para páginas capturadas (igual à extensão)
        if (!db.objectStoreNames.contains('capturedPages')) {
          const pagesStore = db.createObjectStore('capturedPages', { keyPath: 'url' })
          pagesStore.createIndex('title', 'title', { unique: false })
          pagesStore.createIndex('hostname', 'hostname', { unique: false })
          pagesStore.createIndex('timestamp', 'timestamp', { unique: false })
          console.log('📄 Store "capturedPages" criada')
        }

        // Store para histórico (igual à extensão)
        if (!db.objectStoreNames.contains('captureHistory')) {
          const historyStore = db.createObjectStore('captureHistory', { keyPath: 'timestamp' })
          historyStore.createIndex('url', 'url', { unique: false })
          historyStore.createIndex('hostname', 'hostname', { unique: false })
          historyStore.createIndex('timestamp', 'timestamp', { unique: false })
          console.log('📚 Store "captureHistory" criada')
        }

        // Store para indexação de links (igual à extensão)
        if (!db.objectStoreNames.contains('linkIndex')) {
          const linkStore = db.createObjectStore('linkIndex', { keyPath: 'url' })
          linkStore.createIndex('text', 'text', { unique: false })
          linkStore.createIndex('title', 'title', { unique: false })
          linkStore.createIndex('type', 'type', { unique: false })
          linkStore.createIndex('relevance', 'relevance', { unique: false })
          linkStore.createIndex('sourceUrl', 'sourceUrl', { unique: false })
          linkStore.createIndex('sourceHostname', 'sourceHostname', { unique: false })
          linkStore.createIndex('discoveredAt', 'discoveredAt', { unique: false })
          linkStore.createIndex('lastSeen', 'lastSeen', { unique: false })
          linkStore.createIndex('clickCount', 'clickCount', { unique: false })
          console.log('🔗 Store "linkIndex" criada')
        }

        // Store para análise de conteúdo (igual à extensão)
        if (!db.objectStoreNames.contains('contentAnalysis')) {
          const contentStore = db.createObjectStore('contentAnalysis', { keyPath: 'url' })
          contentStore.createIndex('contentType', 'contentType', { unique: false })
          contentStore.createIndex('topics', 'topics', { unique: false })
          contentStore.createIndex('entities', 'entities', { unique: false })
          contentStore.createIndex('sentiment', 'sentiment', { unique: false })
          contentStore.createIndex('readingLevel', 'readingLevel', { unique: false })
          contentStore.createIndex('contentStructure', 'contentStructure', { unique: false })
          contentStore.createIndex('analyzedAt', 'analyzedAt', { unique: false })
          console.log('📊 Store "contentAnalysis" criada')
        }

        // Store para fila de captura persistente (igual à extensão)
        if (!db.objectStoreNames.contains('captureQueue')) {
          const queueStore = db.createObjectStore('captureQueue', { keyPath: 'id' })
          queueStore.createIndex('url', 'url', { unique: false })
          queueStore.createIndex('priority', 'priority', { unique: false })
          queueStore.createIndex('scheduledAt', 'scheduledAt', { unique: false })
          queueStore.createIndex('status', 'status', { unique: false })
          console.log('📋 Store "captureQueue" criada')
        }

        console.log('🔄 Schema do IndexedDB atualizado (igual à extensão)')
      }
    })
  }

  /**
   * Inicializa cliente da API
   */
  async initAPIClient () {
    try {
      if (!window.BuscaLogoAPIClient) {
        console.warn('⚠️ BuscaLogoAPIClient não encontrado')
        return
      }

      // Passa a referência do scraper para o cliente API
      this.apiClient = new window.BuscaLogoAPIClient(this)

      // Configura callbacks
      this.apiClient.onConnect = () => {
        console.log('🔗 Conectado como peer ao BuscaLogo')
        // DESABILITADO: Sincronização automática não é necessária para desktop
        // this.syncWithServer();
      }

      this.apiClient.onDisconnect = () => {
        console.log('🔌 Desconectado do BuscaLogo')
      }

      // Conecta à API
      await this.apiClient.connect()
    } catch (error) {
      console.error('❌ Erro ao inicializar cliente da API:', error)
    }
  }

  /**
   * Adiciona URL para captura
   */
  addUrlForCapture (url, priority = 'normal') {
    try {
      // Valida URL
      const urlObj = new URL(url)

      // Verifica se já está na fila
      const isInQueue = this.captureQueue.some(item => item.url === url)
      if (isInQueue) {
        console.log(`ℹ️ URL já está na fila: ${url}`)
        return false
      }

      // Verifica se já foi capturada
      this.getPageByUrl(url).then(existingPage => {
        if (existingPage) {
          console.log(`ℹ️ Página já capturada: ${url}`)
          return false
        }
      })

      // Adiciona à fila
      const queueItem = {
        id: this.generateId(),
        url,
        priority,
        scheduledAt: Date.now(),
        status: 'pending',
        hostname: urlObj.hostname,
        retryCount: 0
      }

      this.captureQueue.push(queueItem)
      console.log(`📥 URL adicionada à fila: ${url} (${priority})`)

      // Notifica atualização da fila
      this.notifyQueueUpdate()

      // Inicia processamento se não estiver rodando
      if (!this.isCapturing) {
        this.startQueueProcessing()
      }

      return true
    } catch (error) {
      console.error('❌ Erro ao adicionar URL à fila:', error)
      return false
    }
  }

  /**
   * Adiciona links descobertos para captura recursiva
   */
  async addDiscoveredLinksForCapture (sourceUrl, maxDepth = 2) {
    try {
      const sourceHostname = new URL(sourceUrl).hostname

      // Obtém links indexados do mesmo domínio
      const links = await this.getLinksByHostname(sourceHostname)

      if (links.length === 0) {
        console.log(`ℹ️ Nenhum link descoberto para o domínio ${sourceHostname}`)
        return
      }

      let addedCount = 0

      for (const link of links) {
        try {
          // Verifica se já foi capturada
          const existingPage = await this.getPageByUrl(link.url)
          if (existingPage) {
            continue // Pula se já foi capturada
          }

          // Verifica se já está na fila
          const isInQueue = this.captureQueue.some(item => item.url === link.url)
          if (isInQueue) {
            continue // Pula se já está na fila
          }

          // Adiciona à fila com prioridade baixa para links descobertos
          const queueItem = {
            id: this.generateId(),
            url: link.url,
            priority: 'low',
            scheduledAt: Date.now(),
            status: 'pending',
            hostname: sourceHostname,
            discoveredFrom: sourceUrl,
            type: 'discovered'
          }

          this.captureQueue.push(queueItem)
          addedCount++
        } catch (error) {
          console.warn(`⚠️ Erro ao processar link descoberto: ${link.url}`, error.message)
        }
      }

      if (addedCount > 0) {
        console.log(`🔗 ${addedCount} links descobertos adicionados à fila para captura recursiva`)
        this.notifyQueueUpdate()
      }
    } catch (error) {
      console.error('❌ Erro ao adicionar links descobertos:', error)
    }
  }

  /**
   * Processa fila de captura
   */
  async processQueue () {
    if (this.isCapturing || this.captureQueue.length === 0) {
      return
    }

    this.isCapturing = true
    console.log(`🎯 Processando fila com ${this.captureQueue.length} itens`)

    try {
      while (this.captureQueue.length > 0) {
        // Ordena por prioridade
        this.sortQueueByPriority()

        const item = this.captureQueue.shift()
        if (!item) continue

        try {
          console.log(`🎯 Processando: ${item.url} (${item.priority})`)

          // Atualiza status
          item.status = 'processing'
          this.notifyQueueUpdate()

          // Captura a página
          await this.capturePage(item.url)

          // Se foi uma captura bem-sucedida, adiciona links descobertos para captura recursiva
          if (item.type !== 'discovered') {
            await this.addDiscoveredLinksForCapture(item.url)
          }

          // Aguarda um pouco entre capturas para não sobrecarregar o servidor
          await this.delay(1000)
        } catch (error) {
          console.error(`❌ Erro ao processar ${item.url}:`, error)

          // Adiciona de volta à fila com prioridade reduzida
          if (item.retryCount < 3) {
            item.retryCount = (item.retryCount || 0) + 1
            item.priority = 'low' // Reduz prioridade após falha
            item.status = 'pending'
            this.captureQueue.push(item)
            console.log(`🔄 Reintentando ${item.url} (tentativa ${item.retryCount})`)
          } else {
            console.log(`❌ ${item.url} falhou após 3 tentativas, removendo da fila`)
          }
        }
      }
    } catch (error) {
      console.error('❌ Erro no processamento da fila:', error)
    } finally {
      this.isCapturing = false
      console.log('✅ Processamento da fila concluído')
      this.notifyQueueUpdate()
    }
  }

  /**
   * Ordena fila por prioridade
   */
  sortQueueByPriority () {
    const priorityOrder = { high: 3, normal: 2, low: 1 }

    this.captureQueue.sort((a, b) => {
      const priorityA = priorityOrder[a.priority] || 2
      const priorityB = priorityOrder[b.priority] || 2

      if (priorityA !== priorityB) {
        return priorityB - priorityA // Prioridade mais alta primeiro
      }

      // Se mesma prioridade, ordena por data de agendamento
      return a.scheduledAt - b.scheduledAt
    })
  }

  /**
   * Captura página
   */
  async capturePage (url) {
    try {
      console.log(`🎯 Iniciando captura: ${url}`)

      // Verifica se já foi capturada
      const existingPage = await this.getPageByUrl(url)
      if (existingPage) {
        console.log(`ℹ️ Página já capturada: ${url}`)
        return existingPage
      }

      // Captura conteúdo da página
      const pageData = await this.fetchPageContent(url)

      // Salva página e indexa links
      await this.savePage(pageData)

      // DESABILITADO: Desktop app não precisa enviar dados automaticamente
      // Envia para API se conectado
      /*
      if (this.apiClient && this.apiClient.isConnected) {
        try {
          await this.apiClient.sendPageData(pageData);
          console.log(`📤 Dados enviados para API do BuscaLogo`);
        } catch (error) {
          console.warn(`⚠️ Erro ao enviar para API: ${error.message}`);
        }
      }
      */

      console.log(`✅ Página capturada com sucesso: ${url}`)
      return pageData
    } catch (error) {
      console.error(`❌ Erro na captura: ${error.message}`)
      throw error
    }
  }

  /**
   * Captura conteúdo da página
   */
  async fetchPageContent (url) {
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'User-Agent': 'BuscaLogo-Desktop/1.0.0'
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const html = await response.text()

      // Extrai informações igual à extensão
      const parser = new DOMParser()
      const doc = parser.parseFromString(html, 'text/html')

      // Extrai metadados igual à extensão
      const meta = {}
      const metaTags = doc.querySelectorAll('meta')
      metaTags.forEach(tag => {
        const name = tag.getAttribute('name') || tag.getAttribute('property')
        const content = tag.getAttribute('content')
        if (name && content) {
          meta[name] = content
        }
      })

      // Extrai headings igual à extensão
      const headings = []
      const headingElements = doc.querySelectorAll('h1, h2, h3')
      headingElements.forEach(heading => {
        const text = heading.textContent?.trim()
        if (text && text.length > 0) {
          headings.push({
            level: heading.tagName.toLowerCase(),
            text
          })
        }
      })

      // Extrai parágrafos igual à extensão
      const paragraphs = []
      const pElements = doc.querySelectorAll('p')
      pElements.forEach(p => {
        const text = p.textContent?.trim()
        if (text && text.length > 10) {
          paragraphs.push(text)
        }
      })

      // Extrai listas igual à extensão
      const lists = []
      const listElements = doc.querySelectorAll('ul, ol')
      listElements.forEach(list => {
        const items = []
        const listItems = list.querySelectorAll('li')
        listItems.forEach(item => {
          const text = item.textContent?.trim()
          if (text && text.length > 0) {
            items.push(text)
          }
        })
        if (items.length > 0) {
          lists.push({
            type: list.tagName.toLowerCase(),
            items
          })
        }
      })

      // Extrai links igual à extensão
      const links = []
      const linkElements = doc.querySelectorAll('a[href]')
      linkElements.forEach(link => {
        const href = link.getAttribute('href')
        const text = link.textContent?.trim()
        const title = link.getAttribute('title')
        const rel = link.getAttribute('rel')

        if (href && text && text.length > 0) {
          // Classifica o link igual à extensão
          let type = 'general'
          let relevance = 0.5
          const textLower = text.toLowerCase()

          if (textLower.includes('lançado') || textLower.includes('lançada') ||
              textLower.includes('como instalar') || textLower.includes('tutorial') ||
              textLower.includes('dica') || textLower.includes('guia')) {
            type = 'article'
            relevance = 0.8
          }

          links.push({
            url: href,
            text,
            title: title || '',
            rel: rel || '',
            type,
            relevance
          })
        }
      })

      // Gera termos de busca igual à extensão
      const allText = [
        doc.title,
        meta.description || '',
        ...headings.map(h => h.text),
        ...paragraphs,
        ...lists.flatMap(list => list.items)
      ].join(' ').toLowerCase()

      const cleanText = allText
        .replace(/<[^>]*>/g, ' ')
        .replace(/[^\w\s]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()

      const words = cleanText.split(/\s+/)
        .filter(word => word.length > 3)
        .filter(word => {
          // Lista de palavras comuns em português (igual à extensão)
          const commonWords = [
            'para', 'com', 'uma', 'por', 'mais', 'como', 'mas', 'foi', 'ele', 'se',
            'tem', 'à', 'seu', 'sua', 'ou', 'ser', 'quando', 'muito', 'há', 'nos',
            'já', 'está', 'eu', 'também', 'só', 'pelo', 'pela', 'até', 'isso', 'ela',
            'entre', 'era', 'depois', 'sem', 'mesmo', 'aos', 'ter', 'seus', 'suas'
          ]
          return !commonWords.includes(word.toLowerCase())
        })

      const terms = [...new Set(words)].slice(0, 50)

      return {
        url,
        hostname: new URL(url).hostname,
        title: doc.title || 'Sem título',
        meta,
        headings,
        paragraphs,
        lists,
        links,
        terms,
        timestamp: Date.now(),
        capturedBy: 'desktop-app'
      }
    } catch (error) {
      throw new Error(`Erro ao capturar página: ${error.message}`)
    }
  }

  /**
   * Salva página no banco
   */
  async savePage (pageData) {
    try {
      // Salva a página capturada
      await this.savePageData(pageData)

      // Indexa os links encontrados na página
      await this.indexPageLinks(pageData)

      console.log(`💾 Página salva e links indexados: ${pageData.url}`)
    } catch (error) {
      console.error('❌ Erro ao salvar página e indexar links:', error)
      throw error
    }
  }

  /**
   * Salva dados da página no banco
   */
  async savePageData (pageData) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['capturedPages'], 'readwrite')
      const store = transaction.objectStore('capturedPages')

      const request = store.put(pageData)

      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  /**
   * Indexa links da página no banco
   */
  async indexPageLinks (pageData) {
    try {
      if (!pageData.links || pageData.links.length === 0) {
        console.log('ℹ️ Nenhum link para indexar')
        return
      }

      const baseHostname = new URL(pageData.url).hostname
      const linksToIndex = []

      // Filtra apenas links do mesmo domínio
      for (const link of pageData.links) {
        try {
          const linkUrl = new URL(link.url, pageData.url)

          // Verifica se é do mesmo domínio
          if (linkUrl.hostname === baseHostname) {
            // Verifica se o link já foi indexado
            const existingLink = await this.getLinkByUrl(link.url)

            if (!existingLink) {
              // Adiciona informações do link para indexação
              linksToIndex.push({
                url: link.url,
                text: link.text,
                title: link.title,
                rel: link.rel,
                type: link.type,
                relevance: link.relevance,
                sourceUrl: pageData.url,
                sourceHostname: baseHostname,
                discoveredAt: Date.now(),
                lastSeen: Date.now(),
                clickCount: 0,
                status: 'discovered'
              })
            } else {
              // Atualiza informações do link existente
              await this.updateLinkInfo(existingLink, pageData.url)
            }
          }
        } catch (error) {
          console.warn(`⚠️ Link inválido ignorado: ${link.url}`, error.message)
        }
      }

      if (linksToIndex.length > 0) {
        await this.saveLinksToIndex(linksToIndex)
        console.log(`🔗 ${linksToIndex.length} links indexados para o domínio ${baseHostname}`)
      }
    } catch (error) {
      console.error('❌ Erro ao indexar links:', error)
    }
  }

  /**
   * Salva links no índice
   */
  async saveLinksToIndex (links) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['linkIndex'], 'readwrite')
      const store = transaction.objectStore('linkIndex')

      let completed = 0
      const total = links.length

      links.forEach(link => {
        const request = store.put(link)

        request.onsuccess = () => {
          completed++
          if (completed === total) {
            resolve()
          }
        }

        request.onerror = () => {
          console.error('❌ Erro ao salvar link no índice:', link.url, request.error)
          completed++
          if (completed === total) {
            resolve() // Continua mesmo com erros
          }
        }
      })
    })
  }

  /**
   * Obtém link por URL
   */
  async getLinkByUrl (url) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['linkIndex'], 'readonly')
      const store = transaction.objectStore('linkIndex')

      const request = store.get(url)

      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  /**
   * Atualiza informações do link existente
   */
  async updateLinkInfo (existingLink, sourceUrl) {
    try {
      const transaction = this.db.transaction(['linkIndex'], 'readwrite')
      const store = transaction.objectStore('linkIndex')

      // Atualiza lastSeen e adiciona nova fonte se não existir
      existingLink.lastSeen = Date.now()

      if (!existingLink.sourceUrls) {
        existingLink.sourceUrls = []
      }

      if (!existingLink.sourceUrls.includes(sourceUrl)) {
        existingLink.sourceUrls.push(sourceUrl)
      }

      const request = store.put(existingLink)

      return new Promise((resolve, reject) => {
        request.onsuccess = () => resolve()
        request.onerror = () => reject(request.error)
      })
    } catch (error) {
      console.error('❌ Erro ao atualizar link:', error)
    }
  }

  /**
   * Obtém página por URL
   */
  async getPageByUrl (url) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['capturedPages'], 'readonly')
      const store = transaction.objectStore('capturedPages')

      const request = store.get(url)

      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  /**
   * Sincroniza com servidor (DESABILITADO - não necessário para desktop)
   */
  async syncWithServer () {
    try {
      // DESABILITADO: Desktop app não precisa sincronizar automaticamente
      console.log('⏸️ Sincronização automática desabilitada para desktop app')

      /*
      if (!this.apiClient || !this.apiClient.isConnected) return;

      console.log('🔄 Sincronizando com servidor...');

      // Obtém todas as páginas
      const pages = await this.getAllPages();

      // Envia cada página
      for (const page of pages) {
        this.apiClient.sendPageData(page);
        await this.delay(100); // Aguarda um pouco
      }

      console.log(`✅ ${pages.length} páginas sincronizadas`);
      */
    } catch (error) {
      console.error('❌ Erro na sincronização:', error)
    }
  }

  /**
   * Adiciona dados de teste para verificar funcionamento
   */
  async addTestData () {
    try {
      if (!this.db) {
        console.log('⚠️ Banco não disponível para adicionar dados de teste')
        return false
      }

      const testPage = {
        url: 'https://exemplo.com/teste',
        title: 'Página de Teste',
        hostname: 'exemplo.com',
        timestamp: Date.now(),
        meta: {
          description: 'Descrição de teste',
          keywords: 'teste, exemplo, demo'
        },
        headings: [
          { text: 'Título Principal', level: 1 },
          { text: 'Subtítulo', level: 2 }
        ],
        paragraphs: [
          'Este é um parágrafo de teste para verificar o funcionamento do sistema.',
          'Outro parágrafo com mais conteúdo para testar o cálculo de tamanho.'
        ],
        terms: ['teste', 'exemplo', 'demo', 'verificação']
      }

      const transaction = this.db.transaction(['capturedPages'], 'readwrite')
      const store = transaction.objectStore('capturedPages')

      const request = store.add(testPage)

      return new Promise((resolve, reject) => {
        request.onsuccess = () => {
          console.log('✅ Dados de teste adicionados com sucesso')
          resolve(true)
        }

        request.onerror = () => {
          console.error('❌ Erro ao adicionar dados de teste:', request.error)
          reject(request.error)
        }
      })
    } catch (error) {
      console.error('❌ Erro ao adicionar dados de teste:', error)
      return false
    }
  }

  /**
   * Verifica status do banco de dados
   */
  getDatabaseStatus () {
    if (!this.db) {
      return {
        initialized: false,
        stores: [],
        message: 'Banco não inicializado'
      }
    }

    return {
      initialized: true,
      stores: Array.from(this.db.objectStoreNames),
      message: 'Banco funcionando'
    }
  }

  /**
   * Obtém todas as páginas
   */
  async getAllPages () {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        console.log('⚠️ Banco de dados não disponível em getAllPages')
        resolve([])
        return
      }

      try {
        const transaction = this.db.transaction(['capturedPages'], 'readonly')
        const store = transaction.objectStore('capturedPages')

        const request = store.getAll()

        request.onsuccess = () => {
          const pages = request.result || []
          console.log(`📄 getAllPages: ${pages.length} páginas encontradas`)
          resolve(pages)
        }

        request.onerror = () => {
          console.error('❌ Erro ao obter páginas:', request.error)
          reject(request.error)
        }
      } catch (error) {
        console.error('❌ Erro na transação getAllPages:', error)
        resolve([])
      }
    })
  }

  /**
   * Obtém estatísticas completas
   */
  async getStats () {
    try {
      console.log('📊 Obtendo estatísticas do scraper...')

      // Verifica status do banco
      const dbStatus = this.getDatabaseStatus()
      console.log('💾 Status do banco:', dbStatus)

      const pages = await this.getAllPages()
      const links = await this.getAllLinks()

      console.log('📄 Páginas encontradas:', pages.length)
      console.log('🔗 Links encontrados:', links.length)

      // Calcula hosts únicos
      const uniqueHosts = new Set()
      pages.forEach(page => {
        if (page.hostname) {
          uniqueHosts.add(page.hostname)
        }
      })

      console.log('🌐 Hosts únicos:', uniqueHosts.size)

      // Calcula tamanho total aproximado (em MB)
      const totalSizeBytes = pages.reduce((total, page) => {
        let pageSize = 0

        // Tamanho do título
        if (page.title) pageSize += page.title.length

        // Tamanho dos metadados
        if (page.meta) {
          Object.values(page.meta).forEach(value => {
            if (typeof value === 'string') pageSize += value.length
          })
        }

        // Tamanho dos headings
        if (page.headings) {
          page.headings.forEach(heading => {
            if (heading.text) pageSize += heading.text.length
          })
        }

        // Tamanho dos parágrafos
        if (page.paragraphs) {
          page.paragraphs.forEach(paragraph => {
            if (paragraph) pageSize += paragraph.length
          })
        }

        // Tamanho dos termos
        if (page.terms) {
          page.terms.forEach(term => {
            if (term) pageSize += term.length
          })
        }

        return total + pageSize
      }, 0)

      const totalSizeMB = Math.round((totalSizeBytes / 1024 / 1024) * 100) / 100

      // Estatísticas da fila
      const queueStats = this.getQueueStats()

      const finalStats = {
        totalPages: pages.length,
        capturedPages: pages.length,
        uniqueHosts: uniqueHosts.size,
        totalSize: totalSizeMB,
        totalSizeBytes,
        queueLength: this.captureQueue.length,
        isCapturing: this.isCapturing,
        apiConnected: this.apiClient ? this.apiClient.isConnected : false,
        totalLinks: links.length,
        discoveredLinks: queueStats.discovered,
        highPriority: queueStats.high,
        normalPriority: queueStats.normal,
        lowPriority: queueStats.low,
        dbStatus
      }

      console.log('📊 Estatísticas finais:', finalStats)
      return finalStats
    } catch (error) {
      console.error('❌ Erro ao obter estatísticas:', error)
      return {
        totalPages: 0,
        capturedPages: 0,
        uniqueHosts: 0,
        totalSize: 0,
        totalSizeBytes: 0,
        queueLength: 0,
        isCapturing: false,
        apiConnected: false,
        totalLinks: 0,
        discoveredLinks: 0,
        highPriority: 0,
        normalPriority: 0,
        lowPriority: 0,
        dbStatus: { initialized: false, stores: [], message: 'Erro' }
      }
    }
  }

  /**
   * Obtém todos os links indexados
   */
  async getAllLinks () {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        console.log('⚠️ Banco de dados não disponível em getAllLinks')
        resolve([])
        return
      }

      try {
        const transaction = this.db.transaction(['linkIndex'], 'readonly')
        const store = transaction.objectStore('linkIndex')

        const request = store.getAll()

        request.onsuccess = () => {
          const links = request.result || []
          console.log(`🔗 getAllLinks: ${links.length} links encontrados`)
          resolve(links)
        }

        request.onerror = () => {
          console.error('❌ Erro ao obter links:', request.error)
          reject(request.error)
        }
      } catch (error) {
        console.error('❌ Erro na transação getAllLinks:', error)
        resolve([])
      }
    })
  }

  /**
   * Valida URL
   */
  isValidUrl (url) {
    try {
      const urlObj = new URL(url)
      return !!urlObj
    } catch {
      return false
    }
  }

  /**
   * Gera ID único
   */
  generateId () {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
  }

  /**
   * Delay assíncrono
   */
  delay (ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  /**
   * Busca páginas localmente no IndexedDB (igual à extensão)
   */
  async searchLocalPages (query) {
    try {
      if (!this.db || !query) return []

      console.log(`🔍 Buscando por "${query}" no IndexedDB...`)

      const transaction = this.db.transaction(['capturedPages'], 'readonly')
      const store = transaction.objectStore('capturedPages')
      const request = store.getAll()

      return new Promise((resolve) => {
        request.onsuccess = () => {
          const pages = request.result || []
          console.log(`📊 ${pages.length} páginas encontradas no IndexedDB`)

          if (pages.length === 0) {
            resolve([])
            return
          }

          // Filtra e pontua resultados igual à extensão
          const results = pages
            .map(page => {
              const score = this.calculateSearchScore(page, query)
              return { ...page, score }
            })
            .filter(result => result.score > 0)
            .sort((a, b) => b.score - a.score)

          console.log(`✅ ${results.length} resultados relevantes encontrados`)
          resolve(results)
        }

        request.onerror = () => {
          console.error('❌ Erro ao buscar no IndexedDB')
          resolve([])
        }
      })
    } catch (error) {
      console.error('❌ Erro na busca local:', error)
      return []
    }
  }

  /**
   * Calcula score de relevância para busca (igual à extensão)
   */
  calculateSearchScore (page, query) {
    if (!page || !query) return 0

    const queryLower = query.toLowerCase()
    let score = 0

    // Título (maior peso)
    if (page.title && typeof page.title === 'string') {
      const titleLower = page.title.toLowerCase()
      if (titleLower.includes(queryLower)) score += 10
      if (titleLower.startsWith(queryLower)) score += 5
    }

    // Meta description
    if (page.meta && page.meta.description) {
      const descLower = page.meta.description.toLowerCase()
      if (descLower.includes(queryLower)) score += 8
    }

    // Headings
    if (page.headings && Array.isArray(page.headings)) {
      page.headings.forEach(heading => {
        if (heading.text && typeof heading.text === 'string') {
          const headingLower = heading.text.toLowerCase()
          if (headingLower.includes(queryLower)) score += 6
        }
      })
    }

    // Parágrafos
    if (page.paragraphs && Array.isArray(page.paragraphs)) {
      page.paragraphs.forEach(paragraph => {
        if (paragraph && typeof paragraph === 'string') {
          const paraLower = paragraph.toLowerCase()
          if (paraLower.includes(queryLower)) score += 3
        }
      })
    }

    // Termos de busca
    if (page.terms && Array.isArray(page.terms)) {
      page.terms.forEach(term => {
        if (term && typeof term === 'string') {
          const termLower = term.toLowerCase()
          if (termLower.includes(queryLower)) score += 4
        }
      })
    }

    return score
  }

  /**
   * Obtém links por hostname
   */
  async getLinksByHostname (hostname) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['linkIndex'], 'readonly')
      const store = transaction.objectStore('linkIndex')
      const index = store.index('sourceHostname')

      const request = index.getAll(hostname)

      request.onsuccess = () => resolve(request.result || [])
      request.onerror = () => reject(request.error)
    })
  }

  /**
   * Inicia processamento da fila
   */
  startQueueProcessing () {
    if (this.isCapturing) {
      console.log('ℹ️ Processamento já está rodando')
      return
    }

    console.log('🚀 Iniciando processamento da fila de captura')
    this.processQueue()
  }

  /**
   * Para processamento da fila
   */
  stopQueueProcessing () {
    if (!this.isCapturing) {
      console.log('ℹ️ Processamento não está rodando')
      return
    }

    console.log('⏹️ Parando processamento da fila de captura')
    this.isCapturing = false
  }

  /**
   * Obtém estatísticas da fila
   */
  getQueueStats () {
    const stats = {
      total: this.captureQueue.length,
      pending: this.captureQueue.filter(item => item.status === 'pending').length,
      processing: this.captureQueue.filter(item => item.status === 'processing').length,
      high: this.captureQueue.filter(item => item.priority === 'high').length,
      normal: this.captureQueue.filter(item => item.priority === 'normal').length,
      low: this.captureQueue.filter(item => item.priority === 'low').length,
      discovered: this.captureQueue.filter(item => item.type === 'discovered').length,
      isCapturing: this.isCapturing
    }

    return stats
  }

  /**
   * Notifica atualização da fila
   */
  notifyQueueUpdate () {
    try {
      // Dispara evento customizado para notificar os controles
      const event = new CustomEvent('queueUpdated', {
        detail: {
          queue: this.captureQueue,
          stats: this.getQueueStats(),
          isCapturing: this.isCapturing
        }
      })

      window.dispatchEvent(event)
      console.log('📢 Notificação de atualização da fila enviada')
    } catch (error) {
      console.error('❌ Erro ao notificar atualização da fila:', error)
    }
  }

  /**
   * Adiciona listener para atualizações da fila
   */
  addQueueUpdateListener (callback) {
    if (typeof callback === 'function') {
      window.addEventListener('queueUpdated', callback)
      console.log('👂 Listener de atualização da fila adicionado')
    }
  }

  /**
   * Remove listener de atualizações da fila
   */
  removeQueueUpdateListener (callback) {
    if (typeof callback === 'function') {
      window.removeEventListener('queueUpdated', callback)
      console.log('👂 Listener de atualização da fila removido')
    }
  }
}

// Exporta para uso global
window.BuscaLogoScraper = BuscaLogoScraper

console.log('🚀 BuscaLogoScraper carregado')
