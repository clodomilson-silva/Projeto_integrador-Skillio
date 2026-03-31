# 🎯 Configuração AWS Cognito - Comandos Rápidos

Este guia contém os comandos e configurações essenciais para configurar rapidamente o AWS Cognito.

---

## 📋 Índice Rápido

1. [Valores para Copiar](#valores-para-copiar)
2. [Comandos AWS CLI](#comandos-aws-cli)
3. [Variáveis de Ambiente](#variáveis-de-ambiente)
4. [Comandos de Teste](#comandos-de-teste)
5. [Troubleshooting Rápido](#troubleshooting-rápido)

---

## 📝 Valores para Copiar

### Durante a Criação do User Pool

Anote estes valores conforme você cria o User Pool:

```
User Pool Name: skillio-user-pool
Region: us-east-1
App Client Name: skillio-app-client

✅ IMPORTANTE:
- Habilitar: Email recovery ✓
- Desabilitar: Client secret ✗
- Habilitar: Self-registration ✓
```

### Após Criar o User Pool

```
User Pool ID: ______________________ (ex: us-east-1_AbCdEfGhI)
Region: __________________________ (ex: us-east-1)
Client ID: ________________________ (ex: 1a2b3c4d5e...)
```

### Após Criar IAM User

```
Access Key ID: ____________________ (ex: AKIAIOSFODNN7...)
Secret Access Key: ________________ (ex: wJalrXUtnFEMI...)
```

---

## ⚡ Comandos AWS CLI

### Instalar AWS CLI

**Windows:**
```powershell
# Via Chocolatey
choco install awscli

# Ou baixar instalador
# https://awscli.amazonaws.com/AWSCLIV2.msi
```

**macOS:**
```bash
brew install awscli
```

**Linux:**
```bash
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install
```

### Configurar AWS CLI

```bash
aws configure

# Responda:
AWS Access Key ID [None]: AKIAIOSFODNN7EXAMPLE
AWS Secret Access Key [None]: wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
Default region name [None]: us-east-1
Default output format [None]: json
```

### Criar Usuário de Teste

```bash
# Substituir pelos seus valores
aws cognito-idp admin-create-user \
  --user-pool-id us-east-1_XXXXXXXXX \
  --username test@example.com \
  --user-attributes \
      Name=email,Value=test@example.com \
      Name=email_verified,Value=true \
  --temporary-password "TempPassword123!" \
  --message-action SUPPRESS
```

### Verificar Email do Usuário

```bash
aws cognito-idp admin-update-user-attributes \
  --user-pool-id us-east-1_XXXXXXXXX \
  --username test@example.com \
  --user-attributes Name=email_verified,Value=true
```

### Listar Usuários

```bash
aws cognito-idp list-users \
  --user-pool-id us-east-1_XXXXXXXXX
```

### Ver Detalhes do User Pool

```bash
aws cognito-idp describe-user-pool \
  --user-pool-id us-east-1_XXXXXXXXX
```

---

## 🔧 Variáveis de Ambiente

### Arquivo .env (Backend)

Crie `backend/.env` e cole:

```bash
# Django Settings
DEBUG=True
SECRET_KEY=django-insecure-your-secret-key-here
ALLOWED_HOSTS=localhost,127.0.0.1

# Database (ajustar conforme necessário)
DATABASE_URL=postgresql://user:password@localhost:5432/dbname

# AWS Cognito Configuration
AWS_COGNITO_REGION=us-east-1
AWS_COGNITO_USER_POOL_ID=us-east-1_XXXXXXXXX
AWS_COGNITO_APP_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxx
AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
```

### Heroku

```bash
heroku config:set AWS_COGNITO_REGION=us-east-1
heroku config:set AWS_COGNITO_USER_POOL_ID=us-east-1_XXXXXXXXX
heroku config:set AWS_COGNITO_APP_CLIENT_ID=xxxxxxxxx
heroku config:set AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
heroku config:set AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
```

### Render.com

No painel do Render:
1. Vá para seu serviço > Environment
2. Adicione cada variável:

```
AWS_COGNITO_REGION = us-east-1
AWS_COGNITO_USER_POOL_ID = us-east-1_XXXXXXXXX
AWS_COGNITO_APP_CLIENT_ID = xxxxxxxxx
AWS_ACCESS_KEY_ID = AKIAIOSFODNN7EXAMPLE
AWS_SECRET_ACCESS_KEY = wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
```

---

## 🧪 Comandos de Teste

### Backend - Instalar Dependências

```bash
cd backend
pip install -r requirements.txt
```

### Backend - Iniciar Servidor

```bash
cd backend
python manage.py runserver
```

### Frontend - Instalar Dependências

```bash
cd Frontend
npm install
```

### Frontend - Iniciar Dev Server

```bash
cd Frontend
npm run dev
```

### Testar API - Forgot Password

```bash
curl -X POST http://localhost:8000/api/auth/forgot-password/ \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}'
```

**Resposta esperada:**
```json
{
  "message": "Código de verificação enviado para seu email."
}
```

### Testar API - Reset Password

```bash
curl -X POST http://localhost:8000/api/auth/reset-password/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "code": "123456",
    "new_password": "NovaSenha123!"
  }'
```

**Resposta esperada (sucesso):**
```json
{
  "message": "Senha redefinida com sucesso!"
}
```

**Resposta esperada (erro):**
```json
{
  "error": "Código de verificação inválido."
}
```

### Testar API - Resend Code

```bash
curl -X POST http://localhost:8000/api/auth/resend-code/ \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}'
```

---

## 🔍 Troubleshooting Rápido

### Email não chega?

**Comando para verificar configuração:**
```bash
aws cognito-idp describe-user-pool \
  --user-pool-id us-east-1_XXXXXXXXX \
  --query 'UserPool.EmailConfiguration'
```

**Verificar email do usuário:**
```bash
aws cognito-idp admin-get-user \
  --user-pool-id us-east-1_XXXXXXXXX \
  --username test@example.com \
  --query 'UserAttributes[?Name==`email_verified`]'
```

**Marcar email como verificado:**
```bash
aws cognito-idp admin-update-user-attributes \
  --user-pool-id us-east-1_XXXXXXXXX \
  --username test@example.com \
  --user-attributes Name=email_verified,Value=true
```

### UnauthorizedException?

**Verificar permissões IAM:**
```bash
aws iam get-user-policy \
  --user-name skillio-cognito-user \
  --policy-name CognitoAccess
```

**Testar credenciais:**
```bash
aws sts get-caller-identity
```

### Código inválido?

**Solicitar novo código via CLI:**
```bash
aws cognito-idp forgot-password \
  --client-id xxxxxxxxx \
  --username test@example.com
```

### Ver logs do Cognito

```bash
# Listar log groups
aws logs describe-log-groups \
  --log-group-name-prefix /aws/cognito

# Ver logs recentes
aws logs tail /aws/cognito/userpool/us-east-1_XXXXXXXXX --follow
```

---

## 📦 JSON de Política IAM

### Política Completa para Cognito

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "cognito-idp:ForgotPassword",
        "cognito-idp:ConfirmForgotPassword",
        "cognito-idp:ResendConfirmationCode",
        "cognito-idp:AdminGetUser",
        "cognito-idp:AdminCreateUser",
        "cognito-idp:AdminUpdateUserAttributes"
      ],
      "Resource": "arn:aws:cognito-idp:us-east-1:ACCOUNT_ID:userpool/us-east-1_XXXXXXXXX"
    }
  ]
}
```

**Criar política via CLI:**
```bash
aws iam create-policy \
  --policy-name SkillioCognitoPolicy \
  --policy-document file://cognito-policy.json
```

**Anexar ao usuário:**
```bash
aws iam attach-user-policy \
  --user-name skillio-cognito-user \
  --policy-arn arn:aws:iam::ACCOUNT_ID:policy/SkillioCognitoPolicy
```

---

## 🎯 Comandos de Verificação

### Verificar se tudo está configurado

```bash
# 1. Verificar AWS CLI
aws --version

# 2. Verificar credenciais
aws sts get-caller-identity

# 3. Verificar User Pool
aws cognito-idp describe-user-pool \
  --user-pool-id us-east-1_XXXXXXXXX \
  --query 'UserPool.Name'

# 4. Listar usuários
aws cognito-idp list-users \
  --user-pool-id us-east-1_XXXXXXXXX \
  --limit 10

# 5. Verificar Python e pip
python --version
pip --version

# 6. Verificar Node e npm
node --version
npm --version

# 7. Verificar dependências Python
pip list | grep boto3

# 8. Verificar backend está rodando
curl http://localhost:8000/api/health/

# 9. Verificar frontend está rodando
curl http://localhost:5173/
```

---

## 🚀 Script de Setup Completo

### Bash (Linux/Mac)

Salve como `setup-cognito.sh`:

```bash
#!/bin/bash

echo "🔧 Configurando AWS Cognito para Skillio..."

# Solicitar valores
read -p "User Pool ID: " POOL_ID
read -p "Client ID: " CLIENT_ID
read -p "Access Key ID: " ACCESS_KEY
read -sp "Secret Access Key: " SECRET_KEY
echo

# Criar .env
cat > backend/.env << EOF
AWS_COGNITO_REGION=us-east-1
AWS_COGNITO_USER_POOL_ID=$POOL_ID
AWS_COGNITO_APP_CLIENT_ID=$CLIENT_ID
AWS_ACCESS_KEY_ID=$ACCESS_KEY
AWS_SECRET_ACCESS_KEY=$SECRET_KEY
EOF

echo "✅ Arquivo .env criado!"

# Instalar dependências
echo "📦 Instalando dependências..."
cd backend && pip install -r requirements.txt

echo "🎉 Setup concluído!"
echo "Execute: python manage.py runserver"
```

**Usar:**
```bash
chmod +x setup-cognito.sh
./setup-cognito.sh
```

### PowerShell (Windows)

Salve como `setup-cognito.ps1`:

```powershell
Write-Host "🔧 Configurando AWS Cognito para Skillio..." -ForegroundColor Cyan

# Solicitar valores
$PoolId = Read-Host "User Pool ID"
$ClientId = Read-Host "Client ID"
$AccessKey = Read-Host "Access Key ID"
$SecretKey = Read-Host "Secret Access Key" -AsSecureString
$SecretKeyPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto(
    [Runtime.InteropServices.Marshal]::SecureStringToBSTR($SecretKey)
)

# Criar .env
$envContent = @"
AWS_COGNITO_REGION=us-east-1
AWS_COGNITO_USER_POOL_ID=$PoolId
AWS_COGNITO_APP_CLIENT_ID=$ClientId
AWS_ACCESS_KEY_ID=$AccessKey
AWS_SECRET_ACCESS_KEY=$SecretKeyPlain
"@

Set-Content -Path "backend\.env" -Value $envContent

Write-Host "✅ Arquivo .env criado!" -ForegroundColor Green

# Instalar dependências
Write-Host "📦 Instalando dependências..." -ForegroundColor Yellow
Set-Location backend
pip install -r requirements.txt

Write-Host "🎉 Setup concluído!" -ForegroundColor Green
Write-Host "Execute: python manage.py runserver"
```

**Usar:**
```powershell
.\setup-cognito.ps1
```

---

## 📚 Links Úteis

### AWS Console
- User Pools: https://console.aws.amazon.com/cognito/users/
- IAM Users: https://console.aws.amazon.com/iam/home#/users
- SES: https://console.aws.amazon.com/ses/home
- CloudWatch Logs: https://console.aws.amazon.com/cloudwatch/home#logsV2:log-groups

### Documentação
- [Guia Completo](./AWS_COGNITO_SETUP.md)
- [Tutorial Rápido](./AWS_COGNITO_QUICK_TUTORIAL.md)
- [Checklist de Testes](./TESTING_CHECKLIST_PASSWORD_RESET.md)

---

## ✅ Checklist Final

- [ ] AWS CLI instalado
- [ ] Credenciais configuradas
- [ ] User Pool criado
- [ ] IAM User criado
- [ ] Arquivo .env criado
- [ ] Dependências instaladas
- [ ] Usuário de teste criado
- [ ] Backend iniciado
- [ ] Frontend iniciado
- [ ] Testes passando

---

**Última atualização**: Fevereiro 2026  
**Versão**: 1.0.0

_Este guia contém todos os comandos essenciais para configurar rapidamente o AWS Cognito._
