@echo off
echo Rebuilding with LocalDate fix...

REM Clean classes
if exist "classes" rmdir /s /q classes
mkdir classes

echo Compiling with LocalDate fix...

REM Compile models first
javac -d classes src\main\java\com\pgallocator\models\*.java

REM Compile utils
javac -cp "lib\*;classes" -d classes src\main\java\com\pgallocator\utils\*.java

REM Compile database connection
javac -cp "lib\*;classes" -d classes src\main\java\com\pgallocator\DatabaseConnection.java

REM Compile DAOs
javac -cp "lib\*;classes" -d classes src\main\java\com\pgallocator\dao\*.java

REM Compile main classes
javac -cp "lib\*;classes" -d classes src\main\java\com\pgallocator\TestConnection.java
javac -cp "lib\*;classes" -d classes src\main\java\com\pgallocator\SimpleHTTPServer.java

if %errorlevel% equ 0 (
    echo ✅ Build successful with LocalDate fix!
    echo.
    echo Stop the current server (Ctrl+C) and restart with:
    echo java -cp "classes;lib\*" com.pgallocator.SimpleHTTPServer
) else (
    echo ❌ Build failed!
)

pause
