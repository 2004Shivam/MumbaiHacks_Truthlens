import React from 'react';

const Card = ({
    children,
    variant = 'default',
    hover = false,
    className = '',
    ...props
}) => {
    const baseStyles = 'rounded-2xl border transition-all duration-150 shadow-sm';

    const variants = {
        default: 'bg-white border-gray-200',
        solid: 'bg-white border-gray-300',
        subtle: 'bg-gray-50 border-gray-200',
    };

    const hoverStyles = hover ? 'hover:shadow-md hover:-translate-y-0.5 cursor-pointer hover:border-gray-300' : '';

    return (
        <div
            className={`${baseStyles} ${variants[variant]} ${hoverStyles} ${className}`}
            {...props}
        >
            {children}
        </div>
    );
};

export default Card;
