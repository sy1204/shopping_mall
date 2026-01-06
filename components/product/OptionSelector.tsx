// components/product/OptionSelector.tsx
'use client';

import { useState } from 'react';
import type { ProductOption } from '@/types/product';

export default function OptionSelector({ options }: { options: ProductOption | null }) {
    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const [selectedColor, setSelectedColor] = useState<string | null>(null);

    if (!options) return null;

    return (
        <div className="space-y-6">
            {/* Colors */}
            {options.colors && options.colors.length > 0 && (
                <div className="space-y-3">
                    <label className="text-sm font-medium text-gray-900">Color</label>
                    <div className="flex gap-2">
                        {options.colors.map((color) => (
                            <button
                                key={color}
                                onClick={() => setSelectedColor(color)}
                                className={`px-4 py-2 text-sm border transition-all ${selectedColor === color
                                        ? 'border-black bg-black text-white'
                                        : 'border-gray-200 text-gray-600 hover:border-gray-400'
                                    }`}
                            >
                                {color}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Sizes */}
            {options.sizes && options.sizes.length > 0 && (
                <div className="space-y-3">
                    <label className="text-sm font-medium text-gray-900">Size</label>
                    <div className="flex gap-2">
                        {options.sizes.map((size) => (
                            <button
                                key={size}
                                onClick={() => setSelectedSize(size)}
                                className={`w-12 h-12 flex items-center justify-center text-sm border transition-all ${selectedSize === size
                                        ? 'border-black bg-black text-white'
                                        : 'border-gray-200 text-gray-600 hover:border-gray-400'
                                    }`}
                            >
                                {size}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Selected Summary */}
            {(selectedSize && selectedColor) && (
                <div className="bg-gray-50 p-4 text-sm mt-4">
                    <div className="flex justify-between items-center mb-2">
                        <span>{selectedColor} / {selectedSize}</span>
                    </div>
                </div>
            )}
        </div>
    );
}
