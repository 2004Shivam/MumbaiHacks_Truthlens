import React, { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';

const VerifyForm = ({ onVerify, isLoading }) => {
    const [text, setText] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (text.trim()) {
            onVerify(text);
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto">
            <form onSubmit={handleSubmit} className="relative">
                <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                    <div className="relative">
                        <textarea
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            placeholder="Paste a rumor, news headline, or message here to verify..."
                            className="w-full h-40 bg-dark-card border border-gray-700 rounded-2xl p-6 text-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-none transition-all"
                            disabled={isLoading}
                        />
                        <div className="absolute bottom-4 right-4">
                            <button
                                type="submit"
                                disabled={!text.trim() || isLoading}
                                className={`btn-primary flex items-center gap-2 py-2 px-6 text-sm ${(!text.trim() || isLoading) ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Verifying...
                                    </>
                                ) : (
                                    <>
                                        <Search className="w-4 h-4" />
                                        Verify Truth
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default VerifyForm;
