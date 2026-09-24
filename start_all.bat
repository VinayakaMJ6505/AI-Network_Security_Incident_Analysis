@echo off
echo ========================================================
echo Launching Suite Strike
echo ========================================================
start "Suite Strike - Backend" cmd /k "cd /d "%~dp0backend" && call run_backend.bat"
start "Suite Strike - Frontend" cmd /k "cd /d "%~dp0frontend" && call run_frontend.bat"
echo.
echo Both servers launched in separate console windows!
echo Backend:  http://localhost:8000/docs
echo Frontend: http://localhost:5173
echo.
