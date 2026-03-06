# School Management System - API Documentation

## Overview

A Node.js-based REST API for managing school information and finding schools by proximity to a user's location.

## Project Structure

```
school-management-api/
├── config/
│   └── db.js                 # Database configuration
├── database/
│   └── schema.sql            # MySQL database schema
├── routes/
│   └── schools.js            # School API routes
├── utils/
│   ├── distance.js           # Distance calculation utility
│   └── validation.js         # Input validation utility
├── .env                      # Environment variables
├── server.js                 # Main server file
├── package.json              # Dependencies
└── README.md                 # This file
```

## Prerequisites

- Node.js (v14 or higher)
- MySQL Server (v5.7 or higher)
- npm or yarn

## Installation

### 1. Clone/Setup Repository

```bash
cd path/to/assignment
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Database

#### Step 1: Create MySQL Database

Run the schema.sql file in your MySQL client:

```bash
mysql -u root -p < database/schema.sql
```

Or manually execute in MySQL:

```sql
CREATE DATABASE IF NOT EXISTS school_management;
USE school_management;

CREATE TABLE IF NOT EXISTS schools (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  address VARCHAR(500) NOT NULL,
  latitude FLOAT NOT NULL,
  longitude FLOAT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_location (latitude, longitude)
);
```

#### Step 2: Update .env Configuration

Edit the `.env` file with your MySQL credentials:

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=school_management
PORT=3000
NODE_ENV=development
```

### 4. Run the Server

```bash
npm start
```

Or for development with auto-reload:

```bash
npm run dev
```

The server will start on `http://localhost:3000`

## API Endpoints

### 1. Health Check

- **Endpoint:** `GET /health`
- **Description:** Check if the server is running
- **Response:**

```json
{
  "status": "OK",
  "message": "School Management API is running",
  "timestamp": "2026-03-06T10:00:00.000Z"
}
```

### 2. Add School API

- **Endpoint:** `POST /addSchool`
- **Method:** POST
- **Content-Type:** application/json

**Request Payload:**

```json
{
  "name": "Green Valley High School",
  "address": "123 Main Street",
  "latitude": 40.7128,
  "longitude": -74.006
}
```

**Validation Rules:**

- `name`: Required, non-empty string
- `address`: Required, non-empty string
- `latitude`: Required, number between -90 and 90
- `longitude`: Required, number between -180 and 180

**Success Response (201):**

```json
{
  "success": true,
  "message": "School added successfully",
  "data": {
    "id": 1,
    "name": "Green Valley High School",
    "address": "123 Main Street",
    "latitude": 40.7128,
    "longitude": -74.006
  }
}
```

**Error Response (400):**

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": ["Latitude must be a number between -90 and 90"]
}
```

### 3. List Schools API (Sorted by Proximity)

- **Endpoint:** `GET /listSchools`
- **Method:** GET
- **Query Parameters:**
  - `latitude` (required): User's latitude (-90 to 90)
  - `longitude` (required): User's longitude (-180 to 180)

**Example Request:**

```
GET /listSchools?latitude=40.7128&longitude=-74.0060
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Schools retrieved successfully",
  "userLocation": {
    "latitude": 40.7128,
    "longitude": -74.006
  },
  "data": [
    {
      "id": 1,
      "name": "Green Valley High School",
      "address": "123 Main Street",
      "latitude": 40.7128,
      "longitude": -74.006,
      "distance": 0.0,
      "coordinates": {
        "latitude": 40.7128,
        "longitude": -74.006
      }
    },
    {
      "id": 2,
      "name": "Riverside Elementary",
      "address": "456 Oak Avenue",
      "latitude": 40.758,
      "longitude": -73.9855,
      "distance": 5.23,
      "coordinates": {
        "latitude": 40.758,
        "longitude": -73.9855
      }
    }
  ],
  "totalCount": 2
}
```

**Error Response (400):**

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": ["Latitude is required", "Longitude is required"]
}
```

## Distance Calculation

The API uses the **Haversine formula** to calculate the distance between two geographical coordinates. The distance is returned in **kilometers (km)**.

### Haversine Formula:

- R = Earth's radius (6,371 km)
- Accurate for most practical applications
- Accounts for the spherical shape of the earth

## Testing with Postman

### Import Postman Collection

1. Open Postman
2. Click "Import"
3. Select the provided `postman_collection.json` file
4. The collection will be imported with all endpoints pre-configured

### Manual Testing Steps

#### Test 1: Add Schools

1. Set method to POST
2. URL: `http://localhost:3000/addSchool`
3. Headers: `Content-Type: application/json`
4. Body (raw JSON):

```json
{
  "name": "Test School",
  "address": "Test Address",
  "latitude": 40.7128,
  "longitude": -74.006
}
```

5. Send and verify 201 status

#### Test 2: List Schools

1. Set method to GET
2. URL: `http://localhost:3000/listSchools?latitude=40.7128&longitude=-74.0060`
3. Send and verify schools are returned sorted by distance

## Deployment

### Local Testing

```bash
npm start
```

### Production Deployment (Example: Heroku)

1. **Create Heroku Account** and install Heroku CLI
2. **Login to Heroku:**
   ```bash
   heroku login
   ```
3. **Create Heroku App:**
   ```bash
   heroku create your-app-name
   ```
4. **Add MySQL Database** (using JawsDB or ClearDB)
5. **Set Environment Variables:**
   ```bash
   heroku config:set DB_HOST=your_db_host
   heroku config:set DB_USER=your_db_user
   heroku config:set DB_PASSWORD=your_db_password
   heroku config:set DB_NAME=your_db_name
   ```
6. **Deploy:**
   ```bash
   git push heroku main
   ```

### Deployment on Other Platforms

- **Render** (formerly Seed)
- **Railway**
- **AWS ECS/EC2**
- **DigitalOcean App Platform**
- **Azure App Service**

## Error Handling

The API implements comprehensive error handling:

- **400 Bad Request** - Validation errors
- **404 Not Found** - Invalid endpoint
- **500 Internal Server Error** - Server-side issues

All error responses follow this format:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message"
}
```

## Best Practices Implemented

1. **Input Validation** - All inputs are validated before processing
2. **Connection Pooling** - Efficient database connection management
3. **Error Handling** - Comprehensive error handling and logging
4. **Security** - CORS enabled, input sanitization
5. **Scalability** - Efficient distance calculation algorithm
6. **Code Organization** - Modular structure with utilities and routes

## Future Enhancements

- Authentication & Authorization (JWT)
- Rate Limiting
- Database Caching
- Advanced Filtering (by school type, rating, etc.)
- School Update/Delete APIs
- Student Management
- Enrollment System

## Troubleshooting

### Issue: "Cannot find module 'mysql2'"

**Solution:** Run `npm install`

### Issue: "Connection refused to MySQL"

**Solution:**

- Check MySQL is running
- Verify DB credentials in .env
- Ensure database exists

### Issue: "Port 3000 already in use"

**Solution:** Change PORT in .env or kill the process using port 3000

## Support

For issues or questions, please refer to the API documentation above or review the source code comments.

---

**Version:** 1.0.0  
**Last Updated:** March 2026
