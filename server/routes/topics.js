const express = require('express');
const router = express.Router();
const Topic = require('../models/Topic');
const Claim = require('../models/Claim');

// GET /api/topics - List all topics
router.get('/', async (req, res) => {
    try {
        const topics = await Topic.find().sort({ createdAt: -1 });
        res.json(topics);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch topics' });
    }
});

// GET /api/topics/:id - Get topic details and its claims
router.get('/:id', async (req, res) => {
    try {
        const topic = await Topic.findById(req.params.id);
        if (!topic) return res.status(404).json({ error: 'Topic not found' });

        const claims = await Claim.find({ topicId: topic._id });
        res.json({ topic, claims });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch topic details' });
    }
});

module.exports = router;
