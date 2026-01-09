// app/shop/[id]/page.tsx
'use client';

import ProductStory from '@/components/product/ProductStory';
import BuyBox from '@/components/product/BuyBox';
import ReviewSection from '@/components/board/ReviewSection';
import InquirySection from '@/components/board/InquirySection';
import { getProductById } from '@/utils/productStorage';
import { Product } from '@/types';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState, use } from 'react';

type Props = {
    params: Promise<{ id: string }>;
};

export default function ProductDetailPage(props: Props) {
    const { id } = use(props.params);
    const { user } = useAuth();
    const [product, setProduct] = useState<Product | null>(null);
    const [selectedImage, setSelectedImage] = useState(0);

    useEffect(() => {
        const fetchProduct = async () => {
            const fetchedProduct = await getProductById(id);
            setProduct(fetchedProduct || null);
        };
        fetchProduct();
    }, [id]);

    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-pulse text-gray-400 font-mono text-sm">
                    [ 로딩 중... ]
                </div>
            </div>
        );
    }

    const images = product.images && product.images.length > 0
        ? product.images
        : ['https://images.unsplash.com/photo-1434389677669-e08b4cac3105?q=80&w=800'];

    return (
        <div className="min-h-screen bg-editorial-grid">
            {/* Breadcrumb */}
            <div className="max-w-[1920px] mx-auto px-6 lg:px-12 py-4">
                <nav className="text-xs uppercase tracking-widest text-gray-400 flex items-center gap-2">
                    <Link href="/shop" className="hover:text-[var(--primary)]">쇼핑</Link>
                    <span>/</span>
                    <span className="text-gray-600">{product.category}</span>
                    <span>/</span>
                    <span className="text-[var(--neural-black)]">{product.name}</span>

                    {(user as any)?.isAdmin && (
                        <Link
                            href={`/admin/products/edit?id=${product.id}`}
                            className="ml-auto text-[var(--primary)] hover:underline"
                        >
                            [ 수정 ]
                        </Link>
                    )}
                </nav>
            </div>

            {/* Product Section */}
            <div className="max-w-[1920px] mx-auto px-6 lg:px-12 py-8">
                <div className="flex flex-col lg:flex-row gap-12 lg:gap-24">

                    {/* Left: Image Gallery */}
                    <div className="w-full lg:w-7/12">
                        {/* Main Image */}
                        <div className="relative aspect-[4/5] bg-gray-50 mb-4 overflow-hidden">
                            <Image
                                src={images[selectedImage]}
                                alt={product.name}
                                fill
                                unoptimized
                                className="object-cover transition-transform duration-700 hover:scale-105"
                            />

                            {/* Image Counter */}
                            <div className="absolute bottom-4 right-4 bg-white/80 backdrop-blur px-3 py-1 text-xs font-mono">
                                {selectedImage + 1} / {images.length}
                            </div>
                        </div>

                        {/* Thumbnail Row */}
                        {images.length > 1 && (
                            <div className="flex gap-2 overflow-x-auto pb-2">
                                {images.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedImage(idx)}
                                        className={`relative w-20 h-24 flex-shrink-0 border-2 transition-colors ${selectedImage === idx
                                                ? 'border-[var(--primary)]'
                                                : 'border-transparent hover:border-gray-300'
                                            }`}
                                    >
                                        <Image
                                            src={img}
                                            alt={`${product.name} ${idx + 1}`}
                                            fill
                                            unoptimized
                                            className="object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right: Product Info */}
                    <div className="w-full lg:w-5/12">
                        <div className="lg:sticky lg:top-28">
                            {/* Brand */}
                            {product.brand && (
                                <p className="text-[10px] uppercase tracking-[0.3em] text-gray-400 mb-2">
                                    {product.brand}
                                </p>
                            )}

                            {/* Product Name */}
                            <h1 className="text-3xl lg:text-4xl font-serif leading-snug mb-6">
                                {product.name}
                            </h1>

                            {/* Price */}
                            <div className="flex items-baseline gap-3 mb-8 font-mono">
                                {product.discount_rate && product.discount_rate > 0 ? (
                                    <>
                                        <span className="text-2xl font-bold text-[var(--primary)]">
                                            ₩{product.price.toLocaleString()}
                                        </span>
                                        <span className="text-lg text-gray-400 line-through">
                                            ₩{product.original_price?.toLocaleString()}
                                        </span>
                                        <span className="text-sm text-[var(--primary)] font-bold">
                                            {product.discount_rate}% OFF
                                        </span>
                                    </>
                                ) : (
                                    <span className="text-2xl font-semibold">
                                        ₩{product.price.toLocaleString()}
                                    </span>
                                )}
                            </div>

                            {/* Divider */}
                            <div className="h-px bg-gray-200 mb-8"></div>

                            {/* Buy Box */}
                            <BuyBox product={product} />

                            {/* Specs */}
                            <div className="mt-10">
                                <h3 className="text-xs font-bold uppercase tracking-widest mb-4">
                                    [ 상품 정보 ]
                                </h3>
                                <div className="space-y-0">
                                    <div className="nd-spec-row">
                                        <span className="nd-spec-label">카테고리</span>
                                        <span className="nd-spec-value">{product.category}</span>
                                    </div>
                                    {product.brand && (
                                        <div className="nd-spec-row">
                                            <span className="nd-spec-label">브랜드</span>
                                            <span className="nd-spec-value">{product.brand}</span>
                                        </div>
                                    )}
                                    <div className="nd-spec-row">
                                        <span className="nd-spec-label">상품 코드</span>
                                        <span className="nd-spec-value font-mono text-sm">{product.id}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Story Section */}
            {product.story_content && (
                <div className="max-w-4xl mx-auto px-6 lg:px-12 py-24">
                    <h2 className="text-xs font-bold uppercase tracking-widest mb-8 text-center">
                        [ 에디토리얼 ]
                    </h2>
                    <ProductStory story={product.story_content} />
                </div>
            )}

            {/* Reviews & QA */}
            <div className="border-t border-gray-100">
                <div className="max-w-4xl mx-auto px-6 lg:px-12 py-16">
                    <div id="reviews" className="mb-16">
                        <h2 className="text-xs font-bold uppercase tracking-widest mb-8">
                            [ 리뷰 ]
                        </h2>
                        <ReviewSection productId={product.id} />
                    </div>
                    <div id="inquiries">
                        <h2 className="text-xs font-bold uppercase tracking-widest mb-8">
                            [ 상품 문의 ]
                        </h2>
                        <InquirySection productId={product.id} />
                    </div>
                </div>
            </div>
        </div>
    );
}
