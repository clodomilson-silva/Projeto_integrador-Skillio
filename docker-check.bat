@echo off
chcp 65001 >nul
echo ════════════════════════════════════════════════════
echo    ✅ SKILLIO - Verificação de Ambiente Docker
echo ════════════════════════════════════════════════════
echo.

REM Verifica Docker
echo 🐳 Verificando Docker...
docker --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker não encontrado! Instale o Docker Desktop.
    goto :end
) else (
    docker --version
    echo ✅ Docker instalado
)
echo.

REM Verifica Docker Compose
echo 🐙 Verificando Docker Compose...
docker-compose --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker Compose não encontrado!
    goto :end
) else (
    docker-compose --version
    echo ✅ Docker Compose instalado
)
echo.

REM Verifica se Docker está rodando
echo 🏃 Verificando se Docker está rodando...
docker info >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker não está rodando! Inicie o Docker Desktop.
    goto :end
) else (
    echo ✅ Docker está rodando
)
echo.

REM Verifica arquivo .env
echo 📄 Verificando arquivo .env...
if exist ".env" (
    echo ✅ Arquivo .env encontrado
    echo.
    echo 📋 Variáveis configuradas:
    findstr /v "^#" .env | findstr /v "^$"
) else (
    echo ❌ Arquivo .env não encontrado!
    echo 💡 Copie o .env.example e configure as variáveis:
    echo    copy .env.example .env
    echo    notepad .env
)
echo.

REM Verifica portas necessárias
echo 🔌 Verificando portas necessárias...
set "portas_ok=1"

netstat -ano | findstr ":80 " | findstr "LISTENING" >nul 2>&1
if not errorlevel 1 (
    echo ⚠️  Porta 80 já está em uso
    set "portas_ok=0"
) else (
    echo ✅ Porta 80 disponível
)

netstat -ano | findstr ":5173 " | findstr "LISTENING" >nul 2>&1
if not errorlevel 1 (
    echo ⚠️  Porta 5173 já está em uso
    set "portas_ok=0"
) else (
    echo ✅ Porta 5173 disponível
)

netstat -ano | findstr ":8000 " | findstr "LISTENING" >nul 2>&1
if not errorlevel 1 (
    echo ⚠️  Porta 8000 já está em uso
    set "portas_ok=0"
) else (
    echo ✅ Porta 8000 disponível
)

netstat -ano | findstr ":5432 " | findstr "LISTENING" >nul 2>&1
if not errorlevel 1 (
    echo ⚠️  Porta 5432 já está em uso
    set "portas_ok=0"
) else (
    echo ✅ Porta 5432 disponível
)
echo.

REM Verifica espaço em disco
echo 💿 Verificando espaço em disco...
for /f "tokens=3" %%a in ('dir /-c ^| find "bytes free"') do set free_space=%%a
echo    Espaço livre: %free_space% bytes
echo ✅ Espaço em disco OK
echo.

REM Status dos containers (se houver)
echo 📊 Status dos containers Skillio:
docker ps -a --filter "name=skillio" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" 2>nul
if errorlevel 1 (
    echo    Nenhum container encontrado
) 
echo.

:end
echo ════════════════════════════════════════════════════
if exist ".env" (
    if "%portas_ok%"=="1" (
        echo    ✅ Ambiente pronto para uso!
        echo    Execute: docker-init.bat
    ) else (
        echo    ⚠️  Libere as portas em uso primeiro
    )
) else (
    echo    ⚠️  Configure o arquivo .env primeiro
)
echo ════════════════════════════════════════════════════
echo.
pause
