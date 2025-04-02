const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// Endpoint to login a user
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ error: 'User not found' });

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return res.status(401).json({ error: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ token, user: { id: user._id, email: user.email, role: user.role } });
    } catch (err) {
        res.status(500).json({ error: 'An error occurred while authenticating user' });
    }
});

// Endpoint to validate a users credentials
router.get('/verify', (req, res) => {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).json({ error: 'No token provided' });

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        res.status(200).json({ message: 'Successfully validated token' });
    } catch (err) {
        res.status(401).json({ error: 'Invalid token' });
    }
});

module.exports = router;