// components/board/InquirySection.tsx
'use client';

import { useAuth } from "@/context/AuthContext";
import { addProductInquiry, getProductInquiries } from "@/utils/boardStorage";
import { ProductInquiry } from "@/types";
import { useEffect, useState } from "react";

export default function InquirySection({ productId }: { productId: string }) {
    const { user } = useAuth();
    const [inquiries, setInquiries] = useState<ProductInquiry[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [content, setContent] = useState('');
    const [isSecret, setIsSecret] = useState(false);

    useEffect(() => {
        const fetchInquiries = async () => {
            const data = await getProductInquiries(productId);
            setInquiries(data);
        };
        fetchInquiries();
    }, [productId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !user.id) return alert('로그인이 필요합니다.');

        await addProductInquiry({
            productId,
            userId: user.id,
            userName: user.name,
            content,
            isSecret
        });

        alert('문의가 등록되었습니다!');
        const updated = await getProductInquiries(productId);
        setInquiries(updated);
        setContent('');
        setIsSecret(false);
        setShowForm(false);
    };

    return (
        <div className="py-8">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">상품 Q&A ({inquiries.length})</h3>
                <button
                    onClick={() => {
                        if (!user) return alert("로그인 후 이용 가능합니다.");
                        setShowForm(!showForm);
                    }}
                    className="bg-white border border-black text-black px-4 py-2 text-sm font-bold hover:bg-black hover:text-white transition-colors"
                >
                    상품 문의하기
                </button>
            </div>

            {showForm && (
                <div className="mb-8 p-6 bg-gray-50 border">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="flex items-center gap-2 mb-2">
                            <input
                                type="checkbox"
                                id="secret"
                                checked={isSecret}
                                onChange={(e) => setIsSecret(e.target.checked)}
                            />
                            <label htmlFor="secret" className="text-sm">비밀글 설정</label>
                        </div>
                        <textarea
                            required
                            className="w-full border p-2 h-24 resize-none"
                            placeholder="문의 내용을 입력해주세요."
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        />
                        <button type="submit" className="w-full bg-black text-white py-3 font-bold">
                            문의 등록하기
                        </button>
                    </form>
                </div>
            )}

            <div className="space-y-4">
                {inquiries.map(inq => (
                    <div key={inq.id} className="border-b pb-4">
                        <div className="flex gap-2 items-center text-sm mb-1">
                            {inq.isSecret && <span className="text-red-500">🔒 비밀글</span>}
                            {!inq.answer ? <span className="bg-gray-200 px-1.5 py-0.5 text-xs text-gray-600 rounded">대기중</span> : <span className="bg-black text-white px-1.5 py-0.5 text-xs rounded">답변완료</span>}
                            <span className="font-bold">{inq.userName}</span>
                            <span className="text-gray-400 text-xs">{new Date(inq.createdAt).toLocaleDateString()}</span>
                        </div>
                        <p className="text-sm text-gray-700">
                            {inq.isSecret && inq.userId !== user?.email ? '비밀글입니다.' : inq.content}
                        </p>
                        {inq.answer && (
                            <div className="mt-3 bg-gray-50 p-3 text-sm">
                                <span className="font-bold block mb-1">A.</span>
                                {inq.answer}
                            </div>
                        )}
                    </div>
                ))}
                {inquiries.length === 0 && (
                    <p className="text-center text-gray-400 py-10">등록된 문의가 없습니다.</p>
                )}
            </div>
        </div>
    );
}
