package com.pgallocator;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class SimpleDatabaseConnection {
    private static final String URL = "jdbc:mysql://localhost:3306/pg_allocator?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC";
    private static final String USERNAME = "root";
    private static final String PASSWORD = "";
    
    private static Connection connection = null;
    
    public static Connection getConnection() {
        try {
            if (connection == null || connection.isClosed()) {
                // Load MySQL JDBC Driver
                Class.forName("com.mysql.cj.jdbc.Driver");
                connection = DriverManager.getConnection(URL, USERNAME, PASSWORD);
                System.out.println("✅ Database connection established successfully!");
                return connection;
            }
        } catch (ClassNotFoundException e) {
            System.err.println("❌ MySQL JDBC Driver not found!");
            System.err.println("Please ensure mysql-connector-j-8.2.0.jar is in the lib folder");
            System.err.println("Run: powershell -ExecutionPolicy Bypass -File download-jars.ps1");
        } catch (SQLException e) {
            System.err.println("❌ Database connection failed: " + e.getMessage());
            System.err.println("Make sure:");
            System.err.println("1. XAMPP MySQL is running");
            System.err.println("2. Database 'pg_allocator' exists");
            System.err.println("3. Import database/pg_allocator.sql in PHPMyAdmin");
        }
        return connection;
    }
    
    public static void closeConnection() {
        try {
            if (connection != null && !connection.isClosed()) {
                connection.close();
                System.out.println("Database connection closed.");
            }
        } catch (SQLException e) {
            System.err.println("Error closing database connection: " + e.getMessage());
        }
    }
    
    public static boolean testConnection() {
        Connection conn = getConnection();
        if (conn != null) {
            try {
                // Test with a simple query
                conn.createStatement().executeQuery("SELECT 1");
                System.out.println("✅ Database connection test successful!");
                return true;
            } catch (SQLException e) {
                System.err.println("❌ Database connection test failed: " + e.getMessage());
                return false;
            }
        }
        return false;
    }
}
