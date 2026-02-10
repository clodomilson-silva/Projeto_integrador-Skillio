#!/bin/bash
################################################################################
# Script de Update Frontend
# Execute no seu PC para atualizar o frontend no S3
################################################################################

set -e

echo "🚀 Atualizando Frontend no S3..."
echo "================================================"

# Solicitar nome do bucket
if [ -z "$1" ]; then
    echo "📦 Digite o nome do bucket S3:"
    read -r BUCKET_NAME
else
    BUCKET_NAME=$1
fi

if [ -z "$BUCKET_NAME" ]; then
    echo "❌ Nome do bucket não pode ser vazio!"
    exit 1
fi

# Verificar se bucket existe
if ! aws s3 ls "s3://$BUCKET_NAME" &> /dev/null; then
    echo "❌ Bucket $BUCKET_NAME não encontrado!"
    echo "   Verifique o nome ou execute: bash deploy_scripts/6_deploy_frontend.sh"
    exit 1
fi

echo "✅ Bucket encontrado: $BUCKET_NAME"

# Ir para diretório frontend
cd Frontend

# Verificar se .env.production existe
if [ ! -f .env.production ]; then
    echo ""
    echo "⚠️  Arquivo .env.production não encontrado!"
    echo "   Copie de .env.production.example:"
    cp .env.production.example .env.production
    echo "   ✅ Arquivo criado. EDITE com suas configurações!"
    nano .env.production
fi

# Build
echo ""
echo "🏗️  Building frontend..."
npm install --silent
npm run build

if [ ! -d "dist" ]; then
    echo "❌ Erro no build!"
    exit 1
fi

echo "✅ Build concluído!"

# Upload para S3
echo ""
echo "☁️  Fazendo upload para S3..."
aws s3 sync dist/ "s3://$BUCKET_NAME" \
    --delete \
    --cache-control "max-age=31536000,public" \
    --exclude "index.html" \
    --exclude "robots.txt"

# index.html sem cache (sempre busca versão nova)
aws s3 cp dist/index.html "s3://$BUCKET_NAME/index.html" \
    --cache-control "no-cache, no-store, must-revalidate"

# robots.txt sem cache
if [ -f dist/robots.txt ]; then
    aws s3 cp dist/robots.txt "s3://$BUCKET_NAME/robots.txt" \
        --cache-control "no-cache"
fi

WEBSITE_URL="http://$BUCKET_NAME.s3-website-us-east-1.amazonaws.com"

echo ""
echo "✅ Frontend atualizado com sucesso!"
echo ""
echo "🌐 URL: $WEBSITE_URL"
echo ""
echo "💡 Dicas:"
echo "   - Limpe o cache do navegador (Ctrl+Shift+R)"
echo "   - Teste em modo anônimo para verificar"
echo ""
