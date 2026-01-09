// app/shop/page.tsx
'use client';

import { getProducts } from "@/utils/productStorage";
import ProductCard from "@/components/product/ProductCard";
import { useEffect, useState, Suspense } from "react";
import { Product } from "@/types";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function ShopContent() {
    const [products, setProducts] = useState<Product[]>([]);
    const [activeCategory, setActiveCategory] = useState<string>('전체');
    const searchParams = useSearchParams();
    const query = searchParams?.get('q');

    useEffect(() => {
        const fetchProducts = async () => {
            let allProducts = await getProducts();
            if (query) {
                allProducts = allProducts.filter(p =>
                    p.name.toLowerCase().includes(query.toLowerCase()) ||
                    p.brand.toLowerCase().includes(query.toLowerCase()) ||
                    p.category.toLowerCase().includes(query.toLowerCase())
                );
            }
            setProducts(allProducts);
        };
        fetchProducts();
    }, [query]);

    // Get unique categories
    const categories = ['전체', ...Array.from(new Set(products.map(p => p.category)))];

    // Filter by category
    const filteredProducts = activeCategory === '전체'
        ? products
        : products.filter(p => p.category === activeCategory);

    return (
        <div className="min-h-screen bg-editorial-grid">
            {/* Header */}
            <div className="border-b border-gray-100">
                <div className="max-w-[1920px] mx-auto px-6 lg:px-12 py-16">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8">
                        <div>
                            <p className="text-xs uppercase tracking-[0.3em] text-gray-400 mb-3">
                                [ 컬렉션 ]
                            </p>
                            <h1 className="text-4xl lg:text-5xl font-serif">
                                {query ? (
                                    <>검색: <span className="italic text-[var(--primary)]">&quot;{query}&quot;</span></>
                                ) : (
                                    '쇼핑'
                                )}
                            </h1>
                        </div>

                        <div className="text-sm font-mono text-gray-400">
                            {filteredProducts.length}개 상품
                        </div>
                    </div>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="sticky top-20 z-30 bg-white/90 backdrop-blur border-b border-gray-100">
                <div className="max-w-[1920px] mx-auto px-6 lg:px-12 py-4 flex gap-6 overflow-x-auto">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`text-xs uppercase tracking-widest whitespace-nowrap transition-colors pb-1 ${activeCategory === cat
                                    ? 'text-[var(--primary)] border-b border-[var(--primary)]'
                                    : 'text-gray-400 hover:text-[var(--neural-black)]'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Products Grid */}
            <div className="max-w-[1920px] mx-auto px-6 lg:px-12 py-12">
                {filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-12">
                        {filteredProducts.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="py-24 text-center border border-dashed border-gray-200">
                        <p className="font-serif text-2xl text-gray-400 mb-4 italic">
                            검색 결과가 없습니다.
                        </p>
                        <Link
                            href="/shop"
                            className="text-xs font-bold uppercase tracking-widest text-[var(--primary)] hover:underline"
                        >
                            [ 전체 상품 보기 ]
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function ShopPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-pulse text-gray-400 font-mono text-sm">[ 로딩 중... ]</div>
            </div>
        }>
            <ShopContent />
        </Suspense>
    );
}
