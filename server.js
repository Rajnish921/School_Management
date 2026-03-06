require("dotenv").config();
const express = require("express");
const cors = require("cors");

const schoolRoutes = require("./routes/schools");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json()); // Built-in JSON parser
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/", schoolRoutes);

// Status Check Route
app.get("/status", (req, res) => {
  res.json({
    status: "OK",
    message: "School Management API is running",
  });
});

// 404 Route Handler
app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    message: "Something went wrong",
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
