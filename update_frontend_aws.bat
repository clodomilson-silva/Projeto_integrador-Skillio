@echo off
chcp 65001 >nul
echo ════════════════════════════════════════════════════
echo    🚀 SKILLIO - Atualizar Frontend na AWS S3
echo ════════════════════════════════════════════════════
echo.

REM Verifica se AWS CLI está instalado
aws --version >nul 2>&1
if errorlevel 1 (
    echo ❌ AWS CLI não encontrado!
    echo    Instale: https://aws.amazon.com/cli/
    pause
    exit /b 1
)

echo ✅ AWS CLI instalado
echo.

REM Solicita nome do bucket
set /p BUCKET_NAME="📦 Digite o nome do bucket S3 (ex: skillio-frontend): "

if "%BUCKET_NAME%"=="" (
    echo ❌ Nome do bucket não pode ser vazio!
    pause
    exit /b 1
)

echo.
echo 🔍 Verificando bucket %BUCKET_NAME%...
aws s3 ls s3://%BUCKET_NAME% >nul 2>&1
if errorlevel 1 (
    echo ❌ Bucket não encontrado ou sem acesso!
    echo    Verifique o nome e as credenciais AWS
    pause
    exit /b 1
)

echo ✅ Bucket encontrado!
echo.

REM Verifica se arquivo .env.production existe
cd Frontend
if not exist ".env.production" (
    echo ⚠️  Arquivo .env.production não encontrado!
    if exist ".env.production.example" (
        copy .env.production.example .env.production
        echo ✅ Arquivo criado. Configure antes de continuar!
        notepad .env.production
        pause
    ) else (
        echo ❌ Arquivo .env.production.example não encontrado!
        pause
        exit /b 1
    )
)

echo 🏗️  Instalando dependências...
call npm install

echo.
echo 🏗️  Building frontend...
call npm run build

if not exist "dist" (
    echo ❌ Erro no build!
    pause
    exit /b 1
)

echo ✅ Build concluído!
echo.

echo ☁️  Fazendo upload para S3...
echo.

REM Upload de todos os arquivos (com cache longo)
aws s3 sync dist/ s3://%BUCKET_NAME% ^
    --delete ^
    --cache-control "max-age=31536000,public" ^
    --exclude "index.html" ^
    --exclude "robots.txt"

REM index.html sem cache (sempre busca versão nova)
aws s3 cp dist/index.html s3://%BUCKET_NAME%/index.html ^
    --cache-control "no-cache, no-store, must-revalidate"

REM robots.txt sem cache
if exist "dist\robots.txt" (
    aws s3 cp dist/robots.txt s3://%BUCKET_NAME%/robots.txt ^
        --cache-control "no-cache"
)

cd ..

echo.
echo ════════════════════════════════════════════════════
echo    ✅ FRONTEND ATUALIZADO COM SUCESSO!
echo ════════════════════════════════════════════════════
echo.
echo 🌐 URLs:
echo    S3: http://%BUCKET_NAME%.s3-website-us-east-2.amazonaws.com
echo    CloudFront: (se configurado)
echo.
REM ID fixo da distribuição CloudFront
set CF_DIST_ID=E2YV8BLYATEHPW
if not "%CF_DIST_ID%"=="" (
    echo 🔄 Invalidando cache do CloudFront (ID: %CF_DIST_ID%) ...
    aws cloudfront create-invalidation --distribution-id %CF_DIST_ID% --paths "/*"
    echo ✅ Invalidação enviada!
)
echo 💡 Dicas:
echo    - Limpe o cache do navegador (Ctrl+Shift+R)
echo    - Se usar CloudFront, crie invalidação se necessário.
echo.
pause
