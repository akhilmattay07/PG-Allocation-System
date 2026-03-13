package com.pgallocator.models;

import java.time.LocalDate;

public class Booking {
    private int id;
    private int pgId;
    private int userId;
    private LocalDate bookingDate;
    private String status;
    private String message;
    
    public Booking() {}
    
    public Booking(int pgId, int userId, LocalDate bookingDate, String message) {
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
    
    public LocalDate getBookingDate() { return bookingDate; }
    public void setBookingDate(LocalDate bookingDate) { this.bookingDate = bookingDate; }
    
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    
    // Helper method for JSON serialization
    public String getBookingDateString() {
        return bookingDate != null ? bookingDate.toString() : null;
    }
    
    public void setBookingDateString(String dateString) {
        this.bookingDate = dateString != null ? LocalDate.parse(dateString) : null;
    }
}
