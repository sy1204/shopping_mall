// components/board/OneToOneSection.tsx
'use client';

import { useAuth } from "@/context/AuthContext";
import { addOneToOneInquiry, getMyInquiries } from "@/utils/boardStorage";
import { OneToOneInquiry } from "@/types";
import { useEffect, useState } from "react";

export default function OneToOneSection() {
    const { user } = useAuth();
    const [inquiries, setInquiries] = useState<OneToOneInquiry[]>([]);
    const [showForm, setShowForm] = useState(false);

    // Form
    const [category, setCategory] = useState('주문/결제');
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    useEffect(() => {
        if (user) {
            setInquiries(getMyInquiries(user.email));
        }
    }, [user]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        addOneToOneInquiry({
            userId: user.email,
            category,
            title,
            content
        });

        alert('문의가 등록되었습니다.');
        setInquiries(getMyInquiries(user.email));

        // Reset
        setTitle('');
        setContent('');
        setShowForm(false);
    };

    return (
        <div className="mt-8">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">1:1 문의 내역</h2>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-black text-white px-4 py-2 text-sm font-bold"
                >
                    문의하기
                </button>
            </div>

            {showForm && (
                <div className="bg-gray-50 p-6 border mb-8">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold mb-1">카테고리</label>
                            <select
                                className="w-full border p-2"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                            >
                                <option>주문/결제</option>
                                <option>배송문의</option>
                                <option>상품문의</option>
                                <option>기타</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold mb-1">제목</label>
                            <input
                                type="text"
                                required
                                className="w-full border p-2"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold mb-1">내용</label>
                            <textarea
                                required
                                className="w-full border p-2 h-32 resize-none"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                            />
                        </div>
                        <button type="submit" className="w-full bg-black text-white py-3 font-bold">
                            등록하기
                        </button>
                    </form>
                </div>
            )}

            <div className="border-t">
                <div className="grid grid-cols-12 bg-gray-100 p-2 text-sm font-bold text-center">
                    <div className="col-span-2">작성일</div>
                    <div className="col-span-2">카테고리</div>
                    <div className="col-span-6">제목</div>
                    <div className="col-span-2">상태</div>
                </div>
                {inquiries.map(inq => (
                    <div key={inq.id} className="grid grid-cols-12 p-3 text-sm border-b hover:bg-gray-50 items-center text-center">
                        <div className="col-span-2 text-gray-500">{new Date(inq.createdAt).toLocaleDateString()}</div>
                        <div className="col-span-2">{inq.category}</div>
                        <div className="col-span-6 text-left px-2 font-medium truncate cursor-pointer">
                            {inq.title}
                        </div>
                        <div className="col-span-2">
                            <span className={`px-2 py-1 rounded text-xs ${inq.status === 'Answered' ? 'bg-blue-100 text-blue-600' : 'bg-gray-200 text-gray-600'}`}>
                                {inq.status === 'Answered' ? '답변완료' : '대기중'}
                            </span>
                        </div>
                    </div>
                ))}
                {inquiries.length === 0 && (
                    <div className="py-10 text-center text-gray-400">
                        문의 내역이 없습니다.
                    </div>
                )}
            </div>
        </div>
    );
}
