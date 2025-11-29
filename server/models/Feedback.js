const mongoose = require('mongoose');

const FeedbackSchema = new mongoose.Schema({
    verificationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Verification', required: true },
    helpful: { type: Boolean, required: true },
    comment: String,
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Feedback', FeedbackSchema);
