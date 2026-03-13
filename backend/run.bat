@echo off
echo Starting PG Allocator Server...

REM Check if classes directory exists
if not exist "classes" (
    echo Classes directory not found. Please run build.bat first.
    pause
    exit /b 1
)

REM Start the server
java -cp "classes;lib\*" com.pgallocator.SimpleHTTPServer

pause
