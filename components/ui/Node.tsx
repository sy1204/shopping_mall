// components/ui/Node.tsx
import React from 'react';

interface NodeProps {
    size?: 'sm' | 'md' | 'lg';
    state?: 'default' | 'active' | 'inactive';
    pulsing?: boolean;
    className?: string;
    onClick?: () => void;
}

/**
 * [N-D] Node Component
 * Represents data points, active states, and selections
 */
export default function Node({
    size = 'md',
    state = 'default',
    pulsing = false,
    className = '',
    onClick
}: NodeProps) {
    const sizeStyles = {
        sm: 'w-1.5 h-1.5',
        md: 'w-2 h-2',
        lg: 'w-3 h-3',
    };

    const stateStyles = {
        default: 'bg-[var(--neural-black)]',
        active: 'bg-[var(--brand-accent)] shadow-[0_0_8px_var(--brand-accent)] shadow-opacity-50',
        inactive: 'bg-[var(--tech-silver)] opacity-30',
    };

    return (
        <button
            className={`
        rounded-full
        transition-all duration-200
        ${sizeStyles[size]}
        ${stateStyles[state]}
        ${pulsing ? 'node-pulse' : ''}
        ${onClick ? 'cursor-pointer hover:scale-125' : 'cursor-default'}
        ${className}
      `}
            onClick={onClick}
            disabled={!onClick}
            aria-label={`Node - ${state}`}
        />
    );
}

/**
 * Node Indicator - for showing active states in lists
 */
interface NodeIndicatorProps {
    active?: boolean;
    label?: string;
    className?: string;
}

export function NodeIndicator({ active = false, label, className = '' }: NodeIndicatorProps) {
    return (
        <div className={`inline-flex items-center gap-2 ${className}`}>
            <Node state={active ? 'active' : 'inactive'} size="sm" />
            {label && (
                <span className={`text-sm ${active ? 'text-[var(--neural-black)]' : 'text-[var(--tech-silver)]'}`}>
                    {label}
                </span>
            )}
        </div>
    );
}

/**
 * Node Cluster - for showing multiple connected nodes
 */
interface NodeClusterProps {
    count: number;
    activeIndices?: number[];
    onNodeClick?: (index: number) => void;
    className?: string;
}

export function NodeCluster({
    count,
    activeIndices = [],
    onNodeClick,
    className = ''
}: NodeClusterProps) {
    return (
        <div className={`flex items-center gap-3 ${className}`}>
            {Array.from({ length: count }, (_, i) => (
                <React.Fragment key={i}>
                    <Node
                        state={activeIndices.includes(i) ? 'active' : 'default'}
                        onClick={onNodeClick ? () => onNodeClick(i) : undefined}
                    />
                    {i < count - 1 && (
                        <div
                            className="w-6 h-px bg-[var(--tech-silver)]"
                            style={{ opacity: 0.3 }}
                            aria-hidden="true"
                        />
                    )}
                </React.Fragment>
            ))}
        </div>
    );
}

/**
 * Progress Nodes - for showing steps or progress
 */
interface ProgressNodesProps {
    total: number;
    current: number;
    labels?: string[];
    className?: string;
}

export function ProgressNodes({
    total,
    current,
    labels = [],
    className = ''
}: ProgressNodesProps) {
    return (
        <div className={`flex items-start gap-4 ${className}`}>
            {Array.from({ length: total }, (_, i) => {
                const isActive = i < current;
                const isCurrent = i === current;

                return (
                    <div key={i} className="flex flex-col items-center gap-2">
                        <Node
                            state={isActive ? 'active' : isCurrent ? 'default' : 'inactive'}
                            pulsing={isCurrent}
                            size="md"
                        />
                        {labels[i] && (
                            <span className={`text-xs ${isActive || isCurrent ? 'text-[var(--neural-black)]' : 'text-[var(--tech-silver)]'}`}>
                                {labels[i]}
                            </span>
                        )}
                        {i < total - 1 && (
                            <div
                                className="absolute top-2 left-1/2 w-full h-px bg-[var(--tech-silver)]"
                                style={{
                                    opacity: isActive ? 0.5 : 0.2,
                                    transform: 'translateY(-50%)'
                                }}
                                aria-hidden="true"
                            />
                        )}
                    </div>
                );
            })}
        </div>
    );
}
