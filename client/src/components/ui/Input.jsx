import React from 'react';

const Input = ({
    label,
    error,
    className = '',
    ...props
}) => {
    return (
        <div className="w-full">
            {label && (
                <label className="block text-sm font-medium text-gray-300 mb-2">
                    {label}
                </label>
            )}
            <input
                className={`w-full px-4 py-2.5 bg-slate-900/60 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-150 ${error ? 'border-red-500' : ''} ${className}`}
                {...props}
            />
            {error && (
                <p className="mt-1 text-sm text-red-400">{error}</p>
            )}
        </div>
    );
};

export default Input;
