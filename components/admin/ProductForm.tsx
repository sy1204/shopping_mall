// components/admin/ProductForm.tsx
// components/admin/ProductForm.tsx
'use client';

import { Product } from "@/utils/dummyData";
import { saveProduct, updateProduct, getProductById } from "@/utils/productStorage";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

interface ProductFormProps {
    initialData?: Product;
    isEdit?: boolean;
}

export default function ProductForm({ initialData, isEdit }: ProductFormProps) {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        brand: '',
        original_price: '',
        discount_rate: '0',
        price: '', // This will be calculated
        category: '',
        images: '',
        story_content: ''
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name,
                brand: initialData.brand,
                original_price: initialData.original_price?.toString() || initialData.price.toString(),
                discount_rate: initialData.discount_rate?.toString() || '0',
                price: initialData.price.toString(),
                category: initialData.category,
                images: initialData.images.join('\n'),
                story_content: initialData.story_content || ''
            });
        }
    }, [initialData]);

    // Auto-calculate Price based on Original Price and Discount Rate
    useEffect(() => {
        if (!initialData || (initialData && formData.original_price !== initialData.original_price?.toString())) {
            const original = Number(formData.original_price);
            const rate = Number(formData.discount_rate);

            if (original && !isNaN(original)) {
                if (rate && !isNaN(rate)) {
                    const discounted = original * (1 - rate / 100);
                    setFormData(prev => ({ ...prev, price: Math.round(discounted).toString() }));
                } else {
                    setFormData(prev => ({ ...prev, price: original.toString() }));
                }
            }
        }
    }, [formData.original_price, formData.discount_rate]);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const productPayload: any = {
            name: formData.name,
            brand: formData.brand,
            price: Number(formData.price),
            original_price: Number(formData.original_price),
            discount_rate: Number(formData.discount_rate),
            category: formData.category,
            images: formData.images.split('\n').filter(url => url.trim().length > 0),
            story_content: formData.story_content
        };

        // If no discount, ensure consistent data
        if (productPayload.discount_rate === 0) {
            productPayload.original_price = undefined;
            productPayload.discount_rate = undefined;
        }

        if (isEdit && initialData) {
            updateProduct(initialData.id, productPayload);
            alert('상품이 수정되었습니다.');
        } else {
            saveProduct(productPayload);
            alert('상품이 등록되었습니다.');
        }

        router.push('/admin/products');
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-2xl bg-white p-8 rounded-lg shadow-sm border">
            <h2 className="text-xl font-bold mb-6">{isEdit ? '상품 수정' : '새 상품 등록'}</h2>

            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">브랜드</label>
                        <input name="brand" value={formData.brand} onChange={handleChange} className="w-full border p-2 rounded" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">상품명</label>
                        <input name="name" value={formData.name} onChange={handleChange} className="w-full border p-2 rounded" required />
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">정가 (Original Price)</label>
                        <input type="number" name="original_price" value={formData.original_price} onChange={handleChange} className="w-full border p-2 rounded" required placeholder="예: 50000" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">할인율 (%)</label>
                        <input type="number" name="discount_rate" value={formData.discount_rate} onChange={handleChange} className="w-full border p-2 rounded" placeholder="0" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">최종 판매가</label>
                        <input type="number" name="price" value={formData.price} readOnly className="w-full border p-2 rounded bg-gray-100 text-gray-500 font-bold" />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">카테고리</label>
                    <select name="category" value={formData.category} onChange={handleChange} className="w-full border p-2 rounded" required>
                        <option value="">카테고리 선택</option>
                        <option value="Top">상의 (Top)</option>
                        <option value="Bottom">하의 (Bottom)</option>
                        <option value="Outerwear">아우터 (Outerwear)</option>
                        <option value="Shoes">신발 (Shoes)</option>
                        <option value="Bag">가방 (Bag)</option>
                        <option value="Accessories">액세서리 (Accessories)</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">이미지 URL (줄바꿈으로 구분)</label>
                    <textarea
                        name="images"
                        value={formData.images}
                        onChange={handleChange}
                        className="w-full border p-2 rounded h-32 font-mono text-sm"
                        placeholder="https://example.com/image1.jpg"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">상세 설명 (Markdown 지원)</label>
                    <textarea
                        name="story_content"
                        value={formData.story_content}
                        onChange={handleChange}
                        className="w-full border p-2 rounded h-48 font-mono text-sm"
                    />
                </div>

                <div className="pt-4 flex justify-end gap-2">
                    <button type="button" onClick={() => router.back()} className="px-4 py-2 border rounded hover:bg-gray-50">취소</button>
                    <button type="submit" className="px-4 py-2 bg-black text-white rounded font-bold hover:bg-gray-800">
                        {isEdit ? '상품 수정' : '상품 등록'}
                    </button>
                </div>
            </div>
        </form>
    );
}
