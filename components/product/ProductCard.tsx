// components/product/ProductCard.tsx
'use client';

import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/types";
import Bracket from "@/components/ui/Bracket";
import Dash from "@/components/ui/Dash";
import { useState } from "react";

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <Link
            href={`/shop/${product.id}`}
            className="group block"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="relative overflow-hidden bg-white border border-[var(--tech-silver)] border-opacity-10 transition-all duration-300 hover:border-[var(--brand-accent)] hover:border-opacity-30">
                {/* Product Image */}
                <div className="relative aspect-[3/4] overflow-hidden">
                    <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        unoptimized
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    {/* Dash Overlay on Hover */}
                    {isHovered && (
                        <div className="absolute inset-0 pointer-events-none">
                            <div className="absolute top-0 left-0 right-0">
                                <Dash opacity={0.3} />
                            </div>
                            <div className="absolute bottom-0 left-0 right-0">
                                <Dash opacity={0.3} />
                            </div>
                        </div>
                    )}
                </div>

                {/* Product Info */}
                <div className="p-4 space-y-2">
                    {/* Brand */}
                    {product.brand && (
                        <p className="text-xs font-mono text-[var(--tech-silver)] tracking-wider">
                            {product.brand}
                        </p>
                    )}

                    {/* Title with Bracket */}
                    <h3 className="text-sm font-medium text-[var(--neural-black)] line-clamp-2 min-h-[2.5rem]">
                        <Bracket variant={isHovered ? "hover" : "default"}>
                            <span className={isHovered ? "font-semibold" : ""}>
                                {product.name}
                            </span>
                        </Bracket>
                    </h3>

                    {/* Price - Monospace */}
                    <div className="flex items-baseline gap-2 font-mono">
                        {product.discount_rate && product.discount_rate > 0 ? (
                            <>
                                <span className="text-sm text-[var(--tech-silver)] line-through">
                                    ₩{product.original_price?.toLocaleString()}
                                </span>
                                <span className="text-base font-semibold text-[var(--brand-accent)]">
                                    ₩{product.price.toLocaleString()}
                                </span>
                                <span className="text-xs text-[var(--brand-accent)]">
                                    {product.discount_rate}%
                                </span>
                            </>
                        ) : (
                            <span className="text-base font-semibold text-[var(--neural-black)]">
                                ₩{product.price.toLocaleString()}
                            </span>
                        )}
                    </div>

                    {/* Bottom Dash */}
                    <div className="pt-3">
                        <Dash opacity={isHovered ? 0.4 : 0.1} />
                    </div>
                </div>
            </div>
        </Link>
    );
}
