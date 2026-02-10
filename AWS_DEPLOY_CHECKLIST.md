# ✅ CHECKLIST DE DEPLOY AWS

Use este checklist para garantir que não esqueceu nenhum passo!

---

## 📋 PRÉ-DEPLOY

### Preparação Local
- [ ] Código commitado no GitHub (branch: Renan---AWS-Free-Tier)
- [ ] Build local funciona: `cd Frontend && npm run build`
- [ ] Testes passando: `cd backend && python manage.py test`
- [ ] Arquivo requirements_prod.txt criado
- [ ] Scripts de deploy criados em `deploy_scripts/`

### Informações Necessárias
- [ ] **Anthropic API Key** (https://console.anthropic.com/)
- [ ] **ReCAPTCHA Keys** (https://www.google.com/recaptcha/)
- [ ] **Email para notificações** (billing alerts)

### Ferramentas Instaladas
- [ ] AWS CLI instalado: `aws --version`
- [ ] AWS CLI configurado: `aws sts get-caller-identity`
- [ ] Git Bash ou WSL (para rodar scripts .sh)
- [ ] SSH client (Git Bash já tem)

---

## 🎯 FASE 1: CRIAR RECURSOS AWS

### Conta AWS
- [ ] Conta AWS criada e verificada
- [ ] Cartão de crédito adicionado
- [ ] MFA ativado (recomendado)
- [ ] Billing alerts configurados ($1/mês)

### RDS PostgreSQL
- [ ] RDS criado (db.t3.micro, Free Tier)
- [ ] Database name: `skillio_db`
- [ ] Master username: `postgres`
- [ ] **📝 Endpoint anotado**: `skillio-db.xxxxx.rds.amazonaws.com`
- [ ] **📝 Password anotado**: `____________`
- [ ] Status: Available

### Security Groups
- [ ] Security Group EC2 criado: `skillio-backend-sg`
  - [ ] SSH (22) - Meu IP
  - [ ] HTTP (80) - 0.0.0.0/0
  - [ ] HTTPS (443) - 0.0.0.0/0
- [ ] Security Group RDS atualizado
  - [ ] PostgreSQL (5432) - Source: skillio-backend-sg

### EC2 Instance
- [ ] EC2 criado (t2.micro, Ubuntu 22.04, Free Tier)
- [ ] Key pair criado e baixado: `skillio-key.pem`
- [ ] Security group: `skillio-backend-sg`
- [ ] **📝 IP Público anotado**: `3.___.___.___ `
- [ ] Status: Running
- [ ] SSH funciona: `ssh -i skillio-key.pem ubuntu@IP`

---

## 🎯 FASE 2: CONFIGURAR BACKEND (EC2)

### Conexão e Setup Inicial
- [ ] Conectado via SSH ao EC2
- [ ] Repositório clonado: `git clone https://github.com/renaneliakim1/Projeto_integrador.git`
- [ ] Script 1 executado: `bash deploy_scripts/1_setup_ec2.sh`
  - [ ] Python 3 instalado
  - [ ] Nginx instalado
  - [ ] PostgreSQL client instalado
  - [ ] Ambiente virtual criado

### Variáveis de Ambiente
- [ ] Script 2 executado: `bash deploy_scripts/2_setup_env.sh`
- [ ] Arquivo `~/.env` criado
- [ ] Arquivo `~/.env` editado com valores reais:
  - [ ] `DB_PASSWORD` = senha do RDS
  - [ ] `DB_HOST` = endpoint do RDS
  - [ ] `ANTHROPIC_API_KEY` = sua key
  - [ ] `DJANGO_SECRET_KEY` gerada automaticamente ✅

### Instalação da Aplicação
- [ ] Script 3 executado: `bash deploy_scripts/3_install_app.sh`
  - [ ] Dependências instaladas
  - [ ] Conexão com banco testada
  - [ ] Migrações executadas
  - [ ] Superuser criado (opcional)
  - [ ] Arquivos estáticos coletados

### Servidor Web
- [ ] Script 4 executado: `bash deploy_scripts/4_setup_nginx.sh`
  - [ ] Configuração do Nginx criada
  - [ ] Teste do Nginx passou
  - [ ] Nginx reiniciado
- [ ] Script 5 executado: `bash deploy_scripts/5_setup_systemd.sh`
  - [ ] Serviço systemd criado
  - [ ] Gunicorn iniciado
  - [ ] Serviço habilitado para auto-start

### Testes Backend
- [ ] API responde: `curl http://localhost/api/v1/`
- [ ] API responde externamente: `http://IP-DO-EC2/api/v1/`
- [ ] Admin acessível: `http://IP-DO-EC2/admin/`
- [ ] Logs sem erros: `sudo journalctl -u skillio -n 50`

---

## 🎯 FASE 3: DEPLOY FRONTEND (S3)

### Criar Bucket S3
- [ ] Script 6 executado no PC: `bash deploy_scripts/6_deploy_frontend.sh`
- [ ] Nome do bucket escolhido: `skillio-frontend-__________`
- [ ] Bucket criado e público
- [ ] Website estático habilitado
- [ ] Bucket policy configurada

### Build e Upload
- [ ] `.env.production` criado com URL do backend
- [ ] `npm install` executado
- [ ] `npm run build` executado sem erros
- [ ] Pasta `dist/` criada
- [ ] Upload para S3 concluído
- [ ] **📝 URL do S3 anotada**: `http://skillio-frontend-_____.s3-website-us-east-1.amazonaws.com`

### Testes Frontend
- [ ] Frontend acessível pela URL do S3
- [ ] Página inicial carrega
- [ ] Console do navegador sem erros (F12)

---

## 🎯 FASE 4: INTEGRAÇÃO FRONTEND ↔ BACKEND

### Atualizar Backend
- [ ] IP do EC2 adicionado em `ALLOWED_HOSTS` (settings_production.py)
- [ ] URL do S3 adicionada em `CSRF_TRUSTED_ORIGINS`
- [ ] URL do S3 adicionada em `CORS_ALLOWED_ORIGINS`
- [ ] Serviço reiniciado: `sudo systemctl restart skillio`

### Atualizar Frontend (se necessário)
- [ ] VITE_API_URL correto no `.env.production`
- [ ] Rebuild: `npm run build`
- [ ] Reupload: `aws s3 sync dist/ s3://BUCKET --delete`

---

## 🎯 FASE 5: TESTES FINAIS

### Funcionalidades Básicas
- [ ] **Cadastro**: Criar nova conta funciona
- [ ] **Login**: Login com credenciais funciona
- [ ] **Perfil**: Visualizar e editar perfil funciona
- [ ] **Upload**: Upload de foto de perfil funciona
- [ ] **Logout**: Logout funciona

### Funcionalidades Principais
- [ ] **Quiz**: Responder quiz inicial funciona
- [ ] **Plano de Estudo**: Gerar plano funciona (IA responde)
- [ ] **Blocos**: Visualizar blocos do plano funciona
- [ ] **Marcar Completo**: Marcar bloco como completo funciona
- [ ] **Gamificação**: XP e nível atualizam
- [ ] **Conquistas**: Conquistas desbloqueiam

### Segurança e Performance
- [ ] CSRF token funciona (nenhum erro 403)
- [ ] CORS configurado (nenhum erro de origem)
- [ ] Imagens carregam
- [ ] API responde em < 3s (requests normais)
- [ ] IA responde em < 30s

---

## 🎯 FASE 6: PÓS-DEPLOY

### Monitoramento de Custos
- [ ] Billing alert configurado ($1/mês)
- [ ] CloudWatch dashboard criado (opcional)
- [ ] Email de notificação testado

### Backup e Segurança
- [ ] RDS automated backup habilitado (7 dias)
- [ ] Volume EC2 com snapshot (opcional)
- [ ] Arquivo `.pem` guardado em local seguro
- [ ] Senhas documentadas em local seguro

### Documentação
- [ ] **📝 Informações anotadas**:
  ```
  RDS Endpoint: ___________________________
  RDS Password: ___________________________
  EC2 IP: _________________________________
  S3 Bucket: ______________________________
  Frontend URL: ___________________________
  Backend URL: ____________________________
  Admin URL: ______________________________
  ```
- [ ] README.md atualizado com URLs de produção
- [ ] Equipe notificada (se houver)

---

## 🚨 TROUBLESHOOTING

### Se algo não funcionar:

#### Backend não responde (502 Bad Gateway)
```bash
# Ver status
sudo systemctl status skillio

# Ver logs
sudo journalctl -u skillio -f

# Reiniciar
sudo systemctl restart skillio
```

#### Frontend não conecta no backend (CORS Error)
1. Verificar `CORS_ALLOWED_ORIGINS` no settings_production.py
2. Verificar se URL do S3 está correta
3. Reiniciar backend: `sudo systemctl restart skillio`

#### Erro de banco de dados
```bash
# Testar conexão
psql -h RDS-ENDPOINT -U postgres -d skillio_db

# Ver variáveis de ambiente
cat ~/.env

# Ver logs do Django
sudo journalctl -u skillio -n 100
```

#### Erro 404 no frontend (ao recarregar página)
- S3 configurado como website? ✅
- Error document = index.html? ✅

---

## 📊 CUSTOS ESPERADOS

### Primeiros 12 meses (Free Tier): **$0-2/mês**

Após 12 meses:
- EC2 t2.micro: ~$8/mês (ou mude para Lightsail $3.50/mês)
- RDS db.t3.micro: ~$15/mês (ou mude para Lightsail $15/mês)
- S3: ~$0.50/mês
- Data Transfer: ~$1/mês
- **Total: ~$25/mês**

Alternativas mais baratas:
- Migrar para Render/Railway: $0-10/mês
- Usar Vercel + PlanetScale: $0/mês

---

## ✅ CHECKLIST FINAL

- [ ] ✅ RDS rodando
- [ ] ✅ EC2 rodando
- [ ] ✅ S3 configurado
- [ ] ✅ Backend responde
- [ ] ✅ Frontend carrega
- [ ] ✅ Login funciona
- [ ] ✅ IA funciona
- [ ] ✅ Billing alert configurado
- [ ] ✅ URLs documentadas
- [ ] ✅ Senhas guardadas
- [ ] ✅ Equipe notificada

---

## 🎉 PARABÉNS!

Seu app está no ar! 🚀

**Links úteis:**
- AWS Console: https://console.aws.amazon.com/
- RDS: https://console.aws.amazon.com/rds/
- EC2: https://console.aws.amazon.com/ec2/
- S3: https://console.aws.amazon.com/s3/
- Billing: https://console.aws.amazon.com/billing/

**Próximo deploy (atualização):**
1. Commit código no GitHub
2. SSH no EC2: `git pull && bash scripts/update.sh`
3. Frontend: `bash deploy_scripts/6_deploy_frontend.sh`

**Precisa de ajuda?** Me envie:
- O erro completo
- Logs: `sudo journalctl -u skillio -n 100`
- Prints do console do navegador (F12)
