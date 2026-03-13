package com.pgallocator;

import com.pgallocator.dao.*;
import com.pgallocator.models.*;
import com.google.gson.Gson;
import com.pgallocator.utils.GsonConfig;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.google.gson.reflect.TypeToken;

import com.sun.net.httpserver.HttpServer;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpExchange;

import java.io.*;
import java.net.InetSocketAddress;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

public class SimpleHTTPServer {
    private static final Gson gson = GsonConfig.createGson();
    private static final UserDAO userDAO = new UserDAO();
    private static final PGListingDAO pgDAO = new PGListingDAO();
    private static final BookingDAO bookingDAO = new BookingDAO();
    
    public static void main(String[] args) {
        try {
            HttpServer server = HttpServer.create(new InetSocketAddress(8080), 0);
            
            // API endpoints
            server.createContext("/api/login", new LoginHandler());
            server.createContext("/api/register", new RegisterHandler());
            server.createContext("/api/pgs", new PGListHandler());
            server.createContext("/api/search", new SearchHandler());
            server.createContext("/api/pg/", new PGDetailHandler());
            server.createContext("/api/book", new BookingHandler());
            server.createContext("/api/owner/pgs/", new OwnerPGsHandler());
            server.createContext("/api/owner/add", new AddPGHandler());
            server.createContext("/api/owner/update", new UpdatePGHandler());
            server.createContext("/api/owner/delete/", new DeletePGHandler());
            server.createContext("/api/bookings/user/", new UserBookingsHandler());
            server.createContext("/api/bookings/owner/", new OwnerBookingsHandler());
            server.createContext("/api/booking/status/", new BookingStatusHandler());
            
            server.setExecutor(null);
            server.start();
            
            System.out.println("PG Allocator Server started on http://localhost:8080");
            System.out.println("API endpoints available:");
            System.out.println("- POST /api/login");
            System.out.println("- POST /api/register");
            System.out.println("- GET /api/pgs");
            System.out.println("- GET /api/search");
            System.out.println("- POST /api/book");
            System.out.println("- GET /api/owner/pgs/{ownerId}");
            System.out.println("- POST /api/owner/add");
            System.out.println("- PUT /api/owner/update");
            System.out.println("- DELETE /api/owner/delete/{pgId}/{ownerId}");
            System.out.println("- PUT /api/booking/status/{bookingId}");
            
        } catch (Exception e) {
            System.err.println("Server startup failed: " + e.getMessage());
            e.printStackTrace();
        }
    }
    
    static class LoginHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            setCORSHeaders(exchange);
            
            if ("OPTIONS".equals(exchange.getRequestMethod())) {
                exchange.sendResponseHeaders(200, -1);
                return;
            }
            
            if (!"POST".equals(exchange.getRequestMethod())) {
                sendErrorResponse(exchange, 405, "Method not allowed");
                return;
            }
            
            try {
                JsonObject requestBody = getRequestBody(exchange);
                String email = requestBody.get("email").getAsString();
                String password = requestBody.get("password").getAsString();
                
                User user = userDAO.authenticate(email, password);
                if (user != null) {
                    JsonObject response = new JsonObject();
                    response.addProperty("success", true);
                    response.addProperty("message", "Login successful");
                    response.add("user", gson.toJsonTree(user));
                    sendJsonResponse(exchange, 200, response);
                } else {
                    sendErrorResponse(exchange, 401, "Invalid credentials");
                }
            } catch (Exception e) {
                sendErrorResponse(exchange, 500, "Internal server error: " + e.getMessage());
            }
        }
    }
    
    static class RegisterHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            setCORSHeaders(exchange);
            
            if ("OPTIONS".equals(exchange.getRequestMethod())) {
                exchange.sendResponseHeaders(200, -1);
                return;
            }
            
            if (!"POST".equals(exchange.getRequestMethod())) {
                sendErrorResponse(exchange, 405, "Method not allowed");
                return;
            }
            
            try {
                JsonObject requestBody = getRequestBody(exchange);
                
                String email = requestBody.get("email").getAsString();
                if (userDAO.emailExists(email)) {
                    sendErrorResponse(exchange, 400, "Email already exists");
                    return;
                }
                
                User user = new User();
                user.setName(requestBody.get("name").getAsString());
                user.setEmail(email);
                user.setPassword(requestBody.get("password").getAsString());
                user.setRole(requestBody.get("role").getAsString());
                user.setPhone(requestBody.has("phone") ? requestBody.get("phone").getAsString() : null);
                
                boolean success = userDAO.registerUser(user);
                if (success) {
                    JsonObject response = new JsonObject();
                    response.addProperty("success", true);
                    response.addProperty("message", "Registration successful");
                    sendJsonResponse(exchange, 201, response);
                } else {
                    sendErrorResponse(exchange, 500, "Registration failed");
                }
            } catch (Exception e) {
                sendErrorResponse(exchange, 500, "Internal server error: " + e.getMessage());
            }
        }
    }
    
    static class PGListHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            setCORSHeaders(exchange);
            
            if ("OPTIONS".equals(exchange.getRequestMethod())) {
                exchange.sendResponseHeaders(200, -1);
                return;
            }
            
            if (!"GET".equals(exchange.getRequestMethod())) {
                sendErrorResponse(exchange, 405, "Method not allowed");
                return;
            }
            
            try {
                List<PGListing> pgs = pgDAO.getAllPGs();
                sendJsonResponse(exchange, 200, pgs);
            } catch (Exception e) {
                sendErrorResponse(exchange, 500, "Internal server error: " + e.getMessage());
            }
        }
    }
    
    static class SearchHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            setCORSHeaders(exchange);
            
            if ("OPTIONS".equals(exchange.getRequestMethod())) {
                exchange.sendResponseHeaders(200, -1);
                return;
            }
            
            if (!"GET".equals(exchange.getRequestMethod())) {
                sendErrorResponse(exchange, 405, "Method not allowed");
                return;
            }
            
            try {
                Map<String, String> params = parseQueryParams(exchange.getRequestURI().getQuery());
                
                String city = params.get("city");
                String minRentStr = params.get("minRent");
                String maxRentStr = params.get("maxRent");
                String sharingType = params.get("sharingType");
                String gender = params.get("gender");
                
                Double minRent = minRentStr != null ? Double.parseDouble(minRentStr) : null;
                Double maxRent = maxRentStr != null ? Double.parseDouble(maxRentStr) : null;
                
                List<PGListing> pgs = pgDAO.searchPGs(city, minRent, maxRent, sharingType, gender);
                sendJsonResponse(exchange, 200, pgs);
            } catch (Exception e) {
                sendErrorResponse(exchange, 500, "Internal server error: " + e.getMessage());
            }
        }
    }
    
    static class PGDetailHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            setCORSHeaders(exchange);
            
            if ("OPTIONS".equals(exchange.getRequestMethod())) {
                exchange.sendResponseHeaders(200, -1);
                return;
            }
            
            if (!"GET".equals(exchange.getRequestMethod())) {
                sendErrorResponse(exchange, 405, "Method not allowed");
                return;
            }
            
            try {
                String path = exchange.getRequestURI().getPath();
                int pgId = Integer.parseInt(path.substring("/api/pg/".length()));
                
                PGListing pg = pgDAO.getPGById(pgId);
                if (pg != null) {
                    sendJsonResponse(exchange, 200, pg);
                } else {
                    sendErrorResponse(exchange, 404, "PG not found");
                }
            } catch (Exception e) {
                sendErrorResponse(exchange, 500, "Internal server error: " + e.getMessage());
            }
        }
    }
    
    static class BookingHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            setCORSHeaders(exchange);
            
            if ("OPTIONS".equals(exchange.getRequestMethod())) {
                exchange.sendResponseHeaders(200, -1);
                return;
            }
            
            if (!"POST".equals(exchange.getRequestMethod())) {
                sendErrorResponse(exchange, 405, "Method not allowed");
                return;
            }
            
            try {
                JsonObject requestBody = getRequestBody(exchange);
                
                Booking booking = new Booking();
                booking.setPgId(requestBody.get("pgId").getAsInt());
                booking.setUserId(requestBody.get("userId").getAsInt());
                booking.setBookingDate(LocalDate.parse(requestBody.get("bookingDate").getAsString()));
                booking.setMessage(requestBody.has("message") ? requestBody.get("message").getAsString() : null);
                
                boolean success = bookingDAO.createBooking(booking);
                if (success) {
                    JsonObject response = new JsonObject();
                    response.addProperty("success", true);
                    response.addProperty("message", "Booking created successfully");
                    sendJsonResponse(exchange, 201, response);
                } else {
                    sendErrorResponse(exchange, 500, "Failed to create booking");
                }
            } catch (Exception e) {
                sendErrorResponse(exchange, 500, "Internal server error: " + e.getMessage());
            }
        }
    }
    
    static class OwnerPGsHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            setCORSHeaders(exchange);
            
            if ("OPTIONS".equals(exchange.getRequestMethod())) {
                exchange.sendResponseHeaders(200, -1);
                return;
            }
            
            if (!"GET".equals(exchange.getRequestMethod())) {
                sendErrorResponse(exchange, 405, "Method not allowed");
                return;
            }
            
            try {
                String path = exchange.getRequestURI().getPath();
                int ownerId = Integer.parseInt(path.substring("/api/owner/pgs/".length()));
                
                List<PGListing> pgs = pgDAO.getPGsByOwner(ownerId);
                sendJsonResponse(exchange, 200, pgs);
            } catch (Exception e) {
                sendErrorResponse(exchange, 500, "Internal server error: " + e.getMessage());
            }
        }
    }
    
    static class AddPGHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            setCORSHeaders(exchange);
            
            if ("OPTIONS".equals(exchange.getRequestMethod())) {
                exchange.sendResponseHeaders(200, -1);
                return;
            }
            
            if (!"POST".equals(exchange.getRequestMethod())) {
                sendErrorResponse(exchange, 405, "Method not allowed");
                return;
            }
            
            try {
                JsonObject requestBody = getRequestBody(exchange);
                
                PGListing pg = new PGListing();
                pg.setOwnerId(requestBody.get("ownerId").getAsInt());
                pg.setName(requestBody.get("name").getAsString());
                pg.setCity(requestBody.get("city").getAsString());
                pg.setAddress(requestBody.get("address").getAsString());
                pg.setRent(new BigDecimal(requestBody.get("rent").getAsString()));
                pg.setSharingType(requestBody.get("sharingType").getAsString());
                pg.setGenderPreference(requestBody.get("genderPreference").getAsString());
                
                List<String> amenities = gson.fromJson(requestBody.get("amenities"), new TypeToken<List<String>>(){}.getType());
                pg.setAmenities(amenities);
                
                pg.setImageUrl(requestBody.has("imageUrl") ? requestBody.get("imageUrl").getAsString() : null);
                pg.setDescription(requestBody.has("description") ? requestBody.get("description").getAsString() : null);
                pg.setAvailableRooms(requestBody.get("availableRooms").getAsInt());
                
                boolean success = pgDAO.addPG(pg);
                if (success) {
                    JsonObject response = new JsonObject();
                    response.addProperty("success", true);
                    response.addProperty("message", "PG added successfully");
                    sendJsonResponse(exchange, 201, response);
                } else {
                    sendErrorResponse(exchange, 500, "Failed to add PG");
                }
            } catch (Exception e) {
                sendErrorResponse(exchange, 500, "Internal server error: " + e.getMessage());
            }
        }
    }
    
    static class UpdatePGHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            setCORSHeaders(exchange);
            
            if ("OPTIONS".equals(exchange.getRequestMethod())) {
                exchange.sendResponseHeaders(200, -1);
                return;
            }
            
            if (!"PUT".equals(exchange.getRequestMethod())) {
                sendErrorResponse(exchange, 405, "Method not allowed");
                return;
            }
            
            try {
                JsonObject requestBody = getRequestBody(exchange);
                
                PGListing pg = new PGListing();
                pg.setId(requestBody.get("id").getAsInt());
                pg.setOwnerId(requestBody.get("ownerId").getAsInt());
                pg.setName(requestBody.get("name").getAsString());
                pg.setCity(requestBody.get("city").getAsString());
                pg.setAddress(requestBody.get("address").getAsString());
                pg.setRent(new BigDecimal(requestBody.get("rent").getAsString()));
                pg.setSharingType(requestBody.get("sharingType").getAsString());
                pg.setGenderPreference(requestBody.get("genderPreference").getAsString());
                
                List<String> amenities = gson.fromJson(requestBody.get("amenities"), new TypeToken<List<String>>(){}.getType());
                pg.setAmenities(amenities);
                
                pg.setImageUrl(requestBody.has("imageUrl") ? requestBody.get("imageUrl").getAsString() : null);
                pg.setDescription(requestBody.has("description") ? requestBody.get("description").getAsString() : null);
                pg.setAvailableRooms(requestBody.get("availableRooms").getAsInt());
                
                boolean success = pgDAO.updatePG(pg);
                if (success) {
                    JsonObject response = new JsonObject();
                    response.addProperty("success", true);
                    response.addProperty("message", "PG updated successfully");
                    sendJsonResponse(exchange, 200, response);
                } else {
                    sendErrorResponse(exchange, 500, "Failed to update PG");
                }
            } catch (Exception e) {
                sendErrorResponse(exchange, 500, "Internal server error: " + e.getMessage());
            }
        }
    }
    
    static class DeletePGHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            setCORSHeaders(exchange);
            
            if ("OPTIONS".equals(exchange.getRequestMethod())) {
                exchange.sendResponseHeaders(200, -1);
                return;
            }
            
            if (!"DELETE".equals(exchange.getRequestMethod())) {
                sendErrorResponse(exchange, 405, "Method not allowed");
                return;
            }
            
            try {
                String path = exchange.getRequestURI().getPath();
                String[] parts = path.split("/");
                int pgId = Integer.parseInt(parts[4]);
                int ownerId = Integer.parseInt(parts[5]);
                
                boolean success = pgDAO.deletePG(pgId, ownerId);
                if (success) {
                    JsonObject response = new JsonObject();
                    response.addProperty("success", true);
                    response.addProperty("message", "PG deleted successfully");
                    sendJsonResponse(exchange, 200, response);
                } else {
                    sendErrorResponse(exchange, 500, "Failed to delete PG");
                }
            } catch (Exception e) {
                sendErrorResponse(exchange, 500, "Internal server error: " + e.getMessage());
            }
        }
    }
    
    static class UserBookingsHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            setCORSHeaders(exchange);
            
            if ("OPTIONS".equals(exchange.getRequestMethod())) {
                exchange.sendResponseHeaders(200, -1);
                return;
            }
            
            if (!"GET".equals(exchange.getRequestMethod())) {
                sendErrorResponse(exchange, 405, "Method not allowed");
                return;
            }
            
            try {
                String path = exchange.getRequestURI().getPath();
                int userId = Integer.parseInt(path.substring("/api/bookings/user/".length()));
                
                List<Booking> bookings = bookingDAO.getBookingsByUser(userId);
                sendJsonResponse(exchange, 200, bookings);
            } catch (Exception e) {
                sendErrorResponse(exchange, 500, "Internal server error: " + e.getMessage());
            }
        }
    }
    
    static class OwnerBookingsHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            setCORSHeaders(exchange);
            
            if ("OPTIONS".equals(exchange.getRequestMethod())) {
                exchange.sendResponseHeaders(200, -1);
                return;
            }
            
            if (!"GET".equals(exchange.getRequestMethod())) {
                sendErrorResponse(exchange, 405, "Method not allowed");
                return;
            }
            
            try {
                String path = exchange.getRequestURI().getPath();
                int ownerId = Integer.parseInt(path.substring("/api/bookings/owner/".length()));
                
                List<Booking> bookings = bookingDAO.getBookingsByOwner(ownerId);
                sendJsonResponse(exchange, 200, bookings);
            } catch (Exception e) {
                sendErrorResponse(exchange, 500, "Internal server error: " + e.getMessage());
            }
        }
    }
    
    private static void setCORSHeaders(HttpExchange exchange) {
        exchange.getResponseHeaders().set("Access-Control-Allow-Origin", "*");
        exchange.getResponseHeaders().set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        exchange.getResponseHeaders().set("Access-Control-Allow-Headers", "Content-Type, Authorization");
        exchange.getResponseHeaders().set("Access-Control-Max-Age", "3600");
    }
    
    private static JsonObject getRequestBody(HttpExchange exchange) throws IOException {
        InputStream inputStream = exchange.getRequestBody();
        BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream));
        StringBuilder sb = new StringBuilder();
        String line;
        while ((line = reader.readLine()) != null) {
            sb.append(line);
        }
        return JsonParser.parseString(sb.toString()).getAsJsonObject();
    }
    
    private static void sendJsonResponse(HttpExchange exchange, int statusCode, Object data) throws IOException {
        String response = gson.toJson(data);
        exchange.getResponseHeaders().set("Content-Type", "application/json");
        exchange.sendResponseHeaders(statusCode, response.getBytes().length);
        OutputStream os = exchange.getResponseBody();
        os.write(response.getBytes());
        os.close();
    }
    
    private static void sendErrorResponse(HttpExchange exchange, int statusCode, String message) throws IOException {
        JsonObject error = new JsonObject();
        error.addProperty("success", false);
        error.addProperty("message", message);
        sendJsonResponse(exchange, statusCode, error);
    }
    
    private static Map<String, String> parseQueryParams(String query) {
        Map<String, String> params = new HashMap<>();
        if (query != null) {
            String[] pairs = query.split("&");
            for (String pair : pairs) {
                String[] keyValue = pair.split("=");
                if (keyValue.length == 2) {
                    params.put(keyValue[0], keyValue[1]);
                }
            }
        }
        return params;
    }
    
    // Booking Status Handler
    static class BookingStatusHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            setCORSHeaders(exchange);
            
            if ("OPTIONS".equals(exchange.getRequestMethod())) {
                exchange.sendResponseHeaders(200, -1);
                return;
            }
            
            if (!"PUT".equals(exchange.getRequestMethod())) {
                sendErrorResponse(exchange, 405, "Method not allowed");
                return;
            }
            
            try {
                String path = exchange.getRequestURI().getPath();
                int bookingId = Integer.parseInt(path.substring("/api/booking/status/".length()));
                
                JsonObject requestBody = getRequestBody(exchange);
                String status = requestBody.get("status").getAsString();
                
                boolean success = bookingDAO.updateBookingStatus(bookingId, status);
                
                if (success) {
                    JsonObject response = new JsonObject();
                    response.addProperty("success", true);
                    response.addProperty("message", "Booking status updated successfully");
                    sendJsonResponse(exchange, 200, response);
                } else {
                    sendErrorResponse(exchange, 400, "Failed to update booking status");
                }
            } catch (Exception e) {
                sendErrorResponse(exchange, 500, "Internal server error: " + e.getMessage());
            }
        }
    }
}
