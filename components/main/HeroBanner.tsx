// components/main/HeroBanner.tsx
import Link from "next/link";
import Image from "next/image";
import { BracketButton } from "@/components/ui/Bracket";

export default function HeroBanner() {
    return (
        <div className="relative w-full h-[500px] md:h-[600px] flex items-center justify-center bg-[var(--neural-black)] text-white overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0 opacity-50">
                <Image
                    src="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop"
                    alt="Hero Banner"
                    fill
                    className="object-cover"
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

            {/* Content */}
            <div className="relative z-10 text-center px-4 max-w-4xl">
                {/* Season Label */}
                <span
                    className="block text-sm md:text-base mb-4 font-mono tracking-widest uppercase"
                    style={{ color: '#d1d5db' }}
                >
                    2026 Spring Collection
                </span>

                {/* Main Title */}
                <h1
                    className="text-4xl md:text-7xl font-black mb-6 tracking-tight"
                    style={{ color: '#ffffff' }}
                >
                    New Arrivals
                </h1>

                {/* Subtitle */}
                <h2
                    className="text-2xl md:text-4xl mb-8 tracking-tight font-light"
                    style={{ color: '#e5e7eb' }}
                >
                    Fresh Styles for the Season
                </h2>

                {/* Description */}
                <p
                    className="max-w-2xl mx-auto text-base md:text-lg mb-10 leading-relaxed"
                    style={{ color: '#d1d5db' }}
                >
                    최신 트렌드를 반영한 신상품을 만나보세요.
                    <br className="hidden md:block" />
                    특별한 할인과 함께 새로운 스타일을 경험하실 수 있습니다.
                </p>

                {/* CTA Button */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link href="/shop">
                        <BracketButton variant="primary" className="bg-white text-[var(--neural-black)] hover:bg-[var(--brand-accent)] hover:text-white">
                            SHOP NOW
                        </BracketButton>
                    </Link>
                    <Link href="/events">
                        <BracketButton variant="outline" className="border-white text-white hover:bg-white hover:text-[var(--neural-black)]">
                            VIEW SALE
                        </BracketButton>
                    </Link>
                </div>
            </div>
        </div>
    );
}
