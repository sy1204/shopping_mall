// app/admin/products/page.tsx
'use client';

import { getProducts, deleteProduct } from "@/utils/productStorage";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Product } from "@/utils/dummyData";
import { useToast } from "@/context/ToastContext";

export default function AdminProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const { showToast } = useToast();

    useEffect(() => {
        setProducts(getProducts());
    }, []);

    const handleDelete = (id: string) => {
        if (window.confirm('상품을 삭제하시겠습니까?')) {
            const updated = deleteProduct(id);
            setProducts(updated);
            showToast('ITEM DELETED SUCCESSFULLY', 'success');
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold font-mono tracking-tight uppercase">Product inventory</h1>
                <Link
                    href="/admin/products/new"
                    className="bg-[var(--neural-black)] text-white px-6 py-2 text-sm font-mono hover:bg-[var(--brand-accent)] transition-colors"
                >
                    [ ADD NEW PRODUCT ]
                </Link>
            </div>

            <div className="bg-white border border-[var(--tech-silver)] border-opacity-20 shadow-sm overflow-x-auto">
                <table className="w-full text-left text-sm min-w-[800px]">
                    <thead className="bg-gray-50 border-b border-[var(--tech-silver)] border-opacity-20 font-mono">
                        <tr>
                            <th className="p-4 font-bold text-[var(--tech-silver)] uppercase tracking-widest text-[10px]">Product / Brand</th>
                            <th className="p-4 font-bold text-[var(--tech-silver)] uppercase tracking-widest text-[10px]">Category</th>
                            <th className="p-4 font-bold text-[var(--tech-silver)] uppercase tracking-widest text-[10px] text-right">Price</th>
                            <th className="p-4 font-bold text-[var(--tech-silver)] uppercase tracking-widest text-[10px] text-center">Engagement</th>
                            <th className="p-4 font-bold text-[var(--tech-silver)] uppercase tracking-widest text-[10px] text-right">Management</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {products.map(product => (
                            <tr key={product.id} className="hover:bg-gray-50 transition-colors group">
                                <td className="p-4">
                                    <div className="flex items-center gap-4">
                                        <div className="relative w-12 h-16 bg-gray-100 flex-shrink-0 overflow-hidden border border-gray-100">
                                            {product.images && product.images[0] && (
                                                <Image
                                                    src={product.images[0]}
                                                    alt={product.name}
                                                    fill
                                                    unoptimized
                                                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                                                />
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-bold text-[var(--neural-black)]">{product.name}</p>
                                            <p className="text-[10px] font-mono text-[var(--tech-silver)] tracking-widest uppercase">{product.brand}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4 text-xs font-mono text-gray-600 uppercase tracking-wider">{product.category}</td>
                                <td className="p-4 text-right font-mono">
                                    <span className="text-sm font-bold">₩{product.price.toLocaleString()}</span>
                                    {product.original_price && (
                                        <span className="block text-[10px] text-[var(--tech-silver)] line-through">
                                            ₩{product.original_price.toLocaleString()}
                                        </span>
                                    )}
                                </td>
                                <td className="p-4 text-center text-[10px] font-mono text-gray-500 uppercase tracking-tighter">
                                    <div className="flex flex-col gap-1 items-center">
                                        <span className="bg-gray-100 px-2 py-0.5 rounded-full">LIKE: {product.like_count}</span>
                                        <span className="bg-gray-100 px-2 py-0.5 rounded-full">REV: {product.review_count}</span>
                                    </div>
                                </td>
                                <td className="p-4 text-right">
                                    <div className="flex justify-end gap-4 font-mono text-[10px] font-bold tracking-widest">
                                        <Link
                                            href={`/admin/products/edit?id=${product.id}`}
                                            className="text-[var(--neural-black)] hover:text-[var(--brand-accent)] transition-colors"
                                        >
                                            [ EDIT ]
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(product.id)}
                                            className="text-red-500 hover:text-red-700 transition-colors"
                                        >
                                            [ DELETE ]
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {products.length === 0 && (
                    <div className="p-20 text-center text-[var(--tech-silver)] font-mono text-xs uppercase tracking-[0.2em]">
                        NO PRODUCTS REGISTERED IN INVENTORY
                    </div>
                )}
            </div>
        </div>
    );
}
