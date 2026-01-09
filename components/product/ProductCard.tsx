// components/product/ProductCard.tsx
'use client';

import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/types";

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    return (
        <Link href={`/shop/${product.id}`} className="nd-product-card group block">
            {/* Product Image */}
            <div className="relative aspect-[3/4] overflow-hidden bg-gray-50 mb-4">
                {product.images && product.images.length > 0 ? (
                    <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        unoptimized
                        className="nd-product-image object-cover hover-grayscale"
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-300 bg-gray-100">
                        <span className="text-xs uppercase tracking-widest">No Image</span>
                    </div>
                )}

                {/* Quick Add Button - Appears on hover */}
                <div className="nd-add-btn absolute bottom-4 left-4 right-4">
                    <div className="bg-white/90 backdrop-blur border border-gray-200 py-3 text-center text-xs uppercase tracking-widest font-medium hover:bg-[var(--neural-black)] hover:text-white transition-colors">
                        [ 빠른 보기 ]
                    </div>
                </div>

                {/* Sale Badge */}
                {product.discount_rate && product.discount_rate > 0 && (
                    <div className="absolute top-3 left-3 bg-[var(--primary)] text-white text-[10px] font-bold px-2 py-1 uppercase tracking-widest">
                        Sale
                    </div>
                )}
            </div>

            {/* Product Info */}
            <div className="space-y-2">
                {/* Brand */}
                {product.brand && (
                    <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400">
                        {product.brand}
                    </p>
                )}

                {/* Product Name */}
                <h3 className="nd-product-name text-base leading-snug line-clamp-2">
                    {product.name}
                </h3>

                {/* Price */}
                <div className="flex items-baseline gap-2 font-mono text-sm">
                    {product.discount_rate && product.discount_rate > 0 ? (
                        <>
                            <span className="text-[var(--primary)] font-semibold">
                                ₩{product.price.toLocaleString()}
                            </span>
                            <span className="text-gray-400 line-through text-xs">
                                ₩{product.original_price?.toLocaleString()}
                            </span>
                        </>
                    ) : (
                        <span className="text-[var(--neural-black)]">
                            ₩{product.price.toLocaleString()}
                        </span>
                    )}
                </div>
            </div>
        </Link>
    );
}
