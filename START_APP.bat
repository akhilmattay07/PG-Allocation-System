@echo off
echo ========================================
echo    PG ALLOCATOR - QUICK START
echo ========================================

echo Step 1: Checking XAMPP services...
echo.

REM Check if MySQL is running
netstat -an | findstr :3306 > nul
if %errorlevel% neq 0 (
    echo ❌ XAMPP MySQL is not running
    echo.
    echo Please start XAMPP first:
    echo 1. Open XAMPP Control Panel
    echo 2. Start Apache and MySQL services
    echo 3. Run this script again
    echo.
    pause
    exit /b 1
)

echo ✅ XAMPP MySQL is running

echo.
echo Step 2: Starting Backend Server...
echo Backend will start on http://localhost:8080
echo.

start "PG Allocator Backend" cmd /k "cd /d c:\xampp\htdocs\PG_webapp\backend && java -cp classes;lib\* com.pgallocator.SimpleHTTPServer"

echo Waiting for backend to start...
timeout /t 3 > nul

echo.
echo Step 3: Starting Frontend...
echo Frontend will open at http://localhost:3000
echo.

start "PG Allocator Frontend" cmd /k "cd /d c:\xampp\htdocs\PG_webapp\frontend && npm start"

echo.
echo ========================================
echo PG Allocator is starting up!
echo.
echo Backend: http://localhost:8080
echo Frontend: http://localhost:3000
echo.
echo Both servers are running in separate windows.
echo Close those windows to stop the servers.
echo ========================================

pause
