package com.pgallocator.models;

import java.math.BigDecimal;
import java.util.List;

public class PGListing {
    private int id;
    private int ownerId;
    private String name;
    private String city;
    private String address;
    private BigDecimal rent;
    private String sharingType;
    private String genderPreference;
    private List<String> amenities;
    private String imageUrl;
    private String description;
    private int availableRooms;
    private boolean isVerified;
    
    public PGListing() {}
    
    public PGListing(int ownerId, String name, String city, String address, BigDecimal rent, 
                    String sharingType, String genderPreference, List<String> amenities, 
                    String imageUrl, String description, int availableRooms) {
        this.ownerId = ownerId;
        this.name = name;
        this.city = city;
        this.address = address;
        this.rent = rent;
        this.sharingType = sharingType;
        this.genderPreference = genderPreference;
        this.amenities = amenities;
        this.imageUrl = imageUrl;
        this.description = description;
        this.availableRooms = availableRooms;
    }
    
    // Getters and Setters
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }
    
    public int getOwnerId() { return ownerId; }
    public void setOwnerId(int ownerId) { this.ownerId = ownerId; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }
    
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    
    public BigDecimal getRent() { return rent; }
    public void setRent(BigDecimal rent) { this.rent = rent; }
    
    public String getSharingType() { return sharingType; }
    public void setSharingType(String sharingType) { this.sharingType = sharingType; }
    
    public String getGenderPreference() { return genderPreference; }
    public void setGenderPreference(String genderPreference) { this.genderPreference = genderPreference; }
    
    public List<String> getAmenities() { return amenities; }
    public void setAmenities(List<String> amenities) { this.amenities = amenities; }
    
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public int getAvailableRooms() { return availableRooms; }
    public void setAvailableRooms(int availableRooms) { this.availableRooms = availableRooms; }
    
    public boolean isVerified() { return isVerified; }
    public void setVerified(boolean verified) { isVerified = verified; }
}
