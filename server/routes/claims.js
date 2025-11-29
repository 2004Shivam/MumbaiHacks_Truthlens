const express = require('express');
const router = express.Router();
const Claim = require('../models/Claim');
const Verification = require('../models/Verification');
const Topic = require('../models/Topic');

// GET /api/claims - List recent claims
router.get('/', async (req, res) => {
    try {
        const claims = await Claim.find().sort({ createdAt: -1 }).limit(20).populate('topicId', 'title');
        res.json(claims);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch claims' });
    }
});

// GET /api/claims/:id - Get claim details and verification
router.get('/:id', async (req, res) => {
    try {
        const claim = await Claim.findById(req.params.id).populate('topicId');
        if (!claim) return res.status(404).json({ error: 'Claim not found' });

        const verification = await Verification.findOne({ claimId: claim._id });
        res.json({ claim, verification });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch claim details' });
    }
});

module.exports = router;
