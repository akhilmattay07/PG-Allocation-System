package com.pgallocator.models;

public class BookingSimple {
    private int id;
    private int pgId;
    private int userId;
    private String bookingDate;  // Using String instead of LocalDate
    private String status;
    private String message;
    
    public BookingSimple() {}
    
    public BookingSimple(int pgId, int userId, String bookingDate, String message) {
        this.pgId = pgId;
        this.userId = userId;
        this.bookingDate = bookingDate;
        this.message = message;
        this.status = "pending";
    }
    
    // Getters and Setters
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }
    
    public int getPgId() { return pgId; }
    public void setPgId(int pgId) { this.pgId = pgId; }
    
    public int getUserId() { return userId; }
    public void setUserId(int userId) { this.userId = userId; }
    
    public String getBookingDate() { return bookingDate; }
    public void setBookingDate(String bookingDate) { this.bookingDate = bookingDate; }
    
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}
