/**
 * Normalize claim text for deduplication
 * @param {string} text - The raw claim text
 * @returns {string} - Normalized claim text
 */
function normalizeClaim(text) {
    if (!text) return '';

    return text
        .toLowerCase()
        .trim()
        // Remove extra whitespace
        .replace(/\s+/g, ' ')
        // Remove common punctuation at end
        .replace(/[.!?]+$/, '')
        // Remove quotes
        .replace(/["']/g, '');
}

module.exports = { normalizeClaim };
