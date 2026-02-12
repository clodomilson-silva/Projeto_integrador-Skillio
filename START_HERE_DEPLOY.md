# ⚡ INÍCIO RÁPIDO - CONFIGURAR DEPLOY

## 🔧 FERRAMENTAS NECESSÁRIAS (Windows)

### 1️⃣ OpenSSH (para atualizar Backend)

**Opção A: Habilitar OpenSSH do Windows** (RECOMENDADO)
```powershell
# Abra PowerShell como Administrador e execute:
Add-WindowsCapability -Online -Name OpenSSH.Client~~~~0.0.1.0
```

**Opção B: Usar Git Bash** (vem com o Git)
- Já está instalado se você tem Git
- Use Git Bash em vez do CMD para rodar os scripts
- Abra: Git Bash aqui (botão direito na pasta)

**Opção C: WSL (Windows Subsystem for Linux)**
- Mais completo mas requer mais configuração

### 2️⃣ AWS CLI (para atualizar Frontend)

**Download:** https://awscli.amazonaws.com/AWSCLIV2.msi

Após instalar:
```cmd
# Configurar credenciais
aws configure

# Você precisará de:
# - AWS Access Key ID
# - AWS Secret Access Key
# - Region: us-east-2
```

---

## 🚀 OPÇÕES DE DEPLOY

### ✅ OPÇÃO 1: Usando Git Bash (MAIS FÁCIL)

1. **Abra Git Bash** na pasta do projeto (botão direito → Git Bash Here)
2. Execute:

```bash
# Backend
ssh -i skillio-key.pem ubuntu@54.227.194.67
cd ~/Projeto_integrador
git config credential.helper store
git pull origin Renan---AWS-Free-Tier
./deploy_scripts/update_backend.sh
exit

# Frontend (precisa AWS CLI configurado)
./deploy_frontend_simple.bat
```

### ✅ OPÇÃO 2: Deploy via Interface AWS (SEM COMANDOS)

#### Backend:
1. Acesse: https://console.aws.amazon.com/ec2
2. Selecione instância `i-0832ea4e8f50447ec`
3. Click em "Connect" → "EC2 Instance Connect"
4. No terminal que abrir:
```bash
cd ~/Projeto_integrador
git pull origin Renan---AWS-Free-Tier
./deploy_scripts/update_backend.sh
```

#### Frontend:
1. Acesse: https://console.aws.amazon.com/s3
2. Abra bucket: `skillio-frontend-087736691624`
3. Click em "Upload"
4. Arraste todos os arquivos da pasta `Frontend/dist` (após build)
5. Click em "Upload"
6. Vá em CloudFront e crie uma invalidação

### ✅ OPÇÃO 3: GitHub Actions (AUTOMÁTICO)

Configurar CI/CD para deploy automático a cada push. Quer que eu configure?

---

## 📝 ORDEM DE INSTALAÇÃO RECOMENDADA

1. ✅ **Instalar OpenSSH** (ou usar Git Bash)
2. ✅ **Instalar AWS CLI**
3. ✅ **Configurar AWS CLI** com suas credenciais
4. ✅ **Testar conexão**: `ssh -i skillio-key.pem ubuntu@54.227.194.67`
5. ✅ **Rodar scripts de deploy**

---

## 🎯 O QUE FAZER AGORA?

### CURTO PRAZO (próximos  minutos):

**Se quer deploy IMEDIATO:**
- Use **Opção 2** (Interface AWS) - não precisa instalar nada

**Se quer automatizar:**
- Instale OpenSSH + AWS CLI
- Use scripts criados: `deploy_backend_scp.bat` e `deploy_frontend_simple.bat`

### PRÓXIMOS PASSOS:

Após instalar as ferramentas, execute:
```cmd
# 1. Testar SSH
ssh -i skillio-key.pem ubuntu@54.227.194.67

# 2. Se funcionar, atualizar backend
deploy_backend_scp.bat

# 3. Atualizar frontend
deploy_frontend_simple.bat
```

---

## 📞 LINKS ÚTEIS

- **OpenSSH:** `Add-WindowsCapability -Online -Name OpenSSH.Client~~~~0.0.1.0`
- **AWS CLI:** https://awscli.amazonaws.com/AWSCLIV2.msi
- **AWS Console EC2:** https://console.aws.amazon.com/ec2
- **AWS Console S3:** https://console.aws.amazon.com/s3
- **CloudFront:** https://console.aws.amazon.com/cloudfront

- **Frontend Deploy:** https://d3lxa11agu4uln.cloudfront.net
- **Backend API:** http://54.227.194.67:8000

---

**Escolha uma opção e me avise para continuarmos!** 🚀
