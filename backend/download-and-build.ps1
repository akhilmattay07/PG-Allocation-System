# PowerShell script to download JARs and build the project
Write-Host "PG Allocator - Download and Build Script" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan

# Clean up
Write-Host "Cleaning up old files..." -ForegroundColor Yellow
if (Test-Path "classes") { Remove-Item -Recurse -Force "classes" }
if (Test-Path "lib") { Remove-Item -Recurse -Force "lib" }

# Create directories
New-Item -ItemType Directory -Path "classes" -Force | Out-Null
New-Item -ItemType Directory -Path "lib" -Force | Out-Null

# Download JAR files
Write-Host "Downloading MySQL Connector..." -ForegroundColor Green
try {
    $url1 = "https://repo1.maven.org/maven2/com/mysql/mysql-connector-j/8.1.0/mysql-connector-j-8.1.0.jar"
    Invoke-WebRequest -Uri $url1 -OutFile "lib\mysql-connector-j-8.1.0.jar" -UseBasicParsing
    Write-Host "✅ MySQL Connector downloaded" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to download MySQL Connector: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host "Downloading Gson..." -ForegroundColor Green
try {
    $url2 = "https://repo1.maven.org/maven2/com/google/code/gson/gson/2.10.1/gson-2.10.1.jar"
    Invoke-WebRequest -Uri $url2 -OutFile "lib\gson-2.10.1.jar" -UseBasicParsing
    Write-Host "✅ Gson downloaded" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to download Gson: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Verify downloads
Write-Host "Verifying downloads..." -ForegroundColor Yellow
if (!(Test-Path "lib\mysql-connector-j-8.1.0.jar")) {
    Write-Host "❌ MySQL connector not found" -ForegroundColor Red
    exit 1
}
if (!(Test-Path "lib\gson-2.10.1.jar")) {
    Write-Host "❌ Gson not found" -ForegroundColor Red
    exit 1
}

Write-Host "✅ All JAR files ready" -ForegroundColor Green

# Compile Java files
Write-Host "Compiling Java files..." -ForegroundColor Cyan

Write-Host "  Compiling models..." -ForegroundColor Yellow
& javac -d classes src\main\java\com\pgallocator\models\User.java
& javac -d classes src\main\java\com\pgallocator\models\PGListing.java
& javac -d classes src\main\java\com\pgallocator\models\Booking.java

Write-Host "  Compiling database connection..." -ForegroundColor Yellow
& javac -cp "lib\*;classes" -d classes src\main\java\com\pgallocator\DatabaseConnection.java

Write-Host "  Compiling DAOs..." -ForegroundColor Yellow
& javac -cp "lib\*;classes" -d classes src\main\java\com\pgallocator\dao\UserDAO.java
& javac -cp "lib\*;classes" -d classes src\main\java\com\pgallocator\dao\PGListingDAO.java
& javac -cp "lib\*;classes" -d classes src\main\java\com\pgallocator\dao\BookingDAO.java

Write-Host "  Compiling main classes..." -ForegroundColor Yellow
& javac -cp "lib\*;classes" -d classes src\main\java\com\pgallocator\TestConnection.java
& javac -cp "lib\*;classes" -d classes src\main\java\com\pgallocator\SimpleHTTPServer.java

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ Build completed successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "1. Test connection: java -cp `"classes;lib\*`" com.pgallocator.TestConnection" -ForegroundColor White
    Write-Host "2. Start server: java -cp `"classes;lib\*`" com.pgallocator.SimpleHTTPServer" -ForegroundColor White
    Write-Host ""
} else {
    Write-Host "❌ Compilation failed" -ForegroundColor Red
    exit 1
}

Read-Host "Press Enter to continue"
