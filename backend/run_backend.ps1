Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "Starting AI Network Security Incident Analysis Backend" -ForegroundColor Green
Write-Host "Target: Python 3.13 Environment (MongoDB incident_db)" -ForegroundColor Yellow
Write-Host "========================================================" -ForegroundColor Cyan

if (Get-Command py -ErrorAction SilentlyContinue) {
    py -3.13 -m uvicorn main:app --reload --port 8000
} else {
    & "C:\Users\user\AppData\Local\Programs\Python\Python313\python.exe" -m uvicorn main:app --reload --port 8000
}
