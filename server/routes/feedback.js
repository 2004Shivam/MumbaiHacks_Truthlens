const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback');

// POST /api/feedback - Submit user feedback
router.post('/', async (req, res) => {
    try {
        const { verificationId, helpful, comment } = req.body;

        if (!verificationId || helpful === undefined) {
            return res.status(400).json({ error: 'Verification ID and helpful status are required' });
        }

        const feedback = await Feedback.create({
            verificationId,
            helpful,
            comment: comment || ''
        });

        res.json({ success: true, feedbackId: feedback._id });
    } catch (error) {
        console.error('Feedback submission error:', error);
        res.status(500).json({ error: 'Failed to submit feedback' });
    }
});

module.exports = router;
