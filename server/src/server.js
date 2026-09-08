const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const connectDB = require("./config/db");
const lotRoutes = require("./routes/lotRoutes");
const analysisRoutes = require("./routes/analysisRoutes");

const app = express();

const PORT = process.env.PORT || 5001;

// --------------------------------------------------
// Connect to MongoDB
// --------------------------------------------------

connectDB();

// --------------------------------------------------
// Middleware
// --------------------------------------------------

app.use(cors());

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

// --------------------------------------------------
// Static Files
// --------------------------------------------------

// Serve uploaded sample images
//
// Example:
// http://localhost:5001/uploads/samples/image.jpg
//
app.use(
  "/uploads",
  express.static(
    path.join(__dirname, "../uploads")
  )
);

// --------------------------------------------------
// API Routes
// --------------------------------------------------

// Harvest lot routes
//
// Examples:
// POST /api/lots
// GET  /api/lots
// GET  /api/lots/:id
// POST /api/lots/:id/samples
// GET  /api/lots/:id/samples
//
app.use(
  "/api/lots",
  lotRoutes
);

// Analysis routes
//
// Example:
// POST /api/lots/:id/analyze
//
app.use(
  "/api/lots",
  analysisRoutes
);

// --------------------------------------------------
// Health Check
// --------------------------------------------------

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "AgriSathi API is running",
  });
});

// --------------------------------------------------
// 404 Handler
// --------------------------------------------------

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// --------------------------------------------------
// Global Error Handler
// --------------------------------------------------

app.use((err, req, res, next) => {
  console.error(
    "Server error:",
    err
  );

  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
});

// --------------------------------------------------
// Start Server
// --------------------------------------------------

app.listen(PORT, () => {
  console.log(
    `AgriSathi server running on port ${PORT}`
  );
});