module.exports = {
  // Configurações do Puppeteer para evitar problemas de instalação
  puppeteer: {
    // Usar versão específica do Chromium
    chromiumRevision: '1095492',
    
    // Configurações de download
    downloadPath: process.env.PUPPETEER_DOWNLOAD_PATH || './.cache/puppeteer',
    
    // Configurações de cache
    cacheDirectory: process.env.PUPPETEER_CACHE_DIR || './.cache/puppeteer',
    
    // Configurações de timeout
    timeout: 30000,
    
    // Configurações de retry
    retry: 3,
    
    // Configurações de proxy (se necessário)
    proxy: process.env.PUPPETEER_PROXY || undefined,
    
    // Configurações de headless
    headless: true,
    
    // Configurações de args
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
      '--disable-gpu'
    ]
  }
};
