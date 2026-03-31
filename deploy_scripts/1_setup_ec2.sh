#!/bin/bash
################################################################################
# Script 1: Configuração Inicial do EC2
# Execute este script DENTRO da instância EC2 após conectar via SSH
################################################################################

set -e  # Para na primeira falha

echo "🚀 Iniciando configuração do EC2 para Django..."
echo "================================================"

# Atualizar sistema
echo "📦 Atualizando pacotes do sistema..."
sudo apt update
sudo apt upgrade -y

# Instalar dependências essenciais
echo "📦 Instalando Python, pip, nginx e PostgreSQL client..."
sudo apt install -y \
    python3-pip \
    python3-venv \
    python3-dev \
    nginx \
    postgresql-client \
    git \
    curl \
    build-essential \
    libpq-dev

# Criar diretórios de log
echo "📁 Criando diretórios de log..."
sudo mkdir -p /var/log/django
sudo chown -R ubuntu:ubuntu /var/log/django

# Criar ambiente virtual Python
echo "🐍 Criando ambiente virtual Python..."
cd ~
python3 -m venv venv
source venv/bin/activate

# Verificar versões
echo ""
echo "✅ Instalações concluídas:"
echo "   Python: $(python3 --version)"
echo "   Pip: $(pip3 --version)"
echo "   Nginx: $(nginx -v 2>&1)"
echo "   PostgreSQL Client: $(psql --version)"
echo ""

echo "✅ EC2 configurado com sucesso!"
echo ""
echo "📋 Próximos passos:"
echo "   1. Clone o repositório: git clone https://github.com/renaneliakim1/Projeto_integrador.git"
echo "   2. Entre no diretório: cd Projeto_integrador"
echo "   3. Execute o script 2: bash deploy_scripts/2_setup_env.sh"
echo ""
