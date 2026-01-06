// components/layout/ServiceLayout.tsx
'use client';

import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";

export default function ServiceLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAdmin = pathname?.startsWith('/admin');

    return (
        <>
            {!isAdmin && <Header />}
            <main className={`min-h-screen ${isAdmin ? 'bg-white' : ''}`}>
                {children}
            </main>
            {!isAdmin && <Footer />}
        </>
    );
}
