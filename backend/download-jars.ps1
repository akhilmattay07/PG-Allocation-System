# PowerShell script to download required JAR files
Write-Host "Downloading required JAR files..." -ForegroundColor Green

# Create lib directory if it doesn't exist
if (!(Test-Path "lib")) {
    New-Item -ItemType Directory -Path "lib"
    Write-Host "Created lib directory" -ForegroundColor Yellow
}

# Download MySQL Connector
Write-Host "Downloading MySQL Connector..." -ForegroundColor Cyan
try {
    Invoke-WebRequest -Uri "https://repo1.maven.org/maven2/com/mysql/mysql-connector-j/8.2.0/mysql-connector-j-8.2.0.jar" -OutFile "lib\mysql-connector-j-8.2.0.jar"
    Write-Host "✅ MySQL Connector downloaded successfully" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to download MySQL Connector" -ForegroundColor Red
    Write-Host "Please download manually from: https://repo1.maven.org/maven2/com/mysql/mysql-connector-j/8.2.0/mysql-connector-j-8.2.0.jar" -ForegroundColor Yellow
}

# Download Gson
Write-Host "Downloading Gson..." -ForegroundColor Cyan
try {
    Invoke-WebRequest -Uri "https://repo1.maven.org/maven2/com/google/code/gson/gson/2.10.1/gson-2.10.1.jar" -OutFile "lib\gson-2.10.1.jar"
    Write-Host "✅ Gson downloaded successfully" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to download Gson" -ForegroundColor Red
    Write-Host "Please download manually from: https://repo1.maven.org/maven2/com/google/code/gson/gson/2.10.1/gson-2.10.1.jar" -ForegroundColor Yellow
}

Write-Host "Setup complete! Check lib directory:" -ForegroundColor Green
Get-ChildItem lib
