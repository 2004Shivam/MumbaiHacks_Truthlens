const mongoose = require('mongoose');
const Topic = require('./models/Topic');
const Claim = require('./models/Claim');
const Verification = require('./models/Verification');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/satayaAI';

async function seed() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        // Clear existing (optional, but good for clean slate if empty)
        // await Topic.deleteMany({});
        // await Claim.deleteMany({});
        // await Verification.deleteMany({});

        // Create Sample Topic
        const topic = await Topic.create({
            title: "Global Tech Summit 2025 Announced",
            summary: "World leaders and tech giants gather to discuss the future of AI and quantum computing in the upcoming summit.",
            posts: [],
            isClaimExtracted: true
        });

        console.log('Created Topic:', topic.title);

        // Create Sample Claims
        const claim1 = await Claim.create({
            topicId: topic._id,
            claimText: "Quantum computing will solve climate change by 2030.",
            isVerified: true
        });

        const claim2 = await Claim.create({
            topicId: topic._id,
            claimText: "AI regulation bill passed unanimously by the UN.",
            isVerified: true
        });

        console.log('Created Claims');

        // Create Verifications
        await Verification.create({
            claim: claim1.claimText,
            claimId: claim1._id,
            verdict: "Unclear",
            explanation: "While quantum computing shows promise for climate modeling, there is no scientific consensus that it will 'solve' climate change by 2030. Experts suggest it will be a tool, not a silver bullet.",
            sources: ["TechCrunch Analysis", "Nature Journal"]
        });

        await Verification.create({
            claim: claim2.claimText,
            claimId: claim2._id,
            verdict: "False",
            explanation: "The UN has discussed AI regulation, but no binding bill has been passed unanimously. Several countries have expressed reservations.",
            sources: ["UN Official Press Release", "Reuters"]
        });

        console.log('Created Verifications');
        console.log('Seeding complete!');
        process.exit(0);
    } catch (error) {
        console.error('Seeding error:', error);
        process.exit(1);
    }
}

seed();
