# PG Allocator - Full Stack Web Application

A complete Paying Guest (PG) accommodation search and management platform.

## 🏗️ Architecture
- **Frontend**: React (HTML, CSS, JS) - Port 3000
- **Backend**: Java + JDBC - Port 8080  
- **Database**: MySQL via PHPMyAdmin
- **Communication**: REST APIs (JSON)

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- Java JDK 17+
- MySQL Server
- XAMPP (for PHPMyAdmin)

### Database Setup
1. Start XAMPP and ensure MySQL is running
2. Open PHPMyAdmin (http://localhost/phpmyadmin)
3. Import `database/pg_allocator.sql`

### Backend Setup
```bash
cd backend
javac -cp "lib/*:." src/main/java/com/pgallocator/*.java
java -cp "lib/*:src/main/java" com.pgallocator.PGAllocatorServer
```

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

## 📁 Project Structure
```
PG_webapp/
├── frontend/          # React application
├── backend/           # Java backend with JDBC
├── database/          # MySQL schema and sample data
└── README.md
```

## 🎯 Features
- 🔍 PG Search with filters
- 🏠 Owner Dashboard for PG management
- 📱 Responsive design
- 🔐 User authentication
- 📊 Booking management
