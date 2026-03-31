@echo off
chcp 65001 >nul
echo ════════════════════════════════════════════════════
echo    🛑 SKILLIO - Parando Containers Docker
echo ════════════════════════════════════════════════════
echo.

docker-compose stop
if errorlevel 1 (
    echo ❌ Erro ao parar containers!
    pause
    exit /b 1
)

echo.
echo ✅ Containers parados com sucesso!
echo.
echo 💡 Para removê-los completamente, use:
echo    docker-compose down
echo    docker-compose down -v (remove também os volumes)
echo.
pause

