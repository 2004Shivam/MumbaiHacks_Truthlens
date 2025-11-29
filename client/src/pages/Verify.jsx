import React, { useState } from 'react';
import { Shield, Send, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import { useMode } from '../context/ModeContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';

const Verify = () => {
    const [text, setText] = useState('');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showAnalystDetails, setShowAnalystDetails] = useState(false);
    const { isCitizen, isAnalyst } = useMode();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!text.trim() || loading) return;

        setLoading(true);
        setError('');
        setResult(null);

        try {
            const response = await fetch('http://localhost:5000/api/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: text.trim() })
            });

            const data = await response.json();

            if (response.ok) {
                setResult(data);
            } else {
                setError(data.error || 'Failed to verify claim');
            }
        } catch (err) {
            console.error('Verification error:', err);
            setError('Failed to connect to verification service');
        } finally {
            setLoading(false);
        }
    };

    const handleFeedback = async (helpful) => {
        if (!result?._id) return;

        try {
            await fetch('http://localhost:5000/api/feedback', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ verificationId: result._id, helpful })
            });
        } catch (err) {
            console.error('Feedback error:', err);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-500/10 rounded-2xl mb-4">
                    <Shield className="w-8 h-8 text-indigo-400" />
                </div>
                <h1 className="text-3xl font-bold text-white mb-2">Verify Any Claim</h1>
                <p className="text-gray-400">AI-powered fact-checking using real-time news data</p>
            </div>

            {/* Input Card */}
            <Card className="p-6 mb-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Enter a claim or statement to verify
                        </label>
                        <textarea
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            placeholder="Example: The Eiffel Tower is located in France"
                            className="w-full h-32 px-4 py-3 bg-slate-900/60 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-150 resize-none"
                            disabled={loading}
                        />
                    </div>
                    <Button
                        type="submit"
                        disabled={!text.trim() || loading}
                        className="w-full"
                        size="lg"
                    >
                        {loading ? (
                            <>
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                                Verifying...
                            </>
                        ) : (
                            <>
                                <Send className="w-5 h-5 mr-2" />
                                Verify Claim
                            </>
                        )}
                    </Button>
                </form>
            </Card>

            {/* Error Message */}
            {error && (
                <Card className="p-4 mb-6 border-red-500/30 bg-red-500/10">
                    <p className="text-red-400 text-sm">{error}</p>
                </Card>
            )}

            {/* Result Card */}
            {result && (
                <div className="space-y-4">
                    {/* Verdict Card */}
                    <Card className="p-6">
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <p className="text-sm text-gray-400 mb-2">Claim</p>
                                <p className="text-lg font-medium text-white">{result.claim}</p>
                            </div>
                            <Badge
                                variant={result.verdict?.toLowerCase()}
                                size="lg"
                                className="text-base px-4 py-2"
                            >
                                {result.verdict}
                            </Badge>
                        </div>

                        {/* Confidence (Analyst Mode) */}
                        {isAnalyst && result.confidence !== undefined && (
                            <div className="mb-4 pb-4 border-b border-white/10">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm text-gray-400">Confidence</span>
                                    <span className="text-sm font-medium text-white">
                                        {(result.confidence * 100).toFixed(0)}%
                                    </span>
                                </div>
                                <div className="w-full bg-slate-800 rounded-full h-2">
                                    <div
                                        className="bg-indigo-500 h-2 rounded-full transition-all duration-500"
                                        style={{ width: `${result.confidence * 100}%` }}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Explanation */}
                        <div>
                            <p className="text-sm text-gray-400 mb-2">
                                {isCitizen ? 'Explanation' : 'Public Explanation'}
                            </p>
                            <p className="text-gray-300 leading-relaxed">
                                {isCitizen ? result.publicExplanation : result.publicExplanation}
                            </p>
                        </div>

                        {/* Analyst Details (Expandable) */}
                        {isAnalyst && result.analystExplanation && (
                            <div className="mt-4 pt-4 border-t border-white/10">
                                <button
                                    onClick={() => setShowAnalystDetails(!showAnalystDetails)}
                                    className="flex items-center justify-between w-full text-left"
                                >
                                    <span className="text-sm font-medium text-indigo-400">
                                        Detailed Analysis
                                    </span>
                                    {showAnalystDetails ? (
                                        <ChevronUp className="w-4 h-4 text-gray-400" />
                                    ) : (
                                        <ChevronDown className="w-4 h-4 text-gray-400" />
                                    )}
                                </button>
                                {showAnalystDetails && (
                                    <div className="mt-3 p-4 bg-white/5 rounded-xl">
                                        <p className="text-sm text-gray-300 leading-relaxed">
                                            {result.analystExplanation}
                                        </p>
                                        {result.previousVerifications && result.previousVerifications.length > 0 && (
                                            <div className="mt-4 pt-4 border-t border-white/10">
                                                <p className="text-xs text-gray-400 mb-2">Previous Verifications</p>
                                                <div className="space-y-2">
                                                    {result.previousVerifications.map((v, i) => (
                                                        <div key={i} className="flex items-center justify-between text-xs">
                                                            <Badge variant={v.verdict?.toLowerCase()} size="sm">
                                                                {v.verdict}
                                                            </Badge>
                                                            <span className="text-gray-500">
                                                                {v.confidence ? `${(v.confidence * 100).toFixed(0)}%` : 'N/A'}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </Card>

                    {/* Sources */}
                    {result.sources && result.sources.length > 0 && (
                        <Card className="p-6">
                            <h3 className="text-sm font-medium text-gray-400 mb-3">Sources</h3>
                            <div className="flex flex-wrap gap-2">
                                {result.sources.map((source, i) => (
                                    <a
                                        key={i}
                                        href={source}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-sm text-gray-300 hover:bg-white/10 hover:border-white/20 transition-all duration-150"
                                    >
                                        <span className="truncate max-w-xs">Source {i + 1}</span>
                                        <ExternalLink className="w-3 h-3 ml-2 flex-shrink-0" />
                                    </a>
                                ))}
                            </div>
                        </Card>
                    )}

                    {/* Feedback */}
                    <Card className="p-6">
                        <p className="text-sm text-gray-400 mb-3">Was this verification helpful?</p>
                        <div className="flex space-x-3">
                            <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => handleFeedback(true)}
                            >
                                👍 Helpful
                            </Button>
                            <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => handleFeedback(false)}
                            >
                                👎 Not Helpful
                            </Button>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default Verify;
