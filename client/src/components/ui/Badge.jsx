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
        default: 'bg-gray-100 text-gray-700 border border-gray-300',
        true: 'bg-green-50 text-green-700 border border-green-200',
        false: 'bg-red-50 text-red-700 border border-red-200',
        unclear: 'bg-orange-50 text-orange-700 border border-orange-200',
        general: 'bg-blue-50 text-blue-700 border border-blue-200',
        election: 'bg-purple-50 text-purple-700 border border-purple-200',
        health: 'bg-green-50 text-green-700 border border-green-200',
        disaster: 'bg-red-50 text-red-700 border border-red-200',
        finance: 'bg-yellow-50 text-yellow-700 border border-yellow-200',
        primary: 'bg-indigo-50 text-indigo-700 border border-indigo-200',
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
