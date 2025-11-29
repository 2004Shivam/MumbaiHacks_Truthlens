import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Filter, ExternalLink, FileText, TrendingUp } from 'lucide-react';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';

const Topics = () => {
    const [topics, setTopics] = useState([]);
    const [filteredTopics, setFilteredTopics] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [loading, setLoading] = useState(true);

    const categories = [
        { value: 'all', label: 'All Topics' },
        { value: 'general', label: 'General' },
        { value: 'election', label: 'Election' },
        { value: 'health', label: 'Health' },
        { value: 'disaster', label: 'Disaster' },
        { value: 'finance', label: 'Finance' },
    ];

    useEffect(() => {
        fetchTopics();
    }, []);

    useEffect(() => {
        if (selectedCategory === 'all') {
            setFilteredTopics(topics);
        } else {
            setFilteredTopics(topics.filter(t => t.category === selectedCategory));
        }
    }, [selectedCategory, topics]);

    const fetchTopics = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/topics');
            setTopics(response.data);
            setFilteredTopics(response.data);
        } catch (error) {
            console.error('Error fetching topics:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-white">All Topics</h2>
                    <p className="text-gray-400 text-sm mt-1">
                        {filteredTopics.length} {selectedCategory === 'all' ? 'total' : selectedCategory} topic{filteredTopics.length !== 1 ? 's' : ''}
                    </p>
                </div>
            </div>

            {/* Category Filters */}
            <Card className="p-4">
                <div className="flex items-center space-x-2 overflow-x-auto">
                    <Filter className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    {categories.map(cat => (
                        <button
                            key={cat.value}
                            onClick={() => setSelectedCategory(cat.value)}
                            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-150 ${selectedCategory === cat.value
                                    ? 'bg-indigo-600 text-white'
                                    : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                                }`}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>
            </Card>

            {/* Topics Table */}
            {loading ? (
                <Card className="p-12">
                    <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500" />
                    </div>
                </Card>
            ) : filteredTopics.length === 0 ? (
                <Card className="p-12">
                    <div className="text-center">
                        <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                        <p className="text-gray-400">No topics found. Agents are processing news...</p>
                    </div>
                </Card>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {filteredTopics.map(topic => (
                        <Link
                            key={topic._id}
                            to={`/topics/${topic._id}`}
                        >
                            <Card hover className="p-6">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-3 mb-2">
                                            <h3 className="text-lg font-semibold text-white">
                                                {topic.title}
                                            </h3>
                                            <Badge variant={topic.category || 'general'} size="sm">
                                                {topic.category || 'general'}
                                            </Badge>
                                        </div>
                                        <p className="text-gray-400 text-sm line-clamp-2 mb-3">
                                            {topic.summary}
                                        </p>
                                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                                            <span className="flex items-center">
                                                <FileText className="w-3 h-3 mr-1" />
                                                {topic.posts?.length || 0} posts
                                            </span>
                                            {topic.updatedAt && (
                                                <span>
                                                    Updated {new Date(topic.updatedAt).toLocaleDateString()}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <ExternalLink className="w-5 h-5 text-gray-500 flex-shrink-0 ml-4" />
                                </div>
                            </Card>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Topics;
