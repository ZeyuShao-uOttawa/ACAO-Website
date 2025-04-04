const express = require('express');
const Album = require('../models/Album');
const { generateAlbumUploadURL, listS3AlbumImages, deleteAlbum } = require('../services/S3Service');
const verifyRole = require('../authentication/verifyRole');

const router = express.Router();

// Endpoint to get all Albums
router.get('/albums', async (req, res) => {
    try {
        const albums = await Album.find();
        if (!albums) return res.status(404).json({ error: 'No albums found' });

        res.status(200).json(albums);
    } catch (err) {
        res.status(500).json({ error: 'Failed to load images' });
    }
});

// Endpoint to get a presigned album URL for image upload.
router.get('/s3AlbumUrl', verifyRole('admin'), async (req, res) => {
    try {
        const { albumId, fileName, fileType } = req.query;

        if (!albumId|| !fileName || !fileType) {
        return res.status(400).json({ error: 'Missing albumId, fileName or fileType' });
        }

        const url = await generateAlbumUploadURL(albumId, fileName, fileType);
        res.status(200).json({ url });
    } catch (err) {
        res.status(500).json({ error: 'Server error generating presigned URL' });
    }
});

// Endpoint to get all images within a certain Album
router.get('/:albumId/images', async (req, res) => {
    try {
        const albumId = req.params.albumId;

        const images = await listS3AlbumImages(albumId);
        res.status(200).json(images);
    } catch (err) {
        res.status(500).json({ error: 'Failed to load images' });
    }
});

// Endpoint to update/create a Album
router.post('/update', verifyRole('admin'), async (req, res) => {
    try {
        const id = req.body._id;
        const updates = {
            title: req.body.title,
            description: req.body.description,
            coverImageUrl: req.body.coverImageUrl,
        }

        // If an ID is passed in, update the Album details, otherwise create a new Album
        if (id != "") {
            const updatedAlbum = await Album.findByIdAndUpdate(
                id,
                updates,
                {
                    new: true,
                    runValidators: true,
                }
            );
        } else {
            const album = new Album(updates);
            await album.save();
        }

        res.status(200).json({ message: 'Successfully created/updated album details' });
    } catch (err) {
        res.status(500).json({ error: 'An error occurred while creating/updating a album' });
    }
});

// Endpoint to delete a specific Album
router.delete('/:id', verifyRole('admin'), async (req, res) => {
    try {
        const { id } = req.params;
        
        // Delete the Album from the DB
        const album = await Album.findByIdAndDelete(id);
        if (!album) return res.status(404).json({ error: 'Album not found' });
        // Delete the images associated with the Album in the S3 bucket
        const s3DeleteResponse = await deleteAlbum(id);

        res.status(200).json({ message: 'Successfully deleted album' });
    } catch (err) {
        res.status(500).json({ error: 'An error occurred while deleting the album' });
    }
});

module.exports = router;