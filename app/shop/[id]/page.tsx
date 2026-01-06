// app/shop/[id]/page.tsx
'use client';

import ProductStory from '@/components/product/ProductStory';
import BuyBox from '@/components/product/BuyBox';
import ReviewSection from '@/components/board/ReviewSection';
import InquirySection from '@/components/board/InquirySection';
import Breadcrumb from '@/components/ui/Breadcrumb';
import { getProductById } from '@/utils/productStorage';
import { Product } from '@/types';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { useEffect, useState, use } from 'react';

type Props = {
    params: Promise<{ id: string }>;
};

export default function ProductDetailPage(props: Props) {
    const { id } = use(props.params);
    const { user } = useAuth();
    const [product, setProduct] = useState<Product | null>(null);

    useEffect(() => {
        const fetchedProduct = getProductById(id);
        setProduct(fetchedProduct || null);
    }, [id]);

    if (!product) {
        return <div className="container mx-auto px-4 py-8">Loading...</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-6 flex items-center justify-between">
                <Breadcrumb
                    items={[
                        { label: 'Shop', href: '/shop' },
                        { label: product.category, href: '/shop' },
                        { label: product.name },
                    ]}
                />
                {(user as any)?.isAdmin && (
                    <Link
                        href={`/admin/products/edit?id=${product.id}`}
                        className="bg-red-600 text-white px-4 py-2 rounded text-sm font-bold hover:bg-red-700 transition-colors flex items-center gap-2"
                    >
                        <span>✏️</span>
                        <span>수정</span>
                    </Link>
                )}
            </div>

            <div className="flex flex-col lg:flex-row gap-16">
                {/* Left: Editorial Content (Story) */}
                <div className="w-full lg:w-2/3">
                    <ProductStory story={product.story_content || `# ${product.name}\n\n${product.category}`} />
                </div>

                {/* Right: Sticky Buy Box */}
                <div className="w-full lg:w-1/3 relative">
                    <div className="lg:sticky lg:top-24">
                        <BuyBox product={product} />
                    </div>
                </div>
            </div>

            {/* Bottom: Reviews & Q&A */}
            <div className="mt-24 border-t pt-12">
                <div className="max-w-4xl">
                    <div id="reviews" className="mb-16">
                        <ReviewSection productId={product.id} />
                    </div>
                    <div id="inquiries">
                        <InquirySection productId={product.id} />
                    </div>
                </div>
            </div>
        </div>
    );
}
