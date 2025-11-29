/**
 * Calculate source quality score based on domain
 * @param {Array} sources - Array of source URLs or titles
 * @returns {number} - Quality score between 0 and 1
 */
function calculateSourceQuality(sources) {
    if (!sources || sources.length === 0) return 0.3;

    const highQualityDomains = [
        'gov', 'edu', 'who.int', 'cdc.gov', 'reuters.com', 'apnews.com',
        'bbc.com', 'nytimes.com', 'theguardian.com', 'bloomberg.com'
    ];

    let qualityScore = 0;
    let count = 0;

    sources.forEach(source => {
        const lowerSource = (source || '').toLowerCase();
        const isHighQuality = highQualityDomains.some(domain => lowerSource.includes(domain));

        if (isHighQuality) {
            qualityScore += 0.9;
        } else if (lowerSource.includes('.gov') || lowerSource.includes('.edu')) {
            qualityScore += 0.85;
        } else {
            qualityScore += 0.5;
        }
        count++;
    });

    return count > 0 ? Math.min(qualityScore / count, 1) : 0.3;
}

module.exports = { calculateSourceQuality };
