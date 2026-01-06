// components/ui/Toast.tsx
'use client';

import Bracket from './Bracket';

interface ToastProps {
    message: string;
    type: 'success' | 'error' | 'info';
}

export default function Toast({ message, type }: ToastProps) {
    const typeStyles = {
        success: 'text-[var(--brand-accent)] border-[var(--brand-accent)]',
        error: 'text-red-500 border-red-500',
        info: 'text-[var(--neural-black)] border-[var(--tech-silver)]',
    };

    return (
        <div className={`bg-white border px-6 py-3 shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-right-4 duration-300 ${typeStyles[type]}`}>
            <Bracket variant="hover">
                <span className="font-mono text-sm uppercase tracking-widest font-bold">
                    {message}
                </span>
            </Bracket>
            <div className="w-2 h-2 rounded-full bg-current animate-pulse" />
        </div>
    );
}
