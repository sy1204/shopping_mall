// components/ui/DesignLoader.tsx
'use client';

import { useEffect } from 'react';

export default function DesignLoader() {
    useEffect(() => {
        const applyColor = () => {
            const savedColor = localStorage.getItem('brand-color');
            if (savedColor) {
                document.documentElement.style.setProperty('--brand-accent', savedColor);
            } else {
                // Default fallback: Brighter Camel from Hero Coat
                document.documentElement.style.setProperty('--brand-accent', '#E2C49C');
            }
        };

        applyColor();

        // Listen for storage changes in the same window (e.g. from Admin save)
        window.addEventListener('storage', applyColor);
        return () => window.removeEventListener('storage', applyColor);
    }, []);

    return null; // This component doesn't render anything
}
