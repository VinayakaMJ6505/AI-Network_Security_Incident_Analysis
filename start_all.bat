@echo off
echo ========================================================
echo Launching AI Network Security Incident Analysis System
echo ========================================================
start "AI Security - Backend" cmd /k "cd /d "%~dp0backend" && call run_backend.bat"
start "AI Security - Frontend" cmd /k "cd /d "%~dp0frontend" && call run_frontend.bat"
echo.
echo Both servers launched in separate console windows!
echo Backend:  http://localhost:8000/docs
echo Frontend: http://localhost:5173
echo.
