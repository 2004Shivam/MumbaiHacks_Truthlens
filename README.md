# 🔍 TruthLens - AI-Powered Fact-Checking Platform

<div align="center">
  
![TruthLens](https://img.shields.io/badge/TruthLens-AI%20Fact%20Checker-6366F1?style=for-the-badge)
![React](https://img.shields.io/badge/React-18.0-61DAFB?style=for-the-badge&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-20.0-339933?style=for-the-badge&logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-7.0-47A248?style=for-the-badge&logo=mongodb)

**Combat misinformation with AI-powered real-time fact-checking**

[Features](#features) • [Tech Stack](#tech-stack) • [Installation](#installation) • [Usage](#usage)

</div>

---

## 📋 Overview

TruthLens is an advanced AI-powered fact-checking platform that automatically detects and verifies claims from news articles using LLM technology (Groq/Llama 3.3) and real-time news data. Built for MumbaiHacks hackathon.

### ✨ Key Features

- **🤖 AI-Powered Verification**: Uses Groq's Llama 3.3 70B model for intelligent claim verification
- **📰 Real-Time News Analysis**: Automatically fetches and clusters news articles
- **🎯 Smart Claim Extraction**: AI agents extract verifiable claims from news topics
- **🔍 Multi-Source Verification**: Cross-references claims across multiple news sources
- **📊 Analytics Dashboard**: Comprehensive insights and trend analysis
- **👥 Dual Mode**: Citizen (simple) and Analyst (detailed) interfaces
- **🎨 Premium UI**: Modern SaaS-style interface with dark theme and glass morphism

---

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI framework
- **React Router** - Navigation
- **Tailwind CSS** - Styling
- **Recharts** - Data visualization
- **Lucide Icons** - Icon library
- **Axios** - HTTP client

### Backend
- **Node.js & Express** - Server framework
- **MongoDB** - Database
- **Groq API** - LLM for verification (Llama 3.3 70B)
- **News API** - Real-time news fetching
- **node-fetch** - HTTP client
- **node-cron** - Scheduled tasks

### AI Agents
- **Watcher Agent** - Fetches news articles
- **Clustering Agent** - Groups articles into topics
- **Extraction Agent** - Extracts claims from topics
- **Verification Agent** - Verifies claims using LLM
- **Explanation Agent** - Refines explanations

---

## 🚀 Installation

### Prerequisites
- Node.js 18+ and npm
- MongoDB 7.0+
- Groq API key ([Get it here](https://console.groq.com))
- News API key ([Get it here](https://newsapi.org))

### Setup

1. **Clone the repository**
```bash
git clone https://github.com/2004Shivam/MumbaiHacks_Truthlens.git
cd TruthLens
```

2. **Install dependencies**
```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

3. **Configure environment variables**

Create `server/.env`:
```env
MONGODB_URI=mongodb://localhost:27017/truthlens
GROQ_API_KEY=your_groq_api_key_here
NEWS_API_KEY=your_news_api_key_here
PORT=5000
```

4. **Start MongoDB**
```bash
# Make sure MongoDB is running on localhost:27017
mongod
```

5. **Run the application**

Terminal 1 (Backend):
```bash
cd server
npm start
```

Terminal 2 (Frontend):
```bash
cd client
npm run dev
```

6. **Access the application**
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

---

## 📖 Usage

### Verify a Claim
1. Navigate to the **Verify** page
2. Enter any claim or statement
3. Click "Verify Claim"
4. Get instant AI-powered verification with:
   - Verdict (True/False/Unclear)
   - Confidence score
   - Detailed explanation
   - Supporting sources

### Browse Topics & Claims
- **Dashboard**: Overview of system activity
- **Topics**: Browse categorized news topics
- **Claims**: View all extracted claims
- **Insights**: Analytics and trends

### Mode Switching
- **Citizen Mode**: Simplified explanations for general public
- **Analyst Mode**: Detailed analysis with confidence scores and metadata

---

## 🏗️ Architecture

### Data Flow
```
News API → Watcher Agent → Raw Posts
         → Clustering Agent → Topics
         → Extraction Agent → Claims
         → Verification Agent → Verified Claims
         → Explanation Agent → Refined Explanations
```

### Key Components
- **Frontend**: React SPA with premium UI components
- **Backend**: RESTful API with Express
- **Database**: MongoDB with Mongoose ODM
- **AI Layer**: Groq API integration for LLM operations
- **Agents**: Autonomous background processes

---

## 📂 Project Structure

```
TruthLens/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   │   ├── ui/       # Design system components
│   │   │   └── layout/   # Layout components
│   │   ├── pages/        # Page components
│   │   ├── context/      # React context
│   │   └── App.jsx       # Main app component
│   └── package.json
│
├── server/                # Node.js backend
│   ├── models/           # Mongoose models
│   ├── routes/           # Express routes
│   ├── services/         # Business logic
│   ├── agents/           # AI agents
│   └── server.js         # Entry point
│
└── README.md
```

---

## 🎯 Features in Detail

### Claim Verification
- **Normalization**: Deduplicates similar claims
- **Confidence Scoring**: ML-based confidence ratings
- **Dual Explanations**: Public and analyst-level explanations
- **Source Quality**: Evaluates reliability of news sources
- **Previous Verifications**: Tracks claim history

### Analytics & Insights
- Verification trends over time
- Top topics by false claims
- Recurring misinformation patterns
- Category-based filtering

### User Experience
- Modern dark theme with glass morphism
- Responsive design (desktop/tablet/mobile)
- Real-time updates
- Smooth animations and transitions
- Intuitive navigation with sidebar

---

## 🔑 API Endpoints

### Verification
- `POST /api/verify` - Verify a claim
- `POST /api/feedback` - Submit feedback

### Topics & Claims
- `GET /api/topics` - List all topics
- `GET /api/topics/:id` - Get topic details
- `GET /api/claims` - List all claims
- `GET /api/claims/:id` - Get claim details

### Insights
- `GET /api/insights/summary` - Summary statistics
- `GET /api/insights/trends` - Verification trends
- `GET /api/insights/top-topics` - Top topics by false claims
- `GET /api/insights/recurring-false-claims` - Recurring misinformation

---

## 🤝 Contributing

This project was built for MumbaiHacks hackathon. Contributions, issues, and feature requests are welcome!

---

## 📄 License

MIT License - feel free to use this project for learning and development.

---

## 👨‍💻 Author

**Shivam**
- GitHub: [@2004Shivam](https://github.com/2004Shivam)

---

## 🙏 Acknowledgments

- MumbaiHacks for the hackathon opportunity
- Groq for providing fast LLM API
- News API for real-time news data
- React and Node.js communities

---

<div align="center">

**⭐ Star this repo if you find it useful!**

Made with ❤️ for MumbaiHacks

</div>
