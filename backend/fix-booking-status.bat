@echo off
echo Fixing booking status endpoint...

echo Recompiling SimpleHTTPServer with booking status fix...
javac -cp "lib\*;classes" -d classes src\main\java\com\pgallocator\SimpleHTTPServer.java

if %errorlevel% equ 0 (
    echo ✅ Compilation successful!
    echo.
    echo Stop the current server (Ctrl+C) and restart with:
    echo java -cp "classes;lib\*" com.pgallocator.SimpleHTTPServer
    echo.
    echo The booking status endpoint should now work:
    echo PUT /api/booking/status/{bookingId}
) else (
    echo ❌ Compilation failed!
)

pause
