import React from 'react';
import { TrendingUp, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

const InsightsSummary = ({ data, loading }) => {
    if (loading) {
        return <div className="text-gray-400">Loading summary...</div>;
    }

    if (!data) {
        return <div className="text-gray-400">No data available</div>;
    }

    const totalClaims = data.totalClaims || 0;
    const falseClaims = data.byVerdict?.false || 0;
    const falsePercentage = totalClaims > 0 ? ((falseClaims / totalClaims) * 100).toFixed(1) : 0;

    const cards = [
        {
            title: 'Total Claims',
            value: totalClaims,
            icon: TrendingUp,
            color: 'text-blue-400',
            bgColor: 'bg-blue-500/10'
        },
        {
            title: 'False Claims',
            value: `${falsePercentage}%`,
            subtitle: `${falseClaims} of ${totalClaims}`,
            icon: AlertTriangle,
            color: 'text-red-400',
            bgColor: 'bg-red-500/10'
        },
        {
            title: 'Verified Claims',
            value: data.byVerdict?.true || 0,
            icon: CheckCircle,
            color: 'text-green-400',
            bgColor: 'bg-green-500/10'
        },
        {
            title: 'Last 7 Days',
            value: data.timeWindows?.last7Days || 0,
            subtitle: 'new claims',
            icon: Clock,
            color: 'text-purple-400',
            bgColor: 'bg-purple-500/10'
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {cards.map((card, index) => {
                const Icon = card.icon;
                return (
                    <div key={index} className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-gray-400 text-sm font-medium">{card.title}</h3>
                            <div className={`${card.bgColor} p-2 rounded-lg`}>
                                <Icon className={`w-5 h-5 ${card.color}`} />
                            </div>
                        </div>
                        <div className={`text-3xl font-bold ${card.color} mb-1`}>{card.value}</div>
                        {card.subtitle && <div className="text-gray-500 text-sm">{card.subtitle}</div>}
                    </div>
                );
            })}
        </div>
    );
};

export default InsightsSummary;
