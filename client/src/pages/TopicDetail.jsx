import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, CheckCircle, Clock } from 'lucide-react';

const TopicDetail = () => {
    const { id } = useParams();
    const [data, setData] = useState(null);

    useEffect(() => {
        axios.get(`http://localhost:5000/api/topics/${id}`)
            .then(res => setData(res.data))
            .catch(err => console.error(err));
    }, [id]);

    if (!data) return <div className="pt-24 text-center text-gray-500">Loading...</div>;

    const { topic, claims } = data;

    return (
        <div className="pt-24 px-4 sm:px-6 lg:px-8 min-h-screen bg-dark text-white">
            <div className="max-w-4xl mx-auto">
                <Link to="/topics" className="inline-flex items-center text-gray-400 hover:text-white mb-6">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Topics
                </Link>

                <div className="glass-card p-8 mb-8">
                    <h1 className="text-3xl font-bold mb-4">{topic.title}</h1>
                    <p className="text-gray-300 text-lg leading-relaxed">{topic.summary}</p>
                    <div className="mt-6 flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {new Date(topic.createdAt).toLocaleString()}</span>
                        <span>•</span>
                        <span>{claims.length} Claims Extracted</span>
                    </div>
                </div>

                <h2 className="text-2xl font-bold mb-6">Extracted Claims</h2>
                <div className="space-y-4">
                    {claims.map(claim => (
                        <Link key={claim._id} to={`/claims/${claim._id}`} className="block glass-card p-6 hover:bg-white/5 transition-colors">
                            <div className="flex justify-between items-start gap-4">
                                <p className="text-lg font-medium">{claim.claimText}</p>
                                {claim.isVerified ? (
                                    <CheckCircle className="w-6 h-6 text-green-500 shrink-0" />
                                ) : (
                                    <div className="px-3 py-1 bg-yellow-500/10 text-yellow-500 text-xs rounded-full shrink-0">Pending Verification</div>
                                )}
                            </div>
                        </Link>
                    ))}
                    {claims.length === 0 && <p className="text-gray-500">No claims extracted yet.</p>}
                </div>
            </div>
        </div>
    );
};

export default TopicDetail;
