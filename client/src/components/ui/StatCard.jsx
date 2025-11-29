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
                    <p className="text-sm font-medium text-gray-600">{title}</p>
                    <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
                    {trend && (
                        <p className={`mt-2 text-sm font-medium ${trendDirection === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                            {trendDirection === 'up' ? '↑' : '↓'} {trend}
                        </p>
                    )}
                </div>
                {Icon && (
                    <div className="p-3 bg-indigo-50 rounded-xl">
                        <Icon className="w-6 h-6 text-indigo-600" />
                    </div>
                )}
            </div>
        </Card>
    );
};

export default StatCard;
