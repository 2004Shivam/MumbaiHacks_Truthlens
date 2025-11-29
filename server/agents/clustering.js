const fetch = require('node-fetch');
const RawPost = require('../models/RawPost');
const Topic = require('../models/Topic');

const apiKey = process.env.GROQ_API_KEY;
const MODEL_NAME = "llama-3.3-70b-versatile";
const BASE_URL = "https://api.groq.com/openai/v1/chat/completions";

async function callGroqAPI(prompt) {
    const response = await fetch(BASE_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: MODEL_NAME,
            messages: [{
                role: "user",
                content: prompt
            }],
            temperature: 0.7,
            max_tokens: 2000
        })
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Groq API error (${response.status}): ${errorText}`);
    }

    const data = await response.json();

    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        throw new Error('Invalid response from Groq API');
    }

    return data.choices[0].message.content;
}

async function clusterPosts() {
    try {
        console.log('Clustering: Checking for new posts...');

        // 1. Fetch unprocessed posts
        const posts = await RawPost.find({ isProcessed: false }).limit(20);
        if (posts.length === 0) {
            console.log('Clustering: No new posts to process.');
            return;
        }

        console.log(`Clustering: Processing ${posts.length} posts...`);

        // 2. Prepare prompt for LLM
        const postsText = posts.map((p, index) => `[${index}] Title: ${p.title}\nDescription: ${p.description}`).join('\n\n');

        const prompt = `
      You are an AI news editor. Group the following news articles into distinct topics.
      
      Articles:
      ${postsText}
      
      Task:
      1. Identify the main topics discussed in these articles.
      2. For each topic, provide a concise title and a 2-sentence summary.
      3. Assign a category: "general", "election", "health", "disaster", or "finance".
      4. List the indices of the articles that belong to each topic.
      
      Return a JSON array of objects with this structure:
      [
        {
          "title": "Topic Title",
          "summary": "Topic Summary",
          "category": "health",
          "indices": [0, 2, 5]
        }
      ]
      
      IMPORTANT: Return ONLY the raw JSON array. Do not wrap it in markdown code blocks.
    `;

        // 3. Call LLM using Groq
        const resultText = await callGroqAPI(prompt);
        let text = resultText.trim();

        // Clean up markdown
        if (text.startsWith('```json')) {
            text = text.replace(/^```json\n/, '').replace(/\n```$/, '');
        } else if (text.startsWith('```')) {
            text = text.replace(/^```\n/, '').replace(/\n```$/, '');
        }

        const clusters = JSON.parse(text);

        // 4. Save Topics and Update Posts
        for (const cluster of clusters) {
            const topicPosts = cluster.indices.map(i => posts[i]._id);

            await Topic.create({
                title: cluster.title,
                summary: cluster.summary,
                category: cluster.category || 'general',
                posts: topicPosts
            });
        }

        // Mark posts as processed
        const postIds = posts.map(p => p._id);
        await RawPost.updateMany({ _id: { $in: postIds } }, { isProcessed: true });

        console.log(`Clustering: Created ${clusters.length} topics from ${posts.length} posts.`);

    } catch (error) {
        console.error('Clustering Error:', error);
    }
}

module.exports = { clusterPosts };
