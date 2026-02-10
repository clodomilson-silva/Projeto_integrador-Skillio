#!/bin/bash
################################################################################
# Script 2: Configurar Variáveis de Ambiente
# Execute após o script 1
################################################################################

set -e

echo "🔐 Configurando variáveis de ambiente..."
echo "================================================"

# Gerar SECRET_KEY Django
echo "🔑 Gerando SECRET_KEY segura..."
DJANGO_SECRET=$(python3 -c "import secrets; print(secrets.token_urlsafe(50))")

# Criar arquivo .env
cat > ~/.env << EOF
# ============================================
# CONFIGURAÇÕES DE PRODUÇÃO - SKILLIO
# ============================================

# Django
DJANGO_SECRET_KEY=${DJANGO_SECRET}
DJANGO_SETTINGS_MODULE=core.settings_production
DEBUG=False

# Database (RDS PostgreSQL)
# ⚠️ PREENCHA COM OS DADOS DO SEU RDS APÓS CRIAR!
DB_NAME=skillio_db
DB_USER=postgres
DB_PASSWORD=ALTERE_AQUI_SUA_SENHA_RDS
DB_HOST=ALTERE_AQUI_SEU_RDS_ENDPOINT
DB_PORT=5432

# AWS S3 (opcional - para armazenar mídia)
# Se não usar S3, deixe USE_S3=FALSE e mídia ficará no EC2
USE_S3=FALSE
# AWS_ACCESS_KEY_ID=sua-access-key-aqui
# AWS_SECRET_ACCESS_KEY=sua-secret-key-aqui
# AWS_STORAGE_BUCKET_NAME=skillio-media
# AWS_S3_REGION_NAME=us-east-1

# API Keys
ANTHROPIC_API_KEY=ALTERE_AQUI_SUA_ANTHROPIC_KEY
# RECAPTCHA_SECRET_KEY=sua-key-aqui

# Segurança (descomente após configurar HTTPS)
# SECURE_SSL_REDIRECT=True
# SESSION_COOKIE_SECURE=True
# CSRF_COOKIE_SECURE=True

EOF

chmod 600 ~/.env

echo ""
echo "✅ Arquivo .env criado em: ~/.env"
echo ""
echo "📝 SECRET_KEY gerada automaticamente: ✅"
echo ""
echo "⚠️  IMPORTANTE: Agora você DEVE editar o arquivo .env:"
echo ""
echo "   nano ~/.env"
echo ""
echo "   Preencha os seguintes campos:"
echo "   1. DB_PASSWORD - Senha do seu RDS"
echo "   2. DB_HOST - Endpoint do seu RDS (ex: skillio-db.xxxxx.rds.amazonaws.com)"
echo "   3. ANTHROPIC_API_KEY - Sua chave da Anthropic"
echo ""
echo "📋 Após editar, execute: bash deploy_scripts/3_install_app.sh"
echo ""
