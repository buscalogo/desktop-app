/**
 * Storage Utilities
 * Utilitários para gerenciamento de armazenamento local
 */

class StorageManager {
  constructor() {
    this.storageKey = 'buscaLogoSettings';
  }

  // Salvar dados no localStorage
  save(key, data) {
    try {
      const serialized = JSON.stringify(data);
      localStorage.setItem(key, serialized);
      return true;
    } catch (error) {
      console.error('Erro ao salvar no localStorage:', error);
      return false;
    }
  }

  // Carregar dados do localStorage
  load(key) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Erro ao carregar do localStorage:', error);
      return null;
    }
  }

  // Remover dados do localStorage
  remove(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Erro ao remover do localStorage:', error);
      return false;
    }
  }

  // Limpar todo o localStorage
  clear() {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error('Erro ao limpar localStorage:', error);
      return false;
    }
  }

  // Verificar se uma chave existe
  exists(key) {
    return localStorage.getItem(key) !== null;
  }

  // Obter tamanho do localStorage
  getSize() {
    let size = 0;
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        size += localStorage[key].length;
      }
    }
    return size;
  }

  // Obter todas as chaves
  getKeys() {
    return Object.keys(localStorage);
  }

  // Salvar configurações
  saveSettings(settings) {
    return this.save(this.storageKey, settings);
  }

  // Carregar configurações
  loadSettings() {
    return this.load(this.storageKey) || {};
  }

  // Verificar espaço disponível
  checkAvailableSpace() {
    const testKey = '__storage_test__';
    try {
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);
      return true;
    } catch (e) {
      return false;
    }
  }
}

// Inicializar storage manager quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
  window.storage = new StorageManager();
});

