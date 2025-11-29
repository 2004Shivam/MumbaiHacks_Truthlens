import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { MessageSquare, ExternalLink, CheckCircle, Clock } from 'lucide-react';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';

const Claims = () => {
    const [claims, setClaims] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchClaims();
    }, []);

    const fetchClaims = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/claims');
            setClaims(response.data);
        } catch (error) {
            console.error('Error fetching claims:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">All Claims</h2>
                    <p className="text-gray-600 text-sm mt-1">
                        {claims.length} claim{claims.length !== 1 ? 's' : ''} extracted
                    </p>
                </div>
            </div>

            {/* Claims List */}
            {loading ? (
                <Card className="p-12">
                    <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500" />
                    </div>
                </Card>
            ) : claims.length === 0 ? (
                <Card className="p-12">
                    <div className="text-center">
                        <MessageSquare className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                        <p className="text-gray-600">No claims yet. Agents are extracting claims...</p>
                    </div>
                </Card>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {claims.map(claim => (
                        <Link
                            key={claim._id}
                            to={`/claims/${claim._id}`}
                        >
                            <Card hover className="p-6">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-2 mb-3">
                                            <Badge
                                                variant={claim.isVerified ? 'true' : 'unclear'}
                                                size="sm"
                                            >
                                                {claim.isVerified ? (
                                                    <>
                                                        <CheckCircle className="w-3 h-3 mr-1" />
                                                        Verified
                                                    </>
                                                ) : (
                                                    <>
                                                        <Clock className="w-3 h-3 mr-1" />
                                                        Pending
                                                    </>
                                                )}
                                            </Badge>
                                            {claim.topicId?.category && (
                                                <Badge variant={claim.topicId.category} size="sm">
                                                    {claim.topicId.category}
                                                </Badge>
                                            )}
                                        </div>
                                        <p className="text-gray-900 font-medium mb-2 line-clamp-3">
                                            {claim.claimText}
                                        </p>
                                        {claim.topicId?.title && (
                                            <p className="text-xs text-gray-600">
                                                Topic: {claim.topicId.title}
                                            </p>
                                        )}
                                    </div>
                                    <ExternalLink className="w-5 h-5 text-gray-500 flex-shrink-0" />
                                </div>
                            </Card>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Claims;
