// components/product/BuyBox.tsx
'use client';

import { Product } from '@/utils/dummyData';
import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import { useRouter } from 'next/navigation';

export default function BuyBox({ product }: { product: Product }) {
    const [selectedSize, setSelectedSize] = useState<string>('');
    const { addToCart } = useCart();
    const { showToast } = useToast();
    const router = useRouter();

    const handleAddToCart = () => {
        if (!selectedSize) {
            showToast('Please select a size', 'error');
            return;
        }
        addToCart(product, { size: selectedSize });
        showToast('ITEM ADDED TO CART', 'success');
        setSelectedSize('');
    };

    const handleBuyNow = () => {
        if (!selectedSize) {
            showToast('Please select a size', 'error');
            return;
        }
        addToCart(product, { size: selectedSize });
        router.push('/checkout/order');
    };

    return (
        <div className="bg-white border border-[var(--tech-silver)] border-opacity-20 p-8 shadow-sm">
            {/* Header / Brand */}
            <div className="mb-6">
                <span className="text-xs font-mono text-[var(--tech-silver)] tracking-widest uppercase mb-2 block">
                    {product.brand}
                </span>
                <h1 className="text-3xl font-light text-[var(--neural-black)] leading-tight tracking-tight">
                    {product.name}
                </h1>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-4 mb-10">
                {product.discount_rate && (
                    <span className="text-2xl font-bold text-[var(--brand-accent)]">{product.discount_rate}%</span>
                )}
                <span className="text-3xl font-medium text-[var(--neural-black)] font-mono">
                    ₩{product.price.toLocaleString()}
                </span>
                {product.original_price && (
                    <span className="text-lg text-[var(--tech-silver)] line-through font-mono">
                        ₩{product.original_price.toLocaleString()}
                    </span>
                )}
            </div>

            <div className="h-px bg-[var(--tech-silver)] bg-opacity-10 my-8" />

            {/* Simple Options */}
            <div className="mb-10">
                <label className="block text-[10px] font-bold text-[var(--tech-silver)] tracking-[0.2em] mb-4 uppercase">SIZE SELECTION</label>
                <div className="grid grid-cols-3 gap-3">
                    {['S', 'M', 'L'].map((size) => (
                        <button
                            key={size}
                            onClick={() => setSelectedSize(size)}
                            className={`border py-4 text-xs font-mono transition-all duration-300 ${selectedSize === size
                                ? 'border-[var(--brand-accent)] bg-[var(--brand-accent)] text-white'
                                : 'border-[var(--tech-silver)] border-opacity-20 hover:border-opacity-100 text-[var(--neural-black)]'
                                }`}
                        >
                            {size}
                        </button>
                    ))}
                </div>
            </div>

            {/* Actions */}
            <div className="space-y-4">
                <button
                    onClick={handleBuyNow}
                    className="w-full bg-[var(--neural-black)] text-white py-5 text-xs font-bold tracking-[0.2em] hover:bg-[var(--brand-accent)] transition-all duration-500 uppercase"
                >
                    PURCHASE NOW
                </button>
                <button
                    onClick={handleAddToCart}
                    className="w-full border border-[var(--neural-black)] text-[var(--neural-black)] py-5 text-xs font-bold tracking-[0.2em] hover:bg-[var(--neural-black)] hover:text-white transition-all duration-500 uppercase"
                >
                    ADD TO CART
                </button>
            </div>
        </div>
    );
}
