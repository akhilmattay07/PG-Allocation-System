@echo off
echo Starting PG Allocator Frontend...

cd /d "c:\xampp\htdocs\PG_webapp\frontend"

echo Checking if backend is running...
powershell -Command "try { Invoke-WebRequest -Uri 'http://localhost:8080/api/pgs' -UseBasicParsing -TimeoutSec 5 | Out-Null; Write-Host '✅ Backend is running' } catch { Write-Host '❌ Backend is not running. Please start backend first.'; exit 1 }"

if %errorlevel% neq 0 (
    echo Please run start-backend.bat first
    pause
    exit /b 1
)

echo Starting React development server...
echo Frontend will open at http://localhost:3000
echo.

npm start
