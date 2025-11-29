require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cron = require('node-cron');

// Routes
const verifyRoutes = require('./routes/verify');
const verifyImageRoutes = require('./routes/verifyImage');
const topicRoutes = require('./routes/topics');
const claimRoutes = require('./routes/claims');
const adminRoutes = require('./routes/admin');
const insightsRoutes = require('./routes/insights');
const feedbackRoutes = require('./routes/feedback');

// Agents
const { fetchAndSaveNews } = require('./agents/watcher');
const { clusterPosts } = require('./agents/clustering');
const { extractClaims } = require('./agents/extractClaims');
const { verifyClaimsAgent } = require('./agents/verifyClaims');
const { explanationAgent } = require('./agents/explanationAgent');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve uploaded images
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/verify/image', verifyImageRoutes);
app.use('/api/verify', verifyRoutes);
app.use('/api/topics', topicRoutes);
app.use('/api/claims', claimRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/insights', insightsRoutes);
app.use('/api/feedback', feedbackRoutes);

// Database Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/satayaAI')
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error('MongoDB Connection Error:', err));

// Schedule Agents
// Watcher: Every 5 minutes
cron.schedule('*/5 * * * *', () => {
    fetchAndSaveNews();
});

// Clustering: Every 10 minutes
cron.schedule('*/10 * * * *', () => {
    clusterPosts();
});

// Extraction: Every 12 minutes (offset to allow clustering)
cron.schedule('*/12 * * * *', () => {
    extractClaims();
});

// Verification: Every 15 minutes
cron.schedule('*/15 * * * *', () => {
    verifyClaimsAgent();
});

// Explanation: Every 20 minutes
cron.schedule('*/20 * * * *', () => {
    explanationAgent();
});

// Run agents immediately on startup for demo purposes
console.log("Starting initial agent run...");
fetchAndSaveNews();
setTimeout(clusterPosts, 10000); // Wait 10s
setTimeout(extractClaims, 20000); // Wait 20s
setTimeout(verifyClaimsAgent, 30000); // Wait 30s
setTimeout(explanationAgent, 40000); // Wait 40s

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
// Trigger restart
