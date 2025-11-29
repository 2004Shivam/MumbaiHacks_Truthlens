import React from 'react';
import { Search, User, UserCog } from 'lucide-react';
import { useMode } from '../../context/ModeContext';

const Topbar = ({ pageTitle = 'Dashboard' }) => {
    const { mode, toggleMode, isCitizen } = useMode();

    return (
        <div className="h-16 bg-slate-950/50 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-6 sticky top-0 z-10">
            {/* Page Title */}
            <h1 className="text-2xl font-bold text-white">{pageTitle}</h1>

            {/* Right Section */}
            <div className="flex items-center space-x-4">
                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="w-64 pl-10 pr-4 py-2 bg-slate-900/60 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-150 text-sm"
                    />
                </div>

                {/* Mode Toggle */}
                <button
                    onClick={toggleMode}
                    className="flex items-center space-x-2 px-3 py-2 rounded-xl bg-slate-900/60 border border-white/10 hover:bg-white/5 transition-all duration-150"
                    title={`Switch to ${isCitizen ? 'Analyst' : 'Citizen'} Mode`}
                >
                    {isCitizen ? <User className="w-4 h-4 text-gray-400" /> : <UserCog className="w-4 h-4 text-indigo-400" />}
                    <span className="text-sm font-medium text-gray-300">{isCitizen ? 'Citizen' : 'Analyst'}</span>
                </button>

                {/* User Avatar */}
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                    <span className="text-sm font-bold text-white">U</span>
                </div>
            </div>
        </div>
    );
};

export default Topbar;
