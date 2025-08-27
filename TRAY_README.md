# 🎯 System Tray - BuscaLogo Desktop

## 📋 Visão Geral

O BuscaLogo Desktop agora inclui um **system tray** (ícone na bandeja do sistema) que permite que a aplicação continue rodando em segundo plano mesmo quando a janela principal é fechada.

## ✨ Funcionalidades

### **🔄 Comportamento da Janela**
- **Fechar janela**: Minimiza para o tray (aplicação continua rodando)
- **Sair da aplicação**: Use "Sair" no menu ou Ctrl+Q/Cmd+Q
- **Restaurar janela**: Clique no ícone do tray

### **🎯 Menu do System Tray**
- **Mostrar BuscaLogo**: Exibe e foca a janela principal
- **Nova Busca**: Abre nova busca e exibe a janela
- **Dashboard**: Abre o dashboard e exibe a janela
- **Preferências**: Abre as preferências e exibe a janela
- **Sair**: Fecha completamente a aplicação

### **🖱️ Interações**
- **Clique simples**: Alterna visibilidade da janela (mostra/esconde)
- **Clique duplo** (macOS): Exibe e foca a janela
- **Clique direito**: Abre menu de contexto

## 🔧 Implementação Técnica

### **📁 Arquivos Modificados**
- `src/main.js` - Lógica principal do system tray
- `assets/tray-icon.png` - Ícone específico para o tray (16x16)

### **🔌 APIs Utilizadas**
```javascript
const { Tray, nativeImage } = require('electron');

// Criação do tray
tray = new Tray(trayIcon);
tray.setToolTip(APP_NAME);
tray.setContextMenu(trayMenu);

// Eventos
tray.on('click', handleClick);
tray.on('double-click', handleDoubleClick);
```

### **⚙️ Configurações**
- **Ícone**: `assets/tray-icon.png` (16x16 pixels)
- **Tooltip**: Nome da aplicação
- **Menu**: Contexto com ações principais
- **Comportamento**: Minimiza para tray em vez de fechar

## 🚀 Como Usar

### **1. Iniciar a Aplicação**
```bash
npm start
```

### **2. Minimizar para o Tray**
- Feche a janela principal (X)
- A aplicação continua rodando em segundo plano
- Ícone aparece na bandeja do sistema

### **3. Restaurar a Janela**
- Clique no ícone do tray
- Ou use o menu de contexto → "Mostrar BuscaLogo"

### **4. Sair Completamente**
- Menu → Arquivo → Sair
- Ou Ctrl+Q (Windows/Linux) / Cmd+Q (macOS)
- Ou menu do tray → "Sair"

## 🎨 Personalização

### **Alterar Ícone do Tray**
```bash
# Substitua o arquivo
cp novo-icone.png assets/tray-icon.png

# Ou modifique o código em src/main.js
const iconPath = path.join(__dirname, '..', 'assets', 'novo-icone.png');
```

### **Modificar Menu do Tray**
Edite a função `createTray()` em `src/main.js`:

```javascript
const trayMenu = Menu.buildFromTemplate([
  {
    label: 'Nova Ação',
    click: () => {
      // Sua ação aqui
    }
  },
  // ... outros itens
]);
```

### **Adicionar Novos Eventos**
```javascript
tray.on('right-click', () => {
  // Ação para clique direito
});

tray.on('mouse-enter', () => {
  // Ação quando mouse entra no ícone
});
```

## 🐛 Solução de Problemas

### **Ícone não aparece no Tray**
- Verifique se `assets/tray-icon.png` existe
- Confirme que o arquivo é uma imagem PNG válida
- Verifique os logs da aplicação

### **Aplicação não minimiza para o Tray**
- Verifique se `app.isQuiting` está configurado corretamente
- Confirme que o evento `close` está sendo tratado
- Verifique se não há conflitos com outros eventos

### **Menu do Tray não funciona**
- Verifique se `createTray()` está sendo chamada
- Confirme que os handlers IPC estão configurados
- Verifique se a janela principal existe

### **Aplicação não sai completamente**
- Use "Sair" no menu principal
- Ou Ctrl+Q/Cmd+Q
- Ou "Sair" no menu do tray

## 📱 Suporte por Plataforma

### **Windows**
- ✅ System tray funcional
- ✅ Menu de contexto
- ✅ Clique simples para alternar

### **macOS**
- ✅ System tray funcional
- ✅ Menu de contexto
- ✅ Clique simples e duplo

### **Linux**
- ✅ System tray funcional
- ✅ Menu de contexto
- ✅ Clique simples para alternar

## 🔄 Fluxo de Funcionamento

```
1. Aplicação inicia
   ↓
2. Janela principal é criada
   ↓
3. System tray é criado
   ↓
4. Usuário fecha janela
   ↓
5. Janela é escondida (não fechada)
   ↓
6. Aplicação continua rodando no tray
   ↓
7. Usuário clica no tray
   ↓
8. Janela é exibida novamente
```

## 🎯 Benefícios

- **🔄 Continuidade**: Aplicação não para ao fechar janela
- **⚡ Acesso rápido**: Restaurar janela com um clique
- **💾 Recursos**: Mantém dados e estado da aplicação
- **🖥️ Organização**: Não polui a barra de tarefas
- **🔒 Persistência**: Funcionalidades continuam rodando

## 📚 Referências

- [Electron Tray Documentation](https://www.electronjs.org/docs/latest/api/tray)
- [Electron NativeImage Documentation](https://www.electronjs.org/docs/latest/api/native-image)
- [Electron Menu Documentation](https://www.electronjs.org/docs/latest/api/menu)

---

**Nota**: O system tray é uma funcionalidade essencial para aplicações desktop que precisam rodar em segundo plano. Esta implementação garante que o BuscaLogo Desktop possa continuar funcionando mesmo quando não está visível para o usuário.
