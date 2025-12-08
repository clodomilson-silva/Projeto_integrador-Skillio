@echo off
echo ========================================
echo   Skillio - Iniciando com Docker
echo ========================================
echo.

echo [1/3] Parando containers antigos...
docker-compose down

echo.
echo [2/3] Construindo imagens Docker...
docker-compose build

echo.
echo [3/3] Iniciando containers...
docker-compose up -d

echo.
echo ========================================
echo   Containers iniciados com sucesso!
echo ========================================
echo.
echo Backend:  http://192.168.15.7:8000
echo Frontend: http://192.168.15.7:5173
echo.
echo Para ver os logs: docker-compose logs -f
echo Para parar: docker-compose down
echo.
pause
