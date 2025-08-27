/**
 * Loading Component
 * Gerencia indicadores de carregamento
 */

class LoadingIndicator {
  constructor () {
    this.overlay = document.getElementById('loadingIndicator')
    this.spinner = this.overlay.querySelector('.loading-spinner')
    this.text = this.overlay.querySelector('.loading-text')
  }

  show (message = 'Carregando...') {
    this.text.textContent = message
    this.overlay.classList.remove('hidden')
    document.body.style.overflow = 'hidden'
  }

  hide () {
    this.overlay.classList.add('hidden')
    document.body.style.overflow = ''
  }

  // Mostrar loading com texto personalizado
  showWithText (message) {
    this.show(message)
  }

  // Mostrar loading com progresso
  showProgress (progress, message = 'Carregando...') {
    this.text.textContent = `${message} ${Math.round(progress)}%`
    this.overlay.classList.remove('hidden')
  }

  // Loading para operações específicas
  showForOperation (operation) {
    const messages = {
      scraping: 'Executando scraping...',
      saving: 'Salvando dados...',
      loading: 'Carregando dados...',
      processing: 'Processando...',
      exporting: 'Exportando dados...',
      importing: 'Importando dados...'
    }

    this.show(messages[operation] || 'Carregando...')
  }
}

// Inicializar loading quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
  window.loading = new LoadingIndicator()
})
