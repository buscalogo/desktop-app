#!/usr/bin/env node

/**
 * Script para atualizar versão em todos os arquivos relevantes
 * Executado automaticamente durante o processo de release
 */

const fs = require('fs');
const path = require('path');

// Lê a versão atual do package.json
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const currentVersion = packageJson.version;

console.log(`🔄 Atualizando versão para ${currentVersion}...`);

// Lista de arquivos onde a versão deve ser atualizada
const filesToUpdate = [
  {
    path: 'src/main.js',
    patterns: [
      { regex: /const APP_VERSION = ['"`]([^'"`]+)['"`];/, replace: `const APP_VERSION = '${currentVersion}';` },
      { regex: /APP_VERSION = ['"`]([^'"`]+)['"`]/, replace: `APP_VERSION = '${currentVersion}'` }
    ]
  },
  {
    path: 'src/renderer/index.html',
    patterns: [
      { regex: /<span class="logo-version">Desktop v([^<]+)<\/span>/, replace: `<span class="logo-version">Desktop v${currentVersion}</span>` },
      { regex: /<title>BuscaLogo Desktop v([^<]+)<\/title>/, replace: `<title>BuscaLogo Desktop v${currentVersion}</title>` }
    ]
  },
  {
    path: 'README.md',
    patterns: [
      { regex: /version: ([0-9]+\.[0-9]+\.[0-9]+)/, replace: `version: ${currentVersion}` },
      { regex: /BuscaLogo Desktop v([0-9]+\.[0-9]+\.[0-9]+)/, replace: `BuscaLogo Desktop v${currentVersion}` }
    ]
  }
];

// Função para atualizar um arquivo
function updateFile(filePath, patterns) {
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️ Arquivo não encontrado: ${filePath}`);
    return;
  }

  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let updated = false;

    patterns.forEach(pattern => {
      if (pattern.regex.test(content)) {
        content = content.replace(pattern.regex, pattern.replace);
        updated = true;
        console.log(`✅ Atualizado: ${filePath}`);
      }
    });

    if (updated) {
      fs.writeFileSync(filePath, content, 'utf8');
    } else {
      console.log(`ℹ️ Nenhuma atualização necessária: ${filePath}`);
    }
  } catch (error) {
    console.error(`❌ Erro ao atualizar ${filePath}:`, error.message);
  }
}

// Atualiza todos os arquivos
filesToUpdate.forEach(file => {
  updateFile(file.path, file.patterns);
});

// Atualiza o arquivo de changelog se existir
const changelogPath = 'CHANGELOG.md';
if (fs.existsSync(changelogPath)) {
  try {
    const changelog = fs.readFileSync(changelogPath, 'utf8');
    const today = new Date().toISOString().split('T')[0];
    
    if (!changelog.includes(`## [${currentVersion}]`)) {
      const newEntry = `## [${currentVersion}] - ${today}

### Added
- Novas funcionalidades

### Changed
- Melhorias e correções

### Fixed
- Correções de bugs

---

`;
      
      const updatedChangelog = newEntry + changelog;
      fs.writeFileSync(changelogPath, updatedChangelog, 'utf8');
      console.log(`✅ CHANGELOG.md atualizado com versão ${currentVersion}`);
    }
  } catch (error) {
    console.error(`❌ Erro ao atualizar CHANGELOG.md:`, error.message);
  }
}

console.log(`🎉 Versão ${currentVersion} atualizada em todos os arquivos!`);
