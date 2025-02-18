const express = require("express");
const { generateUploadURL, listS3Images } = require("../services/S3Service");

const router = express.Router();

// Endpoint to get a presigned URL for image upload.
router.get("/s3Url", async (req, res) => {
    try {
        const { fileName, fileType } = req.query;

        if (!fileName || !fileType) {
        return res.status(400).json({ error: "Missing fileName or fileType" });
        }

        const url = await generateUploadURL(fileName, fileType);
        res.status(200).json({ url });
    } catch (error) {
        console.error("Error generating presigned URL", error);
        res.status(500).json({ error: "Server error generating presigned URL" });
    }
});

// Endpoint to get all image URLs from S3
router.get("/list-images", async (req, res) => {
    try {
        const images = await listS3Images();
        res.status(200).json(images);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Failed to load images" });
    }
});

module.exports = router;