# 📱 Guia de Teste PWA - Mobile

## ⚠️ IMPORTANTE: Endereço Correto

❌ **ERRADO:** `192.168.15.7.8080` (com ponto)
✅ **CORRETO:** `192.168.15.7:8080` (com dois pontos **:**)

---

## 🧪 Passo a Passo para Testar no Celular

### **1. CERTIFIQUE-SE QUE O FRONTEND ESTÁ RODANDO**

No computador, execute:

```bash
cd Frontend
npm run dev -- --host 0.0.0.0
```

Aguarde a mensagem: `Local: http://localhost:8080`

---

### **2. ACESSE DO CELULAR**

**Certifique-se:**
- ✅ PC e celular na **mesma WiFi**
- ✅ Use o endereço: `http://192.168.15.7:8080` (com **dois pontos**)

**No navegador do celular:**
- Digite: `http://192.168.15.7:8080`
- Pressione Enter
- Aguarde a página carregar

---

### **3. CHECAR O CONSOLE**

**No celular (Chrome):**
1. Menu (⋮) → "Inspecionar" ou acesse: `chrome://inspect`
2. Procure por:
   ```
   ✅ PWA: Service Worker registrado com sucesso!
   📱 App pode ser instalado como PWA
   ```

**Se NÃO aparecer essas mensagens:**
- Limpe o cache do navegador
- Tente em modo anônimo
- Verifique se o endereço está correto

---

### **4. AGUARDAR BANNER DE INSTALAÇÃO**

Após **3 segundos**, deve aparecer um **banner roxo/azul** na parte inferior da tela:

```
┌─────────────────────────────────┐
│ 📥 📱 Instalar Skillio          │
│                                 │
│ Instale o app para acesso       │
│ rápido e offline!               │
│                                 │
│ [Instalar Agora]  [X]           │
└─────────────────────────────────┘
```

**Se NÃO aparecer:**
- Verifique o console (deve ter logs)
- Pode já ter sido instalado antes
- Limpe o localStorage: Console → `localStorage.clear()` → F5

---

### **5. INSTALAR O APP**

#### **Chrome Android:**
- Clique em **"Instalar Agora"** no banner
- Ou: Menu (⋮) → "Instalar app" → Confirmar

#### **Safari iOS:**
1. Clique em **"Ver Como"** no banner (mostra instruções)
2. Ou manualmente:
   - Botão **"Compartilhar"** (quadrado com seta ↑)
   - Role para baixo → **"Adicionar à Tela de Início"**
   - Toque em **"Adicionar"**

#### **Outros navegadores:**
- Firefox: Menu → "Instalar"
- Edge: Menu → "Aplicativos" → "Instalar este site como aplicativo"

---

### **6. VERIFICAR INSTALAÇÃO**

**Após instalar:**
- ✅ Ícone do Skillio aparece na tela inicial
- ✅ Ao abrir, funciona em tela cheia (sem barra do navegador)
- ✅ Deve aparecer notificação: "🎉 App instalado!"

**Testar offline:**
1. Abra o app instalado
2. Ative o modo avião
3. Navegue pelo app → Deve funcionar!

---

## 🐛 Troubleshooting

### **Banner não aparece:**

1. **Limpar localStorage:**
   ```javascript
   // No console do navegador
   localStorage.removeItem('pwa-install-banner-seen');
   location.reload();
   ```

2. **Verificar se já está instalado:**
   - Se já tiver o ícone na tela inicial, não mostra banner
   - Desinstale e teste novamente

3. **Forçar atualização:**
   ```javascript
   // No console
   navigator.serviceWorker.getRegistrations().then(regs => {
     regs.forEach(reg => reg.unregister());
   });
   location.reload();
   ```

### **Service Worker não registra:**

1. Verifique o endereço (dois pontos `:` não ponto `.`)
2. Certifique-se que está na mesma rede
3. Tente: `http://192.168.15.7:8080` (não HTTPS em local)

### **App não funciona offline:**

1. Visite algumas páginas primeiro
2. Aguarde o cache completar
3. Verifique console: "📱 App pronto para uso offline!"

---

## 📊 Logs de Debug Esperados

**Console do navegador deve mostrar:**

```
✅ PWA: Service Worker registrado com sucesso!
📱 App pode ser instalado como PWA
🌐 URL atual: http://192.168.15.7:8080
📱 User Agent: Mozilla/5.0 (...)
📱 Dispositivo: { iOS: false, standalone: false, displayMode: false }
🎉 Mostrando banner de instalação
```

**Se iOS:**
```
📱 Dispositivo: { iOS: true, standalone: false, displayMode: false }
```

**Se já instalado:**
```
✅ App já instalado! Rodando em modo standalone
```

---

## ✅ Checklist de Verificação

- [ ] Frontend rodando: `npm run dev -- --host 0.0.0.0`
- [ ] Endereço correto: `http://192.168.15.7:8080` (com **dois pontos**)
- [ ] Mesma rede WiFi (PC e celular)
- [ ] Página carrega normalmente
- [ ] Console mostra: "✅ PWA: Service Worker registrado"
- [ ] Banner aparece após 3 segundos
- [ ] Botão de instalação funciona
- [ ] App instalado com ícone na tela inicial
- [ ] Funciona offline após instalação

---

## 🎯 Próximos Passos

Depois de instalar:
1. Teste todas as páginas principais
2. Teste offline (modo avião)
3. Veja os atalhos: Dashboard, Trilha, Quiz
4. Personalize os ícones (veja PWA_ICONS_GUIDE.md)

---

**Qualquer dúvida, verifique os logs do console! Eles são bem detalhados agora.** 🔍
