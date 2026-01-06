// app/admin/board/page.tsx
'use client';

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { getNotices, addNotice, getFAQs, addFAQ, getAllOneToOneInquiries, getAllReviews, initializeBoardData } from "@/utils/boardStorage";
import { Notice, FAQ, OneToOneInquiry, Review } from "@/types";

export default function AdminBoardPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const tab = searchParams?.get('tab') || 'notice';

    // Data States
    const [notices, setNotices] = useState<Notice[]>([]);
    const [faqs, setFaqs] = useState<FAQ[]>([]);
    const [inquiries, setInquiries] = useState<OneToOneInquiry[]>([]);
    const [reviews, setReviews] = useState<Review[]>([]);

    // Form States
    const [showForm, setShowForm] = useState(false);

    // Notice Form
    const [noticeForm, setNoticeForm] = useState({ title: '', content: '', category: 'StyleShop', author: 'Admin' });

    // FAQ Form
    const [faqForm, setFaqForm] = useState({ question: '', answer: '', category: '주문' });

    useEffect(() => {
        initializeBoardData(); // Initialize dummy data if empty
        refreshData();
    }, [tab]);

    const refreshData = () => {
        if (tab === 'notice') setNotices(getNotices());
        if (tab === 'faq') setFaqs(getFAQs());
        if (tab === 'inquiry') setInquiries(getAllOneToOneInquiries());
        if (tab === 'review') setReviews(getAllReviews());
    };

    const handleTabChange = (newTab: string) => {
        router.push(`/admin/board?tab=${newTab}`);
        setShowForm(false);
    };

    const handleNoticeSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        addNotice(noticeForm as any);
        setShowForm(false);
        refreshData();
        setNoticeForm({ title: '', content: '', category: 'StyleShop', author: 'Admin' });
    };

    const handleFAQSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        addFAQ(faqForm);
        setShowForm(false);
        refreshData();
        setFaqForm({ question: '', answer: '', category: '주문' });
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">게시판 관리</h1>
            </div>

            <div className="bg-white border rounded p-6 min-h-[500px]">
                {/* NOTICE TAB */}
                {tab === 'notice' && (
                    <>
                        <div className="flex justify-between mb-4">
                            <h2 className="text-lg font-bold">공지사항 목록</h2>
                            <button
                                onClick={() => setShowForm(!showForm)}
                                className="bg-blue-600 text-white px-4 py-2 text-sm rounded font-bold"
                            >
                                {showForm ? '닫기' : '+ 공지 등록'}
                            </button>
                        </div>

                        {showForm && (
                            <form onSubmit={handleNoticeSubmit} className="mb-8 p-4 bg-gray-50 border rounded">
                                <div className="grid gap-4">
                                    <input
                                        type="text"
                                        placeholder="제목"
                                        className="border p-2 w-full"
                                        value={noticeForm.title}
                                        onChange={e => setNoticeForm({ ...noticeForm, title: e.target.value })}
                                        required
                                    />
                                    <select
                                        className="border p-2 w-full"
                                        value={noticeForm.category}
                                        onChange={e => setNoticeForm({ ...noticeForm, category: e.target.value as 'StyleShop' | 'Customer' })}
                                    >
                                        <option value="StyleShop">스타일 숍</option>
                                        <option value="Customer">고객센터</option>
                                    </select>
                                    <textarea
                                        placeholder="내용"
                                        className="border p-2 w-full h-32"
                                        value={noticeForm.content}
                                        onChange={e => setNoticeForm({ ...noticeForm, content: e.target.value })}
                                        required
                                    />
                                    <button className="bg-black text-white py-2 font-bold rounded">등록하기</button>
                                </div>
                            </form>
                        )}

                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="p-3">분류</th>
                                    <th className="p-3">제목</th>
                                    <th className="p-3">작성일</th>
                                    <th className="p-3">작성자</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {notices.map(n => (
                                    <tr key={n.id} className="hover:bg-gray-50">
                                        <td className="p-3">
                                            <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">{n.category}</span>
                                        </td>
                                        <td className="p-3 font-medium">{n.title}</td>
                                        <td className="p-3 text-gray-400">{new Date(n.createdAt).toLocaleDateString()}</td>
                                        <td className="p-3">{n.author}</td>
                                    </tr>
                                ))}
                                {notices.length === 0 && <tr><td colSpan={4} className="p-10 text-center text-gray-400">데이터가 없습니다.</td></tr>}
                            </tbody>
                        </table>
                    </>
                )}

                {/* FAQ TAB */}
                {tab === 'faq' && (
                    <>
                        <div className="flex justify-between mb-4">
                            <h2 className="text-lg font-bold">FAQ 관리</h2>
                            <button
                                onClick={() => setShowForm(!showForm)}
                                className="bg-blue-600 text-white px-4 py-2 text-sm rounded font-bold"
                            >
                                {showForm ? '닫기' : '+ FAQ 등록'}
                            </button>
                        </div>

                        {showForm && (
                            <form onSubmit={handleFAQSubmit} className="mb-8 p-4 bg-gray-50 border rounded">
                                <div className="grid gap-4">
                                    <input
                                        type="text"
                                        placeholder="질문 (Q)"
                                        className="border p-2 w-full"
                                        value={faqForm.question}
                                        onChange={e => setFaqForm({ ...faqForm, question: e.target.value })}
                                        required
                                    />
                                    <select
                                        className="border p-2 w-full"
                                        value={faqForm.category}
                                        onChange={e => setFaqForm({ ...faqForm, category: e.target.value })}
                                        required
                                    >
                                        <option value="사이즈">사이즈</option>
                                        <option value="주문">주문</option>
                                        <option value="교환/환불">교환/환불</option>
                                        <option value="배송">배송</option>
                                        <option value="웹페이지 문제">웹페이지 문제</option>
                                        <option value="기타">기타</option>
                                    </select>
                                    <textarea
                                        placeholder="답변 (A)"
                                        className="border p-2 w-full h-32"
                                        value={faqForm.answer}
                                        onChange={e => setFaqForm({ ...faqForm, answer: e.target.value })}
                                        required
                                    />
                                    <button className="bg-black text-white py-2 font-bold rounded">등록하기</button>
                                </div>
                            </form>
                        )}

                        <div className="space-y-4">
                            {faqs.map(f => (
                                <div key={f.id} className="border p-4 rounded bg-gray-50">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="bg-gray-200 text-xs px-2 py-1 rounded">{f.category}</span>
                                        <span className="font-bold">Q. {f.question}</span>
                                    </div>
                                    <p className="pl-2 text-sm text-gray-600">A. {f.answer}</p>
                                </div>
                            ))}
                            {faqs.length === 0 && <div className="p-10 text-center text-gray-400">데이터가 없습니다.</div>}
                        </div>
                    </>
                )}

                {/* INQUIRY TAB */}
                {tab === 'inquiry' && (
                    <>
                        <h2 className="text-lg font-bold mb-4">1:1 문의 내역</h2>
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="p-3">상태</th>
                                    <th className="p-3">유형</th>
                                    <th className="p-3">제목</th>
                                    <th className="p-3">작성일</th>
                                    <th className="p-3">관리</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {inquiries.map(i => (
                                    <tr key={i.id} className="hover:bg-gray-50">
                                        <td className="p-3">
                                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${i.status === 'Answered' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                                {i.status === 'Answered' ? '답변완료' : '대기중'}
                                            </span>
                                        </td>
                                        <td className="p-3 text-gray-500">{i.category}</td>
                                        <td className="p-3 font-medium">{i.title}</td>
                                        <td className="p-3 text-gray-400">{new Date(i.createdAt).toLocaleDateString()}</td>
                                        <td className="p-3">
                                            <button className="text-blue-600 underline text-xs">답변하기</button>
                                        </td>
                                    </tr>
                                ))}
                                {inquiries.length === 0 && <tr><td colSpan={5} className="p-10 text-center text-gray-400">문의 내역이 없습니다.</td></tr>}
                            </tbody>
                        </table>
                    </>
                )}

                {/* REVIEW TAB */}
                {tab === 'review' && (
                    <>
                        <h2 className="text-lg font-bold mb-4">상품 후기 관리</h2>
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="p-3">별점</th>
                                    <th className="p-3">상품ID</th>
                                    <th className="p-3">내용</th>
                                    <th className="p-3">작성자</th>
                                    <th className="p-3">작성일</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {reviews.map(r => (
                                    <tr key={r.id} className="hover:bg-gray-50">
                                        <td className="p-3 text-yellow-500">{'★'.repeat(r.rating)}</td>
                                        <td className="p-3 text-xs text-gray-400">{r.productId.substring(0, 8)}...</td>
                                        <td className="p-3">{r.content}</td>
                                        <td className="p-3 text-gray-600">{r.userName}</td>
                                        <td className="p-3 text-gray-400">{new Date(r.createdAt).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                                {reviews.length === 0 && <tr><td colSpan={5} className="p-10 text-center text-gray-400">데이터가 없습니다.</td></tr>}
                            </tbody>
                        </table>
                    </>
                )}
            </div>
        </div>
    );
}
