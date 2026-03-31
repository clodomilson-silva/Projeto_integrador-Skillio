# Guia de Configuração do AWS Cognito para Recuperação de Senha

Este guia explica passo a passo como configurar o AWS Cognito para a funcionalidade de recuperação de senha no Skillio.

## 📋 Índice

1. [Pré-requisitos](#pré-requisitos)
2. [Criar User Pool no AWS Cognito](#criar-user-pool)
3. [Configurar Client App](#configurar-client-app)
4. [Configurar Email para Códigos](#configurar-email)
5. [Obter Credenciais AWS](#obter-credenciais)
6. [Configurar Variáveis de Ambiente](#configurar-variáveis)
7. [Testar a Configuração](#testar)
8. [Troubleshooting](#troubleshooting)

---

## 🔧 Pré-requisitos

- Conta AWS ativa ([Criar conta gratuita](https://aws.amazon.com/free/))
- Acesso ao AWS Console
- Permissões para criar recursos no Cognito e IAM

---

## 📦 1. Criar User Pool no AWS Cognito

### Passo 1.1: Acessar o Console AWS Cognito

1. Faça login no [AWS Console](https://console.aws.amazon.com/)
2. Busque por **"Cognito"** na barra de pesquisa
3. Clique em **"Manage User Pools"**
4. Clique em **"Create a user pool"**

### Passo 1.2: Configurar Sign-in Experience

1. **Provider types**: Selecione **"Cognito user pool"**
2. **Cognito user pool sign-in options**: 
   - Marque **"Email"**
   - (Opcional) Marque "Username" se quiser permitir login por username
3. Clique em **"Next"**

### Passo 1.3: Configurar Security Requirements

1. **Password policy**:
   - Selecione **"Cognito defaults"** ou personalize conforme necessário
   - Recomendado: Mínimo 8 caracteres, letras maiúsculas, minúsculas e números

2. **Multi-factor authentication (MFA)**:
   - Selecione **"No MFA"** (ou configure se desejar segurança adicional)

3. **User account recovery**:
   - Marque **"Enable self-service account recovery"**
   - Selecione **"Email only"**
   - ⚠️ **IMPORTANTE**: Esta opção é essencial para a funcionalidade de recuperação

4. Clique em **"Next"**

### Passo 1.4: Configurar Sign-up Experience

1. **Self-service sign-up**:
   - Marque **"Enable self-registration"**

2. **Attribute verification**:
   - Selecione **"Send email message, verify email address"**

3. **Required attributes**:
   - Selecione **"email"** (já vem marcado)
   - (Opcional) Adicione outros campos como "name" se necessário

4. Clique em **"Next"**

### Passo 1.5: Configurar Message Delivery

**IMPORTANTE**: Esta é a configuração mais crítica para recuperação de senha!

1. **Email**:
   
   **Opção A: Amazon SES (Produção - Recomendado)**
   - Selecione **"Send email with Amazon SES"**
   - Você precisará:
     - Verificar seu domínio no SES
     - Configurar identidades de email
     - Solicitar saída do sandbox (para envios em produção)
   - [Documentação do SES](https://docs.aws.amazon.com/ses/latest/dg/verify-domain-procedure.html)

   **Opção B: Cognito Email (Desenvolvimento - Limitado)**
   - Selecione **"Send email with Cognito"**
   - ⚠️ Limite de 50 emails/dia
   - Adequado apenas para testes
   - FROM email será: **no-reply@verificationemail.com**

2. **FROM email address**:
   - Se usar SES: Configure seu email verificado (ex: noreply@seudominio.com)
   - Se usar Cognito: Será no-reply@verificationemail.com

3. **SES Region**: Selecione sua região (ex: us-east-1)

4. Clique em **"Next"**

### Passo 1.6: Integrar seu App

1. **User pool name**: Digite um nome (ex: `skillio-user-pool`)

2. **Hosted authentication pages**: 
   - Desmarque (não vamos usar as páginas do Cognito)

3. **Initial app client**:
   - **App client name**: Digite um nome (ex: `skillio-app-client`)
   - **Client secret**: Selecione **"Don't generate a client secret"**
   - ⚠️ **IMPORTANTE**: Sem client secret para aplicações públicas

4. Clique em **"Next"**

### Passo 1.7: Revisar e Criar

1. Revise todas as configurações
2. Clique em **"Create user pool"**
3. Aguarde a criação (leva alguns segundos)

---

## 🔑 2. Configurar Client App

### Passo 2.1: Acessar App Client

1. No User Pool criado, vá para a aba **"App integration"**
2. Em **"App clients and analytics"**, clique no app client criado
3. Clique em **"Edit"**

### Passo 2.2: Configurar Authentication Flows

Marque as seguintes opções:

- ✅ **ALLOW_USER_PASSWORD_AUTH** (para login com email/senha)
- ✅ **ALLOW_REFRESH_TOKEN_AUTH** (para renovar tokens)
- ✅ **ALLOW_CUSTOM_AUTH** (opcional)

**NÃO marque**:
- ❌ ALLOW_USER_SRP_AUTH (a menos que use SRP)

### Passo 2.3: Configurar Token Expiration

- **Access token expiration**: 60 minutos (padrão)
- **ID token expiration**: 60 minutos (padrão)
- **Refresh token expiration**: 30 dias (padrão)

Clique em **"Save changes"**

---

## 📧 3. Configurar Email para Códigos

### Passo 3.1: Personalizar Templates de Email

1. No User Pool, vá para a aba **"Messaging"**
2. Clique em **"Edit"** em **"Verification message"**

**Forgot Password Message**:
```
Olá!

Você solicitou a recuperação de senha no Skillio.

Seu código de verificação é: {####}

Este código expira em 1 hora.

Se você não solicitou esta recuperação, ignore este email.

Atenciosamente,
Equipe Skillio
```

3. **Subject**: `Código de Recuperação - Skillio`
4. Clique em **"Save changes"**

### Passo 3.2: Configurar Expiração do Código

1. Na aba **"Sign-in experience"**, clique em **"Edit"**
2. Em **"Forgot password code validity"**: Configure para **1 hora** (3600 segundos)
3. Clique em **"Save changes"**

---

## 🔐 4. Obter Credenciais AWS

### Passo 4.1: Criar IAM User

1. Vá para o serviço **IAM** no AWS Console
2. No menu lateral, clique em **"Users"**
3. Clique em **"Add users"**
4. **User name**: Digite um nome (ex: `skillio-cognito-user`)
5. **Access type**: Marque **"Programmatic access"**
6. Clique em **"Next: Permissions"**

### Passo 4.2: Configurar Permissões

**Opção A: Política Gerenciada (Mais Simples)**
1. Clique em **"Attach existing policies directly"**
2. Busque e marque: **"AmazonCognitoPowerUser"**
3. Clique em **"Next"** até **"Create user"**

**Opção B: Política Customizada (Mais Seguro)**
1. Clique em **"Create policy"**
2. Selecione a aba **"JSON"**
3. Cole a política abaixo:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "cognito-idp:ForgotPassword",
        "cognito-idp:ConfirmForgotPassword",
        "cognito-idp:ResendConfirmationCode"
      ],
      "Resource": "arn:aws:cognito-idp:us-east-1:YOUR_ACCOUNT_ID:userpool/YOUR_USER_POOL_ID"
    }
  ]
}
```

4. Substitua `YOUR_ACCOUNT_ID` e `YOUR_USER_POOL_ID`
5. Nome da política: `SkillioCognitoResetPassword`
6. Volte e anexe esta política ao usuário

### Passo 4.3: Salvar Credenciais

⚠️ **MUITO IMPORTANTE**: 
- Após criar o usuário, baixe o CSV com as credenciais
- Ou copie manualmente:
  - **Access Key ID**
  - **Secret Access Key**
- **Você só verá essas credenciais UMA VEZ!**

---

## ⚙️ 5. Configurar Variáveis de Ambiente

### Passo 5.1: Obter Informações do User Pool

1. No User Pool, vá para **"User pool overview"**
2. Copie:
   - **User pool ID** (ex: us-east-1_AbCdEfGhI)
   - **Region** (ex: us-east-1)

3. Na aba **"App integration"**, copie:
   - **Client ID** (ex: 1a2b3c4d5e6f7g8h9i0j1k2l3m)

### Passo 5.2: Criar arquivo .env no Backend

No diretório `backend/`, crie ou edite o arquivo `.env`:

```bash
# AWS Cognito Configuration
AWS_COGNITO_REGION=us-east-1
AWS_COGNITO_USER_POOL_ID=us-east-1_AbCdEfGhI
AWS_COGNITO_APP_CLIENT_ID=1a2b3c4d5e6f7g8h9i0j1k2l3m
AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
```

⚠️ **Substitua pelos seus valores reais!**

### Passo 5.3: Adicionar ao .gitignore

Certifique-se de que `.env` está no `.gitignore`:

```bash
# Environment variables
.env
.env.local
.env.production
```

### Passo 5.4: Configurar no Servidor de Produção

**Render.com**:
1. No painel do Render, vá para seu serviço
2. Clique em **"Environment"**
3. Adicione as variáveis:
   - `AWS_COGNITO_REGION`
   - `AWS_COGNITO_USER_POOL_ID`
   - `AWS_COGNITO_APP_CLIENT_ID`
   - `AWS_ACCESS_KEY_ID`
   - `AWS_SECRET_ACCESS_KEY`

**Heroku**:
```bash
heroku config:set AWS_COGNITO_REGION=us-east-1
heroku config:set AWS_COGNITO_USER_POOL_ID=us-east-1_AbCdEfGhI
heroku config:set AWS_COGNITO_APP_CLIENT_ID=1a2b3c4d5e6f7g8h9i0j1k2l3m
heroku config:set AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
heroku config:set AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
```

---

## 🧪 6. Testar a Configuração

### Passo 6.1: Instalar Dependências

```bash
cd backend
pip install -r requirements.txt
```

### Passo 6.2: Criar Usuário de Teste no Cognito

**Opção A: Via AWS Console**
1. No User Pool, clique em **"Users"**
2. Clique em **"Create user"**
3. Preencha:
   - **Email**: seu-email@teste.com
   - **Password**: Senha123!
   - Marque **"Mark email as verified"**
4. Clique em **"Create user"**

**Opção B: Via AWS CLI**
```bash
aws cognito-idp admin-create-user \
  --user-pool-id us-east-1_AbCdEfGhI \
  --username test@example.com \
  --user-attributes Name=email,Value=test@example.com Name=email_verified,Value=true \
  --temporary-password TempPassword123! \
  --message-action SUPPRESS
```

### Passo 6.3: Testar Fluxo Completo

1. **Iniciar Backend**:
```bash
cd backend
python manage.py runserver
```

2. **Iniciar Frontend**:
```bash
cd frontend
npm run dev
```

3. **Testar Recuperação de Senha**:
   - Acesse `http://localhost:5173/forgot-password`
   - Digite o email do usuário de teste
   - Clique em "Enviar Código"
   - Verifique o email (pode levar 1-2 minutos)
   - Copie o código de 6 dígitos
   - Acesse `http://localhost:5173/reset-password`
   - Cole o código
   - Digite nova senha
   - Clique em "Redefinir Senha"

### Passo 6.4: Testar via API (opcional)

**Solicitar código**:
```bash
curl -X POST http://localhost:8000/api/auth/forgot-password/ \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}'
```

**Redefinir senha**:
```bash
curl -X POST http://localhost:8000/api/auth/reset-password/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "code": "123456",
    "new_password": "NovaSenha123!"
  }'
```

---

## 🔍 7. Troubleshooting

### Problema: "Email não verificado"

**Solução**:
1. No User Pool, vá em **"Users"**
2. Clique no usuário
3. Em **"Attributes"**, edite `email_verified` para `true`

### Problema: "Código não recebido"

**Causas possíveis**:
1. **Email na pasta de spam**: Verifique a pasta de spam/lixo eletrônico
2. **Usando Cognito Email**: Limite de 50 emails/dia atingido
3. **SES em Sandbox**: Só envia para emails verificados
4. **Email não verificado**: Verifique `email_verified` no Cognito

**Soluções**:
1. Verificar spam
2. Migrar para Amazon SES
3. [Sair do Sandbox do SES](https://docs.aws.amazon.com/ses/latest/dg/request-production-access.html)
4. Marcar email como verificado

### Problema: "CodeMismatchException"

**Causas**:
- Código expirado (1 hora)
- Código incorreto
- Espaços no código

**Solução**:
1. Solicitar novo código
2. Copiar código exatamente como aparece no email
3. Não incluir espaços

### Problema: "InvalidPasswordException"

**Causa**: Senha não atende aos requisitos

**Solução**:
Senha deve ter:
- Mínimo 8 caracteres
- Pelo menos 1 letra maiúscula
- Pelo menos 1 letra minúscula
- Pelo menos 1 número
- (Opcional) 1 caractere especial

### Problema: "LimitExceededException"

**Causa**: Muitas tentativas em curto período

**Solução**:
- Aguardar 15-30 minutos
- Implementar rate limiting no frontend
- Considerar implementar captcha adicional

### Problema: "UnauthorizedException"

**Causas**:
1. Credenciais AWS incorretas
2. Permissões IAM insuficientes
3. User Pool ID ou Client ID incorretos

**Solução**:
1. Verificar variáveis de ambiente
2. Verificar permissões IAM do usuário
3. Confirmar IDs no AWS Console

### Problema: Emails não chegam (SES)

**Solução**:
1. Verificar se domínio está verificado no SES
2. Verificar se está fora do Sandbox
3. Ver logs no CloudWatch:
   - Console AWS > CloudWatch > Logs
   - Buscar por `/aws/cognito/userpool/[user-pool-id]`

---

## 📊 8. Monitoramento e Logs

### CloudWatch Logs

1. Vá para **CloudWatch** no AWS Console
2. Clique em **"Logs"** > **"Log groups"**
3. Busque por `/aws/cognito/userpool/[user-pool-id]`
4. Veja os logs de:
   - Envios de email
   - Tentativas de recuperação
   - Erros

### Métricas do Cognito

1. No User Pool, aba **"Monitoring"**
2. Veja métricas de:
   - Usuários ativos
   - Tentativas de login
   - Recuperações de senha
   - Erros

---

## 🔒 9. Segurança e Boas Práticas

### ✅ Recomendações

1. **Nunca** comite credenciais AWS no Git
2. **Sempre** use IAM com políticas de menor privilégio
3. **Rotacione** Access Keys periodicamente (a cada 90 dias)
4. **Habilite** MFA para a conta AWS root
5. **Configure** CloudWatch Alarms para monitorar uso
6. **Use** Amazon SES em produção (não Cognito Email)
7. **Implemente** rate limiting no frontend
8. **Adicione** logs de auditoria para recuperações de senha

### ❌ Evite

1. Usar credenciais AWS root
2. Compartilhar Access Keys
3. Hardcodear credenciais no código
4. Usar Cognito Email em produção
5. Permitir tentativas ilimitadas

---

## 📚 10. Recursos Adicionais

### Documentação Oficial

- [AWS Cognito Documentation](https://docs.aws.amazon.com/cognito/)
- [Forgot Password Flow](https://docs.aws.amazon.com/cognito/latest/developerguide/amazon-cognito-user-pools-forgot-password-flow.html)
- [Amazon SES Setup](https://docs.aws.amazon.com/ses/latest/dg/setting-up.html)
- [IAM Best Practices](https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html)

### Custos

- **User Pool**: Gratuito até 50.000 MAUs (Monthly Active Users)
- **Depois**: $0.0055 por MAU
- **SES**: $0.10 por 1.000 emails
- [Detalhes de Preços](https://aws.amazon.com/cognito/pricing/)

### Suporte

- [AWS Forums](https://forums.aws.amazon.com/forum.jspa?forumID=173)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/amazon-cognito)
- [AWS Support](https://console.aws.amazon.com/support/)

---

## ✅ Checklist de Implementação

- [ ] User Pool criado no AWS Cognito
- [ ] Email recovery habilitado
- [ ] App Client configurado sem client secret
- [ ] Amazon SES configurado (ou Cognito Email para testes)
- [ ] IAM User criado com permissões corretas
- [ ] Credenciais AWS salvas em local seguro
- [ ] Variáveis de ambiente configuradas no backend
- [ ] Dependências instaladas (`boto3`)
- [ ] Usuário de teste criado
- [ ] Fluxo de recuperação testado end-to-end
- [ ] Logs do CloudWatch verificados
- [ ] Variáveis de ambiente configuradas no servidor de produção
- [ ] Template de email personalizado
- [ ] Frontend atualizado com novas rotas

---

## 🎉 Conclusão

Parabéns! Você configurou com sucesso a funcionalidade de recuperação de senha com AWS Cognito no Skillio.

**Próximos passos**:
1. Testar em ambiente de produção
2. Monitorar logs e métricas
3. Coletar feedback dos usuários
4. Considerar adicionar MFA para maior segurança

**Precisa de ajuda?** Abra uma issue no repositório ou consulte a documentação oficial da AWS.

---

**Última atualização**: Fevereiro 2026
**Versão do guia**: 1.0.0
