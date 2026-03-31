#!/bin/bash
################################################################################
# Script 4: Configurar Nginx
# Execute após instalar a aplicação
################################################################################

set -e

echo "🌐 Configurando Nginx..."
echo "================================================"

# Obter IP público do EC2
EC2_IP=$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)
echo "📍 IP público detectado: $EC2_IP"

# Criar configuração do Nginx
sudo tee /etc/nginx/sites-available/skillio > /dev/null << EOF
server {
    listen 80;
    server_name $EC2_IP;  # Atualize com seu domínio se tiver

    client_max_body_size 10M;

    # Proxy para o Gunicorn
    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        
        # Timeout aumentado para requisições AI
        proxy_connect_timeout 300;
        proxy_send_timeout 300;
        proxy_read_timeout 300;
    }

    # Servir arquivos estáticos diretamente
    location /static/ {
        alias /home/ubuntu/Projeto_integrador/backend/staticfiles/;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    # Servir arquivos de mídia (se não usar S3)
    location /media/ {
        alias /home/ubuntu/Projeto_integrador/backend/media/;
        expires 7d;
        add_header Cache-Control "public";
    }

    # Logs
    access_log /var/log/nginx/skillio_access.log;
    error_log /var/log/nginx/skillio_error.log;
}
EOF

# Remover configuração padrão
sudo rm -f /etc/nginx/sites-enabled/default

# Criar link simbólico
sudo ln -sf /etc/nginx/sites-available/skillio /etc/nginx/sites-enabled/

# Testar configuração
echo ""
echo "🔍 Testando configuração do Nginx..."
sudo nginx -t

if [ $? -eq 0 ]; then
    echo "✅ Configuração do Nginx OK!"
    
    # Reiniciar Nginx
    sudo systemctl restart nginx
    sudo systemctl enable nginx
    
    echo ""
    echo "✅ Nginx configurado e rodando!"
    echo ""
    echo "📋 Próximo passo:"
    echo "   Execute: bash deploy_scripts/5_setup_systemd.sh"
else
    echo "❌ Erro na configuração do Nginx!"
    exit 1
fi
