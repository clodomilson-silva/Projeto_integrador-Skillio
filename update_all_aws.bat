@echo off
chcp 65001 >nul
echo ════════════════════════════════════════════════════
echo    🚀 SKILLIO - Atualizar TUDO na AWS
echo ════════════════════════════════════════════════════
echo.
echo Este script irá:
echo    1. Atualizar Backend no EC2
echo    2. Atualizar Frontend no S3
echo.
set /p confirm="Continuar? (S/N): "
if /i not "%confirm%"=="S" (
    echo Operação cancelada.
    pause
    exit /b 0
)

echo.
echo ════════════════════════════════════════════════════
echo    ETAPA 1/2: Atualizando Backend...
echo ════════════════════════════════════════════════════
echo.
call update_backend_aws.bat

if errorlevel 1 (
    echo.
    echo ❌ Erro ao atualizar backend! Abortando...
    pause
    exit /b 1
)

echo.
echo ════════════════════════════════════════════════════
echo    ETAPA 2/2: Atualizando Frontend...
echo ════════════════════════════════════════════════════
echo.
call update_frontend_aws.bat

if errorlevel 1 (
    echo.
    echo ❌ Erro ao atualizar frontend!
    pause
    exit /b 1
)

echo.
echo ════════════════════════════════════════════════════
echo    ✅ TUDO ATUALIZADO COM SUCESSO!
echo ════════════════════════════════════════════════════
echo.
echo 🎉 Backend e Frontend atualizados na AWS
echo.
pause
