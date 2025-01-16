const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
    name: { type: String, required: true },
    position: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
});

module.exports = mongoose.model('Exec', EventSchema);