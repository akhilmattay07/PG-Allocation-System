@echo off
echo Fixing lib folder locations...

echo Current directory: %CD%
echo.

echo Checking for JAR files in different locations...

REM Check parent lib folder
if exist "..\lib\*.jar" (
    echo Found JAR files in parent lib folder:
    dir "..\lib\*.jar"
    echo.
    echo Moving JAR files to backend\lib...
    if not exist "lib" mkdir lib
    copy "..\lib\*.jar" "lib\"
    echo JAR files moved successfully!
) else (
    echo No JAR files found in parent lib folder
)

REM Check current lib folder
if exist "lib\*.jar" (
    echo Found JAR files in backend\lib:
    dir "lib\*.jar"
) else (
    echo No JAR files found in backend\lib
)

REM Check Downloads folder (common location)
if exist "%USERPROFILE%\Downloads\mysql-connector*.jar" (
    echo Found MySQL connector in Downloads folder!
    if not exist "lib" mkdir lib
    copy "%USERPROFILE%\Downloads\mysql-connector*.jar" "lib\"
    echo MySQL connector copied from Downloads
)

if exist "%USERPROFILE%\Downloads\gson*.jar" (
    echo Found Gson in Downloads folder!
    if not exist "lib" mkdir lib
    copy "%USERPROFILE%\Downloads\gson*.jar" "lib\"
    echo Gson copied from Downloads
)

echo.
echo Final check - JAR files in backend\lib:
if exist "lib\*.jar" (
    dir "lib\*.jar"
    echo.
    echo ✅ JAR files are now in the correct location!
    echo You can now run: build-any-jars.bat
) else (
    echo ❌ No JAR files found anywhere.
    echo.
    echo Please download these files manually:
    echo 1. https://repo1.maven.org/maven2/com/mysql/mysql-connector-j/8.1.0/mysql-connector-j-8.1.0.jar
    echo 2. https://repo1.maven.org/maven2/com/google/code/gson/gson/2.10.1/gson-2.10.1.jar
    echo.
    echo Save both to: %CD%\lib\
)

pause
