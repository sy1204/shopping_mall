// components/admin/ProductForm.tsx
'use client';

import { saveProduct, updateProduct } from "@/utils/productStorage";
import { Product } from "@/types";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";

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
        story_content: '',
        is_best: false,
        is_new: false
    });

    // Image preview state
    const [imageUrls, setImageUrls] = useState<string[]>([]);
    const [newImageUrl, setNewImageUrl] = useState('');

    useEffect(() => {
        if (initialData) {
            const images = initialData.images || [];
            setFormData({
                name: initialData.name,
                brand: initialData.brand,
                original_price: initialData.original_price?.toString() || initialData.price.toString(),
                discount_rate: initialData.discount_rate?.toString() || '0',
                price: initialData.price.toString(),
                category: initialData.category,
                images: images.join('\n'),
                story_content: initialData.story_content || '',
                is_best: initialData.is_best || false,
                is_new: initialData.is_new || false
            });
            setImageUrls(images);
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
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const addImageUrl = () => {
        if (newImageUrl.trim() && !imageUrls.includes(newImageUrl.trim())) {
            const updated = [...imageUrls, newImageUrl.trim()];
            setImageUrls(updated);
            setFormData(prev => ({ ...prev, images: updated.join('\n') }));
            setNewImageUrl('');
        }
    };

    const removeImage = (index: number) => {
        const updated = imageUrls.filter((_, i) => i !== index);
        setImageUrls(updated);
        setFormData(prev => ({ ...prev, images: updated.join('\n') }));
    };

    const moveImage = (index: number, direction: 'up' | 'down') => {
        if (
            (direction === 'up' && index === 0) ||
            (direction === 'down' && index === imageUrls.length - 1)
        ) return;

        const newIndex = direction === 'up' ? index - 1 : index + 1;
        const updated = [...imageUrls];
        [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
        setImageUrls(updated);
        setFormData(prev => ({ ...prev, images: updated.join('\n') }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (imageUrls.length === 0) {
            alert('최소 1개의 이미지를 등록해주세요.');
            return;
        }

        const productPayload: any = {
            name: formData.name,
            brand: formData.brand,
            price: Number(formData.price),
            original_price: Number(formData.original_price),
            discount_rate: Number(formData.discount_rate),
            category: formData.category,
            images: imageUrls,
            story_content: formData.story_content,
            is_best: formData.is_best,
            is_new: formData.is_new
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
        <form onSubmit={handleSubmit} className="max-w-3xl bg-white p-8 rounded border shadow-sm">
            <h2 className="text-xl font-bold mb-6 font-mono tracking-tight uppercase">{isEdit ? 'Edit Product' : 'Register New Product'}</h2>

            <div className="space-y-6">
                {/* Basic Info */}
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

                {/* Pricing */}
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

                {/* Category */}
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

                {/* Image Management */}
                <div>
                    <label className="block text-[10px] font-mono font-bold text-gray-400 mb-2 uppercase tracking-widest">
                        Product Images ({imageUrls.length}개)
                    </label>

                    {/* Image Preview Grid */}
                    {imageUrls.length > 0 && (
                        <div className="grid grid-cols-4 gap-3 mb-4">
                            {imageUrls.map((url, index) => (
                                <div key={index} className="relative group border rounded overflow-hidden bg-gray-50">
                                    <div className="relative aspect-[3/4]">
                                        <Image
                                            src={url}
                                            alt={`Product image ${index + 1}`}
                                            fill
                                            className="object-cover"
                                            unoptimized
                                        />
                                    </div>
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                                        <button
                                            type="button"
                                            onClick={() => moveImage(index, 'up')}
                                            disabled={index === 0}
                                            className="w-6 h-6 bg-white rounded text-xs disabled:opacity-30"
                                        >
                                            ←
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => moveImage(index, 'down')}
                                            disabled={index === imageUrls.length - 1}
                                            className="w-6 h-6 bg-white rounded text-xs disabled:opacity-30"
                                        >
                                            →
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => removeImage(index)}
                                            className="w-6 h-6 bg-red-500 text-white rounded text-xs"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                    {index === 0 && (
                                        <div className="absolute top-1 left-1 bg-black text-white text-[8px] px-1.5 py-0.5 rounded font-mono">
                                            MAIN
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Add Image URL */}
                    <div className="flex gap-2">
                        <input
                            type="url"
                            value={newImageUrl}
                            onChange={(e) => setNewImageUrl(e.target.value)}
                            placeholder="https://example.com/image.jpg"
                            className="flex-1 border p-2 rounded text-sm font-mono focus:border-black outline-none"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    addImageUrl();
                                }
                            }}
                        />
                        <button
                            type="button"
                            onClick={addImageUrl}
                            className="px-4 py-2 bg-gray-100 border rounded text-sm font-mono hover:bg-gray-200 transition-colors"
                        >
                            + 추가
                        </button>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                        이미지 URL을 입력하고 추가 버튼을 클릭하세요. 첫 번째 이미지가 대표 이미지로 사용됩니다.
                    </p>
                </div>

                {/* Description */}
                <div>
                    <label className="block text-[10px] font-mono font-bold text-gray-400 mb-1 uppercase tracking-widest">Description (Markdown)</label>
                    <textarea
                        name="story_content"
                        value={formData.story_content}
                        onChange={handleChange}
                        className="w-full border p-3 rounded h-48 focus:border-black outline-none transition-colors text-sm"
                        placeholder="상품 설명을 마크다운 형식으로 입력하세요...&#10;&#10;예시:&#10;## 특징&#10;- 고급 소재 사용&#10;- 편안한 착용감"
                    />
                    <p className="text-xs text-gray-400 mt-1">
                        마크다운 문법을 지원합니다. ##(제목), -(목록), **(강조) 등을 사용하세요.
                    </p>
                </div>

                {/* Exposure Settings */}
                <div className="flex gap-6 p-4 bg-gray-50 rounded border">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            name="is_best"
                            checked={formData.is_best}
                            onChange={handleChange}
                            className="w-4 h-4 accent-black"
                        />
                        <span className="text-sm font-bold">주간 베스트 (Weekly Best)</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            name="is_new"
                            checked={formData.is_new}
                            onChange={handleChange}
                            className="w-4 h-4 accent-black"
                        />
                        <span className="text-sm font-bold">신상품 (New Arrival)</span>
                    </label>
                </div>

                {/* Submit */}
                <div className="pt-4 border-t flex justify-end gap-2">
                    <button type="button" onClick={() => router.back()} className="px-6 py-2 border rounded text-xs font-mono font-bold uppercase hover:bg-gray-50 transition-colors">Cancel</button>
                    <button type="submit" className="px-6 py-2 bg-black text-white rounded text-xs font-mono font-bold uppercase hover:bg-gray-800 transition-colors">
                        {isEdit ? 'Update Product' : 'Register Product'}
                    </button>
                </div>
            </div>
        </form>
    );
}
