@echo off
echo ========================================
echo   CONFIGURAR FIREWALL - Skillio Docker
echo ========================================
echo.
echo Este script criara regras no Firewall do Windows
echo para permitir acesso externo ao Skillio.
echo.
echo IMPORTANTE: Execute este arquivo como ADMINISTRADOR!
echo (Clique com botao direito -> Executar como administrador)
echo.
pause

echo.
echo [1/2] Criando regra para Frontend (porta 5173)...
powershell -Command "New-NetFirewallRule -DisplayName 'Skillio Frontend Docker' -Direction Inbound -LocalPort 5173 -Protocol TCP -Action Allow -Profile Any"

echo.
echo [2/2] Criando regra para Backend (porta 8000)...
powershell -Command "New-NetFirewallRule -DisplayName 'Skillio Backend Docker' -Direction Inbound -LocalPort 8000 -Protocol TCP -Action Allow -Profile Any"

echo.
echo ========================================
echo   Configuracao Concluida!
echo ========================================
echo.
echo As seguintes regras foram criadas:
echo - Skillio Frontend Docker (porta 5173)
echo - Skillio Backend Docker (porta 8000)
echo.
echo Agora outros PCs na mesma rede podem acessar:
echo http://192.168.15.7:5173
echo.
pause
