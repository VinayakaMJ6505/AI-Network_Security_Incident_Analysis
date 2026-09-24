Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "Starting Suite Strike Frontend" -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan

$env:ComSpec = "C:\Windows\System32\cmd.exe"
$env:COMSPEC = "C:\Windows\System32\cmd.exe"

npm run dev
if ($LASTEXITCODE -ne 0) {
    Write-Host "Falling back to direct node vite runner..." -ForegroundColor Yellow
    node ./node_modules/vite/bin/vite.js
}
