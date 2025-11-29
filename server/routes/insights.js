const express = require('express');
const router = express.Router();
const Claim = require('../models/Claim');
const Verification = require('../models/Verification');
const Topic = require('../models/Topic');

// GET /api/insights/summary - Overall statistics
router.get('/summary', async (req, res) => {
    try {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const last7Days = new Date(today);
        last7Days.setDate(last7Days.getDate() - 7);
        const last30Days = new Date(today);
        last30Days.setDate(last30Days.getDate() - 30);

        // Total claims
        const totalClaims = await Claim.countDocuments();

        // Claims by verdict
        const verifications = await Verification.aggregate([
            {
                $group: {
                    _id: '$verdict',
                    count: { $sum: 1 }
                }
            }
        ]);

        const byVerdict = {
            true: 0,
            false: 0,
            unclear: 0
        };
        verifications.forEach(v => {
            const key = v._id.toLowerCase();
            byVerdict[key] = v.count;
        });

        // Claims in time windows
        const claimsToday = await Claim.countDocuments({ createdAt: { $gte: today } });
        const claimsLast7Days = await Claim.countDocuments({ createdAt: { $gte: last7Days } });
        const claimsLast30Days = await Claim.countDocuments({ createdAt: { $gte: last30Days } });

        res.json({
            totalClaims,
            byVerdict,
            timeWindows: {
                today: claimsToday,
                last7Days: claimsLast7Days,
                last30Days: claimsLast30Days
            }
        });

    } catch (error) {
        console.error('Insights summary error:', error);
        res.status(500).json({ error: 'Failed to fetch summary' });
    }
});

// GET /api/insights/trends - Daily claims over last 30 days
router.get('/trends', async (req, res) => {
    try {
        const days = parseInt(req.query.days) || 30;
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        // Aggregate claims with their verifications
        const data = await Claim.aggregate([
            {
                $match: {
                    createdAt: { $gte: startDate }
                }
            },
            {
                $lookup: {
                    from: 'verifications',
                    localField: '_id',
                    foreignField: 'claimId',
                    as: 'verifications'
                }
            },
            {
                $unwind: {
                    path: '$verifications',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $group: {
                    _id: {
                        date: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                        verdict: '$verifications.verdict'
                    },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { '_id.date': 1 }
            }
        ]);

        // Transform to daily format
        const dailyMap = {};
        data.forEach(item => {
            const date = item._id.date;
            if (!dailyMap[date]) {
                dailyMap[date] = { date, true: 0, false: 0, unclear: 0 };
            }
            const verdict = (item._id.verdict || 'unclear').toLowerCase();
            dailyMap[date][verdict] = item.count;
        });

        const daysArray = Object.values(dailyMap);

        res.json({ days: daysArray });

    } catch (error) {
        console.error('Insights trends error:', error);
        res.status(500).json({ error: 'Failed to fetch trends' });
    }
});

// GET /api/insights/top-topics - Top topics by claim count
router.get('/top-topics', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;

        const topTopics = await Topic.aggregate([
            {
                $lookup: {
                    from: 'claims',
                    localField: '_id',
                    foreignField: 'topicId',
                    as: 'claims'
                }
            },
            {
                $lookup: {
                    from: 'verifications',
                    let: { claimIds: '$claims._id' },
                    pipeline: [
                        {
                            $match: {
                                $expr: { $in: ['$claimId', '$$claimIds'] }
                            }
                        }
                    ],
                    as: 'verifications'
                }
            },
            {
                $project: {
                    title: 1,
                    category: 1,
                    createdAt: 1,
                    totalClaims: { $size: '$claims' },
                    falseClaims: {
                        $size: {
                            $filter: {
                                input: '$verifications',
                                cond: { $eq: ['$$this.verdict', 'False'] }
                            }
                        }
                    },
                    unclearClaims: {
                        $size: {
                            $filter: {
                                input: '$verifications',
                                cond: { $eq: ['$$this.verdict', 'Unclear'] }
                            }
                        }
                    }
                }
            },
            {
                $match: {
                    totalClaims: { $gt: 0 }
                }
            },
            {
                $sort: { totalClaims: -1 }
            },
            {
                $limit: limit
            }
        ]);

        res.json(topTopics);

    } catch (error) {
        console.error('Top topics error:', error);
        res.status(500).json({ error: 'Failed to fetch top topics' });
    }
});

// GET /api/insights/recurring-false-claims - Duplicate false claims
router.get('/recurring-false-claims', async (req, res) => {
    try {
        const recurringClaims = await Claim.aggregate([
            {
                $lookup: {
                    from: 'verifications',
                    localField: '_id',
                    foreignField: 'claimId',
                    as: 'verifications'
                }
            },
            {
                $match: {
                    'verifications.verdict': 'False'
                }
            },
            {
                $group: {
                    _id: '$normalizedText',
                    claimText: { $first: '$claimText' },
                    occurrences: { $sum: 1 },
                    firstSeen: { $min: '$createdAt' },
                    lastSeen: { $max: '$createdAt' }
                }
            },
            {
                $match: {
                    occurrences: { $gt: 1 }
                }
            },
            {
                $sort: { occurrences: -1 }
            },
            {
                $limit: 20
            },
            {
                $project: {
                    _id: 0,
                    claimText: 1,
                    occurrences: 1,
                    firstSeen: 1,
                    lastSeen: 1
                }
            }
        ]);

        res.json(recurringClaims);

    } catch (error) {
        console.error('Recurring claims error:', error);
        res.status(500).json({ error: 'Failed to fetch recurring false claims' });
    }
});

module.exports = router;
