const mongoose = require("mongoose");

const harvestLotSchema = new mongoose.Schema(
  {
    farmerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },

    crop: {
      type: String,
      required: true,
      trim: true,
    },

    quantityKg: {
      type: Number,
      required: true,
      min: 0,
    },

    harvestDate: {
      type: Date,
      required: true,
    },

    location: {
      type: String,
      required: true,
      trim: true,
    },

    status: {
      type: String,
      enum: [
        "created",
        "sampling",
        "analyzing",
        "analyzed",
        "recommended",
      ],
      default: "created",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("HarvestLot", harvestLotSchema);