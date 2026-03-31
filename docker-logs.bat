@echo off
chcp 65001 >nul
echo ════════════════════════════════════════════════════
echo    📊 SKILLIO - Logs dos Containers
echo ════════════════════════════════════════════════════
echo.
echo Pressione Ctrl+C para sair
echo.

docker-compose logs -f --tail=100

