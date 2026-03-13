@echo off
echo Building PG Allocator Backend...

REM Create lib directory if it doesn't exist
if not exist "lib" mkdir lib

REM Move JAR files from parent directory if they exist there
if exist "..\lib\mysql-connector-j-8.2.0.jar" (
    echo Moving MySQL connector to correct location...
    move "..\lib\mysql-connector-j-8.2.0.jar" "lib\"
)

if exist "..\lib\gson-2.10.1.jar" (
    echo Moving Gson to correct location...
    move "..\lib\gson-2.10.1.jar" "lib\"
)

REM Check if JAR files exist
if not exist "lib\mysql-connector-j-8.2.0.jar" (
    echo ❌ MySQL JDBC Driver not found in lib folder
    echo Please ensure mysql-connector-j-8.2.0.jar is in backend\lib\
    pause
    exit /b 1
)

if not exist "lib\gson-2.10.1.jar" (
    echo ❌ Gson not found in lib folder
    echo Please ensure gson-2.10.1.jar is in backend\lib\
    pause
    exit /b 1
)

REM Create classes directory
if not exist "classes" mkdir classes

REM Compile Java files one by one to avoid wildcard issues
echo Compiling Java files...

REM Compile models first
javac -cp "lib\*" -d classes src\main\java\com\pgallocator\models\User.java
javac -cp "lib\*" -d classes src\main\java\com\pgallocator\models\PGListing.java
javac -cp "lib\*" -d classes src\main\java\com\pgallocator\models\Booking.java

REM Compile database connection
javac -cp "lib\*;classes" -d classes src\main\java\com\pgallocator\DatabaseConnection.java
javac -cp "lib\*;classes" -d classes src\main\java\com\pgallocator\SimpleDatabaseConnection.java

REM Compile DAOs
javac -cp "lib\*;classes" -d classes src\main\java\com\pgallocator\dao\UserDAO.java
javac -cp "lib\*;classes" -d classes src\main\java\com\pgallocator\dao\PGListingDAO.java
javac -cp "lib\*;classes" -d classes src\main\java\com\pgallocator\dao\BookingDAO.java

REM Compile main classes
javac -cp "lib\*;classes" -d classes src\main\java\com\pgallocator\TestConnection.java
javac -cp "lib\*;classes" -d classes src\main\java\com\pgallocator\SimpleHTTPServer.java

if %errorlevel% equ 0 (
    echo ✅ Build successful!
    echo To test connection: java -cp "classes;lib\*" com.pgallocator.TestConnection
    echo To run server: java -cp "classes;lib\*" com.pgallocator.SimpleHTTPServer
) else (
    echo ❌ Build failed!
)

pause
