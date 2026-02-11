@echo off
REM Script para verificar status do CloudFront

echo ═══════════════════════════════════════════════════
echo    VERIFICAR STATUS DO CLOUDFRONT
echo ═══════════════════════════════════════════════════
echo.

cd c:\Users\RENAN\Downloads\Projeto_integrador

echo Verificando status...
echo.

c:\Users\RENAN\Downloads\Projeto_integrador\aws-cli.bat cloudfront get-distribution --id E2YV8BLYATEHPW --query "Distribution.Status" --output text

echo.
echo ═══════════════════════════════════════════════════
echo.
echo Status possíveis:
echo.
echo   InProgress - Ainda propagando (aguarde 2-3 min)
echo   Deployed   - PRONTO! Teste agora! 🎉
echo.
echo URL HTTPS: https://d3lxa11agu4uln.cloudfront.net
echo.
echo ═══════════════════════════════════════════════════

pause
