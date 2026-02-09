# 📝 Tutorial: Configuração AWS Cognito em 15 Minutos

Este é um guia simplificado para configurar rapidamente o AWS Cognito para recuperação de senha.

---

## ⏱️ Tempo estimado: 15 minutos

---

## 🎯 Pré-requisitos

- [ ] Conta AWS (criar grátis em https://aws.amazon.com/free/)
- [ ] Email para testes
- [ ] Projeto Skillio clonado

---

## 📝 Passo a Passo Simplificado

### 1️⃣ Criar User Pool (5 min)

1. Acesse https://console.aws.amazon.com/cognito/
2. Clique em **"Create user pool"**
3. **Sign-in experience**:
   - ✅ Email
   - Clique **"Next"**
4. **Security requirements**:
   - Password policy: **"Cognito defaults"**
   - MFA: **"No MFA"**
   - User account recovery: ✅ **"Email only"** ⭐
   - Clique **"Next"**
5. **Sign-up experience**:
   - ✅ Enable self-registration
   - ✅ Email verification
   - Clique **"Next"**
6. **Message delivery**:
   - **Para testes**: Selecione "Send email with Cognito"
   - **Para produção**: Configure Amazon SES (ver guia completo)
   - Clique **"Next"**
7. **Integrate your app**:
   - User pool name: `skillio-user-pool`
   - ❌ Desmarque "Hosted authentication pages"
   - App client name: `skillio-app-client`
   - ❌ "Don't generate a client secret" ⭐
   - Clique **"Next"**
8. Clique **"Create user pool"**

### 2️⃣ Copiar Informações (2 min)

1. No User Pool criado, copie:
   - **User pool ID**: `us-east-1_XXXXXXXXX`
   - **Region**: `us-east-1` (ou sua região)

2. Aba **"App integration"** > App client:
   - **Client ID**: `xxxxxxxxxx...`

3. Salve esses valores temporariamente

### 3️⃣ Criar IAM User (5 min)

1. Acesse https://console.aws.amazon.com/iam/
2. Menu **"Users"** > **"Add users"**
3. User name: `skillio-cognito`
4. ✅ **"Programmatic access"**
5. Clique **"Next: Permissions"**
6. **"Attach existing policies"**
7. Busque e marque: `AmazonCognitoPowerUser`
8. Clique **"Next"** até **"Create user"**
9. ⚠️ **IMPORTANTE**: Baixe o CSV ou copie:
   - **Access Key ID**: `AKIA...`
   - **Secret Access Key**: `wJal...`
   - Você só verá isso UMA VEZ!

### 4️⃣ Configurar Backend (3 min)

1. No projeto, vá para `backend/`
2. Crie arquivo `.env` (ou edite se já existir)
3. Adicione:

```bash
# AWS Cognito
AWS_COGNITO_REGION=us-east-1
AWS_COGNITO_USER_POOL_ID=us-east-1_XXXXXXXXX
AWS_COGNITO_APP_CLIENT_ID=xxxxxxxxxx
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=wJal...
```

4. Substitua pelos valores que você copiou
5. Instale dependências:

```bash
cd backend
pip install -r requirements.txt
```

### 5️⃣ Criar Usuário de Teste

**Via AWS Console** (mais fácil):

1. No User Pool > **"Users"** > **"Create user"**
2. Email: `seu-email@teste.com`
3. ✅ **"Mark email as verified"** ⭐
4. Password: `Teste123!`
5. ❌ Desmarque "Send email invitation"
6. Clique **"Create user"**

### 6️⃣ Testar (2 min)

1. Inicie o projeto:

```bash
# Terminal 1 - Backend
cd backend
python manage.py runserver

# Terminal 2 - Frontend
cd Frontend
npm run dev
```

2. Acesse: http://localhost:5173/forgot-password
3. Digite o email do teste
4. Verifique o email (⚠️ pode demorar 1-2 min, verifique spam!)
5. Copie o código de 6 dígitos
6. Acesse: http://localhost:5173/reset-password
7. Complete o formulário
8. Sucesso! 🎉

---

## ✅ Checklist de Verificação

- [ ] User Pool criado
- [ ] Email recovery habilitado
- [ ] App client sem client secret
- [ ] IAM user criado
- [ ] Credenciais copiadas
- [ ] `.env` configurado
- [ ] Dependências instaladas
- [ ] Usuário de teste criado com email verificado
- [ ] Fluxo testado com sucesso

---

## ⚠️ Problemas Comuns

### Email não chega?
**Solução**: 
1. Aguarde 1-2 minutos
2. Verifique spam/lixo eletrônico
3. Se usar Cognito Email: limite de 50 emails/dia (criar novo pool se atingir)

### Código inválido?
**Solução**: 
- Código expira em 1 hora
- Clique em "Reenviar código"

### "UnauthorizedException"?
**Solução**: 
- Verifique se `.env` tem os valores corretos
- Reinicie o backend
- Confirme que IAM user tem permissões

### Email não verificado?
**Solução**:
1. AWS Console > User Pool > Users
2. Clique no usuário
3. Edite `email_verified` para `true`

---

## 🚀 Para Produção

Depois de testar localmente:

1. **Configure Amazon SES** (em vez de Cognito Email):
   - Sem limite de 50 emails/dia
   - Emails personalizados
   - Melhor entregabilidade
   - Ver [guia completo](AWS_COGNITO_SETUP.md)

2. **Configure no servidor**:
   - Render.com: Adicione as variáveis de ambiente
   - Heroku: Use `heroku config:set ...`
   - AWS: Configure no Systems Manager Parameter Store

3. **Teste em produção**

---

## 📚 Próximos Passos

✅ Funcionando localmente? 

Consulte:
- [Guia Completo](AWS_COGNITO_SETUP.md) - Para produção e troubleshooting avançado
- [Guia Rápido](PASSWORD_RESET_QUICKSTART.md) - Visão geral da implementação

---

## 💰 Custos

**Desenvolvimento**: $0 (dentro do free tier)
**Produção**: 
- Gratuito até 50.000 usuários ativos/mês
- Depois: ~$0.0055 por usuário
- SES: $0.10 por 1.000 emails

---

## 🎉 Pronto!

Parabéns! Você configurou a recuperação de senha com AWS Cognito.

**Testou com sucesso?** Marque todos os checkboxes acima e siga para produção!

**Teve problemas?** Consulte a seção de troubleshooting ou o [guia completo](AWS_COGNITO_SETUP.md).

---

**Última atualização**: Fevereiro 2026
