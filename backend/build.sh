#!/usr/bin/env bash
# Build script para Render - Backend Django
# Este script é executado automaticamente no deploy

set -o errexit  # Exit on error

echo "📦 Instalando dependências Python..."
pip install --upgrade pip
pip install -r requirements.txt

echo "📊 Coletando arquivos estáticos..."
python manage.py collectstatic --no-input

echo "🗄️ Executando migrações do banco de dados..."
python manage.py migrate

echo "✅ Build concluído com sucesso!"
