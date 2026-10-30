@echo off
title EPC Weekly Project Progress Management
echo ======================================================
echo Starting EPC Weekly Project Progress Application
echo ======================================================
set PATH=%~dp0tools\node;%PATH%

if not exist "%~dp0dist\index.html" (
    echo Building production assets...
    call npm run build
)

echo Starting production server on http://localhost:3000
echo Press Ctrl+C to stop.
start http://localhost:3000
node server/index.js
pause
