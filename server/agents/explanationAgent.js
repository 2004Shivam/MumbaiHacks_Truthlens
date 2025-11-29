const fetch = require('node-fetch');
const Verification = require('../models/Verification');

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

async function explanationAgent() {
    try {
        console.log('ExplanationAgent: Refining explanations...');

        const verifications = await Verification.find().sort({ scoredAt: -1 }).limit(5);

        for (const v of verifications) {
            if (!v.analystExplanation) continue;

            const prompt = `
        Original Explanation: ${v.analystExplanation}
        
        Task: Rewrite this explanation to be more concise and clear while keeping all key points.
        Return ONLY the refined explanation as plain text.
      `;

            const refined = await callGroqAPI(prompt);
            v.analystExplanation = refined.trim();
            await v.save();

            console.log(`ExplanationAgent: Refined explanation for verification ${v._id}`);
        }

    } catch (error) {
        console.error('ExplanationAgent Error:', error);
    }
}

module.exports = { explanationAgent };
