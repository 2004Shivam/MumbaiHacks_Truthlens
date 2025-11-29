const mongoose = require('mongoose');

const ClaimSchema = new mongoose.Schema({
    topicId: { type: mongoose.Schema.Types.ObjectId, ref: 'Topic' },
    claimText: { type: String, required: true },
    normalizedText: { type: String, required: true, index: true },
    createdAt: { type: Date, default: Date.now },
    isVerified: { type: Boolean, default: false }
});

module.exports = mongoose.model('Claim', ClaimSchema);
