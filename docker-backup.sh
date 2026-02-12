#!/bin/bash

# Cores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "════════════════════════════════════════════════════"
echo "   💾 SKILLIO - Backup do Banco de Dados"
echo "════════════════════════════════════════════════════"
echo ""

# Cria pasta de backup se não existir
mkdir -p backup

# Gera nome do arquivo com data e hora
backup_file="backup/skillio_backup_$(date +%Y%m%d_%H%M%S).sql"

echo "💾 Criando backup..."
if docker exec skillio_db pg_dump -U postgres skillio_db > "$backup_file"; then
    echo ""
    echo -e "${GREEN}✅ Backup criado com sucesso!${NC}"
    echo "📁 Arquivo: $backup_file"
    echo ""
else
    echo -e "${RED}❌ Erro ao criar backup!${NC}"
    exit 1
fi
