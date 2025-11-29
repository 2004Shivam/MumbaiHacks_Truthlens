const mongoose = require('mongoose');

const SystemLogSchema = new mongoose.Schema({
    level: { type: String, enum: ['INFO', 'WARN', 'ERROR'], default: 'INFO' },
    agent: String,
    message: String,
    details: mongoose.Schema.Types.Mixed,
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SystemLog', SystemLogSchema);
