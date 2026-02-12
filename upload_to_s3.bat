@echo off
chcp 65001 >nul
echo ════════════════════════════════════════════════════
echo    ☁️  SKILLIO - Upload Direto para S3
echo ════════════════════════════════════════════════════
echo.
echo ⚠️  IMPORTANTE: Execute o build ANTES de rodar este script!
echo    cd Frontend
echo    npm run build
echo.
set /p continuar="Build já foi feito? (S/N): "
if /i not "%continuar%"=="S" (
    echo.
    echo Execute o build primeiro e tente novamente.
    pause
    exit /b 0
)

set BUCKET_NAME=skillio-frontend-087736691624
set DISTRIBUTION_ID=E2YV8BLYATEHPW

cd Frontend

if not exist "dist" (
    echo ❌ Pasta dist não encontrada!
    echo    Execute: npm run build
    cd ..
    pause
    exit /b 1
)

echo.
echo ☁️  Fazendo upload para S3...
echo.

REM Sync com cache longo para assets
"C:\Program Files\Amazon\AWSCLIV2\aws.exe" s3 sync dist/ s3://%BUCKET_NAME% --delete --cache-control "max-age=31536000, public, immutable" --exclude "index.html" --exclude "*.html"

if errorlevel 1 (
    echo.
    echo ❌ Erro ao enviar arquivos!
    echo    Verifique se AWS CLI está configurado: aws configure
    cd ..
    pause
    exit /b 1
)

REM index.html sem cache
"C:\Program Files\Amazon\AWSCLIV2\aws.exe" s3 cp dist/index.html s3://%BUCKET_NAME%/index.html --cache-control "no-cache, no-store, must-revalidate"

echo.
echo ✅ Upload concluído!
echo.
echo 🔄 Invalidando cache do CloudFront...

"C:\Program Files\Amazon\AWSCLIV2\aws.exe" cloudfront create-invalidation --distribution-id %DISTRIBUTION_ID% --paths "/*"

cd ..

echo.
echo ════════════════════════════════════════════════════
echo    ✅ FRONTEND ATUALIZADO!
echo ════════════════════════════════════════════════════
echo.
echo 🌐 URL: https://d3lxa11agu4uln.cloudfront.net
echo.
echo ⏱️ Aguarde 2-5 minutos para propagação do CloudFront
echo 💡 Teste em modo anônimo (Ctrl+Shift+N)
echo.
pause
