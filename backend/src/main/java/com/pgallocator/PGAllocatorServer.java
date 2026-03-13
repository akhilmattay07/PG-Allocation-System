package com.pgallocator;

import com.pgallocator.dao.*;
import com.pgallocator.models.*;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.google.gson.reflect.TypeToken;

import org.eclipse.jetty.server.Server;
import org.eclipse.jetty.servlet.ServletContextHandler;
import org.eclipse.jetty.servlet.ServletHolder;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.BufferedReader;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

public class PGAllocatorServer extends HttpServlet {
    private static final Gson gson = new Gson();
    private static final UserDAO userDAO = new UserDAO();
    private static final PGListingDAO pgDAO = new PGListingDAO();
    private static final BookingDAO bookingDAO = new BookingDAO();
    
    public static void main(String[] args) {
        try {
            Server server = new Server(8080);
            
            ServletContextHandler context = new ServletContextHandler(ServletContextHandler.SESSIONS);
            context.setContextPath("/");
            server.setHandler(context);
            
            context.addServlet(new ServletHolder(new PGAllocatorServer()), "/api/*");
            
            server.start();
            System.out.println("PG Allocator Server started on http://localhost:8080");
            server.join();
        } catch (Exception e) {
            System.err.println("Server startup failed: " + e.getMessage());
            e.printStackTrace();
        }
    }
    
    @Override
    protected void doOptions(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        setCORSHeaders(resp);
        resp.setStatus(HttpServletResponse.SC_OK);
    }
    
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        setCORSHeaders(resp);
        String pathInfo = req.getPathInfo();
        
        try {
            if (pathInfo.equals("/pgs")) {
                handleGetAllPGs(req, resp);
            } else if (pathInfo.equals("/search")) {
                handleSearchPGs(req, resp);
            } else if (pathInfo.startsWith("/owner/pgs/")) {
                handleGetOwnerPGs(req, resp);
            } else if (pathInfo.startsWith("/pg/")) {
                handleGetPGById(req, resp);
            } else if (pathInfo.startsWith("/bookings/user/")) {
                handleGetUserBookings(req, resp);
            } else if (pathInfo.startsWith("/bookings/owner/")) {
                handleGetOwnerBookings(req, resp);
            } else {
                sendErrorResponse(resp, 404, "Endpoint not found");
            }
        } catch (Exception e) {
            sendErrorResponse(resp, 500, "Internal server error: " + e.getMessage());
        }
    }
    
    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        setCORSHeaders(resp);
        String pathInfo = req.getPathInfo();
        
        try {
            if (pathInfo.equals("/login")) {
                handleLogin(req, resp);
            } else if (pathInfo.equals("/register")) {
                handleRegister(req, resp);
            } else if (pathInfo.equals("/book")) {
                handleCreateBooking(req, resp);
            } else if (pathInfo.equals("/owner/add")) {
                handleAddPG(req, resp);
            } else {
                sendErrorResponse(resp, 404, "Endpoint not found");
            }
        } catch (Exception e) {
            sendErrorResponse(resp, 500, "Internal server error: " + e.getMessage());
        }
    }
    
    @Override
    protected void doPut(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        setCORSHeaders(resp);
        String pathInfo = req.getPathInfo();
        
        try {
            if (pathInfo.equals("/owner/update")) {
                handleUpdatePG(req, resp);
            } else if (pathInfo.startsWith("/booking/status/")) {
                handleUpdateBookingStatus(req, resp);
            } else {
                sendErrorResponse(resp, 404, "Endpoint not found");
            }
        } catch (Exception e) {
            sendErrorResponse(resp, 500, "Internal server error: " + e.getMessage());
        }
    }
    
    @Override
    protected void doDelete(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        setCORSHeaders(resp);
        String pathInfo = req.getPathInfo();
        
        try {
            if (pathInfo.startsWith("/owner/delete/")) {
                handleDeletePG(req, resp);
            } else {
                sendErrorResponse(resp, 404, "Endpoint not found");
            }
        } catch (Exception e) {
            sendErrorResponse(resp, 500, "Internal server error: " + e.getMessage());
        }
    }
    
    private void handleLogin(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        JsonObject requestBody = getRequestBody(req);
        String email = requestBody.get("email").getAsString();
        String password = requestBody.get("password").getAsString();
        
        User user = userDAO.authenticate(email, password);
        if (user != null) {
            JsonObject response = new JsonObject();
            response.addProperty("success", true);
            response.addProperty("message", "Login successful");
            response.add("user", gson.toJsonTree(user));
            sendJsonResponse(resp, 200, response);
        } else {
            sendErrorResponse(resp, 401, "Invalid credentials");
        }
    }
    
    private void handleRegister(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        JsonObject requestBody = getRequestBody(req);
        
        String email = requestBody.get("email").getAsString();
        if (userDAO.emailExists(email)) {
            sendErrorResponse(resp, 400, "Email already exists");
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
            sendJsonResponse(resp, 201, response);
        } else {
            sendErrorResponse(resp, 500, "Registration failed");
        }
    }
    
    private void handleGetAllPGs(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        List<PGListing> pgs = pgDAO.getAllPGs();
        sendJsonResponse(resp, 200, pgs);
    }
    
    private void handleSearchPGs(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        String city = req.getParameter("city");
        String minRentStr = req.getParameter("minRent");
        String maxRentStr = req.getParameter("maxRent");
        String sharingType = req.getParameter("sharingType");
        String gender = req.getParameter("gender");
        
        Double minRent = minRentStr != null ? Double.parseDouble(minRentStr) : null;
        Double maxRent = maxRentStr != null ? Double.parseDouble(maxRentStr) : null;
        
        List<PGListing> pgs = pgDAO.searchPGs(city, minRent, maxRent, sharingType, gender);
        sendJsonResponse(resp, 200, pgs);
    }
    
    private void handleGetOwnerPGs(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        String pathInfo = req.getPathInfo();
        int ownerId = Integer.parseInt(pathInfo.substring("/owner/pgs/".length()));
        
        List<PGListing> pgs = pgDAO.getPGsByOwner(ownerId);
        sendJsonResponse(resp, 200, pgs);
    }
    
    private void handleGetPGById(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        String pathInfo = req.getPathInfo();
        int pgId = Integer.parseInt(pathInfo.substring("/pg/".length()));
        
        PGListing pg = pgDAO.getPGById(pgId);
        if (pg != null) {
            sendJsonResponse(resp, 200, pg);
        } else {
            sendErrorResponse(resp, 404, "PG not found");
        }
    }
    
    private void handleAddPG(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        JsonObject requestBody = getRequestBody(req);
        
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
            sendJsonResponse(resp, 201, response);
        } else {
            sendErrorResponse(resp, 500, "Failed to add PG");
        }
    }
    
    private void handleUpdatePG(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        JsonObject requestBody = getRequestBody(req);
        
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
            sendJsonResponse(resp, 200, response);
        } else {
            sendErrorResponse(resp, 500, "Failed to update PG");
        }
    }
    
    private void handleDeletePG(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        String pathInfo = req.getPathInfo();
        String[] parts = pathInfo.split("/");
        int pgId = Integer.parseInt(parts[3]);
        int ownerId = Integer.parseInt(parts[4]);
        
        boolean success = pgDAO.deletePG(pgId, ownerId);
        if (success) {
            JsonObject response = new JsonObject();
            response.addProperty("success", true);
            response.addProperty("message", "PG deleted successfully");
            sendJsonResponse(resp, 200, response);
        } else {
            sendErrorResponse(resp, 500, "Failed to delete PG");
        }
    }
    
    private void handleCreateBooking(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        JsonObject requestBody = getRequestBody(req);
        
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
            sendJsonResponse(resp, 201, response);
        } else {
            sendErrorResponse(resp, 500, "Failed to create booking");
        }
    }
    
    private void handleGetUserBookings(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        String pathInfo = req.getPathInfo();
        int userId = Integer.parseInt(pathInfo.substring("/bookings/user/".length()));
        
        List<Booking> bookings = bookingDAO.getBookingsByUser(userId);
        sendJsonResponse(resp, 200, bookings);
    }
    
    private void handleGetOwnerBookings(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        String pathInfo = req.getPathInfo();
        int ownerId = Integer.parseInt(pathInfo.substring("/bookings/owner/".length()));
        
        List<Booking> bookings = bookingDAO.getBookingsByOwner(ownerId);
        sendJsonResponse(resp, 200, bookings);
    }
    
    private void handleUpdateBookingStatus(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        String pathInfo = req.getPathInfo();
        int bookingId = Integer.parseInt(pathInfo.substring("/booking/status/".length()));
        
        JsonObject requestBody = getRequestBody(req);
        String status = requestBody.get("status").getAsString();
        
        boolean success = bookingDAO.updateBookingStatus(bookingId, status);
        if (success) {
            JsonObject response = new JsonObject();
            response.addProperty("success", true);
            response.addProperty("message", "Booking status updated successfully");
            sendJsonResponse(resp, 200, response);
        } else {
            sendErrorResponse(resp, 500, "Failed to update booking status");
        }
    }
    
    private void setCORSHeaders(HttpServletResponse resp) {
        resp.setHeader("Access-Control-Allow-Origin", "*");
        resp.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        resp.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
        resp.setHeader("Access-Control-Max-Age", "3600");
    }
    
    private JsonObject getRequestBody(HttpServletRequest req) throws IOException {
        StringBuilder sb = new StringBuilder();
        BufferedReader reader = req.getReader();
        String line;
        while ((line = reader.readLine()) != null) {
            sb.append(line);
        }
        return JsonParser.parseString(sb.toString()).getAsJsonObject();
    }
    
    private void sendJsonResponse(HttpServletResponse resp, int statusCode, Object data) throws IOException {
        resp.setStatus(statusCode);
        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");
        resp.getWriter().write(gson.toJson(data));
    }
    
    private void sendErrorResponse(HttpServletResponse resp, int statusCode, String message) throws IOException {
        JsonObject error = new JsonObject();
        error.addProperty("success", false);
        error.addProperty("message", message);
        sendJsonResponse(resp, statusCode, error);
    }
}
