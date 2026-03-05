# 🔑 Como Obter Nova API Key do Google Gemini

## ⚠️ Problema Urgente

Sua API key atual do Google Gemini foi **comprometida e bloqueada** pelo Google:

```
[403 Forbidden] Your API key was reported as leaked. Please use another API key.
```

## 🛠️ Solução Rápida

### Passo 1: Acessar Google AI Studio

1. Acesse: https://aistudio.google.com/app/apikey
2. Faça login com sua conta Google

### Passo 2: Criar Nova API Key

1. Clique em **"Create API Key"** ou **"Criar chave de API"**
2. Selecione um projeto Google Cloud ou crie um novo
3. Clique em **"Create API key in new project"** (recomendado)
4. **COPIE a chave imediatamente** - ela só é mostrada uma vez

### Passo 3: Configurar no Projeto

#### Frontend (.env local)

Edite o arquivo `Frontend/.env`:

```env
VITE_GOOGLE_GENERATIVE_LANGUAGE_API_KEY=SUA_NOVA_CHAVE_AQUI
```

#### Backend (.env se usar)

Se o backend também usar, edite `backend/.env`:

```env
GOOGLE_GENERATIVE_LANGUAGE_API_KEY=SUA_NOVA_CHAVE_AQUI
```

### Passo 4: Reiniciar Aplicação

```bash
# Parar frontend se estiver rodando (Ctrl+C)
# No diretório Frontend:
cd Frontend
npm run dev
```

## 🔒 Boas Práticas de Segurança

### ❌ **NUNCA FAÇA ISSO:**

- Commitar `.env` no Git
- Compartilhar chaves em screenshots
- Publicar chaves em issues públicas do GitHub
- Hardcoded de chaves no código

### ✅ **SEMPRE FAÇA:**

1. **Adicione `.env` ao `.gitignore`:**
   ```
   # .gitignore
   .env
   .env.local
   .env.production
   ```

2. **Use variáveis de ambiente:**
   ```typescript
   // ✅ CORRETO
   const API_KEY = import.meta.env.VITE_GOOGLE_GENERATIVE_LANGUAGE_API_KEY;
   
   // ❌ ERRADO
   const API_KEY = "AIzaSyB..."; // Nunca faça isso!
   ```

3. **Configure limites de uso no Google Cloud Console:**
   - Acesse: https://console.cloud.google.com/apis/api/generativelanguage.googleapis.com/quotas
   - Defina limites diários para evitar uso excessivo

4. **Use restrições de API Key:**
   - No Google Cloud Console, restrinja a chave para:
     - Apenas APIs necessárias (Generative Language API)
     - IPs específicos (se possível)
     - Referrers específicos (para produção)

## 🎮 Modo Offline (Fallback)

Enquanto você configura a nova chave, o sistema está funcionando em **modo offline** com perguntas de fallback para desenvolvimento.

### Como funciona:

```typescript
// useGenerativeAI.ts
if (import.meta.env.DEV) {
  // Gera 15 perguntas de fallback automaticamente
  // Permite desenvolvimento sem API key
}
```

**Vantagens:**
- ✅ Permite testar a UI sem API key
- ✅ Desenvolvimento offline
- ✅ Economia de quota da API

**Limitações:**
- ❌ Perguntas genéricas (não personalizadas)
- ❌ Sem variação de dificuldade real
- ❌ Mesmas perguntas sempre

## 📊 Monitoramento de Uso

Verifique o uso da sua API key:
1. Acesse: https://console.cloud.google.com/apis/api/generativelanguage.googleapis.com/metrics
2. Monitore requests diários/mensais
3. Configure alertas para uso excessivo

## 🆘 Troubleshooting

### Erro: "API key not valid"
- Verifique se copiou a chave completa
- Confirme que a API "Generative Language API" está ativada
- Aguarde alguns minutos após criar (propagação pode levar tempo)

### Erro: "403 Forbidden"
- Sua chave pode ter restrições de IP/referrer
- Verifique as configurações da chave no Google Cloud Console

### Erro: "429 Too Many Requests"
- Você excedeu a quota gratuita (1500 requests/dia)
- Aguarde reset diário ou considere upgrade

## 📚 Links Úteis

- **Google AI Studio**: https://aistudio.google.com/
- **Documentação Gemini API**: https://ai.google.dev/docs
- **Pricing**: https://ai.google.dev/pricing
- **Quotas**: https://console.cloud.google.com/iam-admin/quotas

## 🎯 Checklist de Implementação

- [ ] Deletar/revogar a API key comprometida no Google Cloud Console
- [ ] Criar nova API key no Google AI Studio
- [ ] Atualizar `Frontend/.env` com nova chave
- [ ] Adicionar `.env` ao `.gitignore` (se ainda não estiver)
- [ ] Reiniciar servidor de desenvolvimento
- [ ] Testar geração de perguntas no quiz
- [ ] Configurar limites de uso no Google Cloud Console
- [ ] Aplicar restrições de segurança na API key

---

**Status Atual:** ✅ Sistema funcionando em modo offline com perguntas de fallback  
**Próximo Passo:** Obter nova API key para perguntas personalizadas por IA
