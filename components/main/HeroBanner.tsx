// components/main/HeroBanner.tsx
import Link from "next/link";
import Image from "next/image";

export default function HeroBanner() {
    return (
        <div className="relative w-full h-[500px] md:h-[600px] flex flex-col justify-end items-center bg-[var(--neural-black)] text-white overflow-hidden pb-16 md:pb-24">
            {/* Background Image */}
            <div className="absolute inset-0 opacity-80">
                <Image
                    src="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop"
                    alt="Hero Banner"
                    fill
                    className="object-cover object-[center_30%]"
                    priority
                />
            </div>

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
                    New Arrivals
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
