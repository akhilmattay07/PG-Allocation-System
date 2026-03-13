@echo off
echo Building PG Allocator Backend...

REM Create lib directory if it doesn't exist
if not exist "lib" mkdir lib

REM Download MySQL JDBC Driver if not present
if not exist "lib\mysql-connector-j-8.2.0.jar" (
    echo MySQL JDBC Driver not found. Please run: powershell -ExecutionPolicy Bypass -File download-jars.ps1
    pause
    exit /b 1
)

REM Download Gson if not present
if not exist "lib\gson-2.10.1.jar" (
    echo Gson not found. Please run: powershell -ExecutionPolicy Bypass -File download-jars.ps1
    pause
    exit /b 1
)

REM Create classes directory
if not exist "classes" mkdir classes

REM Compile Java files
echo Compiling Java files...
javac -cp "lib\*" -d classes src\main\java\com\pgallocator\*.java src\main\java\com\pgallocator\models\*.java src\main\java\com\pgallocator\dao\*.java

if %errorlevel% equ 0 (
    echo Build successful!
    echo To run the server: java -cp "classes;lib\*" com.pgallocator.SimpleHTTPServer
) else (
    echo Build failed!
)

pause
