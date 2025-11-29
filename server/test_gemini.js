const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const apiKey = process.env.GEMINI_API_KEY;
console.log("Testing API Key:", apiKey ? `${apiKey.substring(0, 5)}...` : "undefined");

const genAI = new GoogleGenerativeAI(apiKey);

async function run() {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.0-pro" });
        const prompt = "Hello, are you working?";
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        console.log("Success! Response:", text);
    } catch (error) {
        console.error("Error:", error);
    }
}

run();
