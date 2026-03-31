#!/bin/bash
################################################################################
# Script 6: Deploy Frontend para S3
# Execute este script NO SEU PC LOCAL (Windows Git Bash ou WSL)
################################################################################

set -e

echo "🚀 Deploy do Frontend para AWS S3..."
echo "================================================"

# Verificar se AWS CLI está instalado
if ! command -v aws &> /dev/null; then
    echo "❌ AWS CLI não encontrado!"
    echo "   Instale: pip install awscli"
    echo "   Configure: aws configure"
    exit 1
fi

# Verificar se está configurado
if ! aws sts get-caller-identity &> /dev/null; then
    echo "❌ AWS CLI não configurado!"
    echo "   Execute: aws configure"
    exit 1
fi

echo "✅ AWS CLI configurado"

# Solicitar nome do bucket
echo ""
echo "📦 Digite o nome do bucket S3 (deve ser único globalmente):"
echo "   Exemplo: skillio-frontend-$(whoami)-$(date +%Y)"
read -r BUCKET_NAME

if [ -z "$BUCKET_NAME" ]; then
    echo "❌ Nome do bucket não pode ser vazio!"
    exit 1
fi

# Criar bucket se não existir
echo ""
echo "📦 Verificando bucket $BUCKET_NAME..."
if aws s3 ls "s3://$BUCKET_NAME" 2>&1 | grep -q 'NoSuchBucket'; then
    echo "📦 Criando bucket..."
    aws s3 mb "s3://$BUCKET_NAME" --region us-east-1
    
    # Configurar como website
    echo "🌐 Configurando como website estático..."
    aws s3 website "s3://$BUCKET_NAME" --index-document index.html --error-document index.html
    
    # Configurar política pública
    cat > /tmp/bucket-policy.json << EOF
{
  "Version": "2012-10-17",
  "Statement": [{
    "Sid": "PublicReadGetObject",
    "Effect": "Allow",
    "Principal": "*",
    "Action": "s3:GetObject",
    "Resource": "arn:aws:s3:::$BUCKET_NAME/*"
  }]
}
EOF
    
    aws s3api put-bucket-policy --bucket "$BUCKET_NAME" --policy file:///tmp/bucket-policy.json
    rm /tmp/bucket-policy.json
    
    echo "✅ Bucket criado e configurado!"
else
    echo "✅ Bucket já existe"
fi

# Build do frontend
echo ""
echo "🏗️  Building frontend..."
cd Frontend

# Criar .env.production se não existir
if [ ! -f .env.production ]; then
    # Tentar obter IP do EC2 do backend
    echo ""
    echo "📝 Digite o IP ou domínio do backend:"
    echo "   Exemplo: http://3.123.45.67"
    read -r BACKEND_URL
    
    cat > .env.production << EOF
VITE_API_URL=$BACKEND_URL/api/v1
# VITE_RECAPTCHA_SITE_KEY=sua-chave-aqui
EOF
    
    echo "✅ Arquivo .env.production criado"
fi

# Instalar dependências e buildar
npm install
npm run build

if [ ! -d "dist" ]; then
    echo "❌ Erro no build! Pasta dist/ não foi criada"
    exit 1
fi

echo "✅ Build concluído!"

# Upload para S3
echo ""
echo "☁️  Fazendo upload para S3..."
aws s3 sync dist/ "s3://$BUCKET_NAME" --delete --cache-control "max-age=31536000,public"

# URL do website
WEBSITE_URL="http://$BUCKET_NAME.s3-website-us-east-1.amazonaws.com"

echo ""
echo "🎉 Deploy do frontend concluído!"
echo ""
echo "🌐 Frontend disponível em:"
echo "   $WEBSITE_URL"
echo ""
echo "📋 Próximos passos:"
echo "   1. Teste o frontend em: $WEBSITE_URL"
echo "   2. Atualize CSRF_TRUSTED_ORIGINS no backend com esta URL"
echo "   3. (Opcional) Configure CloudFront para HTTPS"
echo ""
echo "💡 Para atualizar o frontend, execute este script novamente"
echo ""
