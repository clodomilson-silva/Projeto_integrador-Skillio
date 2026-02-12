@echo off
chcp 65001 >nul
echo ════════════════════════════════════════════════════
echo    🚀 SKILLIO - Deploy Frontend Simplificado
echo ════════════════════════════════════════════════════
echo.

REM Configurações
set BUCKET_NAME=skillio-frontend-087736691624
set DISTRIBUTION_ID=E2YV8BLYATEHPW
set CLOUDFRONT_URL=https://d3lxa11agu4uln.cloudfront.net

echo 📦 Bucket S3: %BUCKET_NAME%
echo 🌐 CloudFront: %CLOUDFRONT_URL%
echo.

REM Verifica AWS CLI
aws --version >nul 2>&1
if errorlevel 1 (
    echo ❌ AWS CLI não instalado!
    echo    Baixe: https://aws.amazon.com/cli/
    pause
    exit /b 1
)

echo ✅ AWS CLI instalado
echo.

REM Verifica Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js não instalado!
    pause
    exit /b 1
)

echo ✅ Node.js instalado
echo.

cd Frontend

REM Verifica .env.production
if not exist ".env.production" (
    echo ⚠️  Criando .env.production...
    (
        echo VITE_API_URL=http://3.142.80.221
        echo VITE_GOOGLE_GENERATIVE_LANGUAGE_API_KEY=
        echo VITE_EMAILJS_SERVICE_ID=
        echo VITE_EMAILJS_TEMPLATE_ID=
        echo VITE_EMAILJS_USER_ID=
        echo VITE_SUPABASE_URL=
        echo VITE_SUPABASE_ANON_KEY=
        echo VITE_YOUTUBE_API_KEY=
    ) > .env.production
    echo ✅ Arquivo criado! Configure suas chaves API em .env.production
    notepad .env.production
    pause
)

echo 📦 Instalando dependências...
call npm install --silent

if errorlevel 1 (
    echo ❌ Erro ao instalar dependências!
    cd ..
    pause
    exit /b 1
)

echo.
echo 🏗️  Building frontend (isso pode levar alguns minutos)...
call npm run build

if errorlevel 1 (
    echo ❌ Erro no build!
    cd ..
    pause
    exit /b 1
)

if not exist "dist" (
    echo ❌ Pasta dist não foi criada!
    cd ..
    pause
    exit /b 1
)

echo ✅ Build concluído!
echo.
echo ☁️  Enviando para S3...

REM Sync com cache longo para assets
aws s3 sync dist/ s3://%BUCKET_NAME% ^
    --delete ^
    --cache-control "max-age=31536000, public, immutable" ^
    --exclude "index.html" ^
    --exclude "*.html"

REM index.html sem cache
aws s3 cp dist/index.html s3://%BUCKET_NAME%/index.html ^
    --cache-control "no-cache, no-store, must-revalidate"

if errorlevel 1 (
    echo ❌ Erro ao enviar para S3!
    cd ..
    pause
    exit /b 1
)

echo ✅ Upload concluído!
echo.
echo 🔄 Invalidando cache do CloudFront...

aws cloudfront create-invalidation ^
    --distribution-id %DISTRIBUTION_ID% ^
    --paths "/*"

cd ..

echo.
echo ════════════════════════════════════════════════════
echo    ✅ FRONTEND ATUALIZADO COM SUCESSO!
echo ════════════════════════════════════════════════════
echo.
echo 🌐 URLs para testar:
echo    • CloudFront: %CLOUDFRONT_URL%
echo    • S3 Direct: http://%BUCKET_NAME%.s3-website.us-east-2.amazonaws.com
echo.
echo ⏱️ Aguarde 2-5 minutos para propagação do CloudFront
echo.
echo 💡 Dica: Teste em modo anônimo (Ctrl+Shift+N)
echo.
pause
