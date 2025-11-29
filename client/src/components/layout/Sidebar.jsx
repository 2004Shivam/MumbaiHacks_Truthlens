import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, FileText, MessageSquare, Shield, BarChart3, Settings } from 'lucide-react';

const Sidebar = () => {
    const location = useLocation();

    const navItems = [
        { name: 'Dashboard', path: '/', icon: LayoutDashboard },
        { name: 'Topics', path: '/topics', icon: FileText },
        { name: 'Claims', path: '/claims', icon: MessageSquare },
        { name: 'Verify', path: '/verify', icon: Shield },
        { name: 'Insights', path: '/insights', icon: BarChart3 },
        { name: 'Admin', path: '/admin', icon: Settings },
    ];

    return (
        <div className="w-64 h-screen bg-white border-r border-gray-200 flex flex-col fixed left-0 top-0 shadow-sm">
            {/* Logo */}
            <div className="p-6 border-b border-gray-200">
                <div className="flex items-center space-x-2">
                    <Shield className="w-8 h-8 text-indigo-600" />
                    <span className="text-xl font-bold text-gray-900">Satya AI</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">AI-Powered Fact Checking</p>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-1">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;

                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl transition-all duration-150 ${isActive
                                ? 'bg-indigo-50 text-indigo-700 border-l-3 border-indigo-600 pl-[10px] font-medium'
                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                }`}
                        >
                            <Icon className="w-5 h-5" />
                            <span className="font-medium">{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-gray-200">
                <div className="text-xs text-gray-500">
                    <p>© 2025 Satya AI</p>
                    <p className="mt-1">Version 2.0</p>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
