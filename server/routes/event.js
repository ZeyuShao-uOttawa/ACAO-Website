const express = require('express');
const jwt = require('jsonwebtoken');
const Event = require('../models/Event');
const verifyRole = require('../authentication/verifyRole');

const router = express.Router();

router.get('/details', async (req, res) => {
    try {
        const event = await Event.findOne();
        if (!event) return res.status(404).json({ error: 'Event not found' });

        res.status(200).json(event);
    } catch (err) {
        res.status(500).json({ error: 'An error occurred while fetching the event' });
    }
});

router.post('/update', verifyRole('admin'), async (req, res) => {
    const updates = req.body;

    try {
        const updatedEvent = await Event.findOneAndUpdate(
            {},
            updates,
            {
                new: true,              // Return the updated document
                runValidators: true,    // Validate updates against the schema
                upsert: true,           // Create a new document if none exists
            }
        );

        res.status(200).json({ message: 'Successfully updated event' });
    } catch (err) {
        res.status(500).json({ message: err });
        // res.status(500).json({ error: 'An error occurred while updating the event' });
    }
});

module.exports = router;
