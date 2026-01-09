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
    const [bannerTitle, setBannerTitle] = useState("뉴럴 스탠다드");

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
        <section className="min-h-[90vh] flex flex-col lg:flex-row relative">
            {/* Left: Text Content */}
            <div className="w-full lg:w-5/12 p-8 lg:p-24 flex flex-col justify-center border-r border-dashed border-gray-200 relative bg-white">
                {/* Status Indicator */}


                {/* Main Title */}
                <h1 className="text-5xl lg:text-7xl font-serif leading-tight mb-8">
                    <span className="italic text-[var(--primary)]">뉴럴</span><br />
                    스탠다드.
                </h1>

                {/* Description */}
                <p className="font-sans text-sm text-gray-500 tracking-wider mb-12 max-w-xs leading-relaxed break-keep">
                    알고리즘의 정밀함과 시대를 초월한 에디토리얼 큐레이션의 만남. 트렌드가 클래식으로 진화하는 곳.
                </p>

                {/* CTA Button */}
                <div className="flex gap-6">
                    <Link
                        href="/shop"
                        className="nd-btn-primary"
                    >
                        <span>[ 컬렉션 둘러보기 ]</span>
                    </Link>
                </div>
            </div>

            {/* Right: Hero Image */}
            <div className="w-full lg:w-7/12 relative h-[50vh] lg:h-auto overflow-hidden group">
                <Image
                    src={bannerImage}
                    alt={bannerTitle}
                    fill
                    className="object-cover transition-transform duration-[2s] ease-out group-hover:scale-105 grayscale hover:grayscale-0"
                    priority
                    unoptimized
                />
            </div>
        </section>
    );
}
