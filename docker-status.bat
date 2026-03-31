@echo off
chcp 65001 >nul
echo ════════════════════════════════════════════════════
echo    📊 SKILLIO - Status dos Containers
echo ════════════════════════════════════════════════════
echo.

echo 🐳 Containers:
docker-compose ps
echo.

echo 💾 Volumes:
docker volume ls | findstr skillio
echo.

echo 🌐 Networks:
docker network ls | findstr skillio
echo.

echo 💿 Uso de disco:
docker system df
echo.

pause
