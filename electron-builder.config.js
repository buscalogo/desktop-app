module.exports = {
  // Configurações básicas
  appId: 'com.buscalogo.desktop',
  productName: 'BuscaLogo',
  
  // Configurações de diretórios
  directories: {
    output: 'dist',
    buildResources: 'build'
  },
  
  // Arquivos incluídos no build
  files: [
    'src/**/*',
    'assets/**/*',
    'node_modules/**/*',
    '!node_modules/**/*.md',
    '!node_modules/**/*.txt',
    '!node_modules/**/*.map'
  ],
  
  // Recursos extras
  extraResources: [
    {
      from: 'assets/',
      to: 'assets/'
    },
    {
      from: 'src/renderer/assets/',
      to: 'renderer/assets/'
    }
  ],
  
  // Configurações específicas para cada plataforma
  win: {
    target: [
      {
        target: 'nsis',
        arch: ['x64']
      }
    ],
    icon: 'assets/icon.ico'
  },
  
  mac: {
    target: 'zip',
    icon: 'assets/icon.icns',
    category: 'public.app-category.productivity'
  },
  
  linux: {
    target: 'AppImage',
    icon: 'assets/icon.png',
    category: 'Utility',
    desktop: {
      Name: 'BuscaLogo',
      Comment: 'Intelligent Web Content Collection & Analysis',
      GenericName: 'Web Content Tool',
      Categories: 'Utility;Network;WebDevelopment;'
    }
  },
  
  // Configurações do NSIS
  nsis: {
    oneClick: false,
    allowToChangeInstallationDirectory: true,
    createDesktopShortcut: true,
    createStartMenuShortcut: true
  }
};
