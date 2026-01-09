// components/layout/Footer.tsx
import Link from "next/link";

export default function Footer() {
    return (
        <footer className="bg-white border-t border-gray-100 pt-24 pb-12 px-6 lg:px-12">
            <div className="max-w-[1920px] mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-24">
                    {/* Brand Section */}
                    <div className="md:col-span-1">
                        <div className="text-2xl font-serif font-light tracking-widest mb-6">
                            [ N<span className="text-[var(--primary)]">-</span>D ]
                        </div>
                        <p className="text-xs text-gray-400 max-w-[200px] leading-relaxed">
                            Neural-Design Inc.<br />
                            Seoul, Korea<br />
                            cs@nd-link.com
                        </p>
                    </div>

                    {/* Collection */}
                    <div>
                        <h4 className="text-xs font-bold uppercase tracking-widest mb-6">컬렉션</h4>
                        <ul className="space-y-3 text-sm text-gray-500 font-light">
                            <li><Link href="/shop" className="hover:text-[var(--primary)] transition-colors">신상품</Link></li>
                            <li><Link href="/shop?category=best" className="hover:text-[var(--primary)] transition-colors">디 에디트</Link></li>
                            <li><Link href="/shop?category=essential" className="hover:text-[var(--primary)] transition-colors">에센셜</Link></li>
                            <li><Link href="/events" className="hover:text-[var(--primary)] transition-colors">아카이브</Link></li>
                        </ul>
                    </div>

                    {/* Neural Link */}
                    <div>
                        <h4 className="text-xs font-bold uppercase tracking-widest mb-6">뉴럴 링크</h4>
                        <ul className="space-y-3 text-sm text-gray-500 font-light">
                            <li><Link href="/mypage" className="hover:text-[var(--primary)] transition-colors">대시보드</Link></li>
                            <li><Link href="/chat" className="hover:text-[var(--primary)] transition-colors">스타일 분석</Link></li>
                            <li><Link href="/open-shop" className="hover:text-[var(--primary)] transition-colors">워드로브 AI</Link></li>
                        </ul>
                    </div>

                    {/* Connect */}
                    <div>
                        <h4 className="text-xs font-bold uppercase tracking-widest mb-6">커넥트</h4>
                        <div className="flex gap-4">
                            <a href="#" className="w-8 h-8 border border-gray-200 flex items-center justify-center hover:border-[var(--primary)] hover:text-[var(--primary)] transition-colors">
                                <span className="text-xs">IG</span>
                            </a>
                            <a href="#" className="w-8 h-8 border border-gray-200 flex items-center justify-center hover:border-[var(--primary)] hover:text-[var(--primary)] transition-colors">
                                <span className="text-xs">YT</span>
                            </a>
                            <a href="#" className="w-8 h-8 border border-gray-200 flex items-center justify-center hover:border-[var(--primary)] hover:text-[var(--primary)] transition-colors">
                                <span className="text-xs">FB</span>
                            </a>
                        </div>
                    </div>
                </div>

                {/* Bottom */}
                <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-gray-100 text-[10px] text-gray-400 uppercase tracking-widest">
                    <p>© 2026 Neural-Design. All rights reserved.</p>
                    <div className="flex gap-6 mt-4 md:mt-0">
                        <Link href="/board" className="hover:text-[var(--neural-black)]">고객센터</Link>
                        <Link href="#" className="hover:text-[var(--neural-black)]">개인정보 처리방침</Link>
                        <Link href="/admin/login" className="hover:text-[var(--primary)]">[ ADMIN ]</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
