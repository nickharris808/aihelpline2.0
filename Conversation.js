const mongoose = require('mongoose');

const conversationSchema = mongoose.Schema({
    phoneNumber: { type: String, required: true, unique: true },
    optInStatus: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date }
});

module.exports = mongoose.model('Conversation', conversationSchema);