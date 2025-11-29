const mongoose = require('mongoose');

const VerifiedClaimSchema = new mongoose.Schema({
  claim: {
    type: String,
    required: true
  },
  verdict: {
    type: String,
    enum: ['True', 'False', 'Unclear'],
    required: true
  },
  explanation: {
    type: String,
    required: true
  },
  sources: [{
    type: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('VerifiedClaim', VerifiedClaimSchema);
