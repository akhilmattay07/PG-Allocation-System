package com.pgallocator.dao;

import com.pgallocator.DatabaseConnection;
import com.pgallocator.models.PGListing;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import java.lang.reflect.Type;

public class PGListingDAO {
    private Gson gson = new Gson();
    
    public List<PGListing> getAllPGs() {
        List<PGListing> pgList = new ArrayList<>();
        String sql = "SELECT * FROM pg_listings ORDER BY created_at DESC";
        
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql);
             ResultSet rs = stmt.executeQuery()) {
            
            while (rs.next()) {
                PGListing pg = mapResultSetToPG(rs);
                pgList.add(pg);
            }
        } catch (SQLException e) {
            System.err.println("Get all PGs error: " + e.getMessage());
        }
        return pgList;
    }
    
    public List<PGListing> searchPGs(String city, Double minRent, Double maxRent, String sharingType, String gender) {
        List<PGListing> pgList = new ArrayList<>();
        StringBuilder sql = new StringBuilder("SELECT * FROM pg_listings WHERE 1=1");
        List<Object> params = new ArrayList<>();
        
        if (city != null && !city.isEmpty()) {
            sql.append(" AND city LIKE ?");
            params.add("%" + city + "%");
        }
        if (minRent != null) {
            sql.append(" AND rent >= ?");
            params.add(minRent);
        }
        if (maxRent != null) {
            sql.append(" AND rent <= ?");
            params.add(maxRent);
        }
        if (sharingType != null && !sharingType.isEmpty()) {
            sql.append(" AND sharing_type = ?");
            params.add(sharingType);
        }
        if (gender != null && !gender.isEmpty()) {
            sql.append(" AND (gender_preference = ? OR gender_preference = 'any')");
            params.add(gender);
        }
        
        sql.append(" ORDER BY created_at DESC");
        
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql.toString())) {
            
            for (int i = 0; i < params.size(); i++) {
                stmt.setObject(i + 1, params.get(i));
            }
            
            ResultSet rs = stmt.executeQuery();
            while (rs.next()) {
                PGListing pg = mapResultSetToPG(rs);
                pgList.add(pg);
            }
        } catch (SQLException e) {
            System.err.println("Search PGs error: " + e.getMessage());
        }
        return pgList;
    }
    
    public List<PGListing> getPGsByOwner(int ownerId) {
        List<PGListing> pgList = new ArrayList<>();
        String sql = "SELECT * FROM pg_listings WHERE owner_id = ? ORDER BY created_at DESC";
        
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setInt(1, ownerId);
            ResultSet rs = stmt.executeQuery();
            
            while (rs.next()) {
                PGListing pg = mapResultSetToPG(rs);
                pgList.add(pg);
            }
        } catch (SQLException e) {
            System.err.println("Get PGs by owner error: " + e.getMessage());
        }
        return pgList;
    }
    
    public boolean addPG(PGListing pg) {
        String sql = "INSERT INTO pg_listings (owner_id, name, city, address, rent, sharing_type, gender_preference, amenities, image_url, description, available_rooms, is_verified) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, TRUE)";
        
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setInt(1, pg.getOwnerId());
            stmt.setString(2, pg.getName());
            stmt.setString(3, pg.getCity());
            stmt.setString(4, pg.getAddress());
            stmt.setBigDecimal(5, pg.getRent());
            stmt.setString(6, pg.getSharingType());
            stmt.setString(7, pg.getGenderPreference());
            stmt.setString(8, gson.toJson(pg.getAmenities()));
            stmt.setString(9, pg.getImageUrl());
            stmt.setString(10, pg.getDescription());
            stmt.setInt(11, pg.getAvailableRooms());
            
            int rowsAffected = stmt.executeUpdate();
            return rowsAffected > 0;
        } catch (SQLException e) {
            System.err.println("Add PG error: " + e.getMessage());
            return false;
        }
    }
    
    public boolean updatePG(PGListing pg) {
        String sql = "UPDATE pg_listings SET name = ?, city = ?, address = ?, rent = ?, " +
                    "sharing_type = ?, gender_preference = ?, amenities = ?, image_url = ?, " +
                    "description = ?, available_rooms = ? WHERE id = ? AND owner_id = ?";
        
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setString(1, pg.getName());
            stmt.setString(2, pg.getCity());
            stmt.setString(3, pg.getAddress());
            stmt.setBigDecimal(4, pg.getRent());
            stmt.setString(5, pg.getSharingType());
            stmt.setString(6, pg.getGenderPreference());
            stmt.setString(7, gson.toJson(pg.getAmenities()));
            stmt.setString(8, pg.getImageUrl());
            stmt.setString(9, pg.getDescription());
            stmt.setInt(10, pg.getAvailableRooms());
            stmt.setInt(11, pg.getId());
            stmt.setInt(12, pg.getOwnerId());
            
            int rowsAffected = stmt.executeUpdate();
            return rowsAffected > 0;
        } catch (SQLException e) {
            System.err.println("Update PG error: " + e.getMessage());
            return false;
        }
    }
    
    public boolean deletePG(int pgId, int ownerId) {
        String sql = "DELETE FROM pg_listings WHERE id = ? AND owner_id = ?";
        
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setInt(1, pgId);
            stmt.setInt(2, ownerId);
            
            int rowsAffected = stmt.executeUpdate();
            return rowsAffected > 0;
        } catch (SQLException e) {
            System.err.println("Delete PG error: " + e.getMessage());
            return false;
        }
    }
    
    public PGListing getPGById(int id) {
        String sql = "SELECT * FROM pg_listings WHERE id = ?";
        
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setInt(1, id);
            ResultSet rs = stmt.executeQuery();
            
            if (rs.next()) {
                return mapResultSetToPG(rs);
            }
        } catch (SQLException e) {
            System.err.println("Get PG by ID error: " + e.getMessage());
        }
        return null;
    }
    
    private PGListing mapResultSetToPG(ResultSet rs) throws SQLException {
        PGListing pg = new PGListing();
        pg.setId(rs.getInt("id"));
        pg.setOwnerId(rs.getInt("owner_id"));
        pg.setName(rs.getString("name"));
        pg.setCity(rs.getString("city"));
        pg.setAddress(rs.getString("address"));
        pg.setRent(rs.getBigDecimal("rent"));
        pg.setSharingType(rs.getString("sharing_type"));
        pg.setGenderPreference(rs.getString("gender_preference"));
        
        String amenitiesJson = rs.getString("amenities");
        if (amenitiesJson != null) {
            Type listType = new TypeToken<List<String>>(){}.getType();
            pg.setAmenities(gson.fromJson(amenitiesJson, listType));
        }
        
        pg.setImageUrl(rs.getString("image_url"));
        pg.setDescription(rs.getString("description"));
        pg.setAvailableRooms(rs.getInt("available_rooms"));
        pg.setVerified(rs.getBoolean("is_verified"));
        
        return pg;
    }
}
