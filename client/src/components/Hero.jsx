import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Search, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const Hero = () => {
    return (
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
            {/* Background Blobs */}
            <div className="absolute top-0 -left-4 w-72 h-72 bg-primary rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
            <div className="absolute top-0 -right-4 w-72 h-72 bg-secondary rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-5xl md:text-7xl font-bold mb-6 tracking-tight"
                >
                    Truth in the <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Age of AI</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto"
                >
                    Instantly verify rumors, news, and messages with our advanced AI-powered fact-checking engine.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="flex flex-col sm:flex-row justify-center gap-4"
                >
                    <Link to="/verify" className="btn-primary flex items-center justify-center gap-2">
                        Start Verifying <ArrowRight className="w-5 h-5" />
                    </Link>
                </motion.div>

                {/* Features Grid */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20"
                >
                    <div className="glass-card p-6 text-left">
                        <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
                            <Search className="w-6 h-6 text-primary" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">Real-time Analysis</h3>
                        <p className="text-gray-400">Scans global news sources instantly to find the truth.</p>
                    </div>
                    <div className="glass-card p-6 text-left">
                        <div className="w-12 h-12 bg-secondary/20 rounded-lg flex items-center justify-center mb-4">
                            <Shield className="w-6 h-6 text-secondary" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">AI Verification</h3>
                        <p className="text-gray-400">Powered by advanced LLMs to understand context and nuance.</p>
                    </div>
                    <div className="glass-card p-6 text-left">
                        <div className="w-12 h-12 bg-pink-500/20 rounded-lg flex items-center justify-center mb-4">
                            <Zap className="w-6 h-6 text-pink-500" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">Instant Verdict</h3>
                        <p className="text-gray-400">Get clear True/False/Unclear ratings with explanations.</p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Hero;
