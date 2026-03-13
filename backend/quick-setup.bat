@echo off
echo ========================================
echo    PG Allocator - Quick Setup
echo ========================================

echo.
echo Step 1: Downloading JAR files...
powershell -ExecutionPolicy Bypass -File download-jars.ps1

echo.
echo Step 2: Checking downloads...
if exist "lib\mysql-connector-j-8.2.0.jar" (
    echo ✅ MySQL Connector found
) else (
    echo ❌ MySQL Connector missing
    goto :error
)

if exist "lib\gson-2.10.1.jar" (
    echo ✅ Gson found
) else (
    echo ❌ Gson missing
    goto :error
)

echo.
echo Step 3: Building project...
call build.bat

echo.
echo Step 4: Testing connection...
call test-jdbc.bat

echo.
echo ========================================
echo Setup complete! 
echo.
echo Next steps:
echo 1. Start XAMPP and ensure MySQL is running
echo 2. Import database/pg_allocator.sql in PHPMyAdmin
echo 3. Run: run.bat
echo ========================================
pause
exit /b 0

:error
echo.
echo ❌ Setup failed. Please download JAR files manually:
echo 1. MySQL: https://repo1.maven.org/maven2/com/mysql/mysql-connector-j/8.2.0/mysql-connector-j-8.2.0.jar
echo 2. Gson: https://repo1.maven.org/maven2/com/google/code/gson/gson/2.10.1/gson-2.10.1.jar
echo Save both to: lib\ folder
pause
exit /b 1
