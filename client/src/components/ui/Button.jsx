import React from 'react';

const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    className = '',
    ...props
}) => {
    const baseStyles = 'font-medium transition-all duration-150 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-white';

    const variants = {
        primary: 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md hover:shadow-lg',
        secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300',
        ghost: 'text-gray-600 hover:text-gray-900 hover:bg-gray-100',
        danger: 'bg-red-600 hover:bg-red-700 text-white shadow-md'
    };

    const sizes = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-base',
        lg: 'px-6 py-3 text-lg'
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;
