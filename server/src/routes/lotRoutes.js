const express = require("express")

const {
  createHarvestLot,
  getHarvestLots,
  getHarvestLotById,
  uploadSampleImages,
  getSampleImages,
} = require("../controllers/lotController")

const upload =
  require("../middleware/upload")

const router =
  express.Router()

/* =========================================
            HARVEST LOTS
========================================= */

router.post(
  "/",
  createHarvestLot
)

router.get(
  "/",
  getHarvestLots
)

router.get(
  "/:id",
  getHarvestLotById
)

/* =========================================
            SAMPLE IMAGES
========================================= */

router.post(
  "/:id/samples",
  upload.array("samples", 10),
  uploadSampleImages
)

router.get(
  "/:id/samples",
  getSampleImages
)

module.exports = router