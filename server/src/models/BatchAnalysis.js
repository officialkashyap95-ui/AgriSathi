const mongoose = require("mongoose");

const batchAnalysisSchema = new mongoose.Schema(
  {
    lotId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "HarvestLot",
      required: true,
      unique: true,
    },

    samplesAnalyzed: {
      type: Number,
      required: true,
      min: 0,
    },

    totalDetections: {
      type: Number,
      required: true,
      min: 0,
    },

    averageConfidence: {
      type: Number,
      required: true,
      min: 0,
      max: 1,
    },

    qualityDistribution: {
      gradeA: {
        type: Number,
        required: true,
        min: 0,
        max: 100,
      },

      gradeB: {
        type: Number,
        required: true,
        min: 0,
        max: 100,
      },

      recovery: {
        type: Number,
        required: true,
        min: 0,
        max: 100,
      },
    },

    estimatedQuantityKg: {
      gradeA: {
        type: Number,
        required: true,
        min: 0,
      },

      gradeB: {
        type: Number,
        required: true,
        min: 0,
      },

      recovery: {
        type: Number,
        required: true,
        min: 0,
      },
    },

    assessmentMode: {
      type: String,
      enum: ["demo", "ai"],
      default: "demo",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "BatchAnalysis",
  batchAnalysisSchema
);