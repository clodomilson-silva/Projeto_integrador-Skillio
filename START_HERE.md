# 🚀 AWS Deploy - Início Rápido

Tudo está preparado para o deploy! Siga este guia simplificado.

---

## 📁 Arquivos Criados

### Backend:
- ✅ `backend/core/settings_production.py` - Configurações de produção
- ✅ `backend/requirements_prod.txt` - Dependências otimizadas

### Scripts de Deploy:
- ✅ `deploy_scripts/1_setup_ec2.sh` - Setup inicial do EC2
- ✅ `deploy_scripts/2_setup_env.sh` - Configurar variáveis de ambiente
- ✅ `deploy_scripts/3_install_app.sh` - Instalar aplicação
- ✅ `deploy_scripts/4_setup_nginx.sh` - Configurar Nginx
- ✅ `deploy_scripts/5_setup_systemd.sh` - Configurar serviço
- ✅ `deploy_scripts/6_deploy_frontend.sh` - Deploy frontend S3
- ✅ `deploy_scripts/update_backend.sh` - Atualização rápida backend
- ✅ `deploy_scripts/update_frontend.sh` - Atualização rápida frontend

### Documentação:
- ✅ `AWS_DEPLOY_GUIDE.md` - Guia completo passo-a-passo
- ✅ `AWS_DEPLOY_CHECKLIST.md` - Checklist detalhado
- ✅ `AWS_USEFUL_COMMANDS.md` - Comandos úteis

### Frontend:
- ✅ `Frontend/.env.production.example` - Template de variáveis

---

## 🎯 Como Começar (Resumo)

### 1️⃣ Criar Conta AWS (10 min)
1. Acesse: https://aws.amazon.com/free/
2. Crie conta gratuita
3. Instale AWS CLI: `pip install awscli`
4. Configure: `aws configure`

### 2️⃣ Criar Recursos AWS (15 min)
Siga o guia: **[AWS_DEPLOY_GUIDE.md](AWS_DEPLOY_GUIDE.md)**

Você vai criar:
- RDS PostgreSQL (banco de dados)
- EC2 Ubuntu (servidor backend)
- S3 Bucket (frontend)

### 3️⃣ Deploy Backend (20 min)
```bash
# SSH no EC2
ssh -i skillio-key.pem ubuntu@SEU-IP

# Clonar repositório
git clone https://github.com/renaneliakim1/Projeto_integrador.git
cd Projeto_integrador

# Executar scripts na ordem
bash deploy_scripts/1_setup_ec2.sh
bash deploy_scripts/2_setup_env.sh
nano ~/.env  # ⚠️ EDITE com suas configurações!
bash deploy_scripts/3_install_app.sh
bash deploy_scripts/4_setup_nginx.sh
bash deploy_scripts/5_setup_systemd.sh
```

### 4️⃣ Deploy Frontend (10 min)
```bash
# No seu PC
cd C:\Users\RENAN\Downloads\Projeto_integrador
bash deploy_scripts/6_deploy_frontend.sh
```

---

## 📚 Documentação Completa

### 🔍 Ver Guia Detalhado:
```bash
# Windows
start AWS_DEPLOY_GUIDE.md

# Ou abra no VS Code
code AWS_DEPLOY_GUIDE.md
```

### ✅ Usar Checklist:
```bash
# Abra e marque cada item conforme avança
code AWS_DEPLOY_CHECKLIST.md
```

### 💻 Comandos Úteis:
```bash
# Depois do deploy, use estes comandos
code AWS_USEFUL_COMMANDS.md
```

---

## 🔄 Atualizações Futuras

### Atualizar Backend:
```bash
# SSH no EC2
ssh -i skillio-key.pem ubuntu@SEU-IP

# Execute o script de atualização
bash ~/Projeto_integrador/deploy_scripts/update_backend.sh
```

### Atualizar Frontend:
```bash
# No seu PC
cd C:\Users\RENAN\Downloads\Projeto_integrador
bash deploy_scripts/update_frontend.sh SEU-BUCKET-NAME
```

---

## 🆘 Precisa de Ajuda?

### Durante o deploy:
1. Siga o **AWS_DEPLOY_GUIDE.md** passo-a-passo
2. Use o **AWS_DEPLOY_CHECKLIST.md** para não esquecer nada
3. Consulte **AWS_USEFUL_COMMANDS.md** para troubleshooting

### Após o deploy:
```bash
# Ver logs do backend
sudo journalctl -u skillio -f

# Status dos serviços
sudo systemctl status skillio nginx
```

---

## 💰 Custos

**Primeiros 12 meses:** GRÁTIS ✅
**Após 12 meses:** ~$2-5/mês (se manter uso baixo)

Configure billing alert:
1. AWS Console > Billing > Budgets
2. Create budget: $1/mês
3. Você receberá email se passar desse valor!

---

## ✨ Próximo Passo

**Abra e leia:** [AWS_DEPLOY_GUIDE.md](AWS_DEPLOY_GUIDE.md)

Está tudo explicado em detalhes com:
- 📸 Prints das telas
- 💡 Dicas importantes
- 🐛 Troubleshooting
- ✅ Validações em cada etapa

**Boa sorte com o deploy! 🚀**

---

## 📝 Informações Importantes

Anote aqui conforme for criando os recursos:

```
RDS Endpoint: _______________________________
RDS Password: _______________________________
EC2 IP Público: _____________________________
S3 Bucket Name: _____________________________
Frontend URL: _______________________________
Backend API URL: ____________________________
Admin URL: __________________________________
```

**⚠️ Guarde estas informações em local seguro!**
