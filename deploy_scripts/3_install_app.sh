#!/bin/bash
################################################################################
# Script 3: Instalar Aplicação
# Execute após configurar as variáveis de ambiente no script 2
################################################################################

set -e

echo "📦 Instalando aplicação Django..."
echo "================================================"

# Carregar variáveis de ambiente
if [ -f ~/.env ]; then
    export $(cat ~/.env | grep -v '^#' | xargs)
else
    echo "❌ Erro: Arquivo .env não encontrado!"
    echo "   Execute o script 2 primeiro: bash deploy_scripts/2_setup_env.sh"
    exit 1
fi

# Ativar ambiente virtual
cd ~
source venv/bin/activate

# Ir para diretório do projeto
cd ~/Projeto_integrador/backend

# Instalar dependências Python
echo "📦 Instalando dependências Python..."
pip install --upgrade pip
pip install -r requirements_prod.txt

# Testar conexão com o banco
echo ""
echo "🔍 Testando conexão com o banco de dados..."
python manage.py check --settings=core.settings_production

if [ $? -eq 0 ]; then
    echo "✅ Conexão com o banco OK!"
else
    echo "❌ Erro na conexão com o banco!"
    echo "   Verifique as variáveis DB_* no arquivo ~/.env"
    exit 1
fi

# Rodar migrações
echo ""
echo "🔄 Rodando migrações do banco de dados..."
python manage.py migrate --settings=core.settings_production

# Criar superuser (opcional - comentar se não quiser)
echo ""
echo "👤 Deseja criar um superuser? (s/n)"
read -r CREATE_SUPER
if [ "$CREATE_SUPER" = "s" ] || [ "$CREATE_SUPER" = "S" ]; then
    python manage.py createsuperuser --settings=core.settings_production
fi

# Coletar arquivos estáticos
echo ""
echo "📁 Coletando arquivos estáticos..."
python manage.py collectstatic --noinput --settings=core.settings_production

echo ""
echo "✅ Aplicação instalada com sucesso!"
echo ""
echo "📋 Próximo passo:"
echo "   Execute: bash deploy_scripts/4_setup_nginx.sh"
echo ""
