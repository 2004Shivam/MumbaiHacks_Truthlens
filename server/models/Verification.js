const mongoose = require('mongoose');

const VerificationSchema = new mongoose.Schema({
    claimId: { type: mongoose.Schema.Types.ObjectId, ref: 'Claim' },
    verdict: {
        type: String,
        enum: ['True', 'False', 'Unclear'],
        required: true
    },
    confidence: { type: Number, min: 0, max: 1 },
    sourceQuality: { type: Number, min: 0, max: 1 },
    publicExplanation: String,
    analystExplanation: String,
    sources: [String],
    scoredAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Verification', VerificationSchema);
