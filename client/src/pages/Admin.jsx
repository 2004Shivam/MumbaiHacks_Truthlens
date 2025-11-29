import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Terminal, Shield, Power, RefreshCw } from 'lucide-react';

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
        <div className="pt-24 px-4 sm:px-6 lg:px-8 min-h-screen bg-dark text-white">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
                    <Shield className="w-8 h-8 text-primary" /> Admin Control Panel
                </h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Agent Controls */}
                    <div className="glass-card p-6 h-fit">
                        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                            <Power className="w-5 h-5 text-secondary" /> Agent Status
                        </h2>
                        <div className="space-y-4">
                            {Object.keys(agents).map(agent => (
                                <div key={agent} className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                                    <span className="capitalize font-medium">{agent} Agent</span>
                                    <button
                                        onClick={() => toggleAgent(agent)}
                                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${agents[agent]
                                                ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                                                : 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                                            }`}
                                    >
                                        {agents[agent] ? 'Active' : 'Stopped'}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* System Logs */}
                    <div className="lg:col-span-2 glass-card p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold flex items-center gap-2">
                                <Terminal className="w-5 h-5 text-gray-400" /> System Logs
                            </h2>
                            <button onClick={fetchLogs} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                                <RefreshCw className="w-4 h-4 text-gray-400" />
                            </button>
                        </div>
                        <div className="bg-black/50 rounded-xl p-4 h-[500px] overflow-y-auto font-mono text-sm">
                            {logs.length > 0 ? (
                                logs.map((log, idx) => (
                                    <div key={idx} className="mb-2 border-b border-white/5 pb-2 last:border-0">
                                        <span className="text-gray-500">[{new Date(log.timestamp).toLocaleTimeString()}]</span>{' '}
                                        <span className={`font-bold ${log.level === 'ERROR' ? 'text-red-500' :
                                                log.level === 'WARN' ? 'text-yellow-500' : 'text-blue-400'
                                            }`}>
                                            [{log.level}]
                                        </span>{' '}
                                        <span className="text-purple-400">[{log.agent}]</span>{' '}
                                        <span className="text-gray-300">{log.message}</span>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-600 italic">No logs available...</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Admin;
