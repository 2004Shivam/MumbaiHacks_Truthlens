const axios = require('axios');

async function searchNews(query) {
    try {
        const apiKey = process.env.NEWS_API_KEY;
        if (!apiKey) {
            throw new Error("NEWS_API_KEY is not set");
        }

        // Using 'everything' endpoint for broader search, sorted by relevancy
        const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&sortBy=relevancy&language=en&pageSize=5&apiKey=${apiKey}`;

        const response = await axios.get(url);

        if (response.data.status !== 'ok') {
            throw new Error(`News API Error: ${response.data.message}`);
        }

        return response.data.articles.map(article => ({
            title: article.title,
            description: article.description,
            url: article.url,
            source: article.source.name
        }));
    } catch (error) {
        console.error("Error searching news:", error);
        // Return empty array instead of crashing if news fails, or throw? 
        // User wants "complete working MVP", so maybe throw to show error or handle gracefully.
        // Let's return empty array to allow "Unclear" verdict.
        return [];
    }
}

module.exports = { searchNews };
