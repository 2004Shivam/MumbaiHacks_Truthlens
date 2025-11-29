const fetch = require('node-fetch');
const Topic = require('../models/Topic');
const Claim = require('../models/Claim');
const { normalizeClaim } = require('../services/claimNormalization');

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
            max_tokens: 1000
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

async function extractClaims() {
    try {
        console.log('ExtractClaims: Checking unprocessed topics...');

        // 1. Fetch topics without claims
        const topics = await Topic.find({ isClaimExtracted: false }).limit(5);
        if (topics.length === 0) {
            console.log('ExtractClaims: No new topics.');
            return;
        }

        console.log(`ExtractClaims: Processing ${topics.length} topics...`);

        for (const topic of topics) {
            const prompt = `
        Topic: ${topic.title}
        Summary: ${topic.summary}
        
        Task: Extract factual claims that can be verified.
        Return a JSON array of claim strings.
        
        Example: ["Claim 1", "Claim 2"]
        
        IMPORTANT: Return ONLY the raw JSON array. Do not wrap it in markdown code blocks.
      `;

            const resultText = await callGroqAPI(prompt);
            let text = resultText.trim();

            if (text.startsWith('```json')) {
                text = text.replace(/^```json\n/, '').replace(/\n```$/, '');
            } else if (text.startsWith('```')) {
                text = text.replace(/^```\n/, '').replace(/\n```$/, '');
            }

            const claimsArray = JSON.parse(text);

            for (const claimText of claimsArray) {
                await Claim.create({
                    topicId: topic._id,
                    claimText: claimText,
                    normalizedText: normalizeClaim(claimText)
                });
            }

            topic.isClaimExtracted = true;
            await topic.save();

            console.log(`ExtractClaims: Extracted ${claimsArray.length} claims from topic "${topic.title}"`);
        }

    } catch (error) {
        console.error('ExtractClaims Error:', error);
    }
}

module.exports = { extractClaims };
