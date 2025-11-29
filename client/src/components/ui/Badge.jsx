import React from 'react';

const Badge = ({
    children,
    variant = 'default',
    size = 'md',
    className = '',
    ...props
}) => {
    const baseStyles = 'inline-flex items-center font-medium rounded-full';

    const variants = {
        default: 'bg-slate-800 text-gray-300 border border-white/10',
        true: 'bg-green-500/10 text-green-400 border border-green-500/20',
        false: 'bg-red-500/10 text-red-400 border border-red-500/20',
        unclear: 'bg-orange-500/10 text-orange-400 border border-orange-500/20',
        general: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
        election: 'bg-purple-500/10 text-purple-400 border border-purple-500/20',
        health: 'bg-green-500/10 text-green-400 border border-green-500/20',
        disaster: 'bg-red-500/10 text-red-400 border border-red-500/20',
        finance: 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20',
        primary: 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20',
    };

    const sizes = {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-2.5 py-1 text-sm',
        lg: 'px-3 py-1.5 text-base'
    };

    return (
        <span
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
            {...props}
        >
            {children}
        </span>
    );
};

export default Badge;
