const mongoose = require('mongoose');
const Claim = require('./models/Claim');
const Verification = require('./models/Verification');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI)
    .then(async () => {
        console.log('Connected to MongoDB');

        // Run the exact aggregation from insights.js
        const verifications = await Verification.aggregate([
            {
                $group: {
                    _id: '$verdict',
                    count: { $sum: 1 }
                }
            }
        ]);
        console.log('Aggregation Result:', JSON.stringify(verifications, null, 2));

        const byVerdict = {
            true: 0,
            false: 0,
            unclear: 0
        };
        verifications.forEach(v => {
            if (v._id) {
                const key = v._id.toLowerCase();
                byVerdict[key] = v.count;
            } else {
                console.log('Found verification with null verdict:', v);
            }
        });
        console.log('Processed Stats:', byVerdict);

        mongoose.disconnect();
    })
    .catch(err => console.error(err));
