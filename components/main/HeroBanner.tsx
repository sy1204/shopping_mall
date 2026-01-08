// components/main/HeroBanner.tsx
'use client';

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";

interface Banner {
    id: number;
    title: string;
    image: string;
    status: 'Active' | 'Inactive';
}

const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop";

export default function HeroBanner() {
    const [bannerImage, setBannerImage] = useState(DEFAULT_IMAGE);
    const [bannerTitle, setBannerTitle] = useState("New Arrivals");

    useEffect(() => {
        // Load active banner from localStorage (set by admin)
        const savedBanners = localStorage.getItem('admin-banners');
        if (savedBanners) {
            const banners: Banner[] = JSON.parse(savedBanners);
            const activeBanner = banners.find(b => b.status === 'Active');
            if (activeBanner) {
                setBannerImage(activeBanner.image);
                setBannerTitle(activeBanner.title);
            }
        }
    }, []);

    return (
        <div className="relative w-full h-[500px] md:h-[800px] flex flex-col justify-end items-center bg-[var(--neural-black)] text-white overflow-hidden pb-16 md:pb-32">
            {/* Background Image */}
            <div className="absolute inset-0 opacity-90">
                <Image
                    src={bannerImage}
                    alt="Hero Banner"
                    fill
                    className="object-cover object-top"
                    priority
                    unoptimized
                />
            </div>
            {/* Gradient Overlay for Text Readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />

            {/* Dash Grid Overlay */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    backgroundImage: `
                        repeating-linear-gradient(
                            0deg,
                            transparent,
                            transparent 79px,
                            rgba(142, 142, 142, 0.1) 79px,
                            rgba(142, 142, 142, 0.1) 80px
                        )
                    `,
                }}
                aria-hidden="true"
            />

            {/* Content - Positioned at bottom (below subject's face) */}
            <div className="relative z-10 text-center px-4 max-w-4xl">
                {/* Season Label */}
                <span
                    className="block text-sm md:text-base mb-4 font-mono tracking-widest uppercase text-white drop-shadow-md"
                >
                    2026 Spring Collection
                </span>

                {/* Main Title */}
                <h1
                    className="text-4xl md:text-7xl font-black mb-6 tracking-tight text-white drop-shadow-lg"
                >
                    {bannerTitle}
                </h1>

                {/* Subtitle */}
                <h2
                    className="text-2xl md:text-4xl mb-8 tracking-tight font-light text-gray-100 drop-shadow-md"
                >
                    Fresh Styles for the Season
                </h2>

                {/* Description */}
                <p
                    className="max-w-2xl mx-auto text-base md:text-lg mb-10 leading-relaxed text-gray-200 drop-shadow"
                >
                    최신 트렌드를 반영한 신상품을 만나보세요.
                    <br className="hidden md:block" />
                    특별한 할인과 함께 새로운 스타일을 경험하실 수 있습니다.
                </p>

                {/* CTA Links */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6 font-mono text-sm md:text-base tracking-wide">
                    <Link
                        href="/shop"
                        className="group flex items-center gap-2 hover:text-[var(--brand-accent)] transition-colors text-white drop-shadow-md"
                    >
                        <span className="opacity-70">[</span>
                        <span className="w-2 h-2 rounded-full bg-[var(--brand-accent)] animate-pulse"></span>
                        <span className="font-medium">SHOP NOW</span>
                        <span className="opacity-70">]</span>
                    </Link>
                    <Link
                        href="/events"
                        className="group flex items-center gap-2 hover:text-[var(--brand-accent)] transition-colors text-white drop-shadow-md"
                    >
                        <span className="opacity-70">[</span>
                        <span className="font-medium">VIEW SALE</span>
                        <span className="opacity-70">]</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
