# Comandos Úteis - AWS Deploy

## 🔍 Monitoramento e Debug

### Ver logs em tempo real
```bash
# Logs do Django/Gunicorn
sudo journalctl -u skillio -f

# Logs do Nginx
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/skillio_access.log

# Logs do Django (se configurado)
sudo tail -f /var/log/django/error.log
```

### Status dos serviços
```bash
# Status do backend
sudo systemctl status skillio

# Status do Nginx
sudo systemctl status nginx

# Verificar se está escutando na porta
sudo netstat -tulnp | grep 8000
sudo netstat -tulnp | grep 80
```

### Reiniciar serviços
```bash
# Reiniciar backend
sudo systemctl restart skillio

# Reiniciar Nginx
sudo systemctl restart nginx

# Reiniciar ambos
sudo systemctl restart skillio nginx
```

---

## 🗄️ Banco de Dados

### Conectar ao RDS
```bash
# Conectar via psql
psql -h SEU-RDS-ENDPOINT.rds.amazonaws.com -U postgres -d skillio_db

# Com senha inline (não recomendado em produção)
PGPASSWORD=sua_senha psql -h ENDPOINT -U postgres -d skillio_db
```

### Queries úteis
```sql
-- Ver tabelas
\dt

-- Ver usuários
SELECT id, username, email, date_joined FROM api_user LIMIT 10;

-- Contar usuários
SELECT COUNT(*) FROM api_user;

-- Ver planos de estudo
SELECT id, usuario_id, created_at FROM api_planodeestudo ORDER BY created_at DESC LIMIT 5;

-- Sair
\q
```

### Fazer backup
```bash
# Backup do banco
pg_dump -h RDS-ENDPOINT -U postgres -d skillio_db > backup-$(date +%Y%m%d).sql

# Restaurar backup
psql -h RDS-ENDPOINT -U postgres -d skillio_db < backup-20260209.sql
```

---

## 🚀 Deploy e Atualização

### Atualizar código backend
```bash
# SSH no EC2
ssh -i skillio-key.pem ubuntu@SEU-IP

# Atualizar código
cd ~/Projeto_integrador
git pull origin Renan---AWS-Free-Tier

# Ativar ambiente virtual
source ~/venv/bin/activate

# Atualizar dependências
cd backend
pip install -r requirements_prod.txt

# Rodar migrações
python manage.py migrate --settings=core.settings_production

# Coletar static files
python manage.py collectstatic --noinput --settings=core.settings_production

# Reiniciar serviço
sudo systemctl restart skillio

# Verificar se subiu
sudo systemctl status skillio
```

### Atualizar frontend
```bash
# No seu PC
cd C:\Users\RENAN\Downloads\Projeto_integrador
git pull origin Renan---AWS-Free-Tier

cd Frontend
npm install
npm run build

# Upload para S3
aws s3 sync dist/ s3://SEU-BUCKET --delete

# Limpar cache do CloudFront (se usar)
aws cloudfront create-invalidation \
  --distribution-id SEU-DISTRIBUTION-ID \
  --paths "/*"
```

---

## 🐛 Debug e Troubleshooting

### Testar aplicação Django manualmente
```bash
# SSH no EC2
cd ~/Projeto_integrador/backend
source ~/venv/bin/activate

# Rodar servidor de desenvolvimento (teste apenas!)
python manage.py runserver 0.0.0.0:8001 --settings=core.settings_production

# Em outra janela, testar
curl http://localhost:8001/api/v1/
```

### Testar Gunicorn manualmente
```bash
source ~/venv/bin/activate
cd ~/Projeto_integrador/backend

# Carregar variáveis de ambiente
export $(cat ~/.env | grep -v '^#' | xargs)

# Rodar Gunicorn manualmente
gunicorn core.wsgi:application --bind 0.0.0.0:8000 --workers 3
```

### Verificar variáveis de ambiente
```bash
# Ver arquivo .env
cat ~/.env

# Ver variáveis carregadas no serviço
sudo systemctl show skillio | grep Environment
```

### Verificar configuração do Nginx
```bash
# Testar configuração
sudo nginx -t

# Ver configuração atual
cat /etc/nginx/sites-available/skillio

# Recarregar configuração (sem downtime)
sudo nginx -s reload
```

---

## 💰 Monitoramento de Custos

### Ver custos do mês atual (AWS CLI)
```bash
# Custos totais
aws ce get-cost-and-usage \
  --time-period Start=2026-02-01,End=2026-02-28 \
  --granularity MONTHLY \
  --metrics BlendedCost

# Custos por serviço
aws ce get-cost-and-usage \
  --time-period Start=2026-02-01,End=2026-02-28 \
  --granularity MONTHLY \
  --metrics BlendedCost \
  --group-by Type=DIMENSION,Key=SERVICE
```

### Listar recursos ativos
```bash
# Listar instâncias EC2
aws ec2 describe-instances --query 'Reservations[*].Instances[*].[InstanceId,State.Name,InstanceType]' --output table

# Listar bancos RDS
aws rds describe-db-instances --query 'DBInstances[*].[DBInstanceIdentifier,DBInstanceStatus,DBInstanceClass]' --output table

# Listar buckets S3
aws s3 ls

# Listar volumes EBS
aws ec2 describe-volumes --query 'Volumes[*].[VolumeId,State,Size]' --output table
```

---

## 📊 Performance e Otimização

### Ver uso de recursos no EC2
```bash
# Uso de CPU e memória
top

# Uso de disco
df -h

# Processos Python
ps aux | grep python

# Processos Gunicorn
ps aux | grep gunicorn

# Conexões ativas
sudo netstat -tulnp | grep ESTABLISHED
```

### Analisar logs por erros
```bash
# Erros no Django
sudo journalctl -u skillio --since "1 hour ago" | grep ERROR

# Erros no Nginx
sudo tail -100 /var/log/nginx/error.log

# Requests mais lentos
sudo cat /var/log/django/access.log | sort -k 10 -r | head -20
```

---

## 🔐 Segurança

### Atualizar senha do RDS
```sql
-- Conectar ao RDS e executar
ALTER USER postgres WITH PASSWORD 'nova_senha_segura';
```

```bash
# Atualizar no .env
nano ~/.env
# Mudar DB_PASSWORD

# Reiniciar backend
sudo systemctl restart skillio
```

### Gerar nova SECRET_KEY
```bash
# Gerar nova key
python3 -c "import secrets; print(secrets.token_urlsafe(50))"

# Atualizar .env
nano ~/.env
# Mudar DJANGO_SECRET_KEY

# Reiniciar backend
sudo systemctl restart skillio
```

### Verificar acessos SSH
```bash
# Ver tentativas de login
sudo tail -100 /var/log/auth.log | grep ssh

# Ver logins bem-sucedidos
last
```

---

## 🧹 Limpeza e Manutenção

### Limpar logs antigos
```bash
# Limpar logs do journalctl (manter últimos 7 dias)
sudo journalctl --vacuum-time=7d

# Limpar logs do Nginx (manter últimos 30 dias)
sudo find /var/log/nginx -name "*.log" -mtime +30 -delete
```

### Limpar cache do pip
```bash
pip cache purge
```

### Deletar snapshots antigos do RDS
```bash
# Listar snapshots
aws rds describe-db-snapshots --query 'DBSnapshots[*].[DBSnapshotIdentifier,SnapshotCreateTime]' --output table

# Deletar snapshot específico
aws rds delete-db-snapshot --db-snapshot-identifier SNAPSHOT-ID
```

---

## 🆘 Comandos de Emergência

### Parar completamente a aplicação
```bash
# Parar backend
sudo systemctl stop skillio

# Parar Nginx
sudo systemctl stop nginx
```

### Rollback para versão anterior
```bash
cd ~/Projeto_integrador
git log --oneline -10  # Ver commits recentes
git checkout COMMIT-HASH  # Voltar para commit específico
bash deploy_scripts/3_install_app.sh  # Reinstalar
sudo systemctl restart skillio
```

### Restaurar banco de dados
```bash
# ⚠️ CUIDADO: Isto apaga todos os dados atuais!

# Conectar ao RDS
psql -h RDS-ENDPOINT -U postgres -d skillio_db

# Dropar e recriar banco
DROP DATABASE skillio_db;
CREATE DATABASE skillio_db;
\q

# Restaurar backup
psql -h RDS-ENDPOINT -U postgres -d skillio_db < backup-20260209.sql

# Reiniciar backend
sudo systemctl restart skillio
```

---

## 📱 Comandos Quick Reference

```bash
# Status geral
sudo systemctl status skillio nginx

# Ver logs
sudo journalctl -u skillio -f

# Reiniciar tudo
sudo systemctl restart skillio nginx

# Ver uso de recursos
top

# Testar API
curl http://localhost/api/v1/

# SSH
ssh -i skillio-key.pem ubuntu@SEU-IP

# Deploy frontend
bash deploy_scripts/6_deploy_frontend.sh
```

---

## 📚 Recursos Úteis

- **AWS Console**: https://console.aws.amazon.com/
- **EC2 Dashboard**: https://console.aws.amazon.com/ec2/
- **RDS Dashboard**: https://console.aws.amazon.com/rds/
- **S3 Dashboard**: https://console.aws.amazon.com/s3/
- **Billing**: https://console.aws.amazon.com/billing/
- **Cost Explorer**: https://console.aws.amazon.com/cost-management/home#/cost-explorer

**Documentação:**
- Django: https://docs.djangoproject.com/
- Gunicorn: https://docs.gunicorn.org/
- Nginx: https://nginx.org/en/docs/
- AWS Free Tier: https://aws.amazon.com/free/
