const { GoogleGenerativeAI } = require("@google/generative-ai");
const RawPost = require('../models/RawPost');

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);
const embeddingModel = genAI.getGenerativeModel({ model: "text-embedding-004" });

// Helper: Cosine Similarity
function cosineSimilarity(vecA, vecB) {
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    for (let i = 0; i < vecA.length; i++) {
        dotProduct += vecA[i] * vecB[i];
        normA += vecA[i] * vecA[i];
        normB += vecB[i] * vecB[i];
    }
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

// Generate embedding for a single text string
async function generateEmbedding(text) {
    try {
        const result = await embeddingModel.embedContent(text);
        return result.embedding.values;
    } catch (error) {
        console.error("Embedding Error:", error);
        return null;
    }
}

// Chunk text into smaller segments (simple sentence/paragraph split)
function chunkText(text, chunkSize = 500) {
    const chunks = [];
    let currentChunk = "";

    const sentences = text.split(/(?<=[.?!])\s+/);

    for (const sentence of sentences) {
        if ((currentChunk + sentence).length > chunkSize) {
            chunks.push(currentChunk.trim());
            currentChunk = sentence;
        } else {
            currentChunk += " " + sentence;
        }
    }
    if (currentChunk.trim()) chunks.push(currentChunk.trim());

    return chunks;
}

// Find relevant chunks from RawPosts
async function findRelevantChunks(query, limit = 5) {
    try {
        const queryEmbedding = await generateEmbedding(query);
        if (!queryEmbedding) return [];

        // Fetch all posts with chunks (In a real prod app, use Vector DB)
        // For MVP/RAG-lite, we fetch recent posts and scan in-memory
        const posts = await RawPost.find({ "chunks.0": { $exists: true } }).sort({ fetchedAt: -1 }).limit(50);

        const allChunks = [];
        for (const post of posts) {
            if (post.chunks) {
                for (const chunk of post.chunks) {
                    allChunks.push({
                        text: chunk.text,
                        embedding: chunk.embedding,
                        source: post.title,
                        url: post.url
                    });
                }
            }
        }

        // Calculate similarity
        const scoredChunks = allChunks.map(chunk => ({
            ...chunk,
            score: cosineSimilarity(queryEmbedding, chunk.embedding)
        }));

        // Sort and slice
        return scoredChunks
            .sort((a, b) => b.score - a.score)
            .slice(0, limit);

    } catch (error) {
        console.error("RAG Retrieval Error:", error);
        return [];
    }
}

module.exports = { generateEmbedding, chunkText, findRelevantChunks };
