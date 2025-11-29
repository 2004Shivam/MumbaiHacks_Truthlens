import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Terminal, Shield, Power, RefreshCw } from 'lucide-react';
import Card from '../components/ui/Card';

const Admin = () => {
    const [logs, setLogs] = useState([]);
    const [agents, setAgents] = useState({
        watcher: true,
        clustering: true,
        extraction: true,
        verification: true
    });

    useEffect(() => {
        fetchLogs();
        const interval = setInterval(fetchLogs, 5000);
        return () => clearInterval(interval);
    }, []);

    const fetchLogs = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/admin/logs');
            setLogs(res.data);
        } catch (error) {
            console.error("Admin Error:", error);
        }
    };

    const toggleAgent = async (agent) => {
        try {
            const newStatus = !agents[agent];
            setAgents(prev => ({ ...prev, [agent]: newStatus }));
            await axios.post('http://localhost:5000/api/admin/toggle-agent', {
                agent,
                status: newStatus ? 'enabled' : 'disabled'
            });
        } catch (error) {
            console.error("Toggle Error:", error);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center space-x-3">
                <Shield className="w-8 h-8 text-indigo-600" />
                <h1 className="text-3xl font-bold text-gray-900">Admin Control Panel</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Agent Controls */}
                <Card className="p-6 h-fit">
                    <h2 className="text-xl font-semibold mb-6 flex items-center space-x-2 text-gray-900">
                        <Power className="w-5 h-5 text-indigo-600" />
                        <span>Agent Status</span>
                    </h2>
                    <div className="space-y-4">
                        {Object.keys(agents).map(agent => (
                            <div key={agent} className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-xl">
                                <span className="capitalize font-medium text-gray-900">{agent} Agent</span>
                                <button
                                    onClick={() => toggleAgent(agent)}
                                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${agents[agent]
                                            ? 'bg-green-100 text-green-700 border border-green-300 hover:bg-green-200'
                                            : 'bg-red-100 text-red-700 border border-red-300 hover:bg-red-200'
                                        }`}
                                >
                                    {agents[agent] ? 'Active' : 'Stopped'}
                                </button>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* System Logs */}
                <Card className="lg:col-span-2 p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold flex items-center space-x-2 text-gray-900">
                            <Terminal className="w-5 h-5 text-gray-600" />
                            <span>System Logs</span>
                        </h2>
                        <button
                            onClick={fetchLogs}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Refresh logs"
                        >
                            <RefreshCw className="w-4 h-4 text-gray-600" />
                        </button>
                    </div>
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 h-[500px] overflow-y-auto font-mono text-sm">
                        {logs.length > 0 ? (
                            logs.map((log, idx) => (
                                <div key={idx} className="mb-2 border-b border-gray-200 pb-2 last:border-0">
                                    <span className="text-gray-500">[{new Date(log.timestamp).toLocaleTimeString()}]</span>{' '}
                                    <span className={`font-bold ${log.level === 'ERROR' ? 'text-red-600' :
                                            log.level === 'WARN' ? 'text-orange-600' : 'text-blue-600'
                                        }`}>
                                        [{log.level}]
                                    </span>{' '}
                                    <span className="text-purple-600">[{log.agent}]</span>{' '}
                                    <span className="text-gray-700">{log.message}</span>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 italic">No logs available...</p>
                        )}
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Admin;
