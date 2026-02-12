#!/bin/bash

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo "════════════════════════════════════════════════════"
echo "   🚀 SKILLIO - Inicialização Completa Docker"
echo "════════════════════════════════════════════════════"
echo ""

# Verifica se Docker está rodando
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}❌ Docker não está rodando! Inicie o Docker primeiro.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Docker está rodando${NC}"
echo ""

# Para e remove containers antigos (se existirem)
echo "🧹 Limpando containers antigos..."
docker-compose down 2>/dev/null
echo ""

# Cria a pasta de backup se não existir
mkdir -p backup
echo -e "${GREEN}✅ Pasta de backup criada${NC}"
echo ""

# Build das imagens
echo "🔨 Construindo imagens Docker..."
if ! docker-compose build --no-cache; then
    echo -e "${RED}❌ Erro ao construir imagens!${NC}"
    exit 1
fi
echo ""

# Inicia os containers
echo "🚀 Iniciando containers..."
if ! docker-compose up -d; then
    echo -e "${RED}❌ Erro ao iniciar containers!${NC}"
    exit 1
fi
echo ""

echo "⏳ Aguardando serviços iniciarem..."
sleep 10
echo ""

# Mostra status dos containers
echo "📊 Status dos containers:"
docker-compose ps
echo ""

echo "════════════════════════════════════════════════════"
echo "   ✅ SKILLIO INICIADO COM SUCESSO!"
echo "════════════════════════════════════════════════════"
echo ""
echo "🌐 Serviços disponíveis:"
echo "   • Frontend: http://localhost (Nginx)"
echo "   • Frontend direto: http://localhost:5173"
echo "   • Backend API: http://localhost:8000"
echo "   • PostgreSQL: localhost:5432"
echo "   • Redis: localhost:6379"
echo "   • Nginx: http://localhost:80"
echo ""
echo "📝 Comandos úteis:"
echo "   • Ver logs: docker-compose logs -f"
echo "   • Parar: docker-compose stop"
echo "   • Remover tudo: docker-compose down -v"
echo ""
