@echo off
title EPC Weekly Project Progress Management
echo ======================================================
echo Starting EPC Weekly Project Progress Application
echo ======================================================
cd /d "%~dp0"
set PATH=%~dp0tools\node;%PATH%

echo Server starting on http://localhost:3000 ...
echo Opening your web browser in 2 seconds...
start /b "" cmd /c "timeout /t 2 /nobreak >nul & start http://localhost:3000"

node server/index.js
pause
