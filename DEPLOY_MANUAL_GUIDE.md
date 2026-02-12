# 🚀 GUIA DE DEPLOY MANUAL - SKILLIO AWS

## ⚠️ PROBLEMAS COMUNS E SOLUÇÕES

### Problema: "Could not read Username for GitHub"
**Causa:** Servidor EC2 não está autenticado no GitHub
**Solução:** Use o método alternativo abaixo

### Problema: Erro ao conectar SSH
**Possíveis causas:**
1. Arquivo `skillio-key.pem` não está na pasta raiz do projeto
2. Permissões do arquivo incorretas
3. IP do EC2 mudou
4. Firewall bloqueando conexão

---

## 📋 MÉTODO 1: Deploy via SSH Manual (RECOMENDADO)

### 1️⃣ Configurar autenticação GitHub no servidor EC2

```bash
# 1. Conectar no servidor
ssh -i skillio-key.pem ubuntu@3.142.80.221

# 2. Configurar GitHub Token (para git pull funcionar)
git config --global credential.helper store

# 3. Fazer git pull uma vez (vai pedir credenciais)
cd ~/Projeto_integrador
git pull origin Renan---AWS-Free-Tier

# Digite seu usuário GitHub e Personal Access Token quando solicitado
# Token: Vá em GitHub.com → Settings → Developer Settings → Personal Access Tokens
```

### 2️⃣ Atualizar Backend

```bash
# Já conectado no servidor EC2:
cd ~/Projeto_integrador
git pull origin Renan---AWS-Free-Tier
./deploy_scripts/update_backend.sh
```

### 3️⃣ Verificar se funcionou

```bash
# Ver status do serviço
sudo systemctl status skillio

# Ver logs em tempo real
sudo journalctl -u skillio -f

# Testar API
curl http://localhost:8000/api/health/
```

---

## 📋 MÉTODO 2: Deploy Frontend (no seu PC Windows)

### 1️⃣ Configurar AWS CLI

```cmd
# Verificar se está instalado
aws --version

# Se não estiver, baixe em: https://aws.amazon.com/cli/

# Configurar credenciais
aws configure
```

**Você precisará:**
- AWS Access Key ID
- AWS Secret Access Key  
- Default region: `us-east-2`
- Output format: `json`

### 2️⃣ Executar deploy do frontend

```cmd
# Na raiz do projeto:
deploy_frontend_simple.bat
```

**Ou manualmente:**

```cmd
cd Frontend

# 1. Build
npm install
npm run build

# 2. Upload para S3
aws s3 sync dist/ s3://skillio-frontend-087736691624 ^
    --delete ^
    --acl public-read

# 3. Invalidar cache do CloudFront
aws cloudfront create-invalidation ^
    --distribution-id E2YV8BLYATEHPW ^
    --paths "/*"
```

---

## 📋 MÉTODO 3: Deploy COMPLETO via GitHub Token

### 1️⃣ Criar GitHub Personal Access Token

1. Vá em: https://github.com/settings/tokens
2. Click em **"Generate new token"** → **"Classic"**
3. Nome: `Skillio Deploy`
4. Selecione: `repo` (todos)
5. Click em **"Generate token"**
6. **COPIE O TOKEN** (só aparece uma vez!)

### 2️⃣ Configurar no servidor EC2

```bash
# Conectar no servidor
ssh -i skillio-key.pem ubuntu@3.142.80.221

# Configurar Git com o token
cd ~/Projeto_integrador

# Remover origin atual
git remote remove origin

# Adicionar origin com token
git remote add origin https://<SEU_TOKEN_AQUI>@github.com/renaneliakim1/Projeto_integrador.git

# Testar
git pull origin Renan---AWS-Free-Tier
```

### 3️⃣ Agora o script automático vai funcionar!

No seu PC Windows:
```cmd
update_backend_aws.bat
```

---

## 🔍 TROUBLESHOOTING

### Verificar conexão SSH

```cmd
# Teste básico
ssh -i skillio-key.pem ubuntu@3.142.80.221 "echo 'Conexão OK!'"
```

### Se der erro "Permission denied (publickey)"

```cmd
# Windows - ajustar permissões do arquivo .pem
icacls skillio-key.pem /inheritance:r
icacls skillio-key.pem /grant:r "%USERNAME%:R"
```

### Verificar se EC2 está rodando

```cmd
# Via AWS CLI
aws ec2 describe-instances --instance-ids i-011652edaf0416223
```

### URLs para testar depois do deploy

- **Backend API:** http://3.142.80.221:8000
- **Frontend (CloudFront):** https://d3lxa11agu4uln.cloudfront.net
- **Frontend (S3):** http://skillio-frontend-087736691624.s3-website.us-east-2.amazonaws.com

---

## 📞 CONTATO DE EMERGÊNCIA

Se nada funcionar:
1. ✅ Verifique se o arquivo `skillio-key.pem` está na raiz do projeto
2. ✅ Verifique conexão com internet
3. ✅ Teste se consegue acessar: http://3.142.80.221:8000
4. ✅ Se o backend não responder, o EC2 pode estar parado (custo AWS)

---

**Última atualização:** 12/02/2026
