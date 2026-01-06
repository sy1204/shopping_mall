// app/layout.tsx
import type { Metadata } from "next";
import { Inter, Cormorant_Garamond, IBM_Plex_Mono, Outfit } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import { ToastProvider } from "@/context/ToastContext";
import DesignLoader from "@/components/ui/DesignLoader";

const inter = Inter({
    subsets: ["latin"],
    variable: '--font-inter',
});

const cormorant = Cormorant_Garamond({
    weight: ['400', '600', '700'],
    subsets: ["latin"],
    display: 'swap',
    variable: '--font-cormorant',
});

const ibmPlexMono = IBM_Plex_Mono({
    weight: ['400', '500', '600'],
    subsets: ["latin"],
    display: 'swap',
    variable: '--font-ibm-mono',
});

const outfit = Outfit({
    weight: ['700', '900'],
    subsets: ["latin"],
    display: 'swap',
    variable: '--font-outfit',
});

export const metadata: Metadata = {
    title: "[N-D]",
    description: "패션은 점(Node)이고 스타일은 선(Dash)입니다. [N-D]에서 당신만의 레거시를 연결하세요.",
};

import ServiceLayout from "@/components/layout/ServiceLayout";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ko" style={{ colorScheme: 'light' }} className={`${inter.variable} ${cormorant.variable} ${ibmPlexMono.variable} ${outfit.variable}`} suppressHydrationWarning>
            <body className={inter.className}>
                <DesignLoader />
                <AuthProvider>
                    <ToastProvider>
                        <CartProvider>
                            <ServiceLayout>
                                {children}
                            </ServiceLayout>
                        </CartProvider>
                    </ToastProvider>
                </AuthProvider>
            </body>
        </html>
    );
}
