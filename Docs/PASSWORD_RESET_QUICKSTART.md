# 🔐 Recuperação de Senha com AWS Cognito - Guia Rápido

## ✅ O que foi implementado

A funcionalidade de "Esqueci minha senha" usando AWS Cognito foi implementada com sucesso no Skillio!

### 📦 Componentes Adicionados

**Backend:**
- ✅ Serviço de integração com AWS Cognito (`api/cognito_service.py`)
- ✅ 3 novos endpoints de API:
  - `POST /api/auth/forgot-password/` - Solicita código de recuperação
  - `POST /api/auth/reset-password/` - Redefine senha com código
  - `POST /api/auth/resend-code/` - Reenvia código expirado
- ✅ Configurações AWS no `settings.py`
- ✅ Dependências: `boto3` e `warrant-lite`

**Frontend:**
- ✅ Página "Esqueci minha senha" ([/forgot-password](src/pages/ForgotPassword.tsx))
- ✅ Página "Redefinir senha" ([/reset-password](src/pages/ResetPassword.tsx))
- ✅ Rotas configuradas no App.tsx
- ✅ Integração completa com backend via Axios

### 🎯 Fluxo do Usuário

1. Usuário clica em "Esqueceu sua senha?" na tela de login
2. Digita seu email e clica em "Enviar Código"
3. Recebe código de 6 dígitos por email
4. Insere código, email e nova senha
5. Clica em "Redefinir Senha"
6. Senha é alterada e usuário é redirecionado para login

---

## 🚀 Como Configurar (Resumo)

### Passo 1: Instalar Dependências

```bash
cd backend
pip install -r requirements.txt
```

### Passo 2: Configurar AWS Cognito

Siga o guia completo: [AWS_COGNITO_SETUP.md](../Docs/AWS_COGNITO_SETUP.md)

**Resumo rápido:**
1. Criar User Pool no AWS Cognito
2. Habilitar recuperação de senha por email
3. Criar App Client (sem client secret)
4. Configurar Amazon SES (ou usar Cognito Email para testes)
5. Criar IAM User com permissões
6. Obter credenciais

### Passo 3: Configurar Variáveis de Ambiente

Crie um arquivo `.env` no diretório `backend/`:

```bash
# AWS Cognito Configuration
AWS_COGNITO_REGION=us-east-1
AWS_COGNITO_USER_POOL_ID=us-east-1_XXXXXXXXX
AWS_COGNITO_APP_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxx
AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
```

⚠️ **IMPORTANTE**: 
- Substitua pelos valores reais da sua conta AWS
- Nunca comite o arquivo `.env` no Git
- Use `.env.example` como referência

### Passo 4: Testar Localmente

1. **Backend:**
```bash
cd backend
python manage.py runserver
```

2. **Frontend:**
```bash
cd Frontend
npm run dev
```

3. **Testar fluxo:**
   - Acesse: http://localhost:5173/login
   - Clique em "Esqueceu sua senha?"
   - Complete o fluxo de recuperação

### Passo 5: Deploy (Produção)

**Render.com / Heroku / AWS:**
1. Adicione as variáveis de ambiente no painel do servidor
2. Faça deploy normalmente
3. Teste em produção

---

## 📋 Checklist de Configuração

- [ ] Conta AWS criada
- [ ] User Pool criado no Cognito
- [ ] Recuperação por email habilitada
- [ ] App Client configurado
- [ ] SES configurado (ou Cognito Email)
- [ ] IAM User criado com permissões
- [ ] Credenciais salvas em `.env`
- [ ] Dependências instaladas
- [ ] Testado localmente
- [ ] Variáveis configuradas no servidor de produção
- [ ] Testado em produção

---

## 🔍 Troubleshooting Rápido

### Email não chega?
- Verifique pasta de spam
- Se usar Cognito Email: limite de 50/dia
- Se usar SES: verifique se está fora do Sandbox

### Código inválido?
- Código expira em 1 hora
- Verifique se copiou corretamente (6 dígitos)
- Solicite novo código

### Erro "UnauthorizedException"?
- Verifique credenciais AWS no `.env`
- Verifique permissões IAM
- Confirme User Pool ID e Client ID

### Senha rejeitada?
- Mínimo 8 caracteres
- Pelo menos 1 maiúscula, 1 minúscula, 1 número

---

## 📚 Documentação Completa

Para configuração detalhada passo a passo, consulte:
- **[Guia Completo de Configuração AWS Cognito](../Docs/AWS_COGNITO_SETUP.md)**

---

## 🎨 Preview das Telas

### Tela "Esqueci minha senha"
- Campo de email
- Botão "Enviar Código"
- Link para voltar ao login
- Validação de email

### Tela "Redefinir senha"
- Campo de email
- Campo de código (6 dígitos)
- Campos de nova senha e confirmação
- Botão "Reenviar código"
- Validação de senha forte
- Feedback visual de sucesso

---

## 💡 Recursos

- Validação de email em tempo real
- Código com 6 dígitos numéricos
- Máscara de senha (mostrar/ocultar)
- Loading states em todas as ações
- Mensagens de erro amigáveis
- Redirecionamento automático após sucesso
- Responsivo (mobile-friendly)
- Dark mode suportado

---

## 🔒 Segurança

✅ **Implementado:**
- Código expira em 1 hora
- Validação de senha forte
- Rate limiting do AWS Cognito
- Credenciais nunca expostas no frontend
- Emails não revelam se usuário existe (segurança por obscuridade)

⚠️ **Recomendações adicionais:**
- Implementar rate limiting no frontend
- Adicionar captcha para múltiplas tentativas
- Monitorar logs no CloudWatch
- Rotacionar credenciais AWS periodicamente

---

## 📊 Custos AWS

- **Cognito User Pool**: Gratuito até 50.000 usuários ativos/mês
- **SES**: $0.10 por 1.000 emails
- **IAM**: Gratuito
- [Detalhes completos](https://aws.amazon.com/cognito/pricing/)

---

## 🆘 Suporte

Problemas ou dúvidas? Consulte:
1. [Guia Completo](../Docs/AWS_COGNITO_SETUP.md) (muito detalhado!)
2. [Documentação AWS Cognito](https://docs.aws.amazon.com/cognito/)
3. Logs do CloudWatch
4. Abra uma issue no repositório

---

**Status**: ✅ Implementado e funcional  
**Última atualização**: Fevereiro 2026
