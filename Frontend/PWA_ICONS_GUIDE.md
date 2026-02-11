# 🎨 Gerador de Ícones PWA para Skillio

Este documento explica como criar os ícones PWA necessários para a aplicação.

## 📦 Ícones Necessários

A aplicação PWA precisa dos seguintes ícones na pasta `public`:

- `pwa-64x64.png` - Ícone pequeno (64x64 pixels)
- `pwa-192x192.png` - Ícone médio (192x192 pixels)
- `pwa-512x512.png` - Ícone grande (512x512 pixels)

## 🛠️ Como Gerar os Ícones

### Opção 1: Usar Ferramenta Online (Recomendado)

1. Acesse: https://www.pwabuilder.com/imageGenerator
2. Faça upload do arquivo `logoSkillio.png` (está em `public/`)
3. Clique em "Generate" 
4. Baixe os ícones gerados
5. Renomeie e coloque na pasta `public`:
   - `icon-64.png` → `pwa-64x64.png`
   - `icon-192.png` → `pwa-192x192.png`
   - `icon-512.png` → `pwa-512x512.png`

### Opção 2: Usar Photoshop/GIMP/Figma

1. Abra o `logoSkillio.png`
2. Redimensione para 512x512 pixels (mantendo proporção)
3. Adicione padding se necessário (para não ficar muito colado nas bordas)
4. Exporte como PNG com fundo transparente ou colorido (#6366F1)
5. Use o mesmo processo para criar 192x192 e 64x64

### Opção 3: Usar ImageMagick (CLI)

```bash
# Instale o ImageMagick primeiro
# Windows: choco install imagemagick
# Linux: sudo apt-get install imagemagick

cd Frontend/public

# Gerar os 3 tamanhos
magick logoSkillio.png -resize 64x64 pwa-64x64.png
magick logoSkillio.png -resize 192x192 pwa-192x192.png
magick logoSkillio.png -resize 512x512 pwa-512x512.png
```

## ✅ Verificar Instalação

Depois de criar os ícones:

1. Verifique se os 3 arquivos estão em `Frontend/public/`
2. Reinicie o servidor: `npm run dev -- --host 0.0.0.0`
3. Acesse a aplicação
4. Abra DevTools (F12) → Application → Manifest
5. Deve mostrar todos os ícones sem erros

## 📱 Testar PWA

### Chrome/Edge:
1. Ícone de instalação aparecerá na barra de endereço
2. Ou: Menu (⋮) → Instalar Skillio

### Mobile:
1. Abra no Chrome/Safari
2. Menu → "Adicionar à tela inicial"

## 🎨 Recomendações de Design

- Use fundo colorido (#6366F1 - azul do tema)
- Logo centralizado com padding de ~15%
- Formato quadrado
- PNG com boa qualidade
- Teste em diferentes fundos (claro/escuro)

---

**Status PWA:** Configurado ✅
**Ícones:** Pendente (você precisa gerá-los) ⏳
