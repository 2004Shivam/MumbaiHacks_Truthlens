const mongoose = require('mongoose');

const TopicSchema = new mongoose.Schema({
    title: { type: String, required: true },
    summary: String,
    category: {
        type: String,
        enum: ['general', 'election', 'health', 'disaster', 'finance'],
        default: 'general'
    },
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'RawPost' }],
    createdAt: { type: Date, default: Date.now },
    isClaimExtracted: { type: Boolean, default: false }
});

module.exports = mongoose.model('Topic', TopicSchema);
