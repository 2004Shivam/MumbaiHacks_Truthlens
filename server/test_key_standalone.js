require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Read from .env
const apiKey = process.env.GEMINI_API_KEY;

console.log("---------------------------------------------------");
console.log("Testing API Key from .env");
console.log("Key:", apiKey ? `${apiKey.substring(0, 5)}...${apiKey.substring(apiKey.length - 4)}` : "undefined");
console.log("---------------------------------------------------");

if (!apiKey) {
    console.error("ERROR: GEMINI_API_KEY is missing in .env file");
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);

async function testKey() {
    try {
        console.log("Attempting to connect to Google Gemini API...");
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const prompt = "Reply with 'Success'";

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        console.log("\n✅ SUCCESS! Your API Key is working correctly.");
        console.log("Gemini Response:", text.trim());
        console.log("---------------------------------------------------");
    } catch (error) {
        console.error("\n❌ FAILED. The API Key is invalid or the API is not enabled.");
        console.error("Error Message:", error.message);

        if (error.message.includes("404")) {
            console.log("\n[Troubleshooting] 404 Not Found:");
            console.log("1. The 'Generative Language API' might not be enabled for this project.");
            console.log("2. The model 'gemini-1.5-flash' might not be available to this key.");
            console.log("3. Try creating a NEW API Key in a NEW Project on Google AI Studio.");
        }
        console.log("---------------------------------------------------");
    }
}

testKey();
