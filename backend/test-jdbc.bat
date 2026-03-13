@echo off
echo Testing JDBC Connection...

REM Check if classes directory exists
if not exist "classes" (
    echo Classes directory not found. Running build first...
    call build.bat
)

REM Test JDBC connection
echo.
echo Testing database connection...
java -cp "classes;lib\*" com.pgallocator.TestConnection

echo.
echo If connection test passed, you can start the server with:
echo java -cp "classes;lib\*" com.pgallocator.SimpleHTTPServer

pause
