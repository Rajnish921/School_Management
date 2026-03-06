# API Testing Guide - School Management System

Complete testing instructions for the School Management API

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Local Testing](#local-testing)
3. [Postman Testing](#postman-testing)
4. [cURL Testing](#curl-testing)
5. [JavaScript/Fetch Testing](#javascriptfetch-testing)
6. [Edge Cases & Validation](#edge-cases--validation)
7. [Performance Testing](#performance-testing)

---

## Prerequisites

### Required Software

- Node.js (v14+)
- npm
- MySQL Server (v5.7+)
- Postman (optional but recommended)
- cURL (comes with Windows 10+, macOS)

### Server Setup

1. Install dependencies: `npm install`
2. Configure `.env` with MySQL credentials
3. Create database: `mysql -u root -p < database/schema.sql`
4. Start server: `npm start`

Expected output:

```
School Management API Server is running on http://localhost:3000
Health check: http://localhost:3000/health
```

---

## Local Testing

### Test 1: Verify Server is Running

```bash
curl http://localhost:3000/health
```

**Expected Response (200 OK):**

```json
{
  "status": "OK",
  "message": "School Management API is running",
  "timestamp": "2026-03-06T10:30:00.000Z"
}
```

### Test 2: Verify Database Connection

The server logs should show successful MySQL connection. If database connection fails, check:

- MySQL is running
- Credentials in `.env` are correct
- Database `school_management` exists
- User has privileges

---

## Postman Testing

### Setup

1. **Import Collection**
   - Open Postman
   - Click "Import" (top-left)
   - Select `postman_collection.json`
   - Click "Import"

2. **Configure Environment**
   - In Postman, select "School Management API" collection
   - Go to Variables tab
   - Default `baseUrl`: `http://localhost:3000`
   - Update if using different hostname/port

3. **CORS Configuration**
   - If testing from browser, ensure CORS is enabled (already configured in server.js)

### Test Suite: Add School API

#### Test Case 1.1: Add Valid School

**Request:**

```
POST /addSchool
Content-Type: application/json

{
  "name": "Green Valley High School",
  "address": "123 Main Street, New York",
  "latitude": 40.7128,
  "longitude": -74.0060
}
```

**Expected Response (201 Created):**

```json
{
  "success": true,
  "message": "School added successfully",
  "data": {
    "id": 1,
    "name": "Green Valley High School",
    "address": "123 Main Street, New York",
    "latitude": 40.7128,
    "longitude": -74.006
  }
}
```

#### Test Case 1.2: Add School - Missing Name

**Request (Invalid):**

```json
{
  "name": "",
  "address": "123 Main Street",
  "latitude": 40.7128,
  "longitude": -74.006
}
```

**Expected Response (400 Bad Request):**

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": ["Name is required and must be a non-empty string"]
}
```

#### Test Case 1.3: Add School - Invalid Latitude

**Request (Invalid):**

```json
{
  "name": "Test School",
  "address": "123 Street",
  "latitude": 150,
  "longitude": -74.006
}
```

**Expected Response (400 Bad Request):**

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": ["Latitude must be a number between -90 and 90"]
}
```

#### Test Case 1.4: Add School - Invalid Longitude

**Request (Invalid):**

```json
{
  "name": "Test School",
  "address": "123 Street",
  "latitude": 40.7128,
  "longitude": 200
}
```

**Expected Response (400 Bad Request):**

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": ["Longitude must be a number between -180 and 180"]
}
```

#### Test Case 1.5: Add School - Missing Multiple Fields

**Request (Invalid):**

```json
{
  "name": "Test"
}
```

**Expected Response (400 Bad Request):**

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    "Address is required and must be a non-empty string",
    "Latitude is required",
    "Longitude is required"
  ]
}
```

### Test Suite: List Schools API

#### Test Case 2.1: List Schools - Valid Location

**Request:**

```
GET /listSchools?latitude=40.7128&longitude=-74.0060
```

**Expected Response (200 OK):**

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

#### Test Case 2.2: Verify Distance Sorting

When requesting list of schools:

- **Verify:** Schools sorted by distance (ascending)
- **Verify:** Closest school has smallest distance value
- **Verify:** Farthest school has largest distance value
- **Verify:** Distance calculated correctly using Haversine formula

#### Test Case 2.3: List Schools - Missing Latitude

**Request:**

```
GET /listSchools?longitude=-74.0060
```

**Expected Response (400 Bad Request):**

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": ["Latitude is required"]
}
```

#### Test Case 2.4: List Schools - Invalid Latitude

**Request:**

```
GET /listSchools?latitude=150&longitude=-74.0060
```

**Expected Response (400 Bad Request):**

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": ["Latitude must be a valid number between -90 and 90"]
}
```

#### Test Case 2.5: List Schools - Missing Longitude

**Request:**

```
GET /listSchools?latitude=40.7128
```

**Expected Response (400 Bad Request):**

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": ["Longitude is required"]
}
```

#### Test Case 2.6: List Schools - Invalid Longitude

**Request:**

```
GET /listSchools?latitude=40.7128&longitude=200
```

**Expected Response (400 Bad Request):**

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": ["Longitude must be a valid number between -180 and 180"]
}
```

#### Test Case 2.7: List Schools - No Parameters

**Request:**

```
GET /listSchools
```

**Expected Response (400 Bad Request):**

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": ["Latitude is required", "Longitude is required"]
}
```

---

## cURL Testing

### Add School with cURL

```bash
curl -X POST http://localhost:3000/addSchool \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Sunnybrook Academy",
    "address": "321 Elm Street",
    "latitude": 40.7489,
    "longitude": -73.9680
  }'
```

### List Schools with cURL

```bash
curl "http://localhost:3000/listSchools?latitude=40.7128&longitude=-74.0060"
```

### Pretty Print Response

```bash
curl "http://localhost:3000/listSchools?latitude=40.7128&longitude=-74.0060" | jq .
```

### Save Response to File

```bash
curl "http://localhost:3000/listSchools?latitude=40.7128&longitude=-74.0060" > response.json
```

---

## JavaScript/Fetch Testing

### Create Test File: `test.js`

```javascript
const BASE_URL = "http://localhost:3000";

// Test 1: Add School
async function testAddSchool() {
  console.log("Test 1: Adding school...");
  try {
    const response = await fetch(`${BASE_URL}/addSchool`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "Test School",
        address: "123 Test Street",
        latitude: 40.7128,
        longitude: -74.006,
      }),
    });

    const data = await response.json();
    console.log("Status:", response.status);
    console.log("Response:", JSON.stringify(data, null, 2));
    return data;
  } catch (error) {
    console.error("Error:", error.message);
  }
}

// Test 2: List Schools
async function testListSchools() {
  console.log("\nTest 2: Listing schools...");
  try {
    const response = await fetch(
      `${BASE_URL}/listSchools?latitude=40.7128&longitude=-74.0060`,
    );

    const data = await response.json();
    console.log("Status:", response.status);
    console.log("Response:", JSON.stringify(data, null, 2));

    if (data.data && Array.isArray(data.data)) {
      console.log("\nSchools sorted by distance:");
      data.data.forEach((school, index) => {
        console.log(
          `${index + 1}. ${school.name} - ${school.distance.toFixed(2)} km away`,
        );
      });
    }
  } catch (error) {
    console.error("Error:", error.message);
  }
}

// Test 3: Validation - Invalid Coordinates
async function testValidation() {
  console.log("\nTest 3: Testing validation...");
  try {
    const response = await fetch(`${BASE_URL}/addSchool`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "Invalid School",
        address: "Address",
        latitude: 150, // Invalid: > 90
        longitude: -74.006,
      }),
    });

    const data = await response.json();
    console.log("Status:", response.status);
    console.log("Validation Response:", JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Error:", error.message);
  }
}

// Run all tests
async function runAllTests() {
  await testAddSchool();
  await testListSchools();
  await testValidation();
}

runAllTests();
```

**Run with Node.js:**

```bash
node test.js
```

---

## Edge Cases & Validation

### Test All Boundary Values

#### Latitude Boundaries

- Valid: -90.0, -45.5, 0, 45.5, 90.0
- Invalid: -90.1, -91, 90.1, 91, 999

#### Longitude Boundaries

- Valid: -180.0, -90.5, 0, 90.5, 180.0
- Invalid: -180.1, -181, 180.1, 181, 999

#### String Fields

- Empty: `""`, `"   "` (whitespace only)
- Long strings: Test with 1000+ character names/addresses
- Special characters: Test with `"<script>", "'; DROP TABLE;"`
- Unicode: Test with non-ASCII characters

### Type Coercion Tests

#### Numeric String Parameters

```
GET /listSchools?latitude="40.7128"&longitude="-74.0060"
```

Should work (auto-conversion works)

#### Non-Numeric Parameters

```
GET /listSchools?latitude=ABC&longitude=XYZ
```

Should fail with validation error

---

## Performance Testing

### Load Testing with Apache Bench

Install Apache Bench:

```bash
# Windows: Download from Apache website
# macOS: brew install httpd
# Linux: sudo apt-get install apache2-utils
```

Run load test:

```bash
# Test add school endpoint
ab -n 1000 -c 10 -p payload.json \
  -T application/json \
  http://localhost:3000/addSchool

# Test list schools endpoint
ab -n 1000 -c 10 \
  "http://localhost:3000/listSchools?latitude=40.7128&longitude=-74.0060"
```

### Load Testing with Artillery

Install:

```bash
npm install -g artillery
```

Create `load-test.yml`:

```yaml
config:
  target: "http://localhost:3000"
  phases:
    - duration: 60
      arrivalRate: 10

scenarios:
  - name: "Add Schools"
    flow:
      - post:
          url: "/addSchool"
          json:
            name: "Test School"
            address: "123 Street"
            latitude: 40.7128
            longitude: -74.0060

  - name: "List Schools"
    flow:
      - get:
          url: "/listSchools?latitude=40.7128&longitude=-74.0060"
```

Run test:

```bash
artillery run load-test.yml
```

---

## Test Summary Template

```
Test Date: _______________
Tested By: ________________
Environment: Local / Staging / Production

API Endpoint Tests:
- [ ] GET /health - PASS / FAIL
- [ ] POST /addSchool - PASS / FAIL
- [ ] GET /listSchools - PASS / FAIL

Validation Tests:
- [ ] School name validation - PASS / FAIL
- [ ] Address validation - PASS / FAIL
- [ ] Latitude validation - PASS / FAIL
- [ ] Longitude validation - PASS / FAIL

Edge Cases:
- [ ] Boundary values - PASS / FAIL
- [ ] Empty strings - PASS / FAIL
- [ ] Special characters - PASS / FAIL
- [ ] Null/undefined values - PASS / FAIL

Performance:
- [ ] Response time < 500ms - PASS / FAIL
- [ ] Handles 100+ concurrent requests - PASS / FAIL

Notes:
_________________________________
_________________________________
```

---

## Troubleshooting

### Issue: "Cannot POST /addSchool"

- Check Content-Type header is `application/json`
- Verify JSON payload is valid
- Check server is running

### Issue: "Latitude must be a number between -90 and 90"

- Verify latitude value is within range
- Check it's a number, not string
- Try: `parseFloat(latitude)`

### Issue: Empty schools list

- Verify schools exist in database
- Connect to MySQL and run: `SELECT * FROM schools;`
- Add test schools if needed using Add School API

### Issue: Incorrect distance calculations

- Verify coordinates are correct
- Check Haversine formula implementation in `utils/distance.js`
- Calculate manually and compare

---

## Additional Resources

- HTTP Status Codes: https://httpwg.org/specs/rfc7231.html#status.codes
- JSON Specification: https://www.json.org/
- Postman Learning: https://learning.postman.com/
- Haversine Formula: https://wikipedia.org/wiki/Haversine_formula

---

**Version:** 1.0.0  
**Last Updated:** March 2026
