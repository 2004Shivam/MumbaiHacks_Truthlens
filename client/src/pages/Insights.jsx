import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, AlertTriangle, FileText, CheckCircle } from 'lucide-react';
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

            // Fetch all insights data in parallel
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
            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Verifications"
                    value={summary?.totalVerifications || 0}
                    icon={BarChart3}
                />
                <StatCard
                    title="True Claims"
                    value={summary?.trueClaims || 0}
                    icon={CheckCircle}
                />
                <StatCard
                    title="False Claims"
                    value={summary?.falseClaims || 0}
                    icon={AlertTriangle}
                />
                <StatCard
                    title="Unclear"
                    value={summary?.unclearClaims || 0}
                    icon={FileText}
                />
            </div>

            {/* Trends Chart */}
            <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-2">
                        <TrendingUp className="w-5 h-5 text-indigo-400" />
                        <h2 className="text-xl font-semibold text-white">Verification Trends</h2>
                    </div>
                    <Badge variant="primary" size="sm">Last 30 Days</Badge>
                </div>
                <div className="h-80 w-full">
                    {trends?.dailyTrends && trends.dailyTrends.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={trends.dailyTrends}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                                <XAxis dataKey="date" stroke="#64748b" />
                                <YAxis stroke="#64748b" />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px' }}
                                    itemStyle={{ color: '#f9fafb' }}
                                />
                                <Line type="monotone" dataKey="true" stroke="#22c55e" strokeWidth={2} name="True" />
                                <Line type="monotone" dataKey="false" stroke="#ef4444" strokeWidth={2} name="False" />
                                <Line type="monotone" dataKey="unclear" stroke="#f97316" strokeWidth={2} name="Unclear" />
                            </LineChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex items-center justify-center h-full">
                            <p className="text-gray-500">No trend data available</p>
                        </div>
                    )}
                </div>
            </Card>

            {/* Top Topics by False Claims */}
            <Card className="p-6">
                <h2 className="text-xl font-semibold text-white mb-6">Top Topics by False Claims</h2>
                {topTopics && topTopics.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="text-left border-b border-white/10">
                                    <th className="pb-3 text-sm font-medium text-gray-400">Topic</th>
                                    <th className="pb-3 text-sm font-medium text-gray-400">Category</th>
                                    <th className="pb-3 text-sm font-medium text-gray-400 text-right">False Claims</th>
                                    <th className="pb-3 text-sm font-medium text-gray-400 text-right">Total Claims</th>
                                </tr>
                            </thead>
                            <tbody>
                                {topTopics.map((topic, i) => (
                                    <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                        <td className="py-4 text-white font-medium">{topic.topicTitle}</td>
                                        <td className="py-4">
                                            <Badge variant={topic.category || 'general'} size="sm">
                                                {topic.category || 'general'}
                                            </Badge>
                                        </td>
                                        <td className="py-4 text-red-400 text-right font-medium">
                                            {topic.falseClaims}
                                        </td>
                                        <td className="py-4 text-gray-400 text-right">
                                            {topic.totalClaims}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-gray-500 text-center py-8">No topics available</p>
                )}
            </Card>

            {/* Recurring False Claims */}
            <Card className="p-6">
                <h2 className="text-xl font-semibold text-white mb-6">Recurring False Claims</h2>
                {recurringClaims && recurringClaims.length > 0 ? (
                    <div className="space-y-4">
                        {recurringClaims.map((claim, i) => (
                            <div
                                key={i}
                                className="p-4 bg-white/5 border border-white/10 rounded-xl"
                            >
                                <div className="flex items-start justify-between mb-2">
                                    <p className="text-white font-medium flex-1">{claim.claimText}</p>
                                    <Badge variant="false" size="sm">
                                        {claim.count}x
                                    </Badge>
                                </div>
                                <p className="text-sm text-gray-500">
                                    Appeared {claim.count} time{claim.count !== 1 ? 's' : ''}
                                </p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500 text-center py-8">No recurring claims found</p>
                )}
            </Card>
        </div>
    );
};

export default Insights;
