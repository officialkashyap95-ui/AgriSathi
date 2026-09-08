const express = require("express");

const {
  analyzeHarvestLot,
  getHarvestAnalysis,
} = require("../controllers/analysisController");

const router = express.Router();

// --------------------------------------------------
// Analyze harvest lot
// POST /api/lots/:id/analyze
// --------------------------------------------------

router.post(
  "/:id/analyze",
  analyzeHarvestLot
);

// --------------------------------------------------
// Get saved harvest analysis
// GET /api/lots/:id/analysis
// --------------------------------------------------

router.get(
  "/:id/analysis",
  getHarvestAnalysis
);

module.exports = router;