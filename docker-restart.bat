@echo off
chcp 65001 >nul
echo ════════════════════════════════════════════════════
echo    🔄 SKILLIO - Restart dos Containers
echo ════════════════════════════════════════════════════
echo.

docker-compose restart
if errorlevel 1 (
    echo ❌ Erro ao reiniciar containers!
    pause
    exit /b 1
)

echo.
echo ✅ Containers reiniciados com sucesso!
echo.

docker-compose ps
echo.
pause
