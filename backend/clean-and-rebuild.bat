@echo off
echo Cleaning and rebuilding PG Allocator Backend...

REM Clean up corrupted files
echo Cleaning up corrupted JAR files...
if exist "lib\mysql-connector-java-8.0.33.jar" del "lib\mysql-connector-java-8.0.33.jar"
if exist "lib\mysql-connector-j-8.2.0.jar" del "lib\mysql-connector-j-8.2.0.jar"
if exist "lib\gson-2.10.1.jar" del "lib\gson-2.10.1.jar"

REM Clean classes
if exist "classes" rmdir /s /q classes
mkdir classes

REM Create lib directory
if not exist "lib" mkdir lib

echo.
echo Downloading fresh JAR files...

REM Download using PowerShell with better error handling
powershell -Command "try { Invoke-WebRequest -Uri 'https://repo1.maven.org/maven2/com/mysql/mysql-connector-j/8.1.0/mysql-connector-j-8.1.0.jar' -OutFile 'lib\mysql-connector-j-8.1.0.jar' -UseBasicParsing; Write-Host 'MySQL Connector downloaded successfully' -ForegroundColor Green } catch { Write-Host 'Failed to download MySQL Connector' -ForegroundColor Red; exit 1 }"

powershell -Command "try { Invoke-WebRequest -Uri 'https://repo1.maven.org/maven2/com/google/code/gson/gson/2.10.1/gson-2.10.1.jar' -OutFile 'lib\gson-2.10.1.jar' -UseBasicParsing; Write-Host 'Gson downloaded successfully' -ForegroundColor Green } catch { Write-Host 'Failed to download Gson' -ForegroundColor Red; exit 1 }"

REM Verify downloads
echo.
echo Verifying downloads...
if not exist "lib\mysql-connector-j-8.1.0.jar" (
    echo ❌ MySQL connector download failed
    goto :manual_download
)

if not exist "lib\gson-2.10.1.jar" (
    echo ❌ Gson download failed
    goto :manual_download
)

echo ✅ All JAR files downloaded successfully
echo.

REM Compile without external dependencies first (basic classes)
echo Compiling basic classes...
javac -d classes src\main\java\com\pgallocator\models\*.java

REM Then compile with dependencies
echo Compiling with dependencies...
javac -cp "lib\*;classes" -d classes src\main\java\com\pgallocator\DatabaseConnection.java
javac -cp "lib\*;classes" -d classes src\main\java\com\pgallocator\SimpleDatabaseConnection.java
javac -cp "lib\*;classes" -d classes src\main\java\com\pgallocator\dao\*.java
javac -cp "lib\*;classes" -d classes src\main\java\com\pgallocator\TestConnection.java
javac -cp "lib\*;classes" -d classes src\main\java\com\pgallocator\SimpleHTTPServer.java

if %errorlevel% equ 0 (
    echo.
    echo ✅ Build completed successfully!
    echo.
    echo Next steps:
    echo 1. Test connection: java -cp "classes;lib\*" com.pgallocator.TestConnection
    echo 2. Start server: java -cp "classes;lib\*" com.pgallocator.SimpleHTTPServer
    echo.
) else (
    echo ❌ Compilation failed
    goto :error
)

pause
exit /b 0

:manual_download
echo.
echo ========================================
echo Manual Download Required
echo ========================================
echo Please download these files manually:
echo.
echo 1. MySQL Connector:
echo    https://repo1.maven.org/maven2/com/mysql/mysql-connector-j/8.1.0/mysql-connector-j-8.1.0.jar
echo    Save as: lib\mysql-connector-j-8.1.0.jar
echo.
echo 2. Gson:
echo    https://repo1.maven.org/maven2/com/google/code/gson/gson/2.10.1/gson-2.10.1.jar
echo    Save as: lib\gson-2.10.1.jar
echo.
echo Then run this script again.
echo ========================================
pause
exit /b 1

:error
echo.
echo ❌ Build failed. Check the error messages above.
pause
exit /b 1
