@echo off
echo Starting PG Allocator Backend Server...

cd /d "c:\xampp\htdocs\PG_webapp\backend"

echo Checking if XAMPP MySQL is running...
netstat -an | findstr :3306 > nul
if %errorlevel% neq 0 (
    echo ❌ MySQL is not running. Please start XAMPP first.
    echo 1. Open XAMPP Control Panel
    echo 2. Start Apache and MySQL
    echo 3. Then run this script again
    pause
    exit /b 1
)

echo ✅ MySQL is running
echo Starting backend server on http://localhost:8080...
echo Press Ctrl+C to stop the server
echo.

java -cp "classes;lib\*" com.pgallocator.SimpleHTTPServer

pause
