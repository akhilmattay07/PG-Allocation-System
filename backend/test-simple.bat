@echo off
echo Testing PG Allocator Connection...

if not exist "classes\com\pgallocator\TestConnection.class" (
    echo ❌ TestConnection.class not found. Please run simple-build.bat first.
    pause
    exit /b 1
)

echo ✅ Running connection test...
java -cp "classes;lib\*" com.pgallocator.TestConnection

pause
