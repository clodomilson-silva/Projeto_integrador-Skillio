@echo off
chcp 65001 >nul
echo ════════════════════════════════════════════════════
echo    🗑️  SKILLIO - Limpeza Completa Docker
echo ════════════════════════════════════════════════════
echo.
echo ⚠️  ATENÇÃO: Esta ação irá:
echo    • Parar todos os containers
echo    • Remover todos os containers
echo    • Remover todos os volumes (dados do banco serão perdidos!)
echo    • Remover imagens do Skillio
echo.
set /p confirm="Tem certeza? (S/N): "
if /i not "%confirm%"=="S" (
    echo Operação cancelada.
    pause
    exit /b 0
)
echo.

echo 🛑 Parando containers...
docker-compose down -v
echo.

echo 🗑️  Removendo imagens...
docker rmi projeto_integrador-backend 2>nul
docker rmi projeto_integrador-frontend 2>nul
docker rmi projeto_integrador-nginx 2>nul
echo.

echo 🧹 Limpando volumes órfãos...
docker volume prune -f
echo.

echo 🧹 Limpando cache de build...
docker builder prune -f
echo.

echo ════════════════════════════════════════════════════
echo    ✅ LIMPEZA CONCLUÍDA!
echo ════════════════════════════════════════════════════
echo.
echo Para iniciar novamente, execute: docker-init.bat
echo.
pause
