@echo off
chcp 65001 >nul
echo ════════════════════════════════════════════════════
echo    🔍 SKILLIO - Encontrar Instância EC2 Correta
echo ════════════════════════════════════════════════════
echo.

set /p IP1="Digite o IP da instância i-004a2e98e9fc638e0: "
set /p IP2="Digite o IP da instância i-0832ea4e8f50447ec: "

echo.
echo 🔍 Testando instância 1 (%IP1%)...
curl -m 5 http://%IP1%:8000/api/health/ 2>nul
if errorlevel 1 (
    echo ❌ Não responde ou timeout
) else (
    echo ✅ ESTA É A INSTÂNCIA CORRETA!
    echo.
    echo 📝 Anote:
    echo    Instance ID: i-004a2e98e9fc638e0
    echo    IP: %IP1%
)

echo.
echo 🔍 Testando instância 2 (%IP2%)...
curl -m 5 http://%IP2%:8000/api/health/ 2>nul
if errorlevel 1 (
    echo ❌ Não responde ou timeout
) else (
    echo ✅ ESTA É A INSTÂNCIA CORRETA!
    echo.
    echo 📝 Anote:
    echo    Instance ID: i-0832ea4e8f50447ec
    echo    IP: %IP2%
)

echo.
echo ════════════════════════════════════════════════════
pause
