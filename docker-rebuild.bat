@echo off
echo ========================================
echo   Skillio - Rebuild Completo
echo ========================================
echo.
echo Este script vai:
echo - Parar todos os containers
echo - Remover volumes e imagens antigas
echo - Reconstruir tudo do zero
echo.
pause

echo.
echo [1/5] Parando containers...
docker-compose down

echo.
echo [2/5] Removendo volumes...
docker-compose down -v

echo.
echo [3/5] Limpando imagens antigas...
docker system prune -f

echo.
echo [4/5] Reconstruindo imagens (sem cache)...
docker-compose build --no-cache

echo.
echo [5/5] Iniciando containers...
docker-compose up -d

echo.
echo ========================================
echo   Rebuild completo finalizado!
echo ========================================
echo.
echo Backend:  http://192.168.15.7:8000
echo Frontend: http://192.168.15.7:5173
echo.
pause
