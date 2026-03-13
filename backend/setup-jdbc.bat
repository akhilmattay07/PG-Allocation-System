@echo off
echo Setting up JDBC Connection for PG Allocator...

REM Create lib directory
if not exist "lib" mkdir lib

REM Download MySQL JDBC Driver
echo Downloading MySQL JDBC Driver...
curl -L -o "lib\mysql-connector-java-8.0.33.jar" "https://repo1.maven.org/maven2/mysql/mysql-connector-java/8.0.33/mysql-connector-java-8.0.33.jar"

REM Download Gson for JSON processing
echo Downloading Gson...
curl -L -o "lib\gson-2.10.1.jar" "https://repo1.maven.org/maven2/com/google/code/gson/gson/2.10.1/gson-2.10.1.jar"

echo JDBC setup complete!
echo.
echo Next steps:
echo 1. Start XAMPP and ensure MySQL is running
echo 2. Import database/pg_allocator.sql in PHPMyAdmin
echo 3. Run build.bat to compile the project
echo 4. Run run.bat to start the server

pause
