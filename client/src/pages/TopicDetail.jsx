import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, CheckCircle } from 'lucide-react';

const TopicDetail = () => {
    const { id } = useParams();
    const [data, setData] = useState(null);

    useEffect(() => {
        axios.get(`http://localhost:5000/api/topics/${id}`)
            .then(res => setData(res.data))
            .catch(err => console.error(err));
    }, [id]);

    if (!data) return <div className="pt-24 text-center text-gray-600">Loading...</div>;

    const { topic, claims } = data;

    return (
        <div className="space-y-6">
            <Link to="/topics" className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Topics
            </Link>

            <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
                <h1 className="text-3xl font-bold mb-4 text-gray-900">{topic.title}</h1>
                <p className="text-gray-700 text-lg leading-relaxed">{topic.summary}</p>
                <div className="mt-6 flex items-center gap-4 text-sm text-gray-600">
                    <span>{new Date(topic.createdAt).toLocaleString()}</span>
                    <span>•</span>
                    <span>{claims.length} Claims Extracted</span>
                </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-900">Extracted Claims</h2>
            <div className="space-y-4">
                {claims.map(claim => (
                    <Link
                        key={claim._id}
                        to={`/claims/${claim._id}`}
                        className="block bg-white border border-gray-200 rounded-xl p-6 hover:bg-gray-50 hover:border-gray-300 transition-colors shadow-sm"
                    >
                        <div className="flex justify-between items-start gap-4">
                            <p className="text-lg font-medium text-gray-900">{claim.claimText}</p>
                            {claim.isVerified ? (
                                <CheckCircle className="w-6 h-6 text-green-600 shrink-0" />
                            ) : (
                                <div className="px-3 py-1 bg-yellow-100 text-yellow-700 border border-yellow-300 text-xs rounded-full shrink-0">
                                    Pending Verification
                                </div>
                            )}
                        </div>
                    </Link>
                ))}
                {claims.length === 0 && <p className="text-gray-600">No claims extracted yet.</p>}
            </div>
        </div>
    );
};

export default TopicDetail;
