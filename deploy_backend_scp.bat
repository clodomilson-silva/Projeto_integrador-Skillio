@echo off
chcp 65001 >nul
echo ════════════════════════════════════════════════════
echo    🔄 SKILLIO - Deploy Backend via SCP
echo ════════════════════════════════════════════════════
echo.
echo 📦 Preparando backend para upload...
echo.

REM Verifica se a chave SSH existe
if not exist "skillio-key.pem" (
    echo ❌ Arquivo skillio-key.pem não encontrado!
    pause
    exit /b 1
)

REM Criar arquivo temporário com comandos
echo ✅ Criando pacote do backend...
cd backend

REM Compactar backend (excluir venv, cache, etc)
tar -czf ../backend.tar.gz ^
    --exclude=__pycache__ ^
    --exclude=*.pyc ^
    --exclude=venv ^
    --exclude=.venv ^
    --exclude=staticfiles ^
    --exclude=media ^
    --exclude=logs ^
    --exclude=*.log ^
    --exclude=db.sqlite3 ^
    .

cd ..

echo ✅ Pacote criado: backend.tar.gz
echo.
echo 📡 Enviando para servidor EC2...

scp -i skillio-key.pem backend.tar.gz ubuntu@54.227.194.67:~/

if errorlevel 1 (
    echo ❌ Erro ao enviar arquivo!
    del backend.tar.gz
    pause
    exit /b 1
)

echo ✅ Arquivo enviado!
echo.
echo 🔄 Aplicando atualização no servidor...

ssh -i skillio-key.pem ubuntu@54.227.194.67 "cd ~/Projeto_integrador/backend && tar -xzf ~/backend.tar.gz && rm ~/backend.tar.gz && source ~/venv/bin/activate && pip install -r requirements_prod.txt --quiet && python manage.py migrate --settings=core.settings_production && python manage.py collectstatic --noinput --settings=core.settings_production --clear && sudo systemctl restart skillio"

if errorlevel 1 (
    echo ❌ Erro ao aplicar atualização!
    del backend.tar.gz
    pause
    exit /b 1
)

del backend.tar.gz

echo.
echo ════════════════════════════════════════════════════
echo    ✅ BACKEND ATUALIZADO COM SUCESSO!
echo ════════════════════════════════════════════════════
echo.
echo 🌐 API: http://3.142.80.221:8000
echo.
echo 💡 Verificar logs:
echo    ssh -i skillio-key.pem ubuntu@3.142.80.221
echo    sudo journalctl -u skillio -f
echo.
pause
