import React from 'react';

const Card = ({
    children,
    variant = 'default',
    hover = false,
    className = '',
    ...props
}) => {
    const baseStyles = 'rounded-2xl border transition-all duration-150';

    const variants = {
        default: 'bg-slate-900/60 border-white/5 backdrop-blur-sm',
        solid: 'bg-slate-900 border-white/10',
        glass: 'bg-white/5 border-white/10 backdrop-blur-md',
    };

    const hoverStyles = hover ? 'hover:scale-[1.01] hover:-translate-y-0.5 cursor-pointer hover:border-white/10' : '';

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
