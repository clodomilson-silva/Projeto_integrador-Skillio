# 📱 PWA - Progressive Web App do Skillio

O Skillio agora funciona como um **Progressive Web App (PWA)**, permitindo instalação e uso offline tanto em **ambiente local quanto produção**!

## ✨ Funcionalidades PWA

### 🎯 Instalável
- **Desktop**: Chrome, Edge, Safari → Ícone de instalação na barra de endereço
- **Mobile**: Android/iOS → "Adicionar à tela inicial"
- Funciona como app nativo (ícone próprio, tela cheia, sem barra do navegador)

### 📴 Offline First
- Cache automático de páginas visitadas
- Imagens e assets salvos localmente
- Funciona sem internet (após primeira visita)

### 🔄 Atualizações Automáticas
- Notificação quando nova versão disponível
- Atualização com um clique
- Verifica atualizações a cada hora

### ⚡ Performance
- Carregamento instantâneo (cache)
- Imagens otimizadas
- Menos consumo de dados

### 🎨 Recursos Nativos
- Ícone na tela inicial
- Splash screen personalizado
- Cor de tema (#6366F1 - azul)
- Atalhos rápidos (Dashboard, Trilha, Quiz)

---

## 🚀 Como Usar em Desenvolvimento Local

### **1. Instalar Dependências** (já feito)

```bash
cd Frontend
npm install
```

### **2. Iniciar Servidor**

```bash
npm run dev -- --host 0.0.0.0
```

✅ **PWA ativo em desenvolvimento!** (configurado com `devOptions.enabled: true`)

### **3. Testar PWA Localmente**

#### **No Desktop (Chrome/Edge):**

1. Acesse: `http://localhost:8080` ou `http://SEU-IP:8080`
2. Abra DevTools (F12) → Aba **"Application"**
3. Verifique:
   - **Manifest**: Deve mostrar ícones e informações
   - **Service Workers**: Deve estar "Activated and running"
   - **Cache Storage**: Deve listar arquivos em cache

4. **Instalar o App:**
   - Ícone de instalação aparece na barra de endereço (⊕)
   - Ou: Menu (⋮) → "Instalar Skillio"
   - Ou: Notificação automática após 5 segundos

#### **No Mobile:**

1. Acesse pelo IP da rede: `http://192.168.X.X:8080`
2. Chrome Android:
   - Menu (⋮) → "Adicionar à tela inicial"
   - Ou banner automático
3. Safari iOS:
   - Botão compartilhar → "Adicionar à Tela de Início"

---

## 🔍 Verificar Funcionamento

### **Console do Navegador:**

```javascript
// Deve aparecer no console:
✅ PWA: Service Worker registrado com sucesso!
📱 App pode ser instalado como PWA
```

### **DevTools → Application:**

- ✅ **Manifest**: Todos os ícones carregados
- ✅ **Service Workers**: Status "activated"
- ✅ **Cache Storage**: Arquivos em cache

### **Lighthouse Audit:**

1. DevTools → Aba **"Lighthouse"**
2. Selecione "Progressive Web App"
3. Clique em "Generate report"
4. **Score ideal**: 90-100 ✅

---

## 📦 Ícones PWA

### **Status Atual:**

Os ícones estão criados (cópias do `logoSkillio.png`):

- ✅ `pwa-64x64.png`
- ✅ `pwa-192x192.png`
- ✅ `pwa-512x512.png`

### **Melhorar Ícones (Opcional):**

Para ícones otimizados, veja: [PWA_ICONS_GUIDE.md](./PWA_ICONS_GUIDE.md)

---

## 🛠️ Configuração Técnica

### **Arquivos Modificados:**

1. ✅ `vite.config.ts` - Plugin PWA com `devOptions.enabled: true`
2. ✅ `public/manifest.json` - Configurações do app
3. ✅ `index.html` - Meta tags PWA
4. ✅ `src/components/PWAPrompt.tsx` - Notificações e instalação
5. ✅ `src/App.tsx` - Integração do PWAPrompt

### **Service Worker:**

- Gerado automaticamente pelo `vite-plugin-pwa`
- Estratégias de cache:
  - **Assets estáticos** (JS, CSS, imagens): Cache First
  - **APIs externas** (Supabase): Network First
  - **Fontes Google**: Cache First (1 ano)

### **Manifest.json:**

```json
{
  "name": "Skillio - Plataforma de Aprendizado Gamificado",
  "short_name": "Skillio",
  "start_url": "/",
  "display": "standalone",
  "theme_color": "#6366F1",
  "background_color": "#0A0A0A",
  "icons": [...],
  "shortcuts": [...]
}
```

---

## 🧪 Testar Scenarios

### **1. Instalação:**
```bash
# Desktop: Ícone na barra de endereço
# Mobile: Banner ou menu
```

### **2. Offline:**
```bash
# 1. Visite o site normalmente
# 2. DevTools → Network → "Offline"
# 3. F5 para recarregar
# ✅ Deve funcionar offline
```

### **3. Atualizações:**
```bash
# 1. Faça uma alteração no código
# 2. Salve e aguarde rebuild
# 3. Deve aparecer notificação: "🔄 Nova versão disponível!"
```

### **4. Atalhos:**
```bash
# Desktop: Clique direito no ícone do app instalado
# Deve mostrar: Dashboard, Trilha, Quiz Rápido
```

---

## 📱 Notificações PWA

O app mostra notificações automáticas para:

1. **"📱 App pronto para uso offline!"** - Quando cache completo
2. **"🔄 Nova versão disponível!"** - Quando há atualização
3. **"🎉 App instalado!"** - Quando instalado
4. **"📱 Instalar Skillio"** - Sugestão de instalação (após 5s, apenas 1x)

---

## 🌐 Produção vs Desenvolvimento

| Recurso | Desenvolvimento | Produção |
|---------|----------------|----------|
| Service Worker | ✅ Ativo | ✅ Ativo |
| Instalação | ✅ Funciona | ✅ Funciona |
| Cache | ✅ Ativo | ✅ Ativo |
| HTTPS | ❌ Não necessário | ✅ Obrigatório |
| Hot Reload | ✅ Funciona | - |

**Nota:** Em produção, PWA requer HTTPS (exceto localhost)

---

## 🐛 Troubleshooting

### **Service Worker não registra:**

1. Limpe o cache: DevTools → Application → Clear storage
2. Desregistre SW antigo: Application → Service Workers → Unregister
3. Recarregue com Ctrl + Shift + R

### **App não instala:**

1. Verifique Manifest: DevTools → Application → Manifest
2. Certifique-se que todos os ícones existem
3. Chrome requer visitar o site pelo menos 1x

### **Offline não funciona:**

1. Visite todas as páginas importantes primeiro
2. Verifique Cache Storage no DevTools
3. Aguarde SW ativar (pode levar alguns segundos)

---

## 📚 Referências

- [MDN - Progressive Web Apps](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
- [Vite Plugin PWA](https://vite-pwa-org.netlify.app/)
- [Web.dev PWA](https://web.dev/progressive-web-apps/)
- [PWA Builder](https://www.pwabuilder.com/)

---

## ✅ Checklist Final

- [x] Plugin `vite-plugin-pwa` instalado
- [x] `devOptions.enabled: true` para local
- [x] Manifest.json criado e configurado
- [x] Ícones PWA criados (3 tamanhos)
- [x] Meta tags PWA no index.html
- [x] PWAPrompt component criado e integrado
- [x] Service Worker registrando corretamente
- [x] Cache funcionando offline
- [x] Notificações de atualização ativas
- [x] Instalação funcionando (desktop + mobile)

---

**Status:** ✅ **PWA TOTALMENTE FUNCIONAL EM LOCAL E PRODUÇÃO!**

**Testar agora:**
```bash
npm run dev -- --host 0.0.0.0
```

Acesse `http://localhost:8080` e veja o ícone de instalação! 🎉
