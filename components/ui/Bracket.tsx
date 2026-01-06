// components/ui/Bracket.tsx
'use client';

import React from 'react';

interface BracketProps {
    children: React.ReactNode;
    variant?: 'default' | 'hover' | 'active';
    className?: string;
    showNode?: boolean;
}

/**
 * [N-D] Bracket Component
 * Wraps content with [ ] brackets, core brand symbol
 */
export default function Bracket({
    children,
    variant = 'default',
    className = '',
    showNode = false
}: BracketProps) {
    const variantStyles = {
        default: '',
        hover: 'text-[var(--brand-accent)]',
        active: 'text-[var(--brand-accent)] font-semibold',
    };

    return (
        <span className={`inline-flex items-center gap-1 ${variantStyles[variant]} ${className}`}>
            <span className="opacity-70">[</span>
            {showNode && <span className="node-active inline-block w-2 h-2 rounded-full"></span>}
            {children}
            <span className="opacity-70">]</span>
        </span>
    );
}

/**
 * Bracket Button - for clickable elements
 */
interface BracketButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'outline';
}

export function BracketButton({
    children,
    variant = 'primary',
    className = '',
    ...props
}: BracketButtonProps) {
    const [isHovered, setIsHovered] = React.useState(false);

    const variantStyles = {
        primary: 'bg-[var(--neural-black)] text-white hover:bg-[var(--brand-accent)]',
        secondary: 'bg-[var(--tech-silver)] text-white hover:bg-[var(--neural-black)]',
        outline: 'border border-[var(--neural-black)] text-[var(--neural-black)] hover:bg-[var(--neural-black)] hover:text-white',
    };

    return (
        <button
            className={`
        inline-flex items-center gap-2 px-6 py-3
        font-medium tracking-wide
        transition-all duration-200
        ${variantStyles[variant]}
        ${className}
      `}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            {...props}
        >
            <span className="opacity-70">[</span>
            {isHovered && <span className="node-active inline-block w-2 h-2 rounded-full animate-pulse"></span>}
            <span>{children}</span>
            <span className="opacity-70">]</span>
        </button>
    );
}

/**
 * Bracket Container - for wrapping sections
 */
interface BracketContainerProps {
    children: React.ReactNode;
    title?: string;
    className?: string;
}

export function BracketContainer({ children, title, className = '' }: BracketContainerProps) {
    return (
        <div className={`relative ${className}`}>
            {title && (
                <div className="font-mono text-sm text-[var(--tech-silver)] mb-2">
                    <Bracket>{title}</Bracket>
                </div>
            )}
            <div className="pl-4 border-l-2 border-[var(--tech-silver)] border-opacity-20">
                {children}
            </div>
        </div>
    );
}
