const mongoose = require('mongoose');

const ImageSchema = new mongoose.Schema({
    albumId: { type: mongoose.Schema.Types.ObjectId, ref: 'Album', required: true },
    url: { type: String, required: true },
    uploadedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Image', ImageSchema);