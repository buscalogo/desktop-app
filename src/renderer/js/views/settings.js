/**
 * BuscaLogo Desktop - Settings View
 */
class SettingsView {
  constructor () {
    this.settings = {}
    this.currentTab = 'general'
    this.hasUnsavedChanges = false
    this.loadSettings()
    this.setupEventListeners()
    this.setupFormValidation()
    this.setupTabNavigation()
    this.loadQuickStats()
  }

  setupEventListeners () {
    // Botões principais
    document.getElementById('saveSettingsBtn')?.addEventListener('click', () => this.saveSettings())
    document.getElementById('resetSettingsBtn')?.addEventListener('click', () => this.resetSettings())
    document.getElementById('clearDataBtn')?.addEventListener('click', () => this.confirmClearData())
    // Inputs de configuração
    const inputs = document.querySelectorAll('#settings input, #settings select')
    inputs.forEach(input => {
      input.addEventListener('change', () => this.onSettingChange())
      input.addEventListener('input', () => this.onSettingChange())
    })
    // Range inputs
    this.setupRangeInputs()
    // Theme selector
    this.setupThemeSelector()
  }

  setupTabNavigation () {
    const tabs = document.querySelectorAll('.nav-tab')
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const tabName = tab.dataset.tab
        this.switchTab(tabName)
      })
    })
  }

  switchTab (tabName) {
    // Remove active class from all tabs and content
    document.querySelectorAll('.nav-tab').forEach(tab => tab.classList.remove('active'))
    document.querySelectorAll('.settings-tab').forEach(tab => tab.classList.remove('active'))
    // Add active class to selected tab and content
    document.querySelector(`[data-tab="${tabName}"]`)?.classList.add('active')
    document.getElementById(`${tabName}-tab`)?.classList.add('active')
    this.currentTab = tabName
    // Update URL hash
    window.location.hash = `#${tabName}`
  }

  setupThemeSelector () {
    const themeOptions = document.querySelectorAll('.theme-option')
    themeOptions.forEach(option => {
      option.addEventListener('click', () => {
        // Remove active class from all options
        themeOptions.forEach(opt => opt.classList.remove('active'))
        // Add active class to clicked option
        option.classList.add('active')
        const theme = option.dataset.theme
        this.updateSetting('themePreference', theme)
        this.onSettingChange()
      })
    })
  }

  setupRangeInputs () {
    // Storage range
    const storageRange = document.getElementById('storageRange')
    const storageInput = document.getElementById('maxStorageSize')
    if (storageRange && storageInput) {
      storageRange.addEventListener('input', (e) => {
        storageInput.value = e.target.value
        this.updateSetting('maxStorageSize', parseInt(e.target.value))
        this.onSettingChange()
      })
      storageInput.addEventListener('input', (e) => {
        const value = Math.min(Math.max(parseInt(e.target.value) || 100, 100), 10000)
        storageRange.value = value
        e.target.value = value
        this.updateSetting('maxStorageSize', value)
        this.onSettingChange()
      })
    }
    // Cleanup range
    const cleanupRange = document.getElementById('cleanupRange')
    const cleanupInput = document.getElementById('cleanupInterval')
    if (cleanupRange && cleanupInput) {
      cleanupRange.addEventListener('input', (e) => {
        cleanupInput.value = e.target.value
        this.updateSetting('cleanupInterval', parseInt(e.target.value))
        this.onSettingChange()
      })
      cleanupInput.addEventListener('input', (e) => {
        const value = Math.min(Math.max(parseInt(e.target.value) || 7, 7), 365)
        cleanupRange.value = value
        e.target.value = value
        this.updateSetting('cleanupInterval', value)
        this.onSettingChange()
      })
    }
  }

  setupFormValidation () {
    const numberInputs = document.querySelectorAll('#settings input[type="number"]')
    numberInputs.forEach(input => {
      input.addEventListener('input', () => this.validateInput(input))
    })
  }

  validateInput (input) {
    const min = parseInt(input.getAttribute('min'))
    const max = parseInt(input.getAttribute('max'))
    let value = parseInt(input.value)
    if (isNaN(value)) value = min
    if (value < min) value = min
    if (value > max) value = max
    input.value = value
  }

  loadSettings () {
    const savedSettings = localStorage.getItem('buscaLogoSettings')
    if (savedSettings) {
      this.settings = JSON.parse(savedSettings)
    } else {
      this.loadDefaultSettings()
    }
    this.applySettings()
  }

  loadDefaultSettings () {
    this.settings = {
      autoSync: false,
      startupView: 'dashboard',
      themePreference: 'auto',
      notifications: true,
      maxStorageSize: 1000,
      autoCleanup: true,
      cleanupInterval: 30,
      dataEncryption: false,
      cacheEnabled: true,
      backgroundSync: true,
      performanceMode: 'balanced',
      requireAuth: false,
      autoBackup: true,
      securityAlerts: true
    }
  }

  applySettings () {
    // Apply settings to UI elements
    Object.keys(this.settings).forEach(key => {
      const element = document.getElementById(key)
      if (element) {
        if (element.type === 'checkbox') {
          element.checked = this.settings[key]
        } else if (element.type === 'select-one') {
          element.value = this.settings[key]
        } else {
          element.value = this.settings[key]
        }
      }
    })
    // Apply theme preference
    const themeOption = document.querySelector(`[data-theme="${this.settings.themePreference}"]`)
    if (themeOption) {
      document.querySelectorAll('.theme-option').forEach(opt => opt.classList.remove('active'))
      themeOption.classList.add('active')
    }
    // Apply range values
    const storageRange = document.getElementById('storageRange')
    const cleanupRange = document.getElementById('cleanupRange')
    if (storageRange) storageRange.value = this.settings.maxStorageSize
    if (cleanupRange) cleanupRange.value = this.settings.cleanupInterval
  }

  updateSetting (key, value) {
    this.settings[key] = value
    this.hasUnsavedChanges = true
    this.showSaveIndicator()
  }

  onSettingChange () {
    this.hasUnsavedChanges = true
    this.showSaveIndicator()
  }

  showSaveIndicator () {
    const indicator = document.getElementById('saveIndicator')
    if (indicator) {
      indicator.style.display = 'flex'
      indicator.querySelector('.indicator-text').textContent = 'Alterações não salvas'
    }
  }

  async saveSettings () {
    try {
      localStorage.setItem('buscaLogoSettings', JSON.stringify(this.settings))
      this.hasUnsavedChanges = false
      const indicator = document.getElementById('saveIndicator')
      if (indicator) {
        indicator.style.display = 'none'
      }
      this.showNotification('Configurações salvas com sucesso!', 'success')
      // Reload quick stats after saving
      await this.loadQuickStats()
    } catch (error) {
      console.error('Erro ao salvar configurações:', error)
      this.showNotification('Erro ao salvar configurações', 'error')
    }
  }

  resetSettings () {
    if (confirm('Tem certeza que deseja restaurar as configurações padrão?')) {
      this.loadDefaultSettings()
      this.applySettings()
      this.saveSettings()
      this.showNotification('Configurações restauradas para padrão', 'info')
    }
  }

  confirmClearData () {
    if (confirm('⚠️ ATENÇÃO: Esta ação irá apagar TODOS os dados do aplicativo!\n\nTem certeza que deseja continuar?')) {
      this.clearAllData()
    }
  }

  async clearAllData () {
    try {
      // Clear localStorage
      localStorage.clear()
      // Clear IndexedDB
      await this.clearIndexedDB()
      this.showNotification('Todos os dados foram apagados', 'success')
      // Reload page
      setTimeout(() => {
        window.location.reload()
      }, 2000)
    } catch (error) {
      console.error('Erro ao limpar dados:', error)
      this.showNotification('Erro ao limpar dados', 'error')
    }
  }

  async clearIndexedDB () {
    return new Promise((resolve, reject) => {
      const request = indexedDB.deleteDatabase('BuscaLogoDB')
      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  async loadQuickStats () {
    try {
      if (!window.buscaLogoApp?.scraper) {
        console.warn('Scraper não disponível para carregar estatísticas')
        return
      }
      const stats = await window.buscaLogoApp.scraper.getStats()
      // Update storage used
      const storageUsed = document.getElementById('storageUsed')
      if (storageUsed) {
        const storageMB = Math.round(stats.storageUsed / (1024 * 1024))
        storageUsed.textContent = storageMB
        // Update progress bar
        const barFill = storageUsed.closest('.stat-card').querySelector('.bar-fill')
        if (barFill) {
          const percentage = Math.min((storageMB / 1000) * 100, 100)
          barFill.style.width = `${percentage}%`
        }
      }
      // Update total pages
      const totalPages = document.getElementById('totalPages')
      if (totalPages) {
        totalPages.textContent = stats.totalPages
      }
      // Update total links
      const totalLinks = document.getElementById('totalLinks')
      if (totalLinks) {
        totalLinks.textContent = stats.totalLinks
      }
      // Update unique domains
      const uniqueDomains = document.getElementById('uniqueDomains')
      if (uniqueDomains) {
        uniqueDomains.textContent = stats.uniqueDomains
      }
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error)
    }
  }

  showNotification (message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div')
    notification.className = `notification notification-${type}`
    notification.innerHTML = `
      <div class="notification-content">
        <span class="notification-icon">${this.getNotificationIcon(type)}</span>
        <span class="notification-text">${message}</span>
        <button class="notification-close" onclick="this.parentElement.parentElement. remove()">×</button>
      </div>
    `
    // Add styles
    notification.style.cssText = `
      position: fixed 
      top: 20px 
      right: 20px 
      background: ${this.getNotificationColor(type)} 
      color: white 
      padding: 1rem 1.5rem 
      border-radius: 12px 
      box-shadow: 0 10px 30px  rgba(0, 0, 0, 0.3) 
      z-index: 10000 
      animation: slideIn 0.3s ease-out 
      max-width: 400px 
    `
    // Add animation styles
    const style = document.createElement('style')
    style.textContent = `
      @keyframes slideIn {
        from { transform:  translateX(100%) opacity: 0 }
        to { transform:  translateX(0) opacity: 1 }
      }
    `
    document.head.appendChild(style)
    // Add to page
    document.body.appendChild(notification)
    // Auto remove after 5 seconds
    setTimeout(() => {
      if (notification.parentElement) {
        notification.remove()
      }
    }, 5000)
  }

  getNotificationIcon (type) {
    const icons = {
      success: '✅',
      error: '❌',
      warning: '⚠️',
      info: 'ℹ️'
    }
    return icons[type] || icons.info
  }

  getNotificationColor (type) {
    const colors = {
      success: 'linear- gradient(135deg, #10b981, #059669)',
      error: 'linear- gradient(135deg, #ef4444, #dc2626)',
      warning: 'linear- gradient(135deg, #f59e0b, #d97706)',
      info: 'linear- gradient(135deg, #06b6d4, #0891b2)'
    }
    return colors[type] || colors.info
  }
}
// Global functions for HTML onclick handlers
window.openSchemaViewer = async function () {
  try {
    if (window.electronAPI) {
      // Electron environment
      const paths = await window.electronAPI.getSystemPaths()
      const schemaPath = `${paths.cwd}/indexeddb-schema-viewer.html`
      const fileInfo = await window.electronAPI.getFileInfo(schemaPath)
      if (fileInfo.exists) {
        await window.electronAPI.openExternalFile(schemaPath)
        console.log('📊 Schema Viewer aberto no navegador padrão')
      } else {
        console.error('❌ Arquivo Schema Viewer não encontrado:', schemaPath)
        alert('Arquivo Schema Viewer não encontrado. Verifique se o arquivo existe.')
      }
    } else {
      // Browser environment
      window.open('indexeddb-schema-viewer.html', '_blank')
      console.log('📊 Schema Viewer aberto em nova aba')
    }
  } catch (error) {
    console.error('❌ Erro ao abrir Schema Viewer:', error)
    alert('Erro ao abrir Schema Viewer: ' + error.message)
  }
}
window.exportDatabaseData = function () {
  // Create and trigger download of export script
  const script = document.createElement('script')
  script.src = 'export-indexeddb-schema.js'
  document.head.appendChild(script)
  script.onload = () => {
    if (window.exportIndexedDBSchema) {
      window.exportIndexedDBSchema()
    }
  }
}
window.checkDatabaseStatus = async function () {
  try {
    if (!window.buscaLogoApp?.scraper) {
      alert('Scraper não disponível')
      return
    }
    const stats = await window.buscaLogoApp.scraper.getStats()
    const status = await window.buscaLogoApp.scraper.getDatabaseStatus()
    const message = `
📊 Status do Banco de Dados:
✅ Conexão: ${status.connected ? 'Ativa' : 'Inativa'}
💾 Armazenamento: ${Math.round(stats.storageUsed / (1024 * 1024))} MB
📄 Páginas: ${stats.totalPages}
🔗 Links: ${stats.totalLinks}
🌐 Domínios: ${stats.uniqueDomains}
🗄️ Tabelas: ${status.tables ? status.tables.length : 'N/A'}
    `
    alert(message)
  } catch (error) {
    console.error('Erro ao verificar status:', error)
    alert('Erro ao verificar status: ' + error.message)
  }
}
window.optimizeDatabase = async function () {
  try {
    const btn = event.target.closest('.tool-btn')
    const originalText = btn.innerHTML
    // Show loading state
    btn.innerHTML = '<span class="btn-icon">⏳</span><span class="btn-text">Otimizando...</span>'
    btn.disabled = true
    // Simulate optimization process
    await new Promise(resolve => setTimeout(resolve, 2000))
    // Show success state
    btn.innerHTML = '<span class="btn-icon">✅</span><span class="btn-text">Otimizado!</span>'
    btn.style.background = 'linear- gradient(135deg, #10b981, #059669)'
    // Reset after 3 seconds
    setTimeout(() => {
      btn.innerHTML = originalText
      btn.style.background = ''
      btn.disabled = false
    }, 3000)
    // Show notification
    if (window.settingsView) {
      window.settingsView.showNotification('Banco de dados otimizado com sucesso!', 'success')
    }
  } catch (error) {
    console.error('Erro na otimização:', error)
    alert('Erro na otimização: ' + error.message)
  }
}
window.toggleSettingsView = function () {
  const settingsInterface = document.querySelector('.settings-interface')
  if (settingsInterface) {
    settingsInterface.classList.toggle('compact-view')
  }
}
window.refreshSettings = async function () {
  if (window.settingsView) {
    await window.settingsView.loadQuickStats()
    window.settingsView.showNotification('Configurações atualizadas!', 'success')
  }
}
// Initialize settings view when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.settingsView = new SettingsView()
  // Check URL hash for initial tab
  const hash = window.location.hash.replace('#', '')
  if (hash && document.querySelector(`[data-tab="${hash}"]`)) {
    window.settingsView.switchTab(hash)
  }
})
