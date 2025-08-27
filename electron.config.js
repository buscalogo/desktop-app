const path = require('path');

module.exports = {
  // Configurações do processo principal
  main: {
    entry: 'src/main.js',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'main.js'
    }
  },
  
  // Configurações do processo de renderização
  renderer: {
    entry: 'src/renderer/index.js',
    output: {
      path: path.resolve(__dirname, 'dist/renderer'),
      filename: 'renderer.js'
    }
  },
  
  // Configurações de desenvolvimento
  dev: {
    hot: true,
    port: 3000,
    open: false
  },
  
  // Configurações de build
  build: {
    minify: true,
    sourcemap: false,
    target: 'electron-main'
  },
  
  // Configurações de cache
  cache: {
    directory: path.resolve(__dirname, '.cache'),
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 dias
  }
};
