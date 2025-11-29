import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const InsightsTrendsChart = ({ data, loading }) => {
    if (loading) {
        return (
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                <h2 className="text-xl font-semibold mb-4">Claim Trends (Last 30 Days)</h2>
                <div className="h-80 flex items-center justify-center text-gray-400">
                    Loading trends...
                </div>
            </div>
        );
    }

    if (!data || !data.days || data.days.length === 0) {
        return (
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                <h2 className="text-xl font-semibold mb-4">Claim Trends (Last 30 Days)</h2>
                <div className="h-80 flex items-center justify-center text-gray-400">
                    No trend data available
                </div>
            </div>
        );
    }

    // Format data for recharts
    const chartData = data.days.map(day => ({
        date: new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        True: day.true || 0,
        False: day.false || 0,
        Unclear: day.unclear || 0
    }));

    return (
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 mb-8">
            <h2 className="text-xl font-semibold mb-4">Claim Trends (Last 30 Days)</h2>
            <ResponsiveContainer width="100%" height={320}>
                <AreaChart data={chartData}>
                    <defs>
                        <linearGradient id="colorTrue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0.1} />
                        </linearGradient>
                        <linearGradient id="colorFalse" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1} />
                        </linearGradient>
                        <linearGradient id="colorUnclear" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.1} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                    <XAxis
                        dataKey="date"
                        stroke="#9ca3af"
                        tick={{ fill: '#9ca3af' }}
                    />
                    <YAxis
                        stroke="#9ca3af"
                        tick={{ fill: '#9ca3af' }}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#1f2937',
                            border: '1px solid #374151',
                            borderRadius: '8px'
                        }}
                        labelStyle={{ color: '#f3f4f6' }}
                    />
                    <Legend />
                    <Area
                        type="monotone"
                        dataKey="True"
                        stroke="#10b981"
                        fillOpacity={1}
                        fill="url(#colorTrue)"
                    />
                    <Area
                        type="monotone"
                        dataKey="False"
                        stroke="#ef4444"
                        fillOpacity={1}
                        fill="url(#colorFalse)"
                    />
                    <Area
                        type="monotone"
                        dataKey="Unclear"
                        stroke="#f59e0b"
                        fillOpacity={1}
                        fill="url(#colorUnclear)"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};

export default InsightsTrendsChart;
