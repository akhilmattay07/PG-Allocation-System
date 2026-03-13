@echo off
echo Building with any JAR files found...

REM Clean up
if exist "classes" rmdir /s /q classes
mkdir classes

REM Check what JAR files we have
echo Checking for JAR files in lib folder...
dir lib\*.jar

REM Check if we have any MySQL connector
set MYSQL_JAR=
for %%f in (lib\mysql-connector*.jar) do set MYSQL_JAR=%%f

REM Check if we have Gson
set GSON_JAR=
for %%f in (lib\gson*.jar) do set GSON_JAR=%%f

if "%MYSQL_JAR%"=="" (
    echo ❌ No MySQL connector JAR found in lib folder
    echo Please download any MySQL connector JAR file to lib folder
    echo Example: mysql-connector-j-8.1.0.jar
    pause
    exit /b 1
)

if "%GSON_JAR%"=="" (
    echo ❌ No Gson JAR found in lib folder  
    echo Please download gson-2.10.1.jar to lib folder
    pause
    exit /b 1
)

echo ✅ Found MySQL JAR: %MYSQL_JAR%
echo ✅ Found Gson JAR: %GSON_JAR%

echo.
echo Compiling Java files...

REM Compile step by step
echo Step 1: Models...
javac -d classes src\main\java\com\pgallocator\models\*.java
if %errorlevel% neq 0 goto :error

echo Step 2: Database Connection...
javac -cp "lib\*;classes" -d classes src\main\java\com\pgallocator\DatabaseConnection.java
if %errorlevel% neq 0 goto :error

echo Step 3: DAOs...
javac -cp "lib\*;classes" -d classes src\main\java\com\pgallocator\dao\*.java
if %errorlevel% neq 0 goto :error

echo Step 4: Main Classes...
javac -cp "lib\*;classes" -d classes src\main\java\com\pgallocator\TestConnection.java
if %errorlevel% neq 0 goto :error

javac -cp "lib\*;classes" -d classes src\main\java\com\pgallocator\SimpleHTTPServer.java
if %errorlevel% neq 0 goto :error

echo.
echo ✅ Build successful!
echo.
echo To test: java -cp "classes;lib\*" com.pgallocator.TestConnection
echo To run: java -cp "classes;lib\*" com.pgallocator.SimpleHTTPServer
echo.
pause
exit /b 0

:error
echo ❌ Compilation failed!
pause
exit /b 1
