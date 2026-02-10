# 🚀 GUIA RÁPIDO: Deploy AWS Free Tier

## 📋 Visão Geral

Este guia te levará do zero ao deploy completo em ~30-60 minutos.

**O que vai ser criado:**
- ✅ RDS PostgreSQL (banco de dados)
- ✅ EC2 t2.micro (backend Django)
- ✅ S3 (frontend React)
- ✅ Tudo configurado e rodando!

---

## 🎯 FASE 1: Preparar Conta AWS (10 min)

### 1.1 Criar Conta AWS
1. Acesse: https://aws.amazon.com/free/
2. Clique em "Create a Free Account"
3. Preencha: email, senha, nome da conta
4. **Adicione cartão de crédito** (não será cobrado no Free Tier)
5. Verifique telefone
6. Escolha plano: **Basic Support (FREE)**

### 1.2 Instalar AWS CLI (Windows)
```bash
# No PowerShell
pip install awscli

# Configurar
aws configure
```

Você precisará de:
- **Access Key ID** (veja em: https://console.aws.amazon.com/iam/home#/security_credentials)
- **Secret Access Key**
- **Region**: `us-east-1`
- **Output format**: `json`

---

## 🎯 FASE 2: Criar Recursos AWS (15 min)

### 2.1 Criar RDS PostgreSQL

1. Acesse: https://console.aws.amazon.com/rds/
2. Clique em **"Create database"**
3. Configurações:
   - **Engine**: PostgreSQL 15.x
   - **Templates**: ✅ **Free tier**
   - **DB instance identifier**: `skillio-db`
   - **Master username**: `postgres`
   - **Master password**: `Skillio2026!` (anote!)
   - **DB instance class**: db.t3.micro (Free tier)
   - **Storage**: 20 GB gp2
   - **Public access**: **No**
   - **Initial database name**: `skillio_db`
4. Clique em **"Create database"**
5. ⏳ Aguarde 5-10 minutos
6. **📝 ANOTE O ENDPOINT**: `skillio-db.xxxxx.us-east-1.rds.amazonaws.com`

### 2.2 Criar Security Group para EC2

1. Acesse: https://console.aws.amazon.com/ec2/home#SecurityGroups
2. Clique em **"Create security group"**
3. Configurações:
   - **Name**: `skillio-backend-sg`
   - **Description**: Backend Django
   - **Inbound rules** (Add rules):
     - SSH (22) - Seu IP (My IP)
     - HTTP (80) - 0.0.0.0/0
     - HTTPS (443) - 0.0.0.0/0
4. Clique em **"Create security group"**
5. **📝 ANOTE O ID**: `sg-xxxxx`

### 2.3 Atualizar Security Group do RDS

1. Vá para: https://console.aws.amazon.com/rds/
2. Clique em `skillio-db` > **Connectivity & security**
3. Clique no security group (ex: `default`)
4. **Inbound rules** > **Edit inbound rules**
5. **Add rule**:
   - Type: PostgreSQL (5432)
   - Source: Custom - Selecione `skillio-backend-sg`
6. **Save rules**

### 2.4 Criar EC2 Instance

1. Acesse: https://console.aws.amazon.com/ec2/home#LaunchInstances
2. Clique em **"Launch instances"**
3. Configurações:
   - **Name**: `skillio-backend`
   - **AMI**: Ubuntu Server 22.04 LTS (Free tier eligible)
   - **Instance type**: t2.micro (Free tier eligible)
   - **Key pair**: 
     - Clique em "Create new key pair"
     - Name: `skillio-key`
     - Type: RSA, .pem
     - **💾 SALVE O ARQUIVO .pem!**
   - **Network settings**:
     - Security group: Select existing - `skillio-backend-sg`
   - **Storage**: 30 GB gp3 (Free tier)
4. Clique em **"Launch instance"**
5. **📝 ANOTE O IP PÚBLICO**: `3.xxx.xxx.xxx`

---

## 🎯 FASE 3: Configurar Backend no EC2 (20 min)

### 3.1 Conectar ao EC2

```bash
# Windows (Git Bash ou PowerShell)
# Navegue até onde está o arquivo .pem
cd C:\Users\RENAN\Downloads

# Dê permissão ao arquivo
icacls skillio-key.pem /inheritance:r
icacls skillio-key.pem /grant:r "%USERNAME%:R"

# Conecte
ssh -i skillio-key.pem ubuntu@3.xxx.xxx.xxx
```

### 3.2 Clonar Repositório no EC2

```bash
# Dentro do EC2
git clone https://github.com/renaneliakim1/Projeto_integrador.git
cd Projeto_integrador
```

### 3.3 Executar Scripts de Deploy (NA ORDEM!)

```bash
# Script 1: Instalar dependências do sistema
bash deploy_scripts/1_setup_ec2.sh

# Script 2: Configurar variáveis de ambiente
bash deploy_scripts/2_setup_env.sh

# ⚠️ IMPORTANTE: Editar o arquivo .env
nano ~/.env
# Preencha:
# - DB_PASSWORD=Skillio2026!
# - DB_HOST=seu-rds-endpoint.rds.amazonaws.com
# - ANTHROPIC_API_KEY=sua-key
# Ctrl+O para salvar, Ctrl+X para sair

# Script 3: Instalar aplicação
bash deploy_scripts/3_install_app.sh

# Script 4: Configurar Nginx
bash deploy_scripts/4_setup_nginx.sh

# Script 5: Configurar serviço systemd
bash deploy_scripts/5_setup_systemd.sh
```

### 3.4 ✅ Testar Backend

```bash
# Dentro do EC2
curl http://localhost/api/v1/

# No seu navegador
http://3.xxx.xxx.xxx/api/v1/
http://3.xxx.xxx.xxx/admin/
```

Se aparecer JSON ou página, **FUNCIONOU!** 🎉

---

## 🎯 FASE 4: Deploy Frontend (15 min)

### 4.1 Atualizar Backend com IPs Reais

```bash
# No EC2, edite settings_production.py
nano ~/Projeto_integrador/backend/core/settings_production.py

# Adicione o IP do EC2 em ALLOWED_HOSTS:
ALLOWED_HOSTS = [
    'localhost',
    '127.0.0.1',
    '3.xxx.xxx.xxx',  # ← SEU IP DO EC2
]

# Salve (Ctrl+O, Ctrl+X)

# Reinicie o serviço
sudo systemctl restart skillio
```

### 4.2 Deploy Frontend para S3

```bash
# NO SEU PC (Git Bash ou PowerShell)
cd C:\Users\RENAN\Downloads\Projeto_integrador

# Execute o script de deploy
bash deploy_scripts/6_deploy_frontend.sh

# Siga as instruções:
# 1. Digite um nome de bucket único (ex: skillio-frontend-renan-2026)
# 2. Digite o IP do backend (ex: http://3.xxx.xxx.xxx)
```

O script vai:
- ✅ Criar bucket S3
- ✅ Configurar como website estático
- ✅ Fazer upload do frontend
- ✅ Te dar a URL do site!

### 4.3 Atualizar CORS no Backend

```bash
# No EC2
nano ~/Projeto_integrador/backend/core/settings_production.py

# Adicione a URL do S3 em CSRF_TRUSTED_ORIGINS e CORS_ALLOWED_ORIGINS:
CSRF_TRUSTED_ORIGINS = [
    'http://localhost:8080',
    'http://skillio-frontend-renan-2026.s3-website-us-east-1.amazonaws.com',  # ← URL do S3
]

CORS_ALLOWED_ORIGINS = [
    'http://localhost:8080',
    'http://skillio-frontend-renan-2026.s3-website-us-east-1.amazonaws.com',  # ← URL do S3
]

# Salve e reinicie
sudo systemctl restart skillio
```

---

## 🎉 PRONTO! Seu app está no ar!

### 🌐 URLs de Acesso:

- **Frontend**: `http://skillio-frontend-SEU-BUCKET.s3-website-us-east-1.amazonaws.com`
- **Backend**: `http://3.xxx.xxx.xxx/api/v1/`
- **Admin**: `http://3.xxx.xxx.xxx/admin/`

---

## 🐛 Troubleshooting

### Backend não responde?
```bash
# Ver logs
sudo journalctl -u skillio -f

# Ver status
sudo systemctl status skillio

# Reiniciar
sudo systemctl restart skillio
```

### Frontend não conecta no backend?
1. Verifique se adicionou a URL do S3 em `CORS_ALLOWED_ORIGINS`
2. Teste o backend: `curl http://SEU-IP/api/v1/`
3. Verifique o console do navegador (F12)

### Erro 502 Bad Gateway?
```bash
# No EC2
# Verificar se Gunicorn está rodando
ps aux | grep gunicorn

# Se não estiver
sudo systemctl start skillio
```

### Erro de conexão com banco?
1. Verifique se o endpoint do RDS está correto no `~/.env`
2. Verifique se o Security Group do RDS permite conexão do EC2
3. Teste: `psql -h SEU-RDS-ENDPOINT -U postgres -d skillio_db`

---

## 📊 Monitoramento de Custos

### Configurar Billing Alert

1. Acesse: https://console.aws.amazon.com/billing/home#/budgets
2. **Create budget**
3. Configurações:
   - **Budget type**: Cost budget
   - **Budget name**: Monthly-Budget
   - **Budgeted amount**: $1.00
   - **Email recipients**: seu@email.com
4. **Create budget**

Agora você receberá email se passar de $1/mês!

---

## 🔄 Como Atualizar o App

### Atualizar Backend:
```bash
# No EC2
cd ~/Projeto_integrador
git pull origin Renan---AWS-Free-Tier
source ~/venv/bin/activate
cd backend
pip install -r requirements_prod.txt
python manage.py migrate --settings=core.settings_production
python manage.py collectstatic --noinput --settings=core.settings_production
sudo systemctl restart skillio
```

### Atualizar Frontend:
```bash
# No seu PC
cd C:\Users\RENAN\Downloads\Projeto_integrador
git pull origin Renan---AWS-Free-Tier
bash deploy_scripts/6_deploy_frontend.sh
```

---

## 📚 Próximos Passos (Opcional)

1. **Configurar HTTPS**:
   - Comprar domínio ou usar Route 53
   - Configurar Certificate Manager (ACM)
   - Criar CloudFront distribution

2. **Configurar CI/CD**:
   - GitHub Actions para deploy automático
   - Arquivo em: `.github/workflows/deploy.yml`

3. **Adicionar Monitoramento**:
   - CloudWatch logs e metrics
   - Sentry para error tracking

4. **Backup Automático**:
   - Configurar RDS automated backups
   - Snapshot do volume EC2

---

## ✅ Checklist Final

- [ ] RDS criado e acessível
- [ ] EC2 criado e SSH funcionando
- [ ] Backend rodando: `http://SEU-IP/api/v1/`
- [ ] S3 bucket criado
- [ ] Frontend acessível: `http://SEU-BUCKET.s3-website...`
- [ ] Login funciona no frontend
- [ ] Cadastro funciona
- [ ] Plano de estudo gera (IA funcionando)
- [ ] Billing alert configurado
- [ ] Documentado URLs e senhas em local seguro

---

## 🆘 Precisa de Ajuda?

Se algo der errado, me avise com:
1. O erro exato que apareceu
2. O comando que você rodou
3. Os logs: `sudo journalctl -u skillio -n 50`

**Boa sorte com o deploy! 🚀**
