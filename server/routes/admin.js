const express = require('express');
const router = express.Router();
const SystemLog = require('../models/SystemLog');

// GET /api/admin/logs
router.get('/logs', async (req, res) => {
    try {
        const logs = await SystemLog.find().sort({ timestamp: -1 }).limit(100);
        res.json(logs);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch logs' });
    }
});

// POST /api/admin/toggle-agent
router.post('/toggle-agent', async (req, res) => {
    // Stub for agent toggling (would require state management in server.js)
    // For MVP, just log the request
    const { agent, status } = req.body;
    await SystemLog.create({
        level: 'INFO',
        agent: 'Admin',
        message: `Toggled ${agent} to ${status}`
    });
    res.json({ success: true, message: `Agent ${agent} ${status}` });
});

module.exports = router;
