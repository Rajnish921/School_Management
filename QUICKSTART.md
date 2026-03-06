# Quick Start Guide - School Management API

## Step-by-Step Setup

### 1. Prerequisites Installation

#### Install Node.js

- Download from https://nodejs.org/ (LTS version recommended)
- Verify installation:
  ```bash
  node --version
  npm --version
  ```

#### Install MySQL

- Download from https://www.mysql.com/downloads/
- Or use a package manager:
  - Windows: `choco install mysql`
  - macOS: `brew install mysql`

### 2. Database Setup

#### Create Database and Table

Option A: Using MySQL Command Line

```bash
# Connect to MySQL
mysql -u root -p

# Create database and table (copy-paste the schema.sql content)
```

Option B: Using MySQL Workbench

1. Open MySQL Workbench
2. Create new connection or use existing
3. File → Open SQL Script → select `database/schema.sql`
4. Execute the script

#### Verify Database Creation

```bash
mysql -u root -p
SHOW DATABASES;
USE school_management;
SHOW TABLES;
SELECT * FROM schools;
```

### 3. Project Setup

```bash
# Navigate to project directory
cd assignment

# Install dependencies
npm install

# This installs:
# - express (web framework)
# - mysql2 (database driver)
# - dotenv (environment variables)
# - cors (cross-origin requests)
# - body-parser (request parsing)
# - nodemon (dev auto-reload) [dev only]
```

### 4. Configure Environment

Edit `.env` file:

```ini
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=school_management
PORT=3000
NODE_ENV=development
```

**Important:** Replace `your_mysql_password` with your actual MySQL password

### 5. Start the Server

```bash
# Production start
npm start

# Development start (with auto-reload)
npm run dev
```

Expected output:

```
School Management API Server is running on http://localhost:3000
Health check: http://localhost:3000/health
```

## Testing the APIs

### Method 1: Using Postman (Recommended)

1. **Import Collection**
   - Open Postman
   - Click "Import"
   - Select `postman_collection.json`
   - Click "Import"

2. **Update Base URL** (if needed)
   - In Postman, click "School Management API" collection
   - Go to Variables tab
   - Update `baseUrl` to your server URL

3. **Run Requests**
   - Select "Add School" and click Send
   - Select "List Schools - Sorted by Proximity" and click Send

### Method 2: Using cURL

#### Test 1: Health Check

```bash
curl http://localhost:3000/health
```

Expected Response:

```json
{
  "status": "OK",
  "message": "School Management API is running",
  "timestamp": "2026-03-06T10:00:00.000Z"
}
```

#### Test 2: Add School

```bash
curl -X POST http://localhost:3000/addSchool \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test School",
    "address": "123 Test Street",
    "latitude": 40.7128,
    "longitude": -74.0060
  }'
```

#### Test 3: List Schools

```bash
curl "http://localhost:3000/listSchools?latitude=40.7128&longitude=-74.0060"
```

### Method 3: Using Browser/JavaScript Fetch

Create a file `test.html`:

```html
<!DOCTYPE html>
<html>
  <head>
    <title>API Test</title>
  </head>
  <body>
    <h1>School Management API Test</h1>
    <button onclick="addSchool()">Add School</button>
    <button onclick="listSchools()">List Schools</button>
    <pre id="result"></pre>

    <script>
      const BASE_URL = "http://localhost:3000";

      async function addSchool() {
        try {
          const response = await fetch(`${BASE_URL}/addSchool`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: "Test School",
              address: "123 Test St",
              latitude: 40.7128,
              longitude: -74.006,
            }),
          });
          const data = await response.json();
          document.getElementById("result").textContent = JSON.stringify(
            data,
            null,
            2,
          );
        } catch (error) {
          document.getElementById("result").textContent =
            "Error: " + error.message;
        }
      }

      async function listSchools() {
        try {
          const response = await fetch(
            `${BASE_URL}/listSchools?latitude=40.7128&longitude=-74.0060`,
          );
          const data = await response.json();
          document.getElementById("result").textContent = JSON.stringify(
            data,
            null,
            2,
          );
        } catch (error) {
          document.getElementById("result").textContent =
            "Error: " + error.message;
        }
      }
    </script>
  </body>
</html>
```

## Common Issues & Solutions

### Issue: ENOENT: no such file or directory '.env'

**Solution:** Create `.env` file in project root with MySQL credentials

### Issue: ER_ACCESS_DENIED_FOR_USER

**Solution:** Check username/password in `.env` matches MySQL credentials

```bash
# Test MySQL connection
mysql -u root -p
```

### Issue: ER_BAD_DB_ERROR (unknown database)

**Solution:** Run the schema.sql script to create database:

```bash
mysql -u root -p < database/schema.sql
```

### Issue: Port 3000 already in use

**Solution:** Change PORT in `.env` or kill the process:

```
# Windows
netstat -ano | findstr :3000
taskkill /PID {PID} /F

# macOS/Linux
lsof -ti:3000 | xargs kill -9
```

### Issue: Cannot find module 'express' or other packages

**Solution:** Reinstall dependencies:

```bash
rm -rf node_modules package-lock.json
npm install
```

## API Endpoint Reference

| Method | Endpoint       | Purpose                   |
| ------ | -------------- | ------------------------- |
| GET    | `/health`      | Server health check       |
| POST   | `/addSchool`   | Add new school            |
| GET    | `/listSchools` | List schools by proximity |

## Validation Rules

### Add School Request

```
name        : Required, non-empty string, max 255 chars
address     : Required, non-empty string, max 500 chars
latitude    : Required, number, range: -90 to 90
longitude   : Required, number, range: -180 to 180
```

### List Schools Request

```
latitude    : Required, number, range: -90 to 90
longitude   : Required, number, range: -180 to 180
```

## Project Structure Reference

```
assignment/
├── config/db.js                    # DB connection pool
├── database/schema.sql             # Database schema
├── routes/schools.js               # API endpoints
├── utils/
│   ├── distance.js                 # Haversine distance calc
│   └── validation.js               # Input validation
├── .env                            # Configuration (not in git)
├── .gitignore                      # Git ignore rules
├── server.js                       # Express app entry point
├── package.json                    # Dependencies
├── README.md                       # Full documentation
├── QUICKSTART.md                   # This file
└── postman_collection.json         # Postman requests
```

## Next Steps

1. **Start Development:**

   ```bash
   npm run dev
   ```

2. **Test APIs:**
   - Use Postman collection
   - Or test with cURL commands

3. **Review Code:**
   - Check `server.js` for main configuration
   - Check `routes/schools.js` for API logic
   - Check `utils/` for helper functions

4. **Deploy (Optional):**
   - See Deployment section in README.md
   - Options: Heroku, Render, Railway, AWS, etc.

## Support Resources

- Node.js Docs: https://nodejs.org/docs/
- Express.js Docs: https://expressjs.com/
- MySQL Docs: https://dev.mysql.com/doc/
- Postman Docs: https://learning.postman.com/

---

**Created:** March 2026  
**Status:** Ready for Development & Testing
