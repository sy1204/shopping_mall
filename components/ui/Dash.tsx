// components/ui/Dash.tsx
import React from 'react';

interface DashProps {
    variant?: 'horizontal' | 'vertical';
    animated?: boolean;
    className?: string;
    opacity?: number;
}

/**
 * [N-D] Dash Component
 * Represents connection lines between nodes
 */
export default function Dash({
    variant = 'horizontal',
    animated = false,
    className = '',
    opacity = 0.2
}: DashProps) {
    const baseStyles = variant === 'horizontal'
        ? 'w-full h-px'
        : 'w-px h-full';

    return (
        <div
            className={`
        bg-[var(--tech-silver)]
        ${baseStyles}
        ${animated ? 'animate-pulse' : ''}
        ${className}
      `}
            style={{ opacity }}
            aria-hidden="true"
        />
    );
}

/**
 * Animated Dash - for loading states
 */
export function AnimatedDash({ className = '' }: { className?: string }) {
    return (
        <div className={`relative h-px overflow-hidden ${className}`}>
            <div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-[var(--brand-accent)] to-transparent dash-slide-animation"
            />
        </div>
    );
}

/**
 * Dash Grid - for background pattern
 */
interface DashGridProps {
    spacing?: number;
    opacity?: number;
    className?: string;
}

export function DashGrid({
    spacing = 80,
    opacity = 0.03,
    className = ''
}: DashGridProps) {
    return (
        <div
            className={`absolute inset-0 pointer-events-none ${className}`}
            style={{
                backgroundImage: `
          repeating-linear-gradient(
            0deg,
            transparent,
            transparent ${spacing - 1}px,
            var(--tech-silver) ${spacing - 1}px,
            var(--tech-silver) ${spacing}px
          ),
          repeating-linear-gradient(
            90deg,
            transparent,
            transparent ${spacing - 1}px,
            var(--tech-silver) ${spacing - 1}px,
            var(--tech-silver) ${spacing}px
          )
        `,
                opacity,
            }}
            aria-hidden="true"
        />
    );
}

/**
 * Connection Line - visual connector between nodes
 */
interface ConnectionLineProps {
    from: 'top' | 'bottom' | 'left' | 'right';
    length?: string;
    className?: string;
}

export function ConnectionLine({ from, length = '20px', className = '' }: ConnectionLineProps) {
    const isVertical = from === 'top' || from === 'bottom';
    const positionStyles: Record<string, string> = {
        top: 'left-1/2 bottom-full',
        bottom: 'left-1/2 top-full',
        left: 'top-1/2 right-full',
        right: 'top-1/2 left-full',
    };

    return (
        <div
            className={`absolute ${positionStyles[from]} ${className}`}
            style={{
                width: isVertical ? '1px' : length,
                height: isVertical ? length : '1px',
                background: 'var(--tech-silver)',
                opacity: 0.3,
            }}
            aria-hidden="true"
        />
    );
}
