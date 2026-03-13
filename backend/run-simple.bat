@echo off
echo Starting PG Allocator Server...

if not exist "classes\com\pgallocator\SimpleHTTPServer.class" (
    echo ❌ SimpleHTTPServer.class not found. Please run simple-build.bat first.
    pause
    exit /b 1
)

echo ✅ Starting server on http://localhost:8080
echo Press Ctrl+C to stop the server
echo.

java -cp "classes;lib\*" com.pgallocator.SimpleHTTPServer
