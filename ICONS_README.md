# 🎨 Ícones e Builds - BuscaLogo Desktop

## 📁 Estrutura de Ícones

Os ícones foram copiados da extensão Chrome e organizados da seguinte forma:

```
desktop-app/
├── assets/                    # Ícones para builds
│   ├── icon.ico              # Ícone Windows (ICO)
│   ├── icon.icns             # Ícone macOS (ICNS)
│   ├── icon.png              # Ícone Linux (PNG 256x256)
│   ├── icon.svg              # Ícone vetorial
│   ├── icon16.png            # Ícone 16x16
│   ├── icon32.png            # Ícone 32x32
│   ├── icon48.png            # Ícone 48x48
│   ├── icon128.png           # Ícone 128x128
│   └── mac/                  # Ícones específicos para macOS
│       ├── icon_16x16.png
│       ├── icon_16x16@2x.png
│       ├── icon_32x32.png
│       ├── icon_32x32@2x.png
│       ├── icon_128x128.png
│       ├── icon_128x128@2x.png
│       ├── icon_256x256.png
│       └── icon_256x256@2x.png
└── src/renderer/assets/icons/ # Ícones para interface
    ├── icon.svg
    ├── icon16.png
    ├── icon32.png
    ├── icon48.png
    └── icon128.png
```

## 🚀 Scripts de Build

### Build para Linux (AppImage)
```bash
npm run build
```

### Build para Windows (NSIS)
```bash
npm run build:win
```

### Build para macOS (DMG)
```bash
npm run build:mac
```

### Build para todas as plataformas
```bash
./build-all.sh
```

## ⚙️ Configuração dos Ícones

### Windows (.ico)
- **Arquivo**: `assets/icon.ico`
- **Formato**: ICO com múltiplas resoluções (16x16, 32x32, 48x48, 64x64, 128x128, 256x256)
- **Uso**: Ícone do executável, instalador e atalhos

### macOS (.icns)
- **Arquivo**: `assets/icon.icns`
- **Formato**: ICNS com múltiplas resoluções para diferentes densidades de tela
- **Uso**: Ícone do aplicativo, DMG e atalhos

### Linux (.png)
- **Arquivo**: `assets/icon.png`
- **Formato**: PNG 256x256 pixels (requisito mínimo)
- **Uso**: Ícone do AppImage e atalhos

## 🔧 Configuração do electron-builder

A configuração está no `package.json` na seção `build`:

```json
{
  "build": {
    "win": {
      "icon": "assets/icon.ico"
    },
    "mac": {
      "icon": "assets/icon.icns"
    },
    "linux": {
      "icon": "assets/icon.png"
    }
  }
}
```

## 📦 Recursos Incluídos

### Arquivos Principais
- `src/**/*` - Código fonte da aplicação
- `assets/**/*` - Ícones e recursos para builds
- `node_modules/**/*` - Dependências

### Recursos Extras
- `assets/` → `assets/` - Ícones para builds
- `src/renderer/assets/` → `renderer/assets/` - Ícones para interface

## 🎯 Como Adicionar Novos Ícones

1. **Coloque o ícone na pasta `assets/`**
2. **Atualize a configuração no `package.json` se necessário**
3. **Execute o build para testar**

### Exemplo de novo ícone
```bash
# Copiar novo ícone
cp novo-icone.png assets/

# Atualizar configuração (se necessário)
# Editar package.json

# Testar build
npm run build
```

## 🐛 Solução de Problemas

### Ícone muito pequeno para Linux
```bash
# Converter para 256x256
convert assets/icon128.png -resize 256x256 assets/icon.png
```

### Ícone não aparece no Windows
- Verifique se o arquivo `.ico` tem múltiplas resoluções
- Use o ImageMagick para criar: `convert icon.png -define icon:auto-resize=256,128,64,48,32,16 icon.ico`

### Ícone não aparece no macOS
- Verifique se o arquivo `.icns` existe
- Para desenvolvimento, um PNG de alta resolução pode ser usado

## 📋 Checklist de Build

- [ ] Ícones estão na pasta `assets/`
- [ ] Ícones têm as resoluções corretas
- [ ] Configuração no `package.json` está correta
- [ ] Build para Linux funciona
- [ ] Build para Windows funciona (se aplicável)
- [ ] Build para macOS funciona (se aplicável)
- [ ] Aplicativo executa com ícone correto

## 🔗 Referências

- [Electron Builder Documentation](https://www.electron.build/)
- [Electron Icons Guide](https://www.electron.build/icons)
- [ImageMagick Documentation](https://imagemagick.org/script/command-line-options.php)

---

**Nota**: Este documento deve ser atualizado sempre que houver mudanças na configuração de ícones ou builds.
