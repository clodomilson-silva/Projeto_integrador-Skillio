@echo off
echo Iniciando Frontend Vite na porta 5173 com acesso de rede...
echo.
echo IMPORTANTE: Mantenha esta janela aberta!
echo.
cd /d "%~dp0"
call npm run dev -- --host 0.0.0.0 --port 5173
pause
