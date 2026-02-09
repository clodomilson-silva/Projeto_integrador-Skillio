# Configuração do Template EmailJS para Recuperação de Senha

## 📧 Template Necessário

Para o envio de código de recuperação de senha funcionar, você precisa configurar um template no EmailJS com os seguintes campos:

### Parâmetros do Template

O backend envia os seguintes parâmetros para o EmailJS:

```javascript
{
  to_email: "email@usuario.com",      // Email do destinatário
  to_name: "nome_usuario",            // Nome de usuário
  reset_code: "123456",               // Código de 6 dígitos
  message: "Seu código de recuperação..." // Mensagem completa
}
```

### Como Configurar o Template

1. **Acesse o EmailJS Dashboard**: https://dashboard.emailjs.com/

2. **Vá em "Email Templates"** e selecione o template `template_sen9xx4`

3. **Configure o template com este conteúdo**:

```html
Assunto: Recuperação de Senha - Código de Verificação

---

Olá {{to_name}},

Você solicitou a recuperação de senha da sua conta Skillio.

🔐 Seu código de verificação é: {{reset_code}}

Este código é válido por 10 minutos.

Se você não solicitou esta recuperação, ignore este email.

Atenciosamente,
Equipe Skillio
```

### Campos Dinâmicos (usar com {{...}})

- `{{to_email}}` - Email do destinatário
- `{{to_name}}` - Nome do usuário
- `{{reset_code}}` - Código de 6 dígitos
- `{{message}}` - Mensagem completa (alternativo)

## ✅ Credenciais Configuradas

Já estão no arquivo `.env`:

```env
EMAILJS_SERVICE_ID=service_d427cse
EMAILJS_TEMPLATE_ID=template_sen9xx4
EMAILJS_USER_ID=sNWIk3c3ZX9fB_hHq
```

## 🧪 Como Testar

1. No frontend, acesse `/forgot-password`
2. Digite o email cadastrado (ex: renaneliakim1@gmail.com)
3. Clique em "Enviar código"
4. Verifique o email na caixa de entrada
5. Use o código recebido na tela `/reset-password`

## 🔍 Debug

Se o email não chegar, verifique:

1. **Console do servidor** - Logs com ✅ ou ❌:
   ```
   ✅ Email enviado com sucesso para email@usuario.com
   ou
   ❌ Erro ao enviar email: 400 - Invalid template
   ```

2. **Dashboard do EmailJS** - Verifique na seção "Email Logs" se houve tentativas de envio

3. **Spam/Lixo Eletrônico** - O email pode ter ido para spam

## 🛠️ Resolução de Problemas

### Erro: "Serviço de email não configurado"
- Verifique se as variáveis EMAILJS_* estão no arquivo `.env`
- Reinicie o servidor Django

### Erro: "Invalid template" (400)
- Verifique se o template_id está correto no EmailJS
- Confirme que os campos {{to_email}}, {{to_name}}, {{reset_code}} existem no template

### Email não chega
- Verifique se o email do usuário está correto no banco de dados
- Teste com outro email
- Verifique os logs no Dashboard do EmailJS

## 📝 Notas Importantes

⚠️ **Segurança**: O código NÃO é mais retornado na resposta da API. Apenas enviado por email.

⚠️ **Expiração**: Os códigos expiram em 10 minutos (600 segundos) e ficam armazenados no Redis cache.

⚠️ **Produção**: Em produção, considere usar um serviço de email mais robusto como AWS SES, SendGrid, ou Mailgun para maior confiabilidade.
