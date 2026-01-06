// app/admin/products/edit/page.tsx
'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getProducts, updateProduct } from '@/utils/productStorage';
import { Product } from '@/types';

function EditContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const productId = searchParams?.get('id');

    const [product, setProduct] = useState<Product | null>(null);
    const [formData, setFormData] = useState<any>({});

    useEffect(() => {
        if (!productId) {
            router.push('/admin/products');
            return;
        }

        const products = getProducts();
        const found = products.find(p => p.id === productId);
        if (found) {
            setProduct(found);
            setFormData(found);
        } else {
            alert('Product not found');
            router.push('/admin/products');
        }
    }, [productId, router]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!productId) return;

        updateProduct(productId, formData);
        alert('상품이 수정되었습니다.');
        router.push('/admin/products');
    };

    if (!product) return <div className="p-8">Loading...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">상품 수정</h1>
                <button
                    onClick={() => router.back()}
                    className="text-gray-500 hover:text-black"
                >
                    ← 돌아가기
                </button>
            </div>

            <form onSubmit={handleSubmit} className="bg-white border rounded-lg p-6 space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1">상품명</label>
                    <input
                        type="text"
                        className="w-full border rounded px-3 py-2"
                        value={formData.name || ''}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">브랜드</label>
                    <input
                        type="text"
                        className="w-full border rounded px-3 py-2"
                        value={formData.brand || ''}
                        onChange={e => setFormData({ ...formData, brand: e.target.value })}
                        required
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">정가</label>
                        <input
                            type="number"
                            className="w-full border rounded px-3 py-2"
                            value={formData.original_price || ''}
                            onChange={e => setFormData({ ...formData, original_price: Number(e.target.value) })}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">판매가</label>
                        <input
                            type="number"
                            className="w-full border rounded px-3 py-2"
                            value={formData.price || ''}
                            onChange={e => setFormData({ ...formData, price: Number(e.target.value) })}
                            required
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">카테고리</label>
                    <input
                        type="text"
                        className="w-full border rounded px-3 py-2"
                        value={formData.category || ''}
                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                        required
                    />
                </div>

                <div className="flex justify-end gap-2 pt-4">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="px-6 py-2 border rounded hover:bg-gray-50"
                    >
                        취소
                    </button>
                    <button
                        type="submit"
                        className="px-6 py-2 bg-black text-white rounded hover:bg-gray-800"
                    >
                        수정
                    </button>
                </div>
            </form>
        </div>
    );
}

export default function ProductEditPage() {
    return (
        <Suspense fallback={<div className="p-8">Loading...</div>}>
            <EditContent />
        </Suspense>
    );
}
