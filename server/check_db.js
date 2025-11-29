const mongoose = require('mongoose');
const Claim = require('./models/Claim');
const Verification = require('./models/Verification');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI)
    .then(async () => {
        console.log('Connected to MongoDB');

        const totalClaims = await Claim.countDocuments();
        const verifiedClaims = await Claim.countDocuments({ isVerified: true });
        const totalVerifications = await Verification.countDocuments();

        console.log('--- Database Stats ---');
        console.log(`Total Claims: ${totalClaims}`);
        console.log(`Verified Claims (isVerified=true): ${verifiedClaims}`);
        console.log(`Total Verification Docs: ${totalVerifications}`);

        const verifications = await Verification.find({}, 'verdict');
        console.log('Verifications by Verdict:', verifications.map(v => v.verdict));

        const claimsWithoutVerification = await Claim.find({ isVerified: true });
        let missingDocs = 0;
        for (const claim of claimsWithoutVerification) {
            const v = await Verification.findOne({ claimId: claim._id });
            if (!v) missingDocs++;
        }
        console.log(`Verified Claims missing Verification docs: ${missingDocs}`);

        mongoose.disconnect();
    })
    .catch(err => console.error(err));
