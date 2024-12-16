const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
    eventTitle: { type: String, required: true },
    eventDetails: { type: String, required: true },
    eventLocation: { type: String, required: true },
    eventPrice: { type: Number, required: true },
    eventImageUrl: { type: String, required: true },
});

module.exports = mongoose.model('Event', EventSchema);