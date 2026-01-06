// components/ui/NeuralLoading.tsx
'use client';

import React from 'react';

interface NeuralLoadingProps {
    message?: string;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

/**
 * [N-D] Neural Loading Component
 * Animated loading indicator showing bracket expansion and node movement
 * Represents "데이터 모델링 중" concept
 */
export default function NeuralLoading({
    message = '당신의 취향을 데이터 모델링 중입니다',
    size = 'md',
    className = ''
}: NeuralLoadingProps) {
    const sizeStyles = {
        sm: { width: '120px', fontSize: 'text-xs' },
        md: { width: '200px', fontSize: 'text-sm' },
        lg: { width: '280px', fontSize: 'text-base' },
    };

    return (
        <div className={`flex flex-col items-center gap-4 ${className}`}>
            {/* Animated Bracket + Dash + Node */}
            <div
                className="relative flex items-center justify-center font-mono text-[var(--neural-black)]"
                style={{ width: sizeStyles[size].width, height: '24px' }}
            >
                {/* Left Bracket */}
                <span className="absolute left-0 opacity-70">[</span>

                {/* Animated Dash */}
                <div className="absolute inset-x-6 flex items-center overflow-hidden">
                    <div
                        className="h-px bg-[var(--brand-accent)] neural-dash-expand"
                    />
                </div>

                {/* Animated Node */}
                <div
                    className="absolute w-2 h-2 rounded-full bg-[var(--brand-accent)] shadow-[0_0_8px_var(--brand-accent)] shadow-opacity-40 neural-node-slide"
                />

                {/* Right Bracket */}
                <span className="absolute right-0 opacity-70">]</span>
            </div>

            {/* Loading Message */}
            {message && (
                <p className={`${sizeStyles[size].fontSize} text-[var(--tech-silver)] text-center font-mono`}>
                    {message}
                </p>
            )}
        </div>
    );
}

/**
 * Simple Loading Spinner - for minimal loading states
 */
export function LoadingSpinner({ size = 'md', className = '' }: { size?: 'sm' | 'md' | 'lg', className?: string }) {
    const sizeStyles = {
        sm: 'w-4 h-4',
        md: 'w-6 h-6',
        lg: 'w-8 h-8',
    };

    return (
        <div
            className={`
        ${sizeStyles[size]}
        border-2 border-[var(--tech-silver)] border-t-[var(--brand-accent)]
        rounded-full
        animate-spin
        ${className}
      `}
            aria-label="Loading"
        />
    );
}

/**
 * Full Page Loading - for page transitions
 */
interface FullPageLoadingProps {
    show: boolean;
    message?: string;
}

export function FullPageLoading({ show, message }: FullPageLoadingProps) {
    if (!show) return null;

    return (
        <div
            className={`
        fixed inset-0 z-50
        flex items-center justify-center
        bg-white/95 backdrop-blur-sm
        transition-opacity duration-300
      `}
        >
            <NeuralLoading message={message} size="lg" />
        </div>
    );
}
