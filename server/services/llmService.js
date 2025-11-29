const fetch = require('node-fetch');

const apiKey = process.env.GROQ_API_KEY;
console.log("Initializing Groq API with key:", apiKey ? `${apiKey.substring(0, 10)}...` : "undefined");

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

async function extractClaim(text) {
    try {
        console.log(`LLM: Extracting claim using Groq...`);
        const prompt = `You are a helpful assistant that extracts the core factual claim from a text. Return ONLY the claim as a single sentence. If there are multiple, pick the most significant one.\n\nText: ${text}`;

        const result = await callGroqAPI(prompt);
        return result.trim();
    } catch (error) {
        console.error("Error extracting claim:", error);
        throw new Error(`Failed to extract claim: ${error.message}`);
    }
}

async function verifyClaim(claim, newsArticles) {
    try {
        console.log(`LLM: Verifying claim using Groq...`);

        let articlesText = "";
        if (newsArticles.length > 0 && typeof newsArticles[0] === 'string') {
            articlesText = newsArticles.join('\n');
        } else {
            articlesText = newsArticles.map(a => `- ${a.title}: ${a.description}`).join('\n');
        }

        const prompt = `
      Claim: "${claim}"
      
      News Evidence:
      ${articlesText}
      
      Task: Verify the claim based ONLY on the news evidence provided.
      Return a JSON object with the following fields:
      - verdict: "True", "False", or "Unclear"
      - confidence: A number between 0 and 1 representing your confidence in this verdict
      - publicExplanation: A 2-3 line citizen-friendly explanation (simple language)
      - analystExplanation: A 5-8 line detailed explanation for analysts (include reasoning, source quality notes)
      - sources: An array of strings, listing the titles of the news articles that support the verdict
      
      IMPORTANT: Return ONLY the raw JSON object. Do not wrap it in markdown code blocks or add any other text.
    `;

        const resultText = await callGroqAPI(prompt);
        let text = resultText.trim();

        // Clean up markdown if present
        if (text.startsWith('```json')) {
            text = text.replace(/^```json\n/, '').replace(/\n```$/, '');
        } else if (text.startsWith('```')) {
            text = text.replace(/^```\n/, '').replace(/\n```$/, '');
        }

        const parsed = JSON.parse(text);

        // Ensure confidence is within valid range
        if (parsed.confidence !== undefined) {
            parsed.confidence = Math.max(0, Math.min(1, parsed.confidence));
        } else {
            parsed.confidence = 0.5; // Default if not provided
        }

        return parsed;
    } catch (error) {
        console.error("Error verifying claim:", error);
        throw new Error(`Failed to verify claim: ${error.message}`);
    }
}

module.exports = { extractClaim, verifyClaim };
