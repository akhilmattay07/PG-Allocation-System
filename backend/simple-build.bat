@echo off
echo Simple Build for PG Allocator Backend...

REM Clean up
echo Cleaning up...
if exist "classes" rmdir /s /q classes
if exist "lib" rmdir /s /q lib

REM Create directories
mkdir classes
mkdir lib

echo.
echo Please download these JAR files manually and save to lib folder:
echo.
echo 1. MySQL Connector (Right-click and Save As):
echo    https://repo1.maven.org/maven2/com/mysql/mysql-connector-j/8.1.0/mysql-connector-j-8.1.0.jar
echo.
echo 2. Gson (Right-click and Save As):
echo    https://repo1.maven.org/maven2/com/google/code/gson/gson/2.10.1/gson-2.10.1.jar
echo.
echo Save both files to: %CD%\lib\
echo.
echo Press any key after downloading both files...
pause

REM Check if files exist
if not exist "lib\mysql-connector-j-8.1.0.jar" (
    echo ❌ MySQL connector not found in lib folder
    pause
    exit /b 1
)

if not exist "lib\gson-2.10.1.jar" (
    echo ❌ Gson not found in lib folder
    pause
    exit /b 1
)

echo ✅ JAR files found. Starting compilation...

REM Compile step by step
echo.
echo Step 1: Compiling models...
javac -d classes src\main\java\com\pgallocator\models\User.java
javac -d classes src\main\java\com\pgallocator\models\PGListing.java
javac -d classes src\main\java\com\pgallocator\models\Booking.java

echo Step 2: Compiling database connection...
javac -cp "lib\*;classes" -d classes src\main\java\com\pgallocator\DatabaseConnection.java

echo Step 3: Compiling DAOs...
javac -cp "lib\*;classes" -d classes src\main\java\com\pgallocator\dao\UserDAO.java
javac -cp "lib\*;classes" -d classes src\main\java\com\pgallocator\dao\PGListingDAO.java
javac -cp "lib\*;classes" -d classes src\main\java\com\pgallocator\dao\BookingDAO.java

echo Step 4: Compiling main classes...
javac -cp "lib\*;classes" -d classes src\main\java\com\pgallocator\TestConnection.java
javac -cp "lib\*;classes" -d classes src\main\java\com\pgallocator\SimpleHTTPServer.java

if %errorlevel% equ 0 (
    echo.
    echo ✅ Build successful!
    echo.
    echo To test: java -cp "classes;lib\*" com.pgallocator.TestConnection
    echo To run: java -cp "classes;lib\*" com.pgallocator.SimpleHTTPServer
) else (
    echo ❌ Build failed!
)

pause
