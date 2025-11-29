import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, AlertTriangle, FileText, CheckCircle, XCircle, HelpCircle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Card from '../components/ui/Card';
import StatCard from '../components/ui/StatCard';
import Badge from '../components/ui/Badge';

const Insights = () => {
    const [summary, setSummary] = useState(null);
    const [trends, setTrends] = useState(null);
    const [topTopics, setTopTopics] = useState([]);
    const [recurringClaims, setRecurringClaims] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchInsightsData();
    }, []);

    const fetchInsightsData = async () => {
        try {
            setLoading(true);

            const [summaryRes, trendsRes, topicsRes, recurringRes] = await Promise.all([
                fetch('http://localhost:5000/api/insights/summary'),
                fetch('http://localhost:5000/api/insights/trends'),
                fetch('http://localhost:5000/api/insights/top-topics'),
                fetch('http://localhost:5000/api/insights/recurring-false-claims')
            ]);

            const [summaryData, trendsData, topicsData, recurringData] = await Promise.all([
                summaryRes.json(),
                trendsRes.json(),
                topicsRes.json(),
                recurringRes.json()
            ]);

            setSummary(summaryData);
            setTrends(trendsData);
            setTopTopics(topicsData);
            setRecurringClaims(recurringData);
        } catch (error) {
            console.error('Error fetching insights:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics & Insights</h1>
                <p className="text-gray-600">Track verification trends and identify misinformation patterns</p>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Verifications"
                    value={summary?.totalClaims || 0}
                    icon={FileText}
                />
                <StatCard
                    title="True Claims"
                    value={summary?.byVerdict?.true || 0}
                    icon={CheckCircle}
                />
                <StatCard
                    title="False Claims"
                    value={summary?.byVerdict?.false || 0}
                    icon={XCircle}
                />
                <StatCard
                    title="Unclear"
                    value={summary?.byVerdict?.unclear || 0}
                    icon={HelpCircle}
                />
            </div>

            {/* Trends Chart */}
            <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-2">
                        <TrendingUp className="w-5 h-5 text-indigo-600" />
                        <h2 className="text-xl font-semibold text-gray-900">Verification Trends</h2>
                    </div>
                    <Badge variant="primary" size="sm">Last 30 Days</Badge>
                </div>

                {trends && trends.days && trends.days.length > 0 ? (
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={trends.days}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                <XAxis
                                    dataKey="date"
                                    stroke="#6b7280"
                                    tick={{ fill: '#6b7280', fontSize: 12 }}
                                />
                                <YAxis
                                    stroke="#6b7280"
                                    tick={{ fill: '#6b7280', fontSize: 12 }}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#ffffff',
                                        borderColor: '#e5e7eb',
                                        borderRadius: '12px',
                                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                                    }}
                                    itemStyle={{ color: '#111827' }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="true"
                                    stroke="#22c55e"
                                    strokeWidth={3}
                                    name="True"
                                    dot={{ fill: '#22c55e', r: 4 }}
                                    activeDot={{ r: 6 }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="false"
                                    stroke="#ef4444"
                                    strokeWidth={3}
                                    name="False"
                                    dot={{ fill: '#ef4444', r: 4 }}
                                    activeDot={{ r: 6 }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="unclear"
                                    stroke="#f59e0b"
                                    strokeWidth={3}
                                    name="Unclear"
                                    dot={{ fill: '#f59e0b', r: 4 }}
                                    activeDot={{ r: 6 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                ) : (
                    <div className="h-80 flex flex-col items-center justify-center bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                        <BarChart3 className="w-16 h-16 text-gray-400 mb-4" />
                        <p className="text-gray-600 font-medium mb-1">No trend data available</p>
                        <p className="text-sm text-gray-500">Data will appear as verifications are processed</p>
                    </div>
                )}
            </Card>

            {/* Top Topics Table */}
            <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-2">
                        <AlertTriangle className="w-5 h-5 text-orange-600" />
                        <h2 className="text-xl font-semibold text-gray-900">Top Topics by Misinformation</h2>
                    </div>
                </div>

                {topTopics && topTopics.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Topic</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Category</th>
                                    <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">False Claims</th>
                                    <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Total Claims</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {topTopics.map((topic, idx) => (
                                    <tr key={idx} className="hover:bg-gray-50 transition-colors">
                                        <td className="py-3 px-4">
                                            <p className="text-gray-900 font-medium text-sm">{topic.title}</p>
                                        </td>
                                        <td className="py-3 px-4">
                                            <Badge variant={topic.category || 'general'} size="sm">
                                                {topic.category || 'general'}
                                            </Badge>
                                        </td>
                                        <td className="py-3 px-4 text-center">
                                            <span className="text-red-600 font-semibold">{topic.falseClaims}</span>
                                        </td>
                                        <td className="py-3 px-4 text-center">
                                            <span className="text-gray-700 font-medium">{topic.totalClaims}</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="py-12 flex flex-col items-center justify-center bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                        <FileText className="w-16 h-16 text-gray-400 mb-4" />
                        <p className="text-gray-600 font-medium mb-1">No topics data yet</p>
                        <p className="text-sm text-gray-500">Topics will appear as claims are verified</p>
                    </div>
                )}
            </Card>

            {/* Recurring False Claims */}
            <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-2">
                        <XCircle className="w-5 h-5 text-red-600" />
                        <h2 className="text-xl font-semibold text-gray-900">Recurring False Claims</h2>
                    </div>
                    <Badge variant="false" size="sm">High Priority</Badge>
                </div>

                {recurringClaims && recurringClaims.length > 0 ? (
                    <div className="space-y-3">
                        {recurringClaims.map((claim, idx) => (
                            <div
                                key={idx}
                                className="p-4 bg-red-50 border border-red-200 rounded-xl hover:bg-red-100 transition-colors"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <p className="text-gray-900 font-medium mb-2 line-clamp-2">{claim.claimText}</p>
                                        <div className="flex items-center space-x-4 text-sm">
                                            <span className="text-gray-600">
                                                Seen <span className="font-semibold text-red-600">{claim.occurrences}</span> times
                                            </span>
                                            {claim.lastSeen && (
                                                <span className="text-gray-500">
                                                    Last seen: {new Date(claim.lastSeen).toLocaleDateString()}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <Badge variant="false" size="sm">False</Badge>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="py-12 flex flex-col items-center justify-center bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                        <CheckCircle className="w-16 h-16 text-gray-400 mb-4" />
                        <p className="text-gray-600 font-medium mb-1">No recurring claims found</p>
                        <p className="text-sm text-gray-500">This is good news! No repeated misinformation detected</p>
                    </div>
                )}
            </Card>
        </div>
    );
};

export default Insights;
