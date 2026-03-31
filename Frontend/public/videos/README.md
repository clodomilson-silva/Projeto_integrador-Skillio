# GIFs de Feedback do Quiz

Esta pasta contém os GIFs animados de feedback para o quiz.

## GIFs Necessários

### 1. victory.gif
- **Quando aparece**: Ao completar o bloco com sucesso (menos de 5 erros e com vidas)
- **Duração recomendada**: 2-4 segundos (loop automático)
- **Conteúdo sugerido**: Celebração, fogos de artifício, troféu, confetes, estrelas
- **Tamanho recomendado**: 300-800 KB (máximo 1MB)
- **Dimensões recomendadas**: 480x270 (16:9) ou 640x360

### 2. defeat.gif
- **Quando aparece**: Ao perder (5 erros ou sem vidas)
- **Duração recomendada**: 2-4 segundos (loop automático)
- **Conteúdo sugerido**: "Try again", nuvem triste, mensagem motivacional
- **Tamanho recomendado**: 300-800 KB (máximo 1MB)
- **Dimensões recomendadas**: 480x270 (16:9) ou 640x360

## Onde Conseguir GIFs Prontos (GRATUITO)

### 🎨 Sites Principais:
1. **GIPHY**: https://giphy.com/
   - Maior biblioteca de GIFs do mundo
   - Busque: "celebration", "victory", "success", "trophy", "confetti"
   - Para derrota: "try again", "motivation", "keep going"
   
2. **Tenor**: https://tenor.com/
   - GIFs de alta qualidade
   - Ótima busca por categoria
   
3. **Gfycat**: https://gfycat.com/
   - GIFs otimizados e leves
   
4. **LottieFiles**: https://lottiefiles.com/
   - Animações vetoriais (exportáveis como GIF)

### 🔍 Palavras-chave para buscar:

**Para Vitória (victory.gif):**
- "celebration"
- "success animation"
- "trophy animated"
- "confetti explosion"
- "fireworks"
- "winner"
- "achievement unlocked"
- "level up"
- "you win"

**Para Derrota (defeat.gif):**
- "try again"
- "game over motivation"
- "keep going"
- "never give up"
- "you can do it"
- "comeback"
- "don't give up"

## Como Baixar do GIPHY

1. Acesse https://giphy.com/
2. Busque pela palavra-chave (ex: "celebration")
3. Clique no GIF que você gostou
4. Clique em "Share" → "Copy GIF"
5. Ou clique com botão direito → "Salvar imagem como..."
6. Renomeie para `victory.gif` ou `defeat.gif`
7. Coloque na pasta `Frontend/public/videos/`

## Otimizar GIFs (se necessário)

Se o GIF estiver muito pesado (>1MB), você pode otimizar:

### Online (Recomendado):
- **ezgif.com**: https://ezgif.com/optimize
  - Upload do GIF
  - Escolha "Optimize GIF" ou "Resize GIF"
  - Reduza para 640x360 se necessário
  - Baixe o otimizado

### Ferramentas Desktop:
- **GIMP** (gratuito): File → Export As → GIF
- **Photoshop**: File → Export → Save for Web (Legacy) → GIF

## Converter Vídeo para GIF

Se você tiver um vídeo curto que quer converter:

### Online:
- **CloudConvert**: https://cloudconvert.com/mp4-to-gif
- **ezgif**: https://ezgif.com/video-to-gif

### FFmpeg (linha de comando):
```bash
# Converter vídeo para GIF (tamanho médio)
ffmpeg -i input.mp4 -vf "fps=15,scale=640:-1:flags=lanczos" -loop 0 victory.gif

# GIF de alta qualidade (maior tamanho)
ffmpeg -i input.mp4 -vf "fps=24,scale=640:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse" victory.gif
```

## ✅ Vantagens do GIF vs Vídeo

- ✅ Muito mais leve (300KB vs 3MB)
- ✅ Carregamento instantâneo
- ✅ Loop automático
- ✅ Funciona 100% em todos os navegadores
- ✅ Não precisa de configuração de autoplay
- ✅ Mais fácil de encontrar e baixar
- ✅ Sem problemas de codec (MP4/WebM)

## Implementação

Os GIFs são exibidos automaticamente usando tag `<img>`:
- **Loop**: Automático (nativo do formato GIF)
- **Autoplay**: Automático (começa assim que carrega)
- **Fallback**: Se não carregar, o elemento é escondido
- **Tamanho**: Responsivo (100% largura, altura 192px)
