@echo off
echo ========================================================
echo Starting Suite Strike Frontend
echo ========================================================
set "ComSpec=C:\Windows\System32\cmd.exe"
npm run dev
if %errorlevel% neq 0 (
    echo Falling back to direct node vite runner...
    node ./node_modules/vite/bin/vite.js
)
pause
