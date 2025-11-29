import React from 'react';
import { AlertCircle, Calendar } from 'lucide-react';

const RecurringFalseClaimsList = ({ data, loading }) => {
    if (loading) {
        return (
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                <h2 className="text-xl font-semibold mb-4">Recurring False Claims</h2>
                <div className="text-gray-400">Loading recurring claims...</div>
            </div>
        );
    }

    if (!data || data.length === 0) {
        return (
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                <h2 className="text-xl font-semibold mb-4">Recurring False Claims</h2>
                <div className="text-gray-400">No recurring false claims found</div>
            </div>
        );
    }

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    return (
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <h2 className="text-xl font-semibold mb-4 flex items-center space-x-2">
                <AlertCircle className="w-6 h-6 text-red-400" />
                <span>Recurring False Claims</span>
            </h2>
            <p className="text-gray-400 text-sm mb-4">
                These claims have been verified as false multiple times
            </p>
            <div className="space-y-4">
                {data.map((claim, index) => (
                    <div
                        key={index}
                        className="bg-white/5 rounded-lg p-4 border border-red-500/20 hover:border-red-500/40 transition-colors"
                    >
                        <div className="flex items-start justify-between mb-2">
                            <p className="text-white font-medium flex-1 pr-4">
                                {claim.claimText}
                            </p>
                            <span className="bg-red-500/20 text-red-400 px-3 py-1 rounded-full text-sm font-semibold whitespace-nowrap">
                                {claim.occurrences}x
                            </span>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-400">
                            <div className="flex items-center space-x-1">
                                <Calendar className="w-4 h-4" />
                                <span>First: {formatDate(claim.firstSeen)}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                                <Calendar className="w-4 h-4" />
                                <span>Last: {formatDate(claim.lastSeen)}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RecurringFalseClaimsList;
