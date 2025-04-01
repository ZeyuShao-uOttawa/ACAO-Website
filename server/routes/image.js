const express = require('express');
const { generateUploadURL, listS3Images, deleteImage } = require('../services/S3Service');
const verifyRole = require('../authentication/verifyRole');

const router = express.Router();

// Endpoint to get a presigned URL for image upload
router.get('/s3Url', verifyRole('admin'), async (req, res) => {
    try {
        const { fileName, fileType } = req.query;

        if (!fileName || !fileType) {
        return res.status(400).json({ error: 'Missing fileName or fileType' });
        }

        const url = await generateUploadURL(fileName, fileType);
        res.status(200).json({ url });
    } catch (err) {
        res.status(500).json({ error: 'Server error generating presigned URL' });
    }
});

// Endpoint to get all image URLs from S3
router.get('/listImages', async (req, res) => {
    try {
        const images = await listS3Images();
        res.status(200).json(images);
    } catch (err) {
        res.status(500).json({ error: 'Failed to load images' });
    }
});

// Endpoint to delete a specific image from S3
router.delete('/deleteImage', verifyRole('admin'), async (req, res) => {
    try {
        const { key } = req.body;

        const deleteResponse = await deleteImage(key);

        res.status(200).json({ message: 'Successfully deleted image' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete image' });
    }
});

module.exports = router;