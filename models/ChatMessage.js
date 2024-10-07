const mongoose = require('mongoose');

const chatMessageSchema = mongoose.Schema({
    message: { type: String, required: true },
    sender: { type: String, required: true },
    conversationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ChatMessage', chatMessageSchema);