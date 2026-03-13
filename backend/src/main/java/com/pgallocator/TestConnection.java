package com.pgallocator;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.Statement;

public class TestConnection {
    public static void main(String[] args) {
        System.out.println("Testing JDBC Connection to MySQL...");
        
        try {
            // Get connection
            Connection conn = DatabaseConnection.getConnection();
            
            if (conn != null) {
                System.out.println("✅ Connection successful!");
                
                // Test query
                Statement stmt = conn.createStatement();
                ResultSet rs = stmt.executeQuery("SELECT COUNT(*) as count FROM users");
                
                if (rs.next()) {
                    int userCount = rs.getInt("count");
                    System.out.println("✅ Database query successful!");
                    System.out.println("📊 Total users in database: " + userCount);
                }
                
                // Test sample data
                rs = stmt.executeQuery("SELECT name, email, role FROM users LIMIT 3");
                System.out.println("\n📋 Sample users:");
                while (rs.next()) {
                    System.out.println("- " + rs.getString("name") + 
                                     " (" + rs.getString("email") + ") - " + 
                                     rs.getString("role"));
                }
                
                rs.close();
                stmt.close();
                
            } else {
                System.out.println("❌ Connection failed!");
            }
            
        } catch (Exception e) {
            System.out.println("❌ Error: " + e.getMessage());
            e.printStackTrace();
        } finally {
            DatabaseConnection.closeConnection();
        }
    }
}
