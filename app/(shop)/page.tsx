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
    const bestProducts = products.filter(p => p.is_best).slice(0, 8);
    // If no best products, just take first few
    const displayBest = bestProducts.length > 0 ? bestProducts : products.slice(0, 4);

    // Sort by newest for New Arrivals
    const newArrivals = [...products].reverse().slice(0, 8);

    if (isLoading) {
        return (
            <main className="min-h-screen">
                <HeroBanner />
                <div className="container mx-auto px-4 py-16 text-center">
                    Loading...
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen">
            <PopupModal />
            <HeroBanner />

            <section className="container mx-auto px-4 py-16">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold tracking-tight">주간 베스트</h2>
                    <Link href="/shop" className="text-sm text-gray-500 cursor-pointer hover:text-black">
                        더 보기 →
                    </Link>
                </div>

                {displayBest.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
                        {displayBest.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 text-gray-400 bg-gray-50">
                        등록된 베스트 상품이 없습니다.
                    </div>
                )}
            </section>

            <section className="bg-gray-50 py-16">
                <div className="container mx-auto px-4">
                    <h2 className="text-2xl font-bold tracking-tight mb-8">신상품</h2>
                    {newArrivals.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {newArrivals.map((product) => (
                                <ProductCard key={`new-${product.id}`} product={product} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 text-gray-400 bg-white">
                            등록된 신상품이 없습니다.
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}
