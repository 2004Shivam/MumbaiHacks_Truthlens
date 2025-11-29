const axios = require('axios');
require('dotenv').config();

async function testNews() {
    try {
        const apiKey = process.env.NEWS_API_KEY;
        console.log("Testing News API Key:", apiKey ? `${apiKey.substring(0, 5)}...` : "undefined");

        const url = `https://newsapi.org/v2/everything?q=test&apiKey=${apiKey}`;
        const response = await axios.get(url);
        console.log("News API Success! Articles found:", response.data.totalResults);
    } catch (error) {
        console.error("News API Error:", error.response ? error.response.data : error.message);
    }
}

testNews();
