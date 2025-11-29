import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle, XCircle, HelpCircle, ExternalLink, TrendingUp, History } from 'lucide-react';
import { useMode } from '../context/ModeContext';

const ClaimDetail = () => {
    const { id } = useParams();
    const [claim, setClaim] = useState(null);
    const [verifications, setVerifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const { isCitizen, isAnalyst } = useMode();

    useEffect(() => {
        fetchClaimDetails();
    }, [id]);

    const fetchClaimDetails = async () => {
        try {
            // Fetch claim details
            const claimRes = await fetch(`http://localhost:5000/api/claims/${id}`);
            const claimData = await claimRes.json();
            setClaim(claimData.claim);

            // Fetch all verifications for this claim
            const verificationsRes = await fetch(`http://localhost:5000/api/claims`);
            const allClaims = await verificationsRes.json();

            // Filter verifications manually (ideally, backend should have an endpoint)
            // For now, we'll use what we have
            if (claimData.verification) {
                setVerifications([claimData.verification]);
            }
        } catch (error) {
            console.error('Error fetching claim details:', error);
        } finally {
            setLoading(false);
        }
    };

    const getVerdictConfig = (verdict) => {
        switch (verdict?.toLowerCase()) {
            case 'true':
                return { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50', label: 'True' };
            case 'false':
                return { icon: XCircle, color: 'text-red-600', bg: 'bg-red-50', label: 'False' };
            default:
                return { icon: HelpCircle, color: 'text-yellow-600', bg: 'bg-yellow-50', label: 'Unclear' };
        }
    };

    if (loading) {
        return (
            <div className="pt-24 px-4 min-h-screen bg-gray-50 text-gray-900">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="animate-spin w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading claim details...</p>
                </div>
            </div>
        );
    }

    if (!claim) {
        return (
            <div className="pt-24 px-4 min-h-screen bg-gray-50 text-gray-900">
                <div className="max-w-4xl mx-auto text-center">
                    <p className="text-gray-600">Claim not found</p>
                </div>
            </div>
        );
    }

    const avgConfidence = verifications.length > 0
        ? verifications.reduce((sum, v) => sum + (v.confidence || 0), 0) / verifications.length
        : 0;

    return (
        <div className="pt-24 px-4 sm:px-6 lg:px-8 min-h-screen bg-gray-50 text-gray-900">
            <div className="max-w-4xl mx-auto">
                <Link to="/claims" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Claims
                </Link>

                {/* Claim Header */}
                <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm mb-6">
                    <h1 className="text-2xl font-bold mb-4 text-gray-900">Claim Details</h1>
                    <p className="text-xl text-gray-700 leading-relaxed">"{claim.claimText}"</p>

                    {/* Claim Metadata */}
                    <div className="mt-6 pt-6 border-t border-gray-200">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                                <div className="text-gray-500 mb-1">Created</div>
                                <div className="text-gray-900 font-medium">{new Date(claim.createdAt).toLocaleDateString()}</div>
                            </div>
                            <div>
                                <div className="text-gray-500 mb-1">Verifications</div>
                                <div className="text-gray-900 font-medium flex items-center space-x-1">
                                    <History className="w-4 h-4" />
                                    <span>{verifications.length}</span>
                                </div>
                            </div>
                            {isAnalyst && verifications.length > 0 && (
                                <>
                                    <div>
                                        <div className="text-gray-500 mb-1">Avg Confidence</div>
                                        <div className="text-gray-900 font-medium flex items-center space-x-1">
                                            <TrendingUp className="w-4 h-4" />
                                            <span>{(avgConfidence * 100).toFixed(0)}%</span>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-gray-500 mb-1">Status</div>
                                        <div className="text-gray-900 font-medium">{claim.isVerified ? 'Verified' : 'Pending'}</div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Verifications */}
                {verifications.length > 0 ? (
                    <div className="space-y-6">
                        <h2 className="text-xl font-semibold flex items-center space-x-2 text-gray-900">
                            <History className="w-6 h-6 text-indigo-600" />
                            <span>Verification History ({verifications.length})</span>
                        </h2>

                        {verifications.map((verification, index) => {
                            const config = getVerdictConfig(verification.verdict);
                            const Icon = config.icon;

                            return (
                                <div
                                    key={index}
                                    className={`bg-white rounded-xl p-6 border ${index === 0 ? 'border-indigo-200 shadow-md' : 'border-gray-200 shadow-sm'}`}
                                >
                                    {/* Verdict Header */}
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="flex items-center space-x-3">
                                            <div className={`p-3 rounded-full ${config.bg}`}>
                                                <Icon className={`w-6 h-6 ${config.color}`} />
                                            </div>
                                            <div>
                                                <div className="text-sm text-gray-500">Verdict</div>
                                                <div className={`text-xl font-bold ${config.color}`}>{config.label}</div>
                                            </div>
                                        </div>
                                        {index === 0 && <span className="text-xs bg-indigo-50 text-indigo-600 px-2 py-1 rounded-full border border-indigo-100">Latest</span>}
                                    </div>

                                    {/* Explanation (Mode-Dependent) */}
                                    <div className="mb-6">
                                        <h3 className="text-sm text-gray-500 mb-2">
                                            {isCitizen ? 'Explanation' : 'Detailed Analysis'}
                                        </h3>
                                        <p className="text-gray-700 leading-relaxed">
                                            {isCitizen
                                                ? verification.publicExplanation || verification.analystExplanation || verification.explanation
                                                : verification.analystExplanation || verification.publicExplanation || verification.explanation
                                            }
                                        </p>
                                    </div>

                                    {/* Sources */}
                                    {verification.sources && verification.sources.length > 0 && (
                                        <div className="mb-6">
                                            <h3 className="text-sm text-gray-500 mb-3">Sources</h3>
                                            <ul className="space-y-2">
                                                {verification.sources.map((source, idx) => (
                                                    <li key={idx} className="flex items-start space-x-2 text-indigo-600 text-sm hover:text-indigo-700">
                                                        <ExternalLink className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                                        <a href={source} target="_blank" rel="noopener noreferrer" className="break-all hover:underline">
                                                            {source}
                                                        </a>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {/* Analyst Mode: Additional Metadata */}
                                    {isAnalyst && (
                                        <div className="pt-4 border-t border-gray-200">
                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                                                {verification.confidence !== undefined && (
                                                    <div>
                                                        <div className="text-gray-500 mb-1">Confidence</div>
                                                        <div className="text-gray-900 font-semibold">
                                                            {(verification.confidence * 100).toFixed(0)}%
                                                        </div>
                                                    </div>
                                                )}
                                                {verification.sourceQuality !== undefined && (
                                                    <div>
                                                        <div className="text-gray-500 mb-1">Source Quality</div>
                                                        <div className="text-gray-900 font-semibold">
                                                            {(verification.sourceQuality * 100).toFixed(0)}%
                                                        </div>
                                                    </div>
                                                )}
                                                <div>
                                                    <div className="text-gray-500 mb-1">Verified On</div>
                                                    <div className="text-gray-900 text-xs">
                                                        {new Date(verification.scoredAt).toLocaleString()}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="bg-white rounded-xl p-12 border border-gray-200 text-center shadow-sm">
                        <div className="animate-spin w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                        <p className="text-gray-600">Verification in progress by autonomous agents...</p>
                        <p className="text-gray-500 text-sm mt-2">This claim is being analyzed and verified</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ClaimDetail;
