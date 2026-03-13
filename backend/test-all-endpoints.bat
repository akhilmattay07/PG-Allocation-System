@echo off
echo Testing All PG Allocator Endpoints...

echo.
echo Open these URLs in your browser to test:
echo.
echo 1. All PGs: http://localhost:8080/api/pgs
echo 2. User 2 bookings: http://localhost:8080/api/bookings/user/2
echo 3. Owner 3 PGs: http://localhost:8080/api/owner/pgs/3
echo 4. Search Bangalore: http://localhost:8080/api/search?city=Bangalore
echo.
echo To test booking status update, use a REST client like Postman:
echo PUT http://localhost:8080/api/booking/status/1
echo Body: {"status": "confirmed"}
echo.
echo Expected results:
echo - All PGs should include newly added ones
echo - Bookings should load without LocalDate errors
echo - Booking status updates should work (no 405 errors)
echo.

pause
