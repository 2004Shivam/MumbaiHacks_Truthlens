import React from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const AppShell = ({ children, pageTitle }) => {
    return (
        <div className="min-h-screen bg-gray-50">
            <Sidebar />
            <div className="ml-64">
                <Topbar pageTitle={pageTitle} />
                <main className="max-w-7xl mx-auto px-6 py-6">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default AppShell;
