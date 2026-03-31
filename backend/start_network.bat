@echo off
echo ====================================
echo  SKILLIO - Backend (Modo Rede)
echo ====================================
echo.
echo Detectando IP da rede local...
echo.

REM Detecta o IP local automaticamente
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"IPv4"') do (
    set IP=%%a
    goto :found
)

:found
REM Remove espaços do IP
set IP=%IP: =%

echo IP detectado: %IP%
echo.
echo Acesse do PC: http://%IP%:8000
echo Acesse do mobile: http://%IP%:8000
echo.
echo ====================================
echo.

cd /d c:\Users\RENAN\Downloads\Projeto_integrador\backend
call venv\Scripts\activate.bat
python manage.py runserver %IP%:8000
