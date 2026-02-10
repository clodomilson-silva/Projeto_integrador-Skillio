#!/bin/bash
################################################################################
# Script 5: Configurar Systemd Service
# Faz o Gunicorn rodar automaticamente como serviço
################################################################################

set -e

echo "⚙️  Configurando serviço systemd..."
echo "================================================"

# Criar serviço systemd
sudo tee /etc/systemd/system/skillio.service > /dev/null << 'EOF'
[Unit]
Description=Skillio Django Application
After=network.target

[Service]
Type=simple
User=ubuntu
Group=ubuntu
WorkingDirectory=/home/ubuntu/Projeto_integrador/backend
Environment="PATH=/home/ubuntu/venv/bin"
EnvironmentFile=/home/ubuntu/.env
ExecStart=/home/ubuntu/venv/bin/gunicorn \
    --workers 3 \
    --bind 0.0.0.0:8000 \
    --timeout 300 \
    --log-level info \
    --access-logfile /var/log/django/access.log \
    --error-logfile /var/log/django/error.log \
    core.wsgi:application
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

# Recarregar systemd
echo "🔄 Recarregando systemd..."
sudo systemctl daemon-reload

# Iniciar serviço
echo "▶️  Iniciando serviço skillio..."
sudo systemctl start skillio

# Habilitar início automático
sudo systemctl enable skillio

# Aguardar 3 segundos
sleep 3

# Verificar status
echo ""
echo "📊 Status do serviço:"
sudo systemctl status skillio --no-pager -l

# Verificar se está rodando
if sudo systemctl is-active --quiet skillio; then
    echo ""
    echo "✅ Serviço skillio rodando!"
    
    # Mostrar IP e porta
    EC2_IP=$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)
    echo ""
    echo "🎉 Deploy concluído!"
    echo ""
    echo "🌐 Backend disponível em:"
    echo "   http://$EC2_IP/api/v1/"
    echo "   http://$EC2_IP/admin/"
    echo ""
    echo "📋 Comandos úteis:"
    echo "   Ver logs: sudo journalctl -u skillio -f"
    echo "   Reiniciar: sudo systemctl restart skillio"
    echo "   Parar: sudo systemctl stop skillio"
    echo "   Status: sudo systemctl status skillio"
    echo ""
    echo "📝 Próximos passos:"
    echo "   1. Teste o backend: curl http://$EC2_IP/api/v1/"
    echo "   2. Atualize ALLOWED_HOSTS em settings_production.py"
    echo "   3. Deploy do frontend: bash deploy_scripts/6_deploy_frontend.sh (no seu PC)"
else
    echo ""
    echo "❌ Erro ao iniciar serviço!"
    echo "   Ver logs: sudo journalctl -u skillio -n 50"
    exit 1
fi
