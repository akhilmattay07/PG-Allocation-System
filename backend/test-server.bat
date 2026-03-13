@echo off
echo Testing PG Allocator Server...

echo Step 1: Testing connection...
java -cp "classes;lib\*" com.pgallocator.TestConnection

echo.
echo Step 2: Starting server (Press Ctrl+C to stop)...
echo Server should start on http://localhost:8080
echo.
echo After server starts, test these URLs in your browser:
echo - http://localhost:8080
echo - http://localhost:8080/api/pgs
echo.

java -cp "classes;lib\*" com.pgallocator.SimpleHTTPServer
