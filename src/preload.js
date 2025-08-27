const { contextBridge, ipcRenderer } = require('electron')

/**
 * API segura exposta para o processo de renderização
 */
contextBridge.exposeInMainWorld('electronAPI', {
  // Informações do sistema
  getSystemInfo: () => ipcRenderer.invoke('get-system-info'),

  // Diálogos de arquivo
  openFileDialog: () => ipcRenderer.invoke('open-file-dialog'),
  saveFileDialog: (defaultPath) => ipcRenderer.invoke('save-file-dialog', defaultPath),

  // Diálogos de mensagem
  showErrorDialog: (title, content) => ipcRenderer.invoke('show-error-dialog', title, content),
  showInfoDialog: (title, content) => ipcRenderer.invoke('show-info-dialog', title, content),

  // Eventos do menu
  onMenuAction: (callback) => {
    ipcRenderer.on('menu-action', (event, action) => callback(action))
  },

  // Eventos de erro
  onError: (callback) => {
    ipcRenderer.on('error', (event, error) => callback(error))
  },

  // Remover listeners
  removeAllListeners: (channel) => {
    ipcRenderer.removeAllListeners(channel)
  },

  // API para abrir arquivos externos
  openExternalFile: (filePath) => {
    return ipcRenderer.invoke('open-external-file', filePath)
  },

  // API para verificar existência de arquivos
  fileExists: (filePath) => {
    return ipcRenderer.invoke('file-exists', filePath)
  },

  // API para obter informações do arquivo
  getFileInfo: (filePath) => {
    return ipcRenderer.invoke('get-file-info', filePath)
  },

  // API para obter caminhos do sistema
  getSystemPaths: () => {
    return ipcRenderer.invoke('get-system-paths')
  }
})

/**
 * API para comunicação com a extensão Chrome
 */
contextBridge.exposeInMainWorld('extensionAPI', {
  // Verifica se a extensão está instalada
  checkExtensionInstalled: () => {
    return new Promise((resolve) => {
      // Tenta detectar a extensão BuscaLogo
      const checkExtension = () => {
        try {
          // Verifica se há algum indicador da extensão
          const hasExtension = document.querySelector('[data-buscalogo]') !== null ||
                             window.buscalogo !== undefined ||
                             localStorage.getItem('buscalogo-extension') !== null

          resolve({
            installed: hasExtension,
            version: hasExtension ? '1.0.0' : null,
            timestamp: Date.now()
          })
        } catch (error) {
          resolve({
            installed: false,
            error: error.message,
            timestamp: Date.now()
          })
        }
      }

      // Executa verificação
      checkExtension()
    })
  },

  // Sincroniza dados com a extensão
  syncWithExtension: () => {
    return new Promise((resolve) => {
      try {
        // Tenta obter dados da extensão
        const extensionData = {
          pages: localStorage.getItem('buscalogo-pages') || '[]',
          settings: localStorage.getItem('buscalogo-settings') || '{}',
          history: localStorage.getItem('buscalogo-history') || '[]',
          timestamp: Date.now()
        }

        resolve({
          success: true,
          data: extensionData,
          message: 'Dados sincronizados com sucesso'
        })
      } catch (error) {
        resolve({
          success: false,
          error: error.message,
          message: 'Erro ao sincronizar com extensão'
        })
      }
    })
  }
})

/**
 * API para armazenamento local
 */
contextBridge.exposeInMainWorld('storageAPI', {
  // Salva dados no armazenamento local
  saveData: (key, data) => {
    try {
      localStorage.setItem(key, JSON.stringify(data))
      return {
        success: true,
        message: 'Dados salvos com sucesso'
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Erro ao salvar dados'
      }
    }
  },

  // Carrega dados do armazenamento local
  loadData: (key) => {
    try {
      const data = localStorage.getItem(key)
      return {
        success: true,
        data: data ? JSON.parse(data) : null,
        message: 'Dados carregados com sucesso'
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Erro ao carregar dados'
      }
    }
  },

  // Remove dados do armazenamento local
  removeData: (key) => {
    try {
      localStorage.removeItem(key)
      return {
        success: true,
        message: 'Dados removidos com sucesso'
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Erro ao remover dados'
      }
    }
  },

  // Limpa todo o armazenamento local
  clearAll: () => {
    try {
      localStorage.clear()
      return {
        success: true,
        message: 'Armazenamento limpo com sucesso'
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Erro ao limpar armazenamento'
      }
    }
  }
})

/**
 * API para utilitários
 */
contextBridge.exposeInMainWorld('utilsAPI', {
  // Formata data
  formatDate: (timestamp) => {
    try {
      const date = new Date(timestamp)
      return date.toLocaleString('pt-BR')
    } catch (error) {
      return 'Data inválida'
    }
  },

  // Formata tamanho de arquivo
  formatFileSize: (bytes) => {
    if (bytes === 0) return '0 Bytes'

    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  },

  // Valida URL
  isValidUrl: (string) => {
    try {
      const url = new URL(string)
      return !!url
    } catch (_) {
      return false
    }
  },

  // Gera ID único
  generateId: () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
  },

  // Debounce function
  debounce: (func, wait) => {
    let timeout
    return function executedFunction (...args) {
      const later = () => {
        clearTimeout(timeout)
        func(...args)
      }
      clearTimeout(timeout)
      timeout = setTimeout(later, wait)
    }
  }
})

console.log('🔌 Preload script carregado')
