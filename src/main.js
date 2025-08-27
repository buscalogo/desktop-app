const { app, BrowserWindow, Menu, ipcMain, dialog, shell, Tray, nativeImage } = require('electron')
const path = require('path')
const isDev = process.argv.includes('--dev')

// Configurações do app
const APP_NAME = 'BuscaLogo Desktop'
const APP_VERSION = '1.0.0'

// Flag para controlar quando a aplicação está realmente saindo
app.isQuiting = false

// Janela principal
let mainWindow
let tray = null

/**
 * Cria a janela principal do aplicativo
 */
function createMainWindow () {
  // Cria a janela do navegador
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, 'preload.js')
    },
    icon: path.join(__dirname, '..', 'assets', 'icon.png'),
    title: APP_NAME,
    show: false,
    titleBarStyle: 'default',
    frame: true,
    resizable: true,
    maximizable: true,
    fullscreenable: true
  })

  // Carrega o arquivo HTML principal
  console.log('📁 Carregando arquivo HTML...')
  mainWindow.loadFile(path.join(__dirname, 'renderer/index.html'))
  console.log('📄 Arquivo HTML carregado')

  // Mostra a janela quando estiver pronta
  mainWindow.once('ready-to-show', () => {
    console.log('🎯 Janela pronta para exibir')
    mainWindow.show()
    console.log('✅ Janela exibida com sucesso')

    // Abre DevTools em modo de desenvolvimento
    if (isDev) {
      mainWindow.webContents.openDevTools()
      console.log('🔧 DevTools aberto')
    }
  })

  // Evento quando a janela é fechada
  mainWindow.on('closed', () => {
    mainWindow = null
  })

  // Evento quando a janela está sendo fechada (antes de fechar)
  mainWindow.on('close', (event) => {
    // Se não for uma saída forçada (Cmd+Q, Ctrl+Q), apenas esconde a janela
    if (!app.isQuiting) {
      event.preventDefault()
      mainWindow.hide()
      return false
    }
  })

  // Previne navegação para URLs externas
  mainWindow.webContents.on('will-navigate', (event, navigationUrl) => {
    const parsedUrl = new URL(navigationUrl)

    if (parsedUrl.origin !== 'file://') {
      event.preventDefault()
      shell.openExternal(navigationUrl)
    }
  })

  // Previne abertura de novas janelas
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url)
    return { action: 'deny' }
  })

  console.log('🚀 Janela principal criada')
}

/**
 * Cria o system tray (ícone na bandeja do sistema)
 */
function createTray () {
  // Cria o ícone do tray usando o ícone específico para tray
  const iconPath = path.join(__dirname, '..', 'assets', 'tray-icon.png')
  const trayIcon = nativeImage.createFromPath(iconPath)

  // Cria o tray com o ícone específico
  tray = new Tray(trayIcon)
  tray.setToolTip(APP_NAME)

  // Cria o menu de contexto do tray
  const trayMenu = Menu.buildFromTemplate([
    {
      label: 'Mostrar BuscaLogo',
      click: () => {
        if (mainWindow) {
          mainWindow.show()
          mainWindow.focus()
        }
      }
    },
    {
      label: 'Nova Busca',
      click: () => {
        if (mainWindow) {
          mainWindow.webContents.send('menu-action', 'new-search')
          mainWindow.show()
          mainWindow.focus()
        }
      }
    },
    {
      label: 'Dashboard',
      click: () => {
        if (mainWindow) {
          mainWindow.webContents.send('menu-action', 'open-dashboard')
          mainWindow.show()
          mainWindow.focus()
        }
      }
    },
    {
      type: 'separator'
    },
    {
      label: 'Preferências',
      click: () => {
        if (mainWindow) {
          mainWindow.webContents.send('menu-action', 'open-preferences')
          mainWindow.show()
          mainWindow.focus()
        }
      }
    },
    {
      type: 'separator'
    },
    {
      label: 'Sair',
      click: () => {
        app.isQuiting = true
        app.quit()
      }
    }
  ])

  tray.setContextMenu(trayMenu)

  // Evento de clique no ícone do tray
  tray.on('click', () => {
    if (mainWindow) {
      if (mainWindow.isVisible()) {
        mainWindow.hide()
      } else {
        mainWindow.show()
        mainWindow.focus()
      }
    }
  })

  // Evento de clique duplo no ícone do tray (macOS)
  if (process.platform === 'darwin') {
    tray.on('double-click', () => {
      if (mainWindow) {
        mainWindow.show()
        mainWindow.focus()
      }
    })
  }

  console.log('🎯 System tray criado')
}

/**
 * Cria o menu da aplicação
 */
function createMenu () {
  const template = [
    {
      label: 'Arquivo',
      submenu: [
        {
          label: 'Nova Busca',
          accelerator: 'CmdOrCtrl+N',
          click: () => {
            mainWindow.webContents.send('menu-action', 'new-search')
          }
        },
        {
          label: 'Abrir Dashboard',
          accelerator: 'CmdOrCtrl+D',
          click: () => {
            mainWindow.webContents.send('menu-action', 'open-dashboard')
          }
        },
        {
          type: 'separator'
        },
        {
          label: 'Preferências',
          accelerator: 'CmdOrCtrl+,',
          click: () => {
            mainWindow.webContents.send('menu-action', 'open-preferences')
          }
        },
        {
          type: 'separator'
        },
        {
          label: 'Sair',
          accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
          click: () => {
            app.isQuiting = true
            app.quit()
          }
        }
      ]
    },
    {
      label: 'Editar',
      submenu: [
        { role: 'undo', label: 'Desfazer' },
        { role: 'redo', label: 'Refazer' },
        { type: 'separator' },
        { role: 'cut', label: 'Recortar' },
        { role: 'copy', label: 'Copiar' },
        { role: 'paste', label: 'Colar' },
        { role: 'selectall', label: 'Selecionar Tudo' }
      ]
    },
    {
      label: 'Visualizar',
      submenu: [
        { role: 'reload', label: 'Recarregar' },
        { role: 'forceReload', label: 'Forçar Recarregamento' },
        { role: 'toggleDevTools', label: 'Alternar Ferramentas de Desenvolvedor' },
        { type: 'separator' },
        { role: 'resetZoom', label: 'Zoom Normal' },
        { role: 'zoomIn', label: 'Aumentar Zoom' },
        { role: 'zoomOut', label: 'Diminuir Zoom' },
        { type: 'separator' },
        { role: 'togglefullscreen', label: 'Alternar Tela Cheia' }
      ]
    },
    {
      label: 'Ferramentas',
      submenu: [
        {
          label: 'Sincronizar com Extensão',
          click: () => {
            mainWindow.webContents.send('menu-action', 'sync-extension')
          }
        },
        {
          label: 'Verificar Atualizações',
          click: () => {
            mainWindow.webContents.send('menu-action', 'check-updates')
          }
        },
        {
          type: 'separator'
        },
        {
          label: 'Logs do Sistema',
          click: () => {
            mainWindow.webContents.send('menu-action', 'show-logs')
          }
        }
      ]
    },
    {
      label: 'Ajuda',
      submenu: [
        {
          label: 'Sobre BuscaLogo',
          click: () => {
            mainWindow.webContents.send('menu-action', 'show-about')
          }
        },
        {
          label: 'Documentação',
          click: () => {
            shell.openExternal('https://buscalogo.com/docs')
          }
        },
        {
          label: 'Suporte',
          click: () => {
            shell.openExternal('https://buscalogo.com/support')
          }
        },
        {
          type: 'separator'
        },
        {
          label: 'Verificar Atualizações',
          click: () => {
            mainWindow.webContents.send('menu-action', 'check-updates')
          }
        }
      ]
    }
  ]

  // Adiciona menu específico do macOS
  if (process.platform === 'darwin') {
    template.unshift({
      label: app.getName(),
      submenu: [
        { role: 'about', label: 'Sobre BuscaLogo' },
        { type: 'separator' },
        { role: 'services', label: 'Serviços' },
        { type: 'separator' },
        { role: 'hide', label: 'Ocultar BuscaLogo' },
        { role: 'hideothers', label: 'Ocultar Outros' },
        { role: 'unhide', label: 'Mostrar Todos' },
        { type: 'separator' },
        { role: 'quit', label: 'Sair do BuscaLogo' }
      ]
    })
  }

  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}

/**
 * Configura os handlers de IPC
 */
function setupIpcHandlers () {
  // Handler para obter informações do sistema
  ipcMain.handle('get-system-info', () => {
    return {
      platform: process.platform,
      arch: process.arch,
      version: process.version,
      appVersion: APP_VERSION,
      appName: APP_NAME,
      isDev
    }
  })

  // Handler para abrir diálogo de arquivo
  ipcMain.handle('open-file-dialog', async () => {
    const result = await dialog.showOpenDialog(mainWindow, {
      properties: ['openFile'],
      filters: [
        { name: 'Arquivos de Texto', extensions: ['txt', 'md', 'json'] },
        { name: 'Todos os Arquivos', extensions: ['*'] }
      ]
    })

    return result
  })

  // Handler para salvar arquivo
  ipcMain.handle('save-file-dialog', async (event, defaultPath) => {
    const result = await dialog.showSaveDialog(mainWindow, {
      defaultPath: defaultPath || 'buscalogo-export.json',
      filters: [
        { name: 'Arquivo JSON', extensions: ['json'] },
        { name: 'Arquivo CSV', extensions: ['csv'] },
        { name: 'Arquivo de Texto', extensions: ['txt'] }
      ]
    })

    return result
  })

  // Handler para mostrar mensagem de erro
  ipcMain.handle('show-error-dialog', async (event, title, content) => {
    const result = await dialog.showErrorBox(title, content)
    return result
  })

  // Handler para mostrar mensagem de informação
  ipcMain.handle('show-info-dialog', async (event, title, content) => {
    const result = await dialog.showMessageBox(mainWindow, {
      type: 'info',
      title,
      message: content,
      buttons: ['OK']
    })

    return result
  })

  // Handler para abrir arquivos externos
  ipcMain.handle('open-external-file', async (event, filePath) => {
    try {
      shell.openPath(filePath)
      return { success: true, message: 'Arquivo aberto com sucesso' }
    } catch (error) {
      return { success: false, error: error.message }
    }
  })

  // Handler para verificar existência de arquivos
  ipcMain.handle('file-exists', async (event, filePath) => {
    try {
      const fs = require('fs')
      return fs.existsSync(filePath)
    } catch (error) {
      return false
    }
  })

  // Handler para obter informações do arquivo
  ipcMain.handle('get-file-info', async (event, filePath) => {
    try {
      const fs = require('fs')
      if (fs.existsSync(filePath)) {
        const stats = fs.statSync(filePath)
        return {
          exists: true,
          isFile: stats.isFile(),
          size: stats.size,
          path: filePath
        }
      }
      return { exists: false }
    } catch (error) {
      return { exists: false, error: error.message }
    }
  })

  // Handler para obter caminhos do sistema
  ipcMain.handle('get-system-paths', async (event) => {
    try {
      return {
        cwd: process.cwd(),
        dirname: __dirname,
        resourcesPath: process.resourcesPath || 'N/A',
        platform: process.platform,
        arch: process.arch
      }
    } catch (error) {
      return { error: error.message }
    }
  })

  console.log('🔌 Handlers IPC configurados')
}

/**
 * Inicializa o aplicativo
 */
app.whenReady().then(() => {
  console.log('🚀 BuscaLogo Desktop iniciando...')

  createMainWindow()
  createTray()
  createMenu()
  setupIpcHandlers()

  console.log('✅ BuscaLogo Desktop iniciado com sucesso')
})

// Quit quando todas as janelas estiverem fechadas
app.on('window-all-closed', () => {
  // No macOS, é comum para aplicativos e suas barras de menu
  // permanecerem ativos até que o usuário saia explicitamente com Cmd + Q
  if (process.platform !== 'darwin') {
    // Em vez de fechar, apenas esconde a janela (a aplicação continua rodando no tray)
    if (mainWindow) {
      mainWindow.hide()
    }
  }
})

// Limpa o tray quando a aplicação sair
app.on('before-quit', () => {
  if (tray) {
    tray.destroy()
  }
})

app.on('activate', () => {
  // No macOS, é comum recriar uma janela no aplicativo quando o
  // ícone do dock é clicado e não há outras janelas abertas
  if (BrowserWindow.getAllWindows().length === 0) {
    createMainWindow()
  }
})

// Previne múltiplas instâncias do app
let gotTheLock = false

app.on('ready', () => {
  gotTheLock = app.requestSingleInstanceLock()

  if (!gotTheLock) {
    console.log('⚠️ Outra instância do BuscaLogo já está rodando')
    app.isQuiting = true
    app.quit()
    return
  }

  app.on('second-instance', (event, commandLine, workingDirectory) => {
    // Alguém tentou executar uma segunda instância, devemos focar nossa janela
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore()
      mainWindow.focus()
    }
  })
})

// Tratamento de erros não capturados
process.on('uncaughtException', (error) => {
  console.error('❌ Erro não capturado:', error)

  if (mainWindow) {
    mainWindow.webContents.send('error', {
      type: 'uncaught',
      message: error.message,
      stack: error.stack
    })
  }
})

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Promise rejeitada não tratada:', reason)

  if (mainWindow) {
    mainWindow.webContents.send('error', {
      type: 'unhandled-rejection',
      reason,
      promise
    })
  }
})
