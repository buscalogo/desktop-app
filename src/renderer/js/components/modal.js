/**
 * Modal Component
 * Gerencia modais da aplicação
 */

class Modal {
  constructor () {
    this.overlay = document.getElementById('modalOverlay')
    this.modal = document.querySelector('.modal')
    this.title = document.getElementById('modalTitle')
    this.content = document.getElementById('modalContent')
    this.closeBtn = document.getElementById('modalClose')

    this.setupEventListeners()
  }

  setupEventListeners () {
    // Fechar modal ao clicar no overlay
    this.overlay.addEventListener('click', (e) => {
      if (e.target === this.overlay) {
        this.hide()
      }
    })

    // Fechar modal ao clicar no botão de fechar
    this.closeBtn.addEventListener('click', () => {
      this.hide()
    })

    // Fechar modal com ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isVisible()) {
        this.hide()
      }
    })
  }

  show (title, content) {
    this.title.textContent = title
    this.content.innerHTML = content
    this.overlay.classList.remove('hidden')
    document.body.style.overflow = 'hidden'
  }

  hide () {
    this.overlay.classList.add('hidden')
    document.body.style.overflow = ''
  }

  isVisible () {
    return !this.overlay.classList.contains('hidden')
  }

  // Método para mostrar confirmação
  confirm (title, message, onConfirm, onCancel) {
    const content = `
      <div class="modal-confirm">
        <p>${message}</p>
        <div class="modal-actions">
          <button class="btn btn-secondary" id="modalCancel">Cancelar</button>
          <button class="btn btn-primary" id="modalConfirm">Confirmar</button>
        </div>
      </div>
    `

    this.show(title, content)

    // Setup event listeners para os botões
    document.getElementById('modalConfirm').addEventListener('click', () => {
      this.hide()
      if (onConfirm) onConfirm()
    })

    document.getElementById('modalCancel').addEventListener('click', () => {
      this.hide()
      if (onCancel) onCancel()
    })
  }
}

// Inicializar modal quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
  window.modal = new Modal()
})
