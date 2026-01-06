// components/admin/ProductForm.tsx
'use client';

import { saveProduct, updateProduct } from "@/utils/productStorage";
import { Product } from "@/types";
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
                images: (initialData.images || []).join('\n'),
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
    }, [formData.original_price, formData.discount_rate, initialData]);


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
        <form onSubmit={handleSubmit} className="max-w-2xl bg-white p-8 rounded border shadow-sm">
            <h2 className="text-xl font-bold mb-6 font-mono tracking-tight uppercase">{isEdit ? 'EDit Product' : 'Register New Product'}</h2>

            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-[10px] font-mono font-bold text-gray-400 mb-1 uppercase tracking-widest">Brand</label>
                        <input name="brand" value={formData.brand} onChange={handleChange} className="w-full border p-2 rounded text-sm focus:border-black outline-none transition-colors" required />
                    </div>
                    <div>
                        <label className="block text-[10px] font-mono font-bold text-gray-400 mb-1 uppercase tracking-widest">Product Name</label>
                        <input name="name" value={formData.name} onChange={handleChange} className="w-full border p-2 rounded text-sm focus:border-black outline-none transition-colors" required />
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                    <div>
                        <label className="block text-[10px] font-mono font-bold text-gray-400 mb-1 uppercase tracking-widest">Original Price</label>
                        <input type="number" name="original_price" value={formData.original_price} onChange={handleChange} className="w-full border p-2 rounded text-sm focus:border-black outline-none transition-colors" required placeholder="50000" />
                    </div>
                    <div>
                        <label className="block text-[10px] font-mono font-bold text-gray-400 mb-1 uppercase tracking-widest">Discount (%)</label>
                        <input type="number" name="discount_rate" value={formData.discount_rate} onChange={handleChange} className="w-full border p-2 rounded text-sm focus:border-black outline-none transition-colors" placeholder="0" />
                    </div>
                    <div>
                        <label className="block text-[10px] font-mono font-bold text-gray-400 mb-1 uppercase tracking-widest">Final Price</label>
                        <input type="number" name="price" value={formData.price} readOnly className="w-full border p-2 rounded bg-gray-50 text-black font-bold font-mono text-sm" />
                    </div>
                </div>

                <div>
                    <label className="block text-[10px] font-mono font-bold text-gray-400 mb-1 uppercase tracking-widest">Category</label>
                    <select name="category" value={formData.category} onChange={handleChange} className="w-full border p-2 rounded text-sm focus:border-black outline-none transition-colors" required>
                        <option value="">Select Category</option>
                        <option value="Top">상의 (Top)</option>
                        <option value="Bottom">하의 (Bottom)</option>
                        <option value="Outerwear">아우터 (Outerwear)</option>
                        <option value="Shoes">신발 (Shoes)</option>
                        <option value="Bag">가방 (Bag)</option>
                        <option value="Accessories">액세서리 (Accessories)</option>
                    </select>
                </div>

                <div>
                    <label className="block text-[10px] font-mono font-bold text-gray-400 mb-1 uppercase tracking-widest">Image URLs (One per line)</label>
                    <textarea
                        name="images"
                        value={formData.images}
                        onChange={handleChange}
                        className="w-full border p-2 rounded h-32 font-mono text-xs focus:border-black outline-none transition-colors"
                        placeholder="https://example.com/image1.jpg"
                        required
                    />
                </div>

                <div>
                    <label className="block text-[10px] font-mono font-bold text-gray-400 mb-1 uppercase tracking-widest">Description (Markdown)</label>
                    <textarea
                        name="story_content"
                        value={formData.story_content}
                        onChange={handleChange}
                        className="w-full border p-2 rounded h-48 focus:border-black outline-none transition-colors text-sm"
                    />
                </div>

                <div className="pt-4 flex justify-end gap-2">
                    <button type="button" onClick={() => router.back()} className="px-6 py-2 border rounded text-xs font-mono font-bold uppercase hover:bg-gray-50 transition-colors">Cancel</button>
                    <button type="submit" className="px-6 py-2 bg-black text-white rounded text-xs font-mono font-bold uppercase hover:bg-gray-800 transition-colors">
                        {isEdit ? 'Update Product' : 'Register Product'}
                    </button>
                </div>
            </div>
        </form>
    );
}
