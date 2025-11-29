const axios = require('axios');
const RawPost = require('../models/RawPost');
const { generateEmbedding, chunkText } = require('../services/embeddingService');

async function fetchAndSaveNews() {
    try {
        console.log('Watcher: Fetching news...');
        const apiKey = process.env.NEWS_API_KEY;
        if (!apiKey) throw new Error("NEWS_API_KEY missing");

        const url = `https://newsapi.org/v2/top-headlines?country=us&category=general&pageSize=20&apiKey=${apiKey}`;
        const response = await axios.get(url);

        if (response.data.status !== 'ok') {
            throw new Error(`News API Error: ${response.data.message}`);
        }

        const articles = response.data.articles;
        let newCount = 0;

        for (const article of articles) {
            if (!article.url || !article.title) continue;

            const exists = await RawPost.findOne({ url: article.url });
            if (!exists) {
                // Generate chunks and embeddings
                const fullText = `${article.title}. ${article.description || ''}. ${article.content || ''}`;
                const textChunks = chunkText(fullText);
                const chunksWithEmbeddings = [];

                for (const text of textChunks) {
                    const embedding = await generateEmbedding(text);
                    if (embedding) {
                        chunksWithEmbeddings.push({ text, embedding });
                    }
                }

                await RawPost.create({
                    sourceId: article.source.id,
                    sourceName: article.source.name,
                    author: article.author,
                    title: article.title,
                    description: article.description,
                    url: article.url,
                    urlToImage: article.urlToImage,
                    publishedAt: article.publishedAt,
                    content: article.content,
                    chunks: chunksWithEmbeddings
                });
                newCount++;
            }
        }

        console.log(`Watcher: Saved ${newCount} new articles with embeddings.`);
    } catch (error) {
        console.error('Watcher Error:', error.message);
    }
}

module.exports = { fetchAndSaveNews };
