import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Activity, FileText, CheckCircle, AlertTriangle, TrendingUp, ExternalLink } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import StatCard from '../components/ui/StatCard';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';

const Dashboard = () => {
    const [stats, setStats] = useState({ topics: 0, claims: 0, verified: 0, falseClaims: 0 });
    const [recentTopics, setRecentTopics] = useState([]);
    const [recentClaims, setRecentClaims] = useState([]);
    const [chartData, setChartData] = useState([]);
    const [activeTab, setActiveTab] = useState('topics');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [topicsRes, claimsRes, summaryRes] = await Promise.all([
                    axios.get('http://localhost:5000/api/topics'),
                    axios.get('http://localhost:5000/api/claims'),
                    axios.get('http://localhost:5000/api/insights/summary')
                ]);

                const topics = topicsRes.data;
                const claims = claimsRes.data;
                const summary = summaryRes.data;

                setRecentTopics(topics.slice(0, 5));
                setRecentClaims(claims.slice(0, 5));

                setStats({
                    topics: topics.length,
                    claims: claims.length,
                    verified: claims.filter(c => c.isVerified).length,
                    falseClaims: summary.byVerdict?.false || 0
                });

                const mockData = [
                    { name: 'Mon', verified: 4 },
                    { name: 'Tue', verified: 7 },
                    { name: 'Wed', verified: 12 },
                    { name: 'Thu', verified: 15 },
                    { name: 'Fri', verified: 22 },
                    { name: 'Sat', verified: 28 },
                    { name: 'Sun', verified: claims.filter(c => c.isVerified).length },
                ];
                setChartData(mockData);

            } catch (error) {
                console.error("Dashboard Error:", error);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Active Topics"
                    value={stats.topics}
                    icon={Activity}

                    trendDirection="up"
                />
                <StatCard
                    title="Total Claims"
                    value={stats.claims}
                    icon={FileText}

                    trendDirection="up"
                />
                <StatCard
                    title="Verified Claims"
                    value={stats.verified}
                    icon={CheckCircle}
                />
                <StatCard
                    title="False Claims"
                    value={stats.falseClaims}
                    icon={AlertTriangle}
                />
            </div>

            {/* Middle Section: Chart + High Risk Topics */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Activity Chart */}
                <Card className="p-6 lg:col-span-2">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-2">
                            <TrendingUp className="w-5 h-5 text-indigo-600" />
                            <h2 className="text-xl font-semibold text-gray-900">Verification Activity</h2>
                        </div>
                        <Badge variant="primary" size="sm">Last 7 Days</Badge>
                    </div>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            {chartData.length > 0 ? (
                                <AreaChart data={chartData}>
                                    <defs>
                                        <linearGradient id="colorVerified" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                    <XAxis dataKey="name" stroke="#6b7280" />
                                    <YAxis stroke="#6b7280" />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e5e7eb', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
                                        itemStyle={{ color: '#111827' }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="verified"
                                        stroke="#6366f1"
                                        strokeWidth={2}
                                        fillOpacity={1}
                                        fill="url(#colorVerified)"
                                    />
                                </AreaChart>
                            ) : (
                                <div className="flex items-center justify-center h-full text-gray-400">
                                    Loading chart data...
                                </div>
                            )}
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* High Risk Topics */}
                <Card className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-semibold text-gray-900">High Risk</h2>
                        <Badge variant="false" size="sm">Alert</Badge>
                    </div>
                    <div className="space-y-3">
                        {recentTopics.slice(0, 3).map(topic => (
                            <Link
                                key={topic._id}
                                to={`/topics/${topic._id}`}
                                className="block p-3 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 hover:border-gray-300 transition-all duration-150"
                            >
                                <div className="flex items-start justify-between mb-1">
                                    <Badge variant={topic.category || 'general'} size="sm">
                                        {topic.category || 'general'}
                                    </Badge>
                                </div>
                                <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mt-2">
                                    {topic.title}
                                </h3>
                                <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                                    {topic.summary}
                                </p>
                            </Link>
                        ))}
                        {recentTopics.length === 0 && (
                            <p className="text-gray-500 text-sm text-center py-8">No topics yet</p>
                        )}
                    </div>
                </Card>
            </div>

            {/* Bottom Section: Tabbed Topics/Claims */}
            <Card className="p-6">
                {/* Tabs */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex space-x-1 bg-gray-100 p-1 rounded-xl">
                        <button
                            onClick={() => setActiveTab('topics')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${activeTab === 'topics'
                                ? 'bg-white text-gray-900 shadow-sm'
                                : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            Recent Topics
                        </button>
                        <button
                            onClick={() => setActiveTab('claims')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${activeTab === 'claims'
                                ? 'bg-white text-gray-900 shadow-sm'
                                : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            Recent Claims
                        </button>
                    </div>
                    <Link
                        to={activeTab === 'topics' ? '/topics' : '/claims'}
                        className="text-sm text-indigo-600 hover:text-indigo-700 flex items-center space-x-1"
                    >
                        <span>View All</span>
                        <ExternalLink className="w-3 h-3" />
                    </Link>
                </div>

                {/* Content */}
                {activeTab === 'topics' ? (
                    <div className="space-y-3">
                        {recentTopics.map(topic => (
                            <Link
                                key={topic._id}
                                to={`/topics/${topic._id}`}
                                className="block p-4 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 hover:shadow-sm hover:-translate-y-0.5 transition-all duration-150"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <h3 className="font-medium text-gray-900">{topic.title}</h3>
                                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">{topic.summary}</p>
                                    </div>
                                    <Badge variant={topic.category || 'general'} size="sm">
                                        {topic.category || 'general'}
                                    </Badge>
                                </div>
                            </Link>
                        ))}
                        {recentTopics.length === 0 && (
                            <p className="text-gray-500 text-center py-12">
                                No topics yet. Agents are processing news...
                            </p>
                        )}
                    </div>
                ) : (
                    <div className="space-y-3">
                        {recentClaims.map(claim => (
                            <Link
                                key={claim._id}
                                to={`/claims/${claim._id}`}
                                className="block p-4 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 hover:shadow-sm hover:-translate-y-0.5 transition-all duration-150"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <p className="font-medium text-gray-900 line-clamp-2 flex-1">{claim.claimText}</p>
                                    <Badge variant={claim.isVerified ? 'true' : 'unclear'} size="sm">
                                        {claim.isVerified ? 'Verified' : 'Pending'}
                                    </Badge>
                                </div>
                                {claim.topicId?.title && (
                                    <p className="text-xs text-gray-500 mt-2">Topic: {claim.topicId.title}</p>
                                )}
                            </Link>
                        ))}
                        {recentClaims.length === 0 && (
                            <p className="text-gray-500 text-center py-12">
                                No claims yet. Agents are extracting claims...
                            </p>
                        )}
                    </div>
                )}
            </Card>
        </div>
    );
};

export default Dashboard;
