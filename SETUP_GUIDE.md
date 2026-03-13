# 🚀 PG Allocator - Complete Setup Guide

## 📋 Prerequisites
- XAMPP installed and running
- Java JDK 17+ installed
- Node.js 16+ installed

## 🔧 Quick Setup (Automated)

### 1. Backend Setup
```bash
cd c:\xampp\htdocs\PG_webapp\backend
quick-setup.bat
```

### 2. Database Setup
1. Start XAMPP Control Panel
2. Start Apache and MySQL services
3. Open PHPMyAdmin: http://localhost/phpmyadmin
4. Import: `database/pg_allocator.sql`

### 3. Frontend Setup
```bash
cd c:\xampp\htdocs\PG_webapp\frontend
npm install
```

## 🚀 Running the Application

### Start Backend Server
```bash
cd c:\xampp\htdocs\PG_webapp\backend
run.bat
```
Server runs on: http://localhost:8080

### Start Frontend
```bash
cd c:\xampp\htdocs\PG_webapp\frontend
npm start
```
Frontend runs on: http://localhost:3000

## 🔍 Manual Setup (If Automated Fails)

### 1. Download JAR Files Manually
Save these files to `backend/lib/` folder:
- [MySQL Connector](https://repo1.maven.org/maven2/com/mysql/mysql-connector-j/8.2.0/mysql-connector-j-8.2.0.jar)
- [Gson](https://repo1.maven.org/maven2/com/google/code/gson/gson/2.10.1/gson-2.10.1.jar)

### 2. Build Backend
```bash
cd backend
build.bat
```

### 3. Test Connection
```bash
test-jdbc.bat
```

## 🎯 Demo Accounts
- **Admin**: admin@pgallocator.com / admin123
- **Owner**: jane@example.com / password123
- **Tenant**: john@example.com / password123

## 🔧 Troubleshooting

### Database Connection Issues
- Ensure XAMPP MySQL is running (green in control panel)
- Check if `pg_allocator` database exists in PHPMyAdmin
- Verify database import was successful

### Build Issues
- Ensure JAR files are in `backend/lib/` folder
- Check Java version: `java -version` (needs 17+)
- Try manual JAR download if automated fails

### Port Issues
- Backend uses port 8080
- Frontend uses port 3000
- Ensure these ports are not in use by other applications

## 📁 Project Structure
```
PG_webapp/
├── backend/
│   ├── lib/                     # JAR dependencies
│   ├── src/main/java/           # Java source code
│   ├── build.bat               # Build script
│   ├── run.bat                 # Run server
│   └── quick-setup.bat         # Automated setup
├── frontend/
│   ├── src/                    # React source code
│   ├── package.json            # Dependencies
│   └── public/                 # Static files
├── database/
│   └── pg_allocator.sql        # Database schema
└── README.md
```

## ✅ Success Indicators
- Backend console shows: "PG Allocator Server started on http://localhost:8080"
- Frontend opens in browser at http://localhost:3000
- You can login with demo accounts
- PG listings are visible on home page
