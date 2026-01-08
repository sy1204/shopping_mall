// app/shop/page.tsx
'use client';

import { getProducts } from "@/utils/productStorage";
import ProductCard from "@/components/product/ProductCard";
import { useEffect, useState, Suspense } from "react";
import { Product } from "@/types";
import { useSearchParams } from "next/navigation";

function ShopContent() {
    const [products, setProducts] = useState<Product[]>([]);
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

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-12">
                <h1 className="text-4xl font-serif mb-4 tracking-tight">
                    {query ? `Search: [ ${query} ]` : 'Style Shop'}
                </h1>
                <p className="text-sm font-mono text-[var(--tech-silver)] uppercase tracking-widest">
                    Showing {products.length} items
                </p>
            </div>

            {products.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
                    {products.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            ) : (
                <div className="py-20 text-center border border-dashed border-[var(--tech-silver)] border-opacity-30">
                    <p className="text-gray-400 font-serif text-xl mb-4 italic">No items found matching your request.</p>
                    <button
                        onClick={() => window.location.href = '/shop'}
                        className="text-sm font-mono text-[var(--brand-accent)] hover:underline"
                    >
                        VIEW ALL PRODUCTS →
                    </button>
                </div>
            )}
        </div>
    );
}

export default function ShopPage() {
    return (
        <Suspense fallback={<div className="container mx-auto px-4 py-20 text-center font-mono">LOADING_SHOP_DATA...</div>}>
            <ShopContent />
        </Suspense>
    );
}
