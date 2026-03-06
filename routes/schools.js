const express = require("express");
const router = express.Router();
const pool = require("../config/db");

const {
  validateSchoolData,
  validateCoordinates,
} = require("../utils/validation");

const { calculateDistance } = require("../utils/distance");

/**
 * POST /addSchool
 */
router.post("/addSchool", async (req, res) => {
  try {
    const { name, address, latitude, longitude } = req.body;

    // Validate input
    const { isValid, errors } = validateSchoolData({
      name,
      address,
      latitude,
      longitude,
    });

    if (!isValid) {
      return res.status(400).json({
        success: false,
        errors,
      });
    }

    const lat = parseFloat(latitude);
    const lon = parseFloat(longitude);

    const query =
      "INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)";

    const [result] = await pool.execute(query, [name, address, lat, lon]);

    res.status(201).json({
      success: true,
      message: "School added successfully",
      data: {
        id: result.insertId,
        name,
        address,
        latitude: lat,
        longitude: lon,
      },
    });
  } catch (error) {
    console.error("Add School Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

/**
 * GET /listSchools?latitude=xx&longitude=yy
 */
router.get("/listSchools", async (req, res) => {
  try {
    // Convert query parameters to numbers
    const userLat = parseFloat(req.query.latitude);
    const userLon = parseFloat(req.query.longitude);

    // Validate input
    if (isNaN(userLat) || isNaN(userLon)) {
      return res.status(400).json({
        success: false,
        message: "Latitude and Longitude are required and must be numbers",
      });
    }

    // Fetch all schools
    const [schools] = await pool.execute("SELECT * FROM schools");

    // Calculate distance for each school
    const schoolsWithDistance = schools.map((school) => ({
      ...school,
      distance: Number(
        calculateDistance(
          userLat,
          userLon,
          school.latitude,
          school.longitude,
        ).toFixed(2),
      ),
    }));

    // Sort by nearest first
    schoolsWithDistance.sort((a, b) => a.distance - b.distance);

    // Send response
    res.json({
      success: true,
      userLocation: {
        latitude: userLat,
        longitude: userLon,
      },
      totalCount: schoolsWithDistance.length,
      data: schoolsWithDistance,
    });
  } catch (error) {
    console.error("Error fetching schools:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

module.exports = router;
