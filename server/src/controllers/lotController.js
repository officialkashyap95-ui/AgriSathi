const HarvestLot = require("../models/HarvestLot");
const SampleImage = require("../models/SampleImage");

/* =========================================
        CREATE HARVEST LOT
========================================= */

const createHarvestLot = async (req, res) => {
    try {
        const {
            crop,
            quantityKg,
            harvestDate,
            location,
        } = req.body;

        if (!crop) {
            return res.status(400).json({
                success: false,
                message: "Crop is required",
            });
        }

        if (
            quantityKg === undefined ||
            quantityKg === null ||
            Number(quantityKg) <= 0
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Quantity must be greater than 0",
            });
        }

        if (!harvestDate) {
            return res.status(400).json({
                success: false,
                message:
                    "Harvest date is required",
            });
        }

        if (!location?.trim()) {
            return res.status(400).json({
                success: false,
                message:
                    "Harvest location is required",
            });
        }

        const harvestLot =
            await HarvestLot.create({
                crop: crop.trim(),
                quantityKg: Number(quantityKg),
                harvestDate,
                location: location.trim(),
                status: "created",
            });

        return res.status(201).json({
            success: true,
            message:
                "Harvest lot created successfully",
            data: harvestLot,
        });
    } catch (error) {
        console.error(
            "Create harvest lot error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Failed to create harvest lot",
        });
    }
};

/* =========================================
        GET HARVEST LOTS
========================================= */

const getHarvestLots = async (
    req,
    res
) => {
    try {
        const lots =
            await HarvestLot.find()
                .sort({
                    createdAt: -1,
                });

        return res.status(200).json({
            success: true,
            count: lots.length,
            data: lots,
        });
    } catch (error) {
        console.error(
            "Get harvest lots error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Failed to fetch harvest lots",
        });
    }
};

/* =========================================
        GET SINGLE HARVEST LOT
========================================= */

const getHarvestLotById = async (
    req,
    res
) => {
    try {
        const { id } = req.params;

        const harvestLot =
            await HarvestLot.findById(id);

        if (!harvestLot) {
            return res.status(404).json({
                success: false,
                message:
                    "Harvest lot not found",
            });
        }

        return res.status(200).json({
            success: true,
            data: harvestLot,
        });
    } catch (error) {
        console.error(
            "Get harvest lot error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Failed to fetch harvest lot",
        });
    }
};

/* =========================================
        UPLOAD SAMPLE IMAGES
========================================= */

const uploadSampleImages = async (
    req,
    res
) => {
    try {
        const { id } = req.params;

        /* -------------------------------------
              CHECK LOT
        ------------------------------------- */

        const harvestLot =
            await HarvestLot.findById(id);

        if (!harvestLot) {
            return res.status(404).json({
                success: false,
                message:
                    "Harvest lot not found",
            });
        }

        /* -------------------------------------
              CHECK FILES
        ------------------------------------- */

        if (
            !req.files ||
            req.files.length === 0
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Please upload at least one sample image",
            });
        }

        /* -------------------------------------
              COUNT EXISTING SAMPLES
        ------------------------------------- */

        const existingSamples =
            await SampleImage.countDocuments({
                lotId: id,
            });

        const incomingCount =
            req.files.length;

        const totalSamples =
            existingSamples +
            incomingCount;

        /* -------------------------------------
              MINIMUM TOTAL
        ------------------------------------- */

        /*
         * Only reject if the total number
         * of samples is still below 5.
         *
         * This allows:
         *
         * First upload: 5
         * Later upload: +1
         */

        if (
            totalSamples < 5
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "At least 5 representative sample images are required.",
            });
        }

        /* -------------------------------------
              MAXIMUM TOTAL
        ------------------------------------- */

        if (
            totalSamples > 10
        ) {
            return res.status(400).json({
                success: false,
                message:
                    `A maximum of 10 sample images is allowed. You already have ${existingSamples} images, so you can add only ${10 - existingSamples} more.`,
            });
        }

        /* -------------------------------------
              CREATE DOCUMENTS
        ------------------------------------- */

        const sampleDocuments =
            req.files.map(
                (file, index) => ({
                    lotId: id,

                    sampleNumber:
                        existingSamples +
                        index +
                        1,

                    originalName:
                        file.originalname,

                    fileName:
                        file.filename,

                    filePath:
                        file.path,

                    mimeType:
                        file.mimetype,

                    size:
                        file.size,

                    qualityStatus:
                        "pending",
                })
            );

        const samples =
            await SampleImage.insertMany(
                sampleDocuments
            );

        /* -------------------------------------
              UPDATE LOT STATUS
        ------------------------------------- */

        harvestLot.status =
            "sampling";

        await harvestLot.save();

        /* -------------------------------------
              RESPONSE
        ------------------------------------- */

        return res.status(201).json({
            success: true,

            message:
                "Representative sample images uploaded successfully",

            count: samples.length,

            totalSamples,

            data: samples,
        });
    } catch (error) {
        console.error(
            "Upload sample images error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Failed to upload sample images",
        });
    }
};

/* =========================================
        GET SAMPLE IMAGES
========================================= */

const getSampleImages = async (
    req,
    res
) => {
    try {
        const { id } = req.params;

        const harvestLot =
            await HarvestLot.findById(id);

        if (!harvestLot) {
            return res.status(404).json({
                success: false,
                message:
                    "Harvest lot not found",
            });
        }

        const samples =
            await SampleImage.find({
                lotId: id,
            }).sort({
                sampleNumber: 1,
            });

        return res.status(200).json({
            success: true,
            count: samples.length,
            data: samples,
        });
    } catch (error) {
        console.error(
            "Get sample images error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Failed to fetch sample images",
        });
    }
};

/* =========================================
              EXPORTS
========================================= */

module.exports = {
    createHarvestLot,
    getHarvestLots,
    getHarvestLotById,
    uploadSampleImages,
    getSampleImages,
};