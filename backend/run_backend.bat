@echo off
echo ========================================================
echo Starting AI Network Security Incident Analysis Backend
echo Using Python 3.13 Environment
echo ========================================================
py -3.13 -m uvicorn main:app --reload --port 8000
if %errorlevel% neq 0 (
    "C:\Users\user\AppData\Local\Programs\Python\Python313\python.exe" -m uvicorn main:app --reload --port 8000
)
pause
