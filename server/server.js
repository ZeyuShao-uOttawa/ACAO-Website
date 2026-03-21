const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const rateLimit = require('express-rate-limit')
const cors = require('cors');

dotenv.config(); // To load environment variables from .env file

// Global rate limit to 100 requests per minute
const globalLimiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 100,
    standardHeaders: true, // returns rate limit info in headers
    legacyHeaders: false
})

const app = express();
app.use(express.json());
app.use(cors());
app.use(globalLimiter);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', require('./routes/authentication'));
app.use('/api/event', require('./routes/event'));
app.use('/api/team', require('./routes/team'));
app.use('/api/image', require('./routes/image'));
app.use('/api/gallery', require('./routes/gallery'));
app.use('/api/message', require('./routes/message'));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Handle all other routes with the Vue app
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Port for Server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});