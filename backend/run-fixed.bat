@echo off
echo Starting PG Allocator Server...

REM Check if classes directory exists
if not exist "classes" (
    echo ❌ Classes directory not found. Please run build-fixed.bat first.
    pause
    exit /b 1
)

REM Check if main class exists
if not exist "classes\com\pgallocator\SimpleHTTPServer.class" (
    echo ❌ SimpleHTTPServer.class not found. Please run build-fixed.bat first.
    pause
    exit /b 1
)

echo ✅ Starting server on http://localhost:8080
echo Press Ctrl+C to stop the server
echo.

REM Start the server
java -cp "classes;lib\*" com.pgallocator.SimpleHTTPServer

pause
