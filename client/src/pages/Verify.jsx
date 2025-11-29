import React, { useState } from 'react';
import { Shield, Send, ChevronDown, ChevronUp, ExternalLink, FileText, Image as ImageIcon } from 'lucide-react';
import { useMode } from '../context/ModeContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import ImageUpload from '../components/ImageUpload';

const Verify = () => {
    const [activeTab, setActiveTab] = useState('text'); // 'text' or 'image'
    const [text, setText] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showAnalystDetails, setShowAnalystDetails] = useState(false);
    const { isCitizen, isAnalyst } = useMode();

    const handleTextSubmit = async (e) => {
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

    const handleImageSubmit = async (e) => {
        e.preventDefault();
        if (!selectedImage || loading) return;

        setLoading(true);
        setError('');
        setResult(null);

        try {
            const formData = new FormData();
            formData.append('image', selectedImage);

            const response = await fetch('http://localhost:5000/api/verify/image', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            if (response.ok) {
                setResult(data);
            } else {
                setError(data.error || 'Failed to verify image');
            }
        } catch (err) {
            console.error('Image verification error:', err);
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

            {/* Tab Switcher */}
            <Card className="p-4 mb-6">
                <div className="flex space-x-1 bg-slate-900/60 p-1 rounded-xl">
                    <button
                        onClick={() => setActiveTab('text')}
                        className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${activeTab === 'text'
                                ? 'bg-indigo-600 text-white'
                                : 'text-gray-400 hover:text-white'
                            }`}
                    >
                        <FileText className="w-4 h-4" />
                        <span>Text Claim</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('image')}
                        className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${activeTab === 'image'
                                ? 'bg-indigo-600 text-white'
                                : 'text-gray-400 hover:text-white'
                            }`}
                    >
                        <ImageIcon className="w-4 h-4" />
                        <span>Image / Screenshot</span>
                    </button>
                </div>
            </Card>

            {/* Input Card - Text */}
            {activeTab === 'text' && (
                <Card className="p-6 mb-6">
                    <form onSubmit={handleTextSubmit} className="space-y-4">
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
            )}

            {/* Input Card - Image */}
            {activeTab === 'image' && (
                <Card className="p-6 mb-6">
                    <form onSubmit={handleImageSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-3">
                                Upload an image or screenshot
                            </label>
                            <ImageUpload
                                onImageSelect={setSelectedImage}
                                onImageRemove={() => setSelectedImage(null)}
                                disabled={loading}
                            />
                        </div>
                        <Button
                            type="submit"
                            disabled={!selectedImage || loading}
                            className="w-full"
                            size="lg"
                        >
                            {loading ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                                    Analyzing Image...
                                </>
                            ) : (
                                <>
                                    <Shield className="w-5 h-5 mr-2" />
                                    Verify Image
                                </>
                            )}
                        </Button>
                    </form>
                </Card>
            )}

            {/* Error Message */}
            {error && (
                <Card className="p-4 mb-6 border-red-500/30 bg-red-500/10">
                    <p className="text-red-400 text-sm">{error}</p>
                </Card>
            )}

            {/* Result Card */}
            {result && (
                <div className="space-y-4">
                    {/* Image Info (if from image) */}
                    {result.extractedText && (
                        <Card className="p-6">
                            <h3 className="text-sm font-medium text-gray-400 mb-3">Extracted Text from Image</h3>
                            <p className="text-white bg-slate-900/60 p-4 rounded-xl border border-white/10 mb-3">
                                {result.extractedText}
                            </p>
                            {result.ocrConfidence && (
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-400">OCR Confidence</span>
                                    <span className="text-white font-medium">
                                        {(result.ocrConfidence).toFixed(0)}%
                                    </span>
                                </div>
                            )}
                        </Card>
                    )}

                    {/* Fake Detection (if from image) */}
                    {result.fakeDetection && (
                        <Card className="p-6">
                            <h3 className="text-sm font-medium text-gray-400 mb-3">Image Authenticity Analysis</h3>
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-white">Status:</span>
                                <Badge
                                    variant={result.fakeDetection.isFake ? 'false' : 'true'}
                                    size="md"
                                >
                                    {result.fakeDetection.isFake ? 'Suspicious' : 'Appears Authentic'}
                                </Badge>
                            </div>
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-gray-400 text-sm">Confidence</span>
                                <span className="text-white font-medium">
                                    {(result.fakeDetection.confidence * 100).toFixed(0)}%
                                </span>
                            </div>
                            <p className="text-sm text-gray-300 bg-white/5 p-3 rounded-lg">
                                {result.fakeDetection.reasoning}
                            </p>
                        </Card>
                    )}

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
                                {result.publicExplanation}
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
