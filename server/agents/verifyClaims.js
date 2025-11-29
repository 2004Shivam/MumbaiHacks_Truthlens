const Claim = require('../models/Claim');
const Verification = require('../models/Verification');
const { searchNews } = require('../services/newsService');
const { verifyClaim } = require('../services/llmService');
const { findRelevantChunks } = require('../services/embeddingService');

async function verifyClaimsAgent() {
    try {
        console.log('Verification: Checking for new claims...');

        const claims = await Claim.find({ isVerified: false }).limit(5);
        if (claims.length === 0) {
            console.log('Verification: No new claims to verify.');
            return;
        }

        console.log(`Verification: Verifying ${claims.length} claims...`);

        for (const claim of claims) {
            // 1. RAG Retrieval (Internal Knowledge)
            const ragChunks = await findRelevantChunks(claim.claimText);
            const ragContext = ragChunks.map(c => `[Internal Source: ${c.source}] ${c.text}`).join('\n');

            // 2. External Search (News API)
            const newsArticles = await searchNews(claim.claimText);

            // 3. Combine Context
            // We pass the RAG context as part of the "newsArticles" array structure expected by verifyClaim
            // or we modify verifyClaim. For simplicity, we'll append RAG context to the prompt in verifyClaim
            // But verifyClaim expects an array of objects. Let's adapt.
            const combinedContext = [
                ...newsArticles,
                ...ragChunks.map(c => ({ title: c.source, description: c.text, url: c.url, source: 'Internal Database' }))
            ];

            // 4. Verify with LLM
            const verificationResult = await verifyClaim(claim.claimText, combinedContext);

            await Verification.create({
                claimId: claim._id,
                verdict: verificationResult.verdict,
                explanation: verificationResult.explanation,
                sources: verificationResult.sources
            });

            claim.isVerified = true;
            await claim.save();
        }

        console.log(`Verification: Verified ${claims.length} claims.`);

    } catch (error) {
        console.error('Verification Agent Error:', error);
    }
}

module.exports = { verifyClaimsAgent };
