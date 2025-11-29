const mongoose = require('mongoose');

const RawPostSchema = new mongoose.Schema({
    sourceId: String,
    sourceName: String,
    author: String,
    title: { type: String, required: true },
    description: String,
    url: { type: String, required: true, unique: true },
    urlToImage: String,
    publishedAt: Date,
    content: String,
    chunks: [{
        text: String,
        embedding: [Number]
    }],
    fetchedAt: { type: Date, default: Date.now },
    isProcessed: { type: Boolean, default: false }
});

module.exports = mongoose.model('RawPost', RawPostSchema);
