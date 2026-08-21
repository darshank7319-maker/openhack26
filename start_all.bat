@echo off
echo ========================================================
echo   Starting FarmConnect (Backend + Frontend)
echo ========================================================
echo.
echo 1. Starting Backend REST API on http://localhost:5000 ...
start "FarmConnect Backend (Port 5000)" cmd /k "cd /d %~dp0backend && python server.py"

echo 2. Starting Frontend Web App on http://localhost:8080 ...
start "FarmConnect Frontend (Port 8080)" cmd /k "cd /d %~dp0frontend && python -m http.server 8080"

echo.
echo Both servers started!
echo Frontend: http://localhost:8080
echo Backend:  http://localhost:5000
echo ========================================================
pause
