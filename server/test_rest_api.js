const fetch = require('node-fetch');

const apiKey = process.env.GEMINI_API_KEY;
console.log("Testing Gemini REST API with key:", apiKey ? `${apiKey.substring(0, 5)}...` : "undefined");

const MODEL_NAME = "gemini-1.5-flash";
const BASE_URL = "https://generativelanguage.googleapis.com/v1beta/models";

async function testGeminiREST() {
    const url = `${BASE_URL}/${MODEL_NAME}:generateContent?key=${apiKey}`;

    console.log("\n🌐 Making REST API call to:", url.replace(apiKey, 'API_KEY'));

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: "Say hello in one word"
                    }]
                }]
            })
        });

        console.log("📡 Response status:", response.status, response.statusText);

        if (!response.ok) {
            const errorText = await response.text();
            console.error("❌ Error response:", errorText);
            throw new Error(`Gemini API error (${response.status}): ${errorText}`);
        }

        const data = await response.json();
        console.log("✅ Full response:", JSON.stringify(data, null, 2));

        if (data.candidates && data.candidates[0] && data.candidates[0].content) {
            const text = data.candidates[0].content.parts[0].text;
            console.log("\n✅ SUCCESS! Gemini responded:", text);
        } else {
            console.log("⚠️ Unexpected response structure:", data);
        }
    } catch (error) {
        console.error("❌ ERROR:", error.message);
        console.error("Stack:", error.stack);
    }
}

testGeminiREST();
