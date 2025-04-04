const express = require('express');
const Exec = require('../models/Exec');
const verifyRole = require('../authentication/verifyRole');

const router = express.Router();

// Endpoint to get all Exec details
router.get('/details', async (req, res) => {
    try {
        const execs = await Exec.find();
        if (!execs) return res.status(404).json({ error: 'Exec details not found' });

        res.status(200).json(execs);
    } catch (err) {
        res.status(500).json({ error: 'An error occurred while fetching the exec details' });
    }
});


// Endpoint to update a specific Exec detail
router.post('/update', verifyRole('admin'), async (req, res) => {
    try {
        const id = req.body._id;
        const updates = {
            name: req.body.name,
            position: req.body.position,
            description: req.body.description,
            image: req.body.image,
        }

        // If an ID was passed try to update, otherwise create a new Exec based on the given information
        if (id != "") {
            const updatedExec = await Exec.findByIdAndUpdate(
                id,
                updates,
                {
                    new: true,
                    runValidators: true,
                }
            );
        } else {
            const exec = new Exec(updates);
            await exec.save();
        }

        res.status(200).json({ message: 'Successfully updated exec details' });
    } catch (err) {
        res.status(500).json({ error: 'An error occurred while updating the exec details' });
    }
});

// Endpoint to delete a specific Exec detail
router.delete('/:id', verifyRole('admin'), async (req, res) => {
    const { id } = req.params;

    try {
        const exec = await Exec.findByIdAndDelete(id);
        if (!exec) return res.status(404).json({ error: 'Exec details not found' });

        res.status(200).json({ message: 'Successfully deleted exec details' });
    } catch (err) {
        res.status(500).json({ error: 'An error occurred while deleting the exec details' });
    }
});

module.exports = router;