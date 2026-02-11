#!/bin/bash
#═══════════════════════════════════════════════════════════
# SKILLIO - Setup Completo do Backend no EC2
#═══════════════════════════════════════════════════════════

set -e  # Para em caso de erro

echo "═══════════════════════════════════════════════════════════"
echo "    SKILLIO - INSTALAÇÃO AUTOMÁTICA DO BACKEND"
echo "═══════════════════════════════════════════════════════════"
echo ""

# Cores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Informações do RDS
DB_HOST="database-1.ctg0eyqokqwa.us-east-2.rds.amazonaws.com"
DB_NAME="skillio_db"
DB_USER="postgres"
DB_PASSWORD="Skillio*7"
DB_PORT="5432"

echo -e "${YELLOW}[1/8] Atualizando sistema...${NC}"
sudo apt-get update -y
sudo apt-get upgrade -y

echo -e "${YELLOW}[2/8] Instalando dependências do sistema...${NC}"
sudo apt-get install -y \
    python3 \
    python3-pip \
    python3-venv \
    python3-dev \
    nginx \
    postgresql-client \
    git \
    build-essential \
    libpq-dev \
    curl

echo -e "${YELLOW}[3/8] Clonando repositório...${NC}"
cd ~
if [ -d "Projeto_integrador" ]; then
    echo "Repositório já existe, atualizando..."
    cd Projeto_integrador
    git pull
else
    git clone https://github.com/renaneliakim1/Projeto_integrador.git
    cd Projeto_integrador
fi

echo -e "${YELLOW}[4/8] Mudando para branch AWS...${NC}"
git checkout Renan---AWS-Free-Tier || git checkout -b Renan---AWS-Free-Tier

echo -e "${YELLOW}[5/8] Criando ambiente virtual Python...${NC}"
cd ~/Projeto_integrador/backend
python3 -m venv venv
source venv/bin/activate

echo -e "${YELLOW}[6/8] Instalando dependências Python...${NC}"
pip install --upgrade pip
if [ -f "requirements_prod.txt" ]; then
    pip install -r requirements_prod.txt
else
    pip install -r requirements.txt
fi

# Instalar gunicorn
pip install gunicorn psycopg2-binary

echo -e "${YELLOW}[7/8] Configurando variáveis de ambiente...${NC}"
cat > ~/.env << EOF
# Django
DEBUG=0
SECRET_KEY=$(python3 -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())')
ALLOWED_HOSTS=localhost,127.0.0.1,3.142.80.221,ec2-3-142-80-221.us-east-2.compute.amazonaws.com

# Database
DB_ENGINE=django.db.backends.postgresql
DB_NAME=${DB_NAME}
DB_USER=${DB_USER}
DB_PASSWORD=${DB_PASSWORD}
DB_HOST=${DB_HOST}
DB_PORT=${DB_PORT}

# APIs (IMPORTANTE: Adicionar suas keys depois!)
# ANTHROPIC_API_KEY=sua-chave-aqui
# RECAPTCHA_SITE_KEY=sua-chave-aqui
# RECAPTCHA_SECRET_KEY=sua-chave-aqui

# CORS
CORS_ALLOWED_ORIGINS=http://3.142.80.221,http://localhost:5173

# Email (opcional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EOF

# Copiar .env para o diretório do backend
cp ~/.env ~/Projeto_integrador/backend/.env

echo -e "${YELLOW}[8/8] Testando conexão com banco de dados...${NC}"
export $(cat ~/.env | xargs)
PGPASSWORD=${DB_PASSWORD} psql -h ${DB_HOST} -U ${DB_USER} -d ${DB_NAME} -c "SELECT version();" || {
    echo -e "${YELLOW}⚠️  Não conseguiu conectar ao banco. Verifique as credenciais.${NC}"
}

echo -e "${YELLOW}Executando migrações...${NC}"
cd ~/Projeto_integrador/backend
source venv/bin/activate
python manage.py migrate --noinput

echo -e "${YELLOW}Coletando arquivos estáticos...${NC}"
python manage.py collectstatic --noinput

echo -e "${GREEN}✅ Setup básico concluído!${NC}"
echo ""
echo "═══════════════════════════════════════════════════════════"
echo "    PRÓXIMOS PASSOS:"
echo "═══════════════════════════════════════════════════════════"
echo ""
echo "1. Edite o arquivo ~/.env e adicione suas API keys:"
echo "   nano ~/.env"
echo ""
echo "2. Execute o script de configuração do Nginx e Gunicorn:"
echo "   cd ~/Projeto_integrador"
echo "   bash deploy_scripts/4_setup_nginx.sh"
echo "   bash deploy_scripts/5_setup_systemd.sh"
echo ""
echo "3. Teste o backend:"
echo "   curl http://localhost/api/v1/"
echo ""
echo "═══════════════════════════════════════════════════════════"
