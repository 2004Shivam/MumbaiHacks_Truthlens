import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, User, UserCog } from 'lucide-react';
import { useMode } from '../context/ModeContext';

const Navbar = () => {
    const { mode, toggleMode, isCitizen } = useMode();

    return (
        <nav className="fixed w-full z-50 bg-dark/80 backdrop-blur-md border-b border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <Link to="/" className="flex items-center space-x-2">
                        <ShieldCheck className="w-8 h-8 text-primary" />
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                            TruthLens
                        </span>
                    </Link>
                    <div className="flex items-center space-x-8">
                        <Link to="/" className="text-gray-300 hover:text-white transition-colors">Dashboard</Link>
                        <Link to="/topics" className="text-gray-300 hover:text-white transition-colors">Topics</Link>
                        <Link to="/claims" className="text-gray-300 hover:text-white transition-colors">Claims</Link>
                        <Link to="/verify" className="text-gray-300 hover:text-white transition-colors">Verify</Link>
                        <Link to="/insights" className="text-gray-300 hover:text-white transition-colors">Insights</Link>
                        <Link to="/admin" className="text-gray-300 hover:text-white transition-colors">Admin</Link>

                        {/* Mode Toggle */}
                        <button
                            onClick={toggleMode}
                            className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/10"
                            title={`Switch to ${isCitizen ? 'Analyst' : 'Citizen'} Mode`}
                        >
                            {isCitizen ? <User className="w-4 h-4" /> : <UserCog className="w-4 h-4" />}
                            <span className="text-sm font-medium">{isCitizen ? 'Citizen' : 'Analyst'}</span>
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
