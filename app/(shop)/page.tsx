'use client';

import HeroBanner from "@/components/main/HeroBanner";
import PopupModal from "@/components/main/PopupModal";
import ProductCard from "@/components/product/ProductCard";
import { getProducts } from "@/utils/productStorage";
import { Product } from "@/types";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Home() {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            const data = await getProducts();
            setProducts(data);
            setIsLoading(false);
        };
        fetchProducts();
    }, []);

    // Filter for sections (Demo logic)
    const bestProducts = products.filter(p => p.is_best).slice(0, 6);
    // If no best products, just take first few
    const displayBest = bestProducts.length > 0 ? bestProducts : products.slice(0, 6);

    // Sort by newest for New Arrivals
    const newArrivals = [...products].reverse().slice(0, 6);

    if (isLoading) {
        return (
            <main className="min-h-screen">
                <HeroBanner />
                <div className="max-w-[1920px] mx-auto px-6 lg:px-12 py-16 text-center">
                    <div className="animate-pulse text-gray-400 font-mono text-sm">
                        [ 로딩 중... ]
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen relative">
            <PopupModal />
            <HeroBanner />

            {/* Marquee Banner */}
            <div className="border-y border-[var(--neural-black)] py-3 overflow-hidden bg-[var(--neural-black)] text-white">
                <div className="whitespace-nowrap flex gap-12 animate-marquee font-mono text-xs uppercase tracking-widest">
                    <span>[ N-D ] 뉴럴 링크 활성화</span>
                    <span>●</span>
                    <span>새로운 시즌 도착</span>
                    <span>●</span>
                    <span>에디토리얼 로직 V.2.0</span>
                    <span>●</span>
                    <span>타임리스 알고리즘</span>
                    <span>●</span>
                    <span>[ N-D ] 뉴럴 링크 활성화</span>
                    <span>●</span>
                    <span>새로운 시즌 도착</span>
                    <span>●</span>
                    <span>에디토리얼 로직 V.2.0</span>
                    <span>●</span>
                    <span>타임리스 알고리즘</span>
                </div>
            </div>

            {/* The Edit Section */}
            <section className="max-w-[1920px] mx-auto px-6 lg:px-12 py-24">
                <div className="flex flex-col lg:flex-row justify-between items-end mb-16 gap-6">
                    <div>
                        <h2 className="text-3xl font-serif mb-2">디 에디트</h2>
                        <p className="text-xs uppercase tracking-widest text-gray-500">[ 뉴럴 인텔리전스 큐레이션 ]</p>
                    </div>
                    <div className="flex items-center gap-8 text-sm font-medium">
                        <button className="text-[var(--primary)] underline underline-offset-4 decoration-1">전체</button>
                        <button className="hover:text-[var(--primary)] transition-colors">의류</button>
                        <button className="hover:text-[var(--primary)] transition-colors">액세서리</button>
                        <button className="hover:text-[var(--primary)] transition-colors">신발</button>
                    </div>
                </div>

                {displayBest.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-12">
                        {displayBest.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 text-gray-400 border border-dashed border-gray-200">
                        등록된 상품이 없습니다.
                    </div>
                )}

                <div className="mt-16 text-center">
                    <Link
                        href="/shop"
                        className="text-xs font-bold uppercase tracking-[0.2em] border-b border-transparent hover:border-[var(--primary)] hover:text-[var(--primary)] transition-all pb-1"
                    >
                        [ 전체 보기 ]
                    </Link>
                </div>
            </section>

            {/* Neural Link Section */}
            <section className="bg-[var(--neural-black)] text-white py-24 relative overflow-hidden">
                {/* Grid Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5"></path>
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#grid)"></rect>
                    </svg>
                </div>

                <div className="max-w-6xl mx-auto px-6 relative z-10 flex flex-col md:flex-row items-center gap-16">
                    <div className="w-full md:w-1/2">
                        <div className="inline-flex items-center gap-2 mb-6 border border-white/20 px-3 py-1 rounded-full">
                            <span className="text-[var(--primary)] text-sm">✨</span>
                            <span className="text-[10px] uppercase tracking-widest">뉴럴 링크 v2.0</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-serif leading-tight mb-6">
                            <span className="text-[var(--primary)] italic">인공 직관</span>으로<br />
                            당신의 스타일을 재정의하세요.
                        </h2>
                        <p className="text-gray-400 font-light mb-8 max-w-md leading-relaxed break-keep">
                            단순한 의류 추천을 넘어, 당신만의 고유한 스타일 지문을 분석하여 다음 세대의 타임리스 아이템을 예측합니다.
                        </p>
                        <div className="flex flex-col gap-4">
                            <Link href="/chat" className="group flex items-center gap-4 text-sm tracking-widest uppercase hover:text-[var(--primary)] transition-colors">
                                <span className="w-8 h-px bg-white group-hover:bg-[var(--primary)] transition-colors"></span>
                                [ N-to-D ] : 서사에서 디자인으로
                            </Link>
                            <Link href="/open-shop" className="group flex items-center gap-4 text-sm tracking-widest uppercase hover:text-[var(--primary)] transition-colors">
                                <span className="w-8 h-px bg-white group-hover:bg-[var(--primary)] transition-colors"></span>
                                [ N-in-D ] : 디자인 속의 뉴럴 인텔리전스
                            </Link>
                        </div>
                    </div>

                    {/* Analysis Card */}
                    <div className="w-full md:w-1/2 flex justify-center">
                        <div className="relative w-80 h-96 border border-white/20 bg-white/5 backdrop-blur-sm p-6 flex flex-col">
                            <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
                                <div className="w-2 h-2 rounded-full bg-[var(--primary)] animate-pulse"></div>
                                <div className="text-[10px] font-mono text-gray-500">분석 중</div>
                            </div>
                            <div className="space-y-4 flex-1">
                                <div className="h-2 bg-white/10 w-3/4 rounded animate-pulse"></div>
                                <div className="h-2 bg-white/10 w-1/2 rounded animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                                <div className="h-2 bg-white/10 w-5/6 rounded animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                            </div>
                            <div className="mt-auto pt-6 border-t border-white/10">
                                <div className="text-[10px] text-[var(--primary)] text-right">매치율: 98%</div>
                            </div>
                            {/* Corner Decorators */}
                            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white"></div>
                            <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-white"></div>
                            <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-white"></div>
                            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* New Arrivals Section */}
            <section className="max-w-[1920px] mx-auto px-6 lg:px-12 py-24 bg-gray-50">
                <div className="flex flex-col lg:flex-row justify-between items-end mb-16 gap-6">
                    <div>
                        <h2 className="text-3xl font-serif mb-2">신상품</h2>
                        <p className="text-xs uppercase tracking-widest text-gray-500">[ 최신 아이템 ]</p>
                    </div>
                </div>

                {newArrivals.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-12">
                        {newArrivals.map((product) => (
                            <ProductCard key={`new-${product.id}`} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 text-gray-400 border border-dashed border-gray-200 bg-white">
                        등록된 신상품이 없습니다.
                    </div>
                )}
            </section>
        </main>
    );
}
