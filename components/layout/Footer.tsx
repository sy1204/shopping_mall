// components/layout/Footer.tsx
import Link from "next/link";
import Bracket from "@/components/ui/Bracket";
import Dash from "@/components/ui/Dash";

export default function Footer() {
    return (
        <footer className="border-t border-[var(--tech-silver)] border-opacity-20 bg-[var(--neural-black)] text-white py-16">
            <div className="container mx-auto px-4">
                {/* Top Dash */}
                <Dash className="mb-12" opacity={0.2} />

                <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
                    {/* Brand Section */}
                    <div>
                        <h3 className="mb-6 font-logo text-2xl font-black">
                            [N-D]
                        </h3>
                        <p className="text-sm text-[var(--tech-silver)] leading-relaxed mb-4">
                            <span className="font-semibold text-white">엔디(ND)</span> | <span className="font-semibold text-white">ND LINK</span>
                        </p>
                        <p className="text-sm text-[var(--tech-silver)] leading-relaxed font-mono">
                            Neural Link & Editorial Logic
                        </p>
                        <p className="text-sm text-[var(--tech-silver)] leading-relaxed mt-4 italic">
                            "Connected by logic, Worn by legacy."
                        </p>
                    </div>

                    {/* Customer Center */}
                    <div>
                        <h3 className="mb-6 font-mono text-sm font-semibold tracking-wide">
                            [ CUSTOMER CENTER ]
                        </h3>
                        <div className="space-y-2 font-mono text-sm text-[var(--tech-silver)]">
                            <p>TEL: 1544-0000</p>
                            <p>MAIL: cs@nd-link.com</p>
                            <p className="mt-4">MON-FRI 10:00-18:00</p>
                            <p>LUNCH 12:00-13:00</p>
                        </div>
                    </div>

                    {/* Navigation */}
                    <div>
                        <h3 className="mb-6 font-mono text-sm font-semibold tracking-wide">
                            [ NAVIGATION ]
                        </h3>
                        <ul className="space-y-3 font-mono text-sm">
                            <li>
                                <Link href="/shop" className="text-[var(--tech-silver)] hover:text-[var(--brand-accent)] transition-colors">
                                    [N-to-D] ESSENTIALS
                                </Link>
                            </li>
                            <li>
                                <Link href="/events" className="text-[var(--tech-silver)] hover:text-[var(--brand-accent)] transition-colors">
                                    [N-in-D] HERITAGE
                                </Link>
                            </li>
                            <li>
                                <Link href="/open-shop" className="text-[var(--tech-silver)] hover:text-[var(--brand-accent)] transition-colors">
                                    [N-beyond-D] LAB
                                </Link>
                            </li>
                            <li className="mt-4">
                                <Link href="/board" className="text-[var(--tech-silver)] hover:text-white transition-colors">
                                    COMMUNITY
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Social & Info */}
                    <div>
                        <h3 className="mb-6 font-mono text-sm font-semibold tracking-wide">
                            [ CONNECT ]
                        </h3>
                        <div className="space-y-3 font-mono text-sm text-[var(--tech-silver)]">
                            <p>Instagram</p>
                            <p>Youtube</p>
                            <p>Facebook</p>
                        </div>
                    </div>
                </div>

                {/* Company Info - Monospace */}
                <div className="mt-16 pt-8 border-t border-[var(--tech-silver)] border-opacity-10">
                    <div className="font-mono text-xs text-[var(--tech-silver)] leading-relaxed space-y-1">
                        <p>COMPANY: [N-D] Co., Ltd. | CEO: Your Name</p>
                        <p>BUSINESS NO: 123-45-67890 | MAIL ORDER LICENSE: 2026-Seoul-0000</p>
                        <p>ADDRESS: Seoul, Korea</p>
                        <p className="mt-4">
                            Node to Dash: 현재의 선택이 미래의 레거시가 됩니다.
                        </p>
                    </div>
                </div>

                {/* Bottom Dash */}
                <Dash className="mt-8 mb-6" opacity={0.2} />

                {/* Copyright */}
                <div className="text-center font-mono text-xs text-[var(--tech-silver)]">
                    <p>
                        © 2026 [N-D] All rights reserved. | {' '}
                        <Link href="/admin/login" className="hover:text-[var(--brand-accent)] transition-colors">
                            [ ADMIN ]
                        </Link>
                    </p>
                    <p className="mt-2 opacity-50">
                        점(Node)과 선(Dash)의 연결로 유행을 레거시로 데이터화합니다.
                    </p>
                </div>
            </div>
        </footer>
    );
}
