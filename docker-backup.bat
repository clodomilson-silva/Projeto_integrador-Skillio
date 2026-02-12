@echo off
chcp 65001 >nul
echo ════════════════════════════════════════════════════
echo    💾 SKILLIO - Backup do Banco de Dados
echo ════════════════════════════════════════════════════
echo.

REM Cria pasta de backup se não existir
if not exist "backup" mkdir backup

REM Gera nome do arquivo com data e hora
for /f "tokens=2 delims==" %%I in ('wmic os get localdatetime /value') do set datetime=%%I
set backup_file=backup\skillio_backup_%datetime:~0,8%_%datetime:~8,6%.sql

echo 💾 Criando backup...
docker exec skillio_db pg_dump -U postgres skillio_db > %backup_file%

if errorlevel 1 (
    echo ❌ Erro ao criar backup!
    pause
    exit /b 1
)

echo.
echo ✅ Backup criado com sucesso!
echo 📁 Arquivo: %backup_file%
echo.
pause
