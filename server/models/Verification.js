const mongoose = require('mongoose');

const VerificationSchema = new mongoose.Schema({
    claim: { type: String, required: true },
    normalizedClaim: String,
    verdict: String,
    confidence: Number,
    publicExplanation: String,
    analystExplanation: String,
    sources: [String],
    isVerified: { type: Boolean, default: false },
    topicId: { type: mongoose.Schema.Types.ObjectId, ref: 'Topic' },
    claimId: { type: mongoose.Schema.Types.ObjectId, ref: 'Claim' },
    previousVerifications: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Verification' }],
    deduplicationNote: String,
    scoredAt: Date,

    // Image verification fields
    fromImage: { type: Boolean, default: false },
    imageUrl: String,
    ocrConfidence: Number,

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Verification', VerificationSchema);
