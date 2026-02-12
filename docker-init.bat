@echo off
chcp 65001 >nul
echo ════════════════════════════════════════════════════
echo    🚀 SKILLIO - Inicialização Completa Docker
echo ════════════════════════════════════════════════════
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

REM Para e remove containers antigos (se existirem)
echo 🧹 Limpando containers antigos...
docker-compose down 2>nul
echo.

REM Cria a pasta de backup se não existir
if not exist "backup" mkdir backup
echo ✅ Pasta de backup criada
echo.

REM Build das imagens
echo 🔨 Construindo imagens Docker...
docker-compose build --no-cache
if errorlevel 1 (
    echo ❌ Erro ao construir imagens!
    pause
    exit /b 1
)
echo.

REM Inicia os containers
echo 🚀 Iniciando containers...
docker-compose up -d
if errorlevel 1 (
    echo ❌ Erro ao iniciar containers!
    pause
    exit /b 1
)
echo.

echo ⏳ Aguardando serviços iniciarem...
timeout /t 10 /nobreak >nul
echo.

REM Mostra status dos containers
echo 📊 Status dos containers:
docker-compose ps
echo.

echo ════════════════════════════════════════════════════
echo    ✅ SKILLIO INICIADO COM SUCESSO!
echo ════════════════════════════════════════════════════
echo.
echo 🌐 Serviços disponíveis:
echo    • Frontend: http://localhost (Nginx)
echo    • Frontend direto: http://localhost:5173
echo    • Backend API: http://localhost:8000
echo    • PostgreSQL: localhost:5432
echo    • Redis: localhost:6379
echo    • Nginx: http://localhost:80
echo.
echo 📝 Comandos úteis:
echo    • Ver logs: docker-compose logs -f
echo    • Parar: docker-compose stop
echo    • Remover tudo: docker-compose down -v
echo.
pause
