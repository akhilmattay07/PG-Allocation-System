@echo off
echo Complete Fix for PG Allocator Backend...

echo Step 1: Recompiling SimpleHTTPServer...
javac -cp "lib/*;classes" -d classes src/main/java/com/pgallocator/SimpleHTTPServer.java

if %errorlevel% equ 0 (
    echo ✅ SimpleHTTPServer compiled successfully
) else (
    echo ❌ SimpleHTTPServer compilation failed
    pause
    exit /b 1
)

echo Step 2: Recompiling DAO classes...
javac -cp "lib/*;classes" -d classes src/main/java/com/pgallocator/dao/*.java

if %errorlevel% equ 0 (
    echo ✅ DAO classes compiled successfully
) else (
    echo ❌ DAO compilation failed
    pause
    exit /b 1
)

echo.
echo ✅ All fixes applied successfully!
echo.
echo Now restart the server with:
echo java -cp "classes;lib/*" com.pgallocator.SimpleHTTPServer
echo.
echo Expected endpoints:
echo - PUT /api/booking/status/{bookingId}
echo - All PGs should show (including unverified)
echo.

pause
