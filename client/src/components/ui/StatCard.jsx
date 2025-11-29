import React from 'react';
import Card from './Card';

const StatCard = ({
    title,
    value,
    icon: Icon,
    trend,
    trendDirection = 'up',
    className = ''
}) => {
    return (
        <Card className={`p-6 ${className}`}>
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <p className="text-sm font-medium text-gray-400">{title}</p>
                    <p className="mt-2 text-3xl font-bold text-white">{value}</p>
                    {trend && (
                        <p className={`mt-2 text-sm ${trendDirection === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                            {trendDirection === 'up' ? '↑' : '↓'} {trend}
                        </p>
                    )}
                </div>
                {Icon && (
                    <div className="p-3 bg-indigo-500/10 rounded-xl">
                        <Icon className="w-6 h-6 text-indigo-400" />
                    </div>
                )}
            </div>
        </Card>
    );
};

export default StatCard;
