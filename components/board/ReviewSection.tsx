// components/board/ReviewSection.tsx
'use client';

import { useAuth } from "@/context/AuthContext";
import { addReview, getReviews, Review } from "@/utils/boardStorage";
import { useEffect, useState } from "react";
import Image from "next/image"; // Import Image component

export default function ReviewSection({ productId }: { productId: string }) {
    const { user } = useAuth();
    const [reviews, setReviews] = useState<Review[]>([]);
    const [showForm, setShowForm] = useState(false);

    // Form Inputs
    const [rating, setRating] = useState(5);
    const [content, setContent] = useState('');
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    useEffect(() => {
        setReviews(getReviews(productId));
    }, [productId]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return alert('로그인이 필요합니다.');

        addReview({
            productId,
            userId: user.email,
            userName: user.name,
            rating,
            content,
            images: imagePreview ? [imagePreview] : []
        });

        alert('리뷰가 등록되었습니다!');
        setReviews(getReviews(productId)); // Refresh list

        // Reset form
        setContent('');
        setRating(5);
        setImagePreview(null);
        setShowForm(false);
    };

    return (
        <div className="py-8">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">상품 구매 후기 ({reviews.length})</h3>
                <button
                    onClick={() => {
                        if (!user) return alert("로그인 후 이용 가능합니다.");
                        setShowForm(!showForm);
                    }}
                    className="bg-black text-white px-4 py-2 text-sm font-bold"
                >
                    상품 리뷰 작성
                </button>
            </div>

            {/* Write Form */}
            {showForm && (
                <div className="mb-8 p-6 bg-gray-50 border">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold mb-1">별점</label>
                            <div className="flex gap-2">
                                {[1, 2, 3, 4, 5].map(star => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setRating(star)}
                                        className={`text-2xl ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
                                    >
                                        ★
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-bold mb-1">사진 첨부</label>
                            <input type="file" accept="image/*" onChange={handleImageChange} className="text-sm" />
                            {imagePreview && (
                                <div className="mt-2 w-20 h-20 relative border">
                                    <Image
                                        src={imagePreview}
                                        alt="Preview"
                                        fill
                                        className="object-cover"
                                        unoptimized // Using data URL
                                    />
                                </div>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-bold mb-1">리뷰 내용</label>
                            <textarea
                                required
                                className="w-full border p-2 h-24 resize-none"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="상품에 대한 솔직한 리뷰를 남겨주세요."
                            />
                        </div>
                        <button type="submit" className="w-full bg-black text-white py-3 font-bold">
                            리뷰 등록하기
                        </button>
                    </form>
                </div>
            )}

            {/* List */}
            <div className="space-y-6">
                {reviews.map(review => (
                    <div key={review.id} className="border-b pb-6">
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <div className="flex text-yellow-400 text-sm mb-1">
                                    {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                                </div>
                                <span className="font-bold mr-2">{review.userName}</span>
                                <span className="text-xs text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                        <p className="text-sm text-gray-700 whitespace-pre-wrap mb-3">{review.content}</p>
                        {review.images.length > 0 && (
                            <div className="flex gap-2">
                                {review.images.map((img, idx) => (
                                    <div key={idx} className="relative w-24 h-24 border">
                                        <Image
                                            src={img}
                                            alt="Review Photo"
                                            fill
                                            className="object-cover"
                                            unoptimized
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
                {reviews.length === 0 && (
                    <p className="text-center text-gray-400 py-10">등록된 리뷰가 없습니다.</p>
                )}
            </div>
        </div>
    );
}
