import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, Tag } from 'lucide-react';

const TopTopicsTable = ({ data, loading }) => {
    if (loading) {
        return (
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                <h2 className="text-xl font-semibold mb-4">Top Topics</h2>
                <div className="text-gray-400">Loading topics...</div>
            </div>
        );
    }

    if (!data || data.length === 0) {
        return (
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                <h2 className="text-xl font-semibold mb-4">Top Topics</h2>
                <div className="text-gray-400">No topics available</div>
            </div>
        );
    }

    const getCategoryColor = (category) => {
        const colors = {
            election: 'bg-blue-500/20 text-blue-400',
            health: 'bg-green-500/20 text-green-400',
            disaster: 'bg-red-500/20 text-red-400',
            finance: 'bg-yellow-500/20 text-yellow-400',
            general: 'bg-gray-500/20 text-gray-400'
        };
        return colors[category] || colors.general;
    };

    return (
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 mb-8">
            <h2 className="text-xl font-semibold mb-4">Top Topics by Claims</h2>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-white/10">
                            <th className="text-left py-3 px-4 text-gray-400 font-medium">Topic</th>
                            <th className="text-left py-3 px-4 text-gray-400 font-medium">Category</th>
                            <th className="text-center py-3 px-4 text-gray-400 font-medium">Total Claims</th>
                            <th className="text-center py-3 px-4 text-gray-400 font-medium">False</th>
                            <th className="text-center py-3 px-4 text-gray-400 font-medium">Unclear</th>
                            <th className="text-center py-3 px-4 text-gray-400 font-medium">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((topic, index) => (
                            <tr key={topic._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                <td className="py-3 px-4">
                                    <div className="font-medium">{topic.title}</div>
                                </td>
                                <td className="py-3 px-4">
                                    <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs ${getCategoryColor(topic.category)}`}>
                                        <Tag className="w-3 h-3" />
                                        <span>{topic.category || 'general'}</span>
                                    </span>
                                </td>
                                <td className="py-3 px-4 text-center">
                                    <span className="font-semibold text-blue-400">{topic.totalClaims}</span>
                                </td>
                                <td className="py-3 px-4 text-center">
                                    <span className="text-red-400">{topic.falseClaims}</span>
                                </td>
                                <td className="py-3 px-4 text-center">
                                    <span className="text-yellow-400">{topic.unclearClaims}</span>
                                </td>
                                <td className="py-3 px-4 text-center">
                                    <Link
                                        to={`/topics/${topic._id}`}
                                        className="inline-flex items-center space-x-1 text-primary hover:text-primary/80 transition-colors"
                                    >
                                        <span>View</span>
                                        <ExternalLink className="w-4 h-4" />
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TopTopicsTable;
