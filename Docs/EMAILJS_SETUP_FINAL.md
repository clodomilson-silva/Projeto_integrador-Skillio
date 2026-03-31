# ✅ EmailJS - Configuração Completa

## 🎯 Como Funciona Agora

O sistema de recuperação de senha usa **EmailJS diretamente do frontend** (navegador), porque EmailJS bloqueia chamadas de backend por segurança.

### Fluxo Completo:

1. **Usuário** digita email no frontend (`/forgot-password`)
2. **Frontend** chama API do backend → gera código de 6 dígitos
3. **Backend** salva código no cache Redis (10 minutos)
4. **Frontend** recebe o código e envia email usando EmailJS
5. **Usuário** recebe email com o código
6. **Usuário** insere código na tela `/reset-password`

## 📧 Credenciais Configuradas

### Backend (.env):
```env
EMAILJS_SERVICE_ID=service_d427cse
EMAILJS_TEMPLATE_ID=template_sen9xx4
EMAILJS_USER_ID=sNWIk3c3ZX9fB_hHq
```

### Frontend (.env):
```env
VITE_EMAILJS_SERVICE_ID="service_d427cse"
VITE_EMAILJS_TEMPLATE_ID="template_sen9xx4"
VITE_EMAILJS_USER_ID="sNWIk3c3ZX9fB_hHq"
```

## 🔧 Template do EmailJS

Você precisa configurar um template no dashboard do EmailJS:

### 1. Acesse: https://dashboard.emailjs.com/

### 2. Vá em "Email Templates" → Selecione `template_sen9xx4`

### 3. Configure com este conteúdo:

**Assunto:**
```
Skillio - Código de Recuperação de Senha
```

**Corpo do Email:**
```
Olá {{to_name}},

Você solicitou a recuperação de senha da sua conta Skillio.

🔐 Seu código de verificação é: {{reset_code}}

Este código é válido por 10 minutos.

Se você não solicitou esta recuperação, ignore este email.

Atenciosamente,
Equipe Skillio
```

### 4. Campos do Template (obrigatórios):

- `{{to_email}}` - Email do destinatário
- `{{to_name}}` - Nome do usuário
- `{{reset_code}}` - Código de 6 dígitos
- `{{message}}` - Mensagem (opcional)

## ⚙️ Configuração no Dashboard EmailJS

### Service (Email Service):

1. Vá em "Email Services"
2. Verifique se o service `service_d427cse` está conectado
3. Pode ser Gmail, Outlook, SendGrid, etc.

### Limites:

- **Plano Gratuito**: 200 emails/mês
- Se precisar mais, faça upgrade no EmailJS

## 🧪 Como Testar

### 1. No Frontend:

```bash
cd Frontend
npm run dev
```

### 2. Acesse: http://localhost:5173/forgot-password

### 3. Digite um email válido (ex: renaneliakim1@gmail.com)

### 4. Clique em "Enviar código"

### 5. Verifique:
- Console do navegador (F12) → Deve aparecer "Email enviado"
- Caixa de entrada do email
- Pasta de Spam (caso não encontre na inbox)

### 6. Use o código recebido em: http://localhost:5173/reset-password

## 🔍 Debug

### Console do Navegador (F12):

✅ Sucesso:
```
Email enviado com sucesso!
```

❌ Erro:
```
Erro ao enviar email: [detalhes do erro]
```

### Console do Backend:

```
🔐 Código gerado para email@teste.com: 123456
```

### Dashboard do EmailJS:

- Vá em "Email Logs"
- Verifique se houve tentativas de envio
- Status: SUCCESS ou FAILED

## ⚠️ Problemas Comuns

### 1. "Template not found"
**Solução:** Verifique se o template_id está correto no dashboard

### 2. "Service not found"
**Solução:** Verifique se o service_id está correto e ativo

### 3. "Invalid user ID"
**Solução:** Verifique se o EMAILJS_USER_ID está correto (Account → API Keys)

### 4. "Email não chega"
**Possíveis causas:**
- Email na pasta de Spam
- Service não configurado corretamente no EmailJS
- Limite de emails atingido (200/mês no plano gratuito)
- Template com erro de sintaxe

### 5. "Public Key (User ID) incorreta"
**Como obter:**
1. Dashboard EmailJS → Account → General
2. Copie "Public Key" (não é a mesma coisa que API Key)

## 📦 Arquivos Modificados

✅ **Backend:**
- `api/views.py` - Função `forgot_password()` retorna código
- `core/settings.py` - Variáveis EmailJS (não mais usadas no backend)

✅ **Frontend:**
- `pages/ForgotPassword.tsx` - Integração com EmailJS
- `package.json` - Dependência `@emailjs/browser` adicionada
- `.env` - Credenciais EmailJS

## 🚀 Produção

Em produção, considere:

1. **Usar serviço mais robusto:**
   - AWS SES
   - SendGrid
   - Mailgun
   - Twilio SendGrid

2. **Implementar rate limiting:**
   - Limitar tentativas por IP
   - Limitar envios por email

3. **Adicionar captcha:**
   - Evitar spam/bots

4. **Logs detalhados:**
   - Monitorar emails enviados
   - Alertas para falhas

## 📝 Notas de Segurança

⚠️ **Código visível no frontend temporariamente** para o frontend enviar o email. Após o envio, o código não é exposto ao usuário.

✅ **Código armazenado no backend** no Redis cache com expiração de 10 minutos.

✅ **Validação no backend** ao redefinir senha (verifica se código está correto).

## 🎓 Documentação Oficial

- EmailJS Docs: https://www.emailjs.com/docs/
- React Integration: https://www.emailjs.com/docs/examples/reactjs/
