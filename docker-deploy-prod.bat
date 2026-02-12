@echo off
chcp 65001 >nul
echo ════════════════════════════════════════════════════
echo    🚀 SKILLIO - Deploy de Produção
echo ════════════════════════════════════════════════════
echo.
echo ⚠️  ATENÇÃO: Este script usa o docker-compose.prod.yml
echo    Certifique-se de que o arquivo .env está configurado
echo    para PRODUÇÃO (DEBUG=0, SECRET_KEY segura, etc.)
echo.

set /p confirm="Continuar com o deploy? (S/N): "
if /i not "%confirm%"=="S" (
    echo Deploy cancelado.
    pause
    exit /b 0
)
echo.

REM Verifica se Docker está rodando
docker info >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker não está rodando! Inicie o Docker Desktop primeiro.
    pause
    exit /b 1
)

echo ✅ Docker está rodando
echo.

REM Backup do banco de dados atual (se existir)
echo 💾 Criando backup do banco de dados...
docker exec skillio_db_prod pg_dump -U postgres skillio_db > backup\pre_deploy_backup_%date:~-4,4%%date:~-10,2%%date:~-7,2%.sql 2>nul
echo.

REM Para containers antigos
echo 🛑 Parando containers antigos...
docker-compose -f docker-compose.prod.yml down
echo.

REM Build das imagens
echo 🔨 Construindo imagens para produção...
docker-compose -f docker-compose.prod.yml build --no-cache
if errorlevel 1 (
    echo ❌ Erro ao construir imagens!
    pause
    exit /b 1
)
echo.

REM Inicia containers
echo 🚀 Iniciando containers de produção...
docker-compose -f docker-compose.prod.yml up -d
if errorlevel 1 (
    echo ❌ Erro ao iniciar containers!
    pause
    exit /b 1
)
echo.

echo ⏳ Aguardando serviços iniciarem...
timeout /t 15 /nobreak >nul
echo.

REM Executa migrações
echo 📊 Executando migrações do banco...
docker-compose -f docker-compose.prod.yml exec -T backend python manage.py migrate --noinput
echo.

REM Coleta arquivos estáticos
echo 📦 Coletando arquivos estáticos...
docker-compose -f docker-compose.prod.yml exec -T backend python manage.py collectstatic --noinput
echo.

REM Status dos containers
echo 📊 Status dos containers:
docker-compose -f docker-compose.prod.yml ps
echo.

echo ════════════════════════════════════════════════════
echo    ✅ DEPLOY CONCLUÍDO!
echo ════════════════════════════════════════════════════
echo.
echo 🌐 Aplicação disponível em:
echo    • http://localhost
echo    • https://localhost (se SSL configurado)
echo.
echo 📝 Próximos passos:
echo    • Testar a aplicação
echo    • Verificar logs: docker-compose -f docker-compose.prod.yml logs -f
echo    • Criar superuser: docker-compose -f docker-compose.prod.yml exec backend python manage.py createsuperuser
echo.
pause
