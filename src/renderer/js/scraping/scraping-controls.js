/**
 * Controles de Scraping Simplificados
 *
 * Funcionalidades:
 * - Adicionar URLs para captura
 * - Visualizar fila de captura
 * - Ver estatísticas básicas
 */
class ScrapingControls {
  constructor (scraper) {
    this.scraper = scraper
    this.elements = {}
    this.init()
  }

  /**
   * Inicializa controles
   */
  async init () {
    try {
      console.log('🎛️ Inicializando controles de scraping...')
      // Mapeia elementos DOM
      this.mapElements()
      // Configura event listeners
      this.setupEventListeners()
      // Adiciona listener para atualizações da fila
      if (this.scraper) {
        this.scraper.addQueueUpdateListener(() => {
          this.updateQueueDisplay()
        })
      }
      // Atualiza display inicial
      this.updateQueueDisplay()
      console.log('✅ Controles de scraping inicializados')
    } catch (error) {
      console.error('❌ Erro ao inicializar controles:', error)
    }
  }

  /**
   * Mapeia elementos DOM
   */
  mapElements () {
    this.elements = {
      // Form de captura
      urlInput: document.getElementById('urlInput'),
      captureButton: document.getElementById('captureButton'),
      prioritySelect: document.getElementById('prioritySelect'),
      // Status da fila
      queueLength: document.getElementById('queueLength'),
      isCapturing: document.getElementById('isCapturing'),
      highPriority: document.getElementById('highPriority'),
      discoveredLinks: document.getElementById('discoveredLinks'),
      // Controles da fila
      startProcessingButton: document.getElementById('startProcessingBtn'),
      stopProcessingButton: document.getElementById('stopProcessingBtn'),
      clearQueueButton: document.getElementById('clearQueueBtn'),
      // Lista da fila
      queueList: document.getElementById('queueList'),
      // Status da API
      apiStatus: document.getElementById('apiStatus')
    }
    console.log('🔍 Elementos mapeados:', Object.keys(this.elements))
  }

  /**
   * Configura event listeners
   */
  setupEventListeners () {
    // Formulário de captura
    if (this.elements.captureForm) {
      this.elements.captureForm.addEventListener('submit', (e) => {
        e.preventDefault()
        this.addUrlToQueue()
      })
    }
    // Botão de captura
    if (this.elements.captureButton) {
      this.elements.captureButton.addEventListener('click', () => {
        this.addUrlToQueue()
      })
    }
    // Botão de iniciar processamento
    if (this.elements.startProcessingButton) {
      this.elements.startProcessingButton.addEventListener('click', () => {
        this.startProcessing()
      })
    }
    // Botão de parar processamento
    if (this.elements.stopProcessingButton) {
      this.elements.stopProcessingButton.addEventListener('click', () => {
        this.stopProcessing()
      })
    }
    // Botão de limpar fila
    if (this.elements.clearQueueButton) {
      this.elements.clearQueueButton.addEventListener('click', () => {
        this.clearQueue()
      })
    }
    console.log('🔌 Event listeners configurados')
  }

  /**
   * Carrega dados iniciais
   */
  loadInitialData () {
    this.updateStats()
    this.updateQueueDisplay()
    // Atualiza a cada 5 segundos
    setInterval(() => {
      this.updateStats()
      this.updateQueueDisplay()
    }, 5000)
  }

  /**
   * Adiciona URL à fila
   */
  addUrlToQueue () {
    const urlInput = this.elements.urlInput
    const prioritySelect = this.elements.prioritySelect
    if (!urlInput || !urlInput.value.trim()) {
      this.showMessage('Por favor, insira uma URL válida', 'error')
      return
    }
    const url = urlInput.value.trim()
    const priority = prioritySelect ? prioritySelect.value : 'normal'
    try {
      const success = this.scraper.addUrlForCapture(url, priority)
      if (success) {
        this.showMessage(`URL adicionada à fila: ${url}`, 'success')
        urlInput.value = ''
        this.updateQueueDisplay()
      } else {
        this.showMessage('Erro ao adicionar URL à fila', 'error')
      }
    } catch (error) {
      console.error('❌ Erro ao adicionar URL:', error)
      this.showMessage('Erro ao adicionar URL à fila', 'error')
    }
  }

  /**
   * Inicia processamento da fila
   */
  startProcessing () {
    if (this.scraper.isCapturing) {
      this.showMessage('Processamento já está rodando', 'info')
      return
    }
    this.scraper.startQueueProcessing()
    this.updateQueueDisplay()
    this.showMessage('Processamento da fila iniciado', 'success')
  }

  /**
   * Para processamento da fila
   */
  stopProcessing () {
    if (!this.scraper.isCapturing) {
      this.showMessage('Processamento não está rodando', 'info')
      return
    }
    this.scraper.stopQueueProcessing()
    this.updateQueueDisplay()
    this.showMessage('Processamento da fila parado', 'info')
  }

  /**
   * Limpa fila de captura
   */
  clearQueue () {
    if (this.scraper.captureQueue.length === 0) {
      this.showMessage('Fila já está vazia', 'info')
      return
    }
    if (confirm('Tem certeza que deseja limpar toda a fila de captura?')) {
      this.scraper.captureQueue = []
      this.updateQueueDisplay()
      this.showMessage('Fila de captura limpa', 'success')
    }
  }

  /**
   * Remove item específico da fila
   */
  removeFromQueue (itemId) {
    const index = this.scraper.captureQueue.findIndex(item => item.id === itemId)
    if (index !== -1) {
      const removedItem = this.scraper.captureQueue.splice(index, 1)[0]
      this.updateQueueDisplay()
      this.showMessage(`Item removido da fila: ${removedItem.url}`, 'success')
    }
  }

  /**
   * Altera prioridade de um item
   */
  changePriority (itemId, newPriority) {
    const item = this.scraper.captureQueue.find(item => item.id === itemId)
    if (item) {
      item.priority = newPriority
      item.scheduledAt = Date.now() // Atualiza timestamp para reordenação
      this.updateQueueDisplay()
      this.showMessage(`Prioridade alterada para: ${newPriority}`, 'success')
    }
  }

  /**
   * Atualiza estatísticas
   */
  async updateStats () {
    try {
      const stats = await this.scraper.getStats()
      if (stats) {
        if (this.elements.totalPages) {
          this.elements.totalPages.textContent = stats.totalPages
        }
        if (this.elements.capturedPages) {
          this.elements.capturedPages.textContent = stats.capturedPages
        }
      }
    } catch (error) {
      console.error('❌ Erro ao atualizar estatísticas:', error)
    }
  }

  /**
   * Atualiza exibição da fila
   */
  updateQueueDisplay () {
    if (!this.scraper) return
    const stats = this.scraper.getQueueStats()
    // Atualiza estatísticas
    if (this.elements.queueLength) {
      this.elements.queueLength.textContent = stats.total
    }
    if (this.elements.isCapturing) {
      this.elements.isCapturing.textContent = stats.isCapturing ? 'Sim' : 'Não'
      this.elements.isCapturing.className = stats.isCapturing ? 'status-value active' : 'status-value'
    }
    if (this.elements.highPriority) {
      this.elements.highPriority.textContent = stats.high
    }
    if (this.elements.discoveredLinks) {
      this.elements.discoveredLinks.textContent = stats.discovered
    }
    // Atualiza lista da fila
    this.updateQueueList()
    // Atualiza status da API
    if (this.elements.apiStatus && this.scraper.apiClient) {
      const apiConnected = this.scraper.apiClient.isConnected
      const peerId = this.scraper.apiClient.peerId
      if (apiConnected) {
        this.elements.apiStatus.textContent = `Sim (${peerId?.substring(0, 8)}...)`
        this.elements.apiStatus.className = 'status-active'
      } else {
        this.elements.apiStatus.textContent = 'Não'
        this.elements.apiStatus.className = 'status-inactive'
      }
    }
  }

  /**
   * Atualiza lista da fila
   */
  updateQueueList () {
    if (!this.elements.queueList || !this.scraper) return
    const queue = this.scraper.captureQueue
    if (queue.length === 0) {
      this.elements.queueList.innerHTML = `
        <div class="no-items">
          <span class="no-items-icon">📋</span>
          <p>Nenhum item na fila</p>
        </div>
      `
      return
    }
    const queueItems = queue.map(item => `
      <div class="queue-item" data-id="${item.id}">
        <div class="queue-item-header">
          <span class="queue-url">${item.url}</span>
          <span class="queue-priority priority-${item.priority}">${item.priority}</span>
        </div>
        <div class="queue-item-details">
          <span class="queue-status status-${item.status}">${item.status}</span>
          <span class="queue-hostname">${item.hostname}</span>
          ${item.type === 'discovered' ? '<span class="queue-type">🔗 Descoberto</span>' : ''}
        </div>
        <div class="queue-item-actions">
          <button class="btn btn-sm btn-primary" onclick="scrapingControls. changePriority('${item.id}', 'high')">Alta</button>
          <button class="btn btn-sm btn-secondary" onclick="scrapingControls. changePriority('${item.id}', 'normal')">Normal</button>
          <button class="btn btn-sm btn-warning" onclick="scrapingControls. changePriority('${item.id}', 'low')">Baixa</button>
          <button class="btn btn-sm btn-danger" onclick="scrapingControls. removeFromQueue('${item.id}')">Remover</button>
        </div>
      </div>
    `).join('')
    this.elements.queueList.innerHTML = queueItems
  }

  /**
   * Obtém texto do status
   */
  getStatusText (status) {
    const statusMap = {
      queued: 'Na Fila',
      capturing: 'Capturando',
      completed: 'Concluído',
      failed: 'Falhou'
    }
    return statusMap[status] || status
  }

  /**
   * Formata timestamp
   */
  formatTime (timestamp) {
    const now = Date.now()
    const diff = now - timestamp
    if (diff < 60000) { // Menos de 1 minuto
      return 'Agora'
    } else if (diff < 3600000) { // Menos de 1 hora
      const minutes = Math.floor(diff / 60000)
      return `${minutes}m atrás`
    } else if (diff < 86400000) { // Menos de 1 dia
      const hours = Math.floor(diff / 3600000)
      return `${hours}h atrás`
    } else {
      const date = new Date(timestamp)
      return date.toLocaleDateString('pt-BR')
    }
  }

  /**
   * Mostra mensagem para o usuário
   */
  showMessage (message, type = 'info') {
    try {
      // Cria elemento de mensagem
      const messageElement = document.createElement('div')
      messageElement.className = `message message-${type}`
      messageElement.textContent = message
      // Adiciona ao DOM
      document.body.appendChild(messageElement)
      // Remove após 3 segundos
      setTimeout(() => {
        if (messageElement.parentNode) {
          messageElement.parentNode.removeChild(messageElement)
        }
      }, 3000)
      console.log(`[${type.toUpperCase()}] ${message}`)
    } catch (error) {
      console.error('❌ Erro ao mostrar mensagem:', error)
    }
  }
}
// Exporta para uso global
window.ScrapingControls = ScrapingControls
console.log('🎛️ Controles de scraping carregados')
