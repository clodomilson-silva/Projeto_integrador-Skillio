@echo off
echo ========================================
echo   Diagnostico de Rede - Skillio Docker
echo ========================================
echo.

echo [1/6] Verificando IP do computador...
echo.
ipconfig | findstr /C:"IPv4" /C:"Adaptador"
echo.

echo [2/6] Verificando se Docker esta rodando...
docker ps
echo.

echo [3/6] Verificando portas abertas (5173 e 8000)...
netstat -ano | findstr :5173
netstat -ano | findstr :8000
echo.

echo [4/6] Testando conectividade local - Frontend (5173)...
curl http://localhost:5173 -I
echo.

echo [5/6] Testando conectividade local - Backend (8000)...
curl http://localhost:8000/api/v1/health/
echo.

echo [6/6] Verificando regras de firewall...
powershell -Command "Get-NetFirewallRule | Where-Object {$_.DisplayName -like '*5173*' -or $_.DisplayName -like '*8000*' -or $_.DisplayName -like '*Skillio*' -or $_.DisplayName -like '*Docker*'} | Select-Object DisplayName, Direction, Action, Enabled | Format-Table"
echo.

echo ========================================
echo   Diagnostico Completo
echo ========================================
echo.
echo PROXIMOS PASSOS:
echo.
echo 1. Se as portas NAO aparecerem em "Verificando portas abertas":
echo    - Execute: docker-start.bat
echo.
echo 2. Se os testes de conectividade falharem:
echo    - Verifique se o Docker esta rodando
echo    - Reinicie: docker-compose restart
echo.
echo 3. Se nao houver regras de firewall:
echo    - Execute como Administrador:
echo    - New-NetFirewallRule -DisplayName "Docker Skillio" -Direction Inbound -LocalPort 5173,8000 -Protocol TCP -Action Allow
echo.
echo 4. Para acessar de outro PC:
echo    - Anote o IPv4 acima
echo    - No outro PC, acesse: http://[IPv4]:5173
echo    - Exemplo: http://192.168.15.7:5173
echo.

pause
