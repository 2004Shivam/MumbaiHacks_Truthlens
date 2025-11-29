const express = require('express');
const router = express.Router();
const { extractClaim, verifyClaim } = require('../services/llmService');
const { searchNews } = require('../services/newsService');
const { calculateSourceQuality } = require('../services/sourceQuality');
const { normalizeClaim } = require('../services/claimNormalization');
const Claim = require('../models/Claim');
const Verification = require('../models/Verification');
const VerifiedClaim = require('../models/VerifiedClaim');

router.post('/', async (req, res) => {
    try {
        const { text } = req.body;

        if (!text) {
            return res.status(400).json({ error: 'Text is required' });
        }

        console.log('=== Starting Verification ===');
        console.log('Input text:', text);

        // 1. Extract Claim
        console.log('Step 1: Extracting claim...');
        const claimText = await extractClaim(text);
        console.log('Extracted claim:', claimText);

        // 2. Normalize the claim for deduplication
        console.log('Step 2: Normalizing claim...');
        const normalized = normalizeClaim(claimText);
        console.log('Normalized:', normalized);

        // 3. Check for existing claim
        console.log('Step 3: Checking for duplicates...');
        let existingClaim = await Claim.findOne({ normalizedText: normalized });
        let claim;
        let previousVerifications = [];

        if (existingClaim) {
            console.log('Found existing claim:', existingClaim._id);
            claim = existingClaim;

            // Get previous verifications
            previousVerifications = await Verification.find({ claimId: existingClaim._id })
                .sort({ scoredAt: -1 })
                .limit(5);
            console.log(`Found ${previousVerifications.length} previous verifications`);
        } else {
            // Create new claim
            claim = await Claim.create({
                claimText: claimText,
                normalizedText: normalized
            });
            console.log('Created new claim:', claim._id);
        }

        // 4. Search News
        console.log('Step 4: Searching news...');
        const newsArticles = await searchNews(claimText);
        console.log(`Found ${newsArticles.length} articles`);

        // 5. Verify using LLM with REST API
        console.log('Step 5: Calling LLM verification...');
        const verificationResult = await verifyClaim(claimText, newsArticles);
        console.log('Verification result:', JSON.stringify(verificationResult, null, 2));

        // 6. Calculate source quality
        console.log('Step 6: Calculating source quality...');
        const sourceQuality = calculateSourceQuality(newsArticles);
        console.log('Source quality:', sourceQuality);

        // 7. Save Verification
        console.log('Step 7: Saving verification to database...');
        const verification = await Verification.create({
            claim: claimText,
            claimId: claim._id,
            verdict: verificationResult.verdict,
            confidence: verificationResult.confidence || 0.5,
            sourceQuality: sourceQuality,
            publicExplanation: verificationResult.publicExplanation || verificationResult.analystExplanation || 'No explanation provided',
            analystExplanation: verificationResult.analystExplanation || verificationResult.publicExplanation || 'No detailed analysis provided',
            sources: verificationResult.sources || newsArticles.map(a => a.url || a.title || a).slice(0, 5),
            scoredAt: new Date()
        });
        console.log('Saved verification:', verification._id);

        claim.isVerified = true;
        await claim.save();

        // 8. Also save to VerifiedClaim for backward compatibility
        await VerifiedClaim.create({
            claim: claimText,
            verdict: verificationResult.verdict,
            explanation: verificationResult.publicExplanation || verificationResult.analystExplanation,
            sources: verificationResult.sources || newsArticles.map(a => a.url || a.title || a).slice(0, 5)
        });

        // 9. Return response
        console.log('Step 8: Sending response...');
        const response = {
            _id: verification._id,
            claim: claimText,
            verdict: verification.verdict,
            confidence: verification.confidence,
            sourceQuality: verification.sourceQuality,
            publicExplanation: verification.publicExplanation,
            analystExplanation: verification.analystExplanation,
            sources: verification.sources,
            isDuplicate: !!existingClaim,
            previousVerifications: previousVerifications.map(v => ({
                verdict: v.verdict,
                confidence: v.confidence,
                scoredAt: v.scoredAt
            }))
        };

        console.log('=== Verification Complete ===');
        res.json(response);

    } catch (error) {
        console.error('=== VERIFICATION ERROR ===');
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
        console.error('=========================');
        res.status(500).json({
            error: 'Failed to verify claim',
            details: error.message
        });
    }
});

module.exports = router;
