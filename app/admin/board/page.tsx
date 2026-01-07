'use client';

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
    getNotices, addNotice, getFAQs, addFAQ,
    getAllOneToOneInquiries, getAllReviews, getAllProductInquiries,
    initializeBoardData, updateOneToOneInquiry, updateProductInquiry
} from "@/utils/boardStorage";
import { Notice, FAQ, OneToOneInquiry, Review, ProductInquiry, Order, User, Product } from "@/types";
import { useToast } from "@/context/ToastContext";
import { getUserByEmail } from "@/utils/userStorage";
import { getOrders } from "@/utils/orderStorage";
import { getProductById } from "@/utils/productStorage";
import Image from "next/image";

type InquiryType = 'oto' | 'product';

export default function AdminBoardPage() {
    const { showToast } = useToast();
    const searchParams = useSearchParams();
    const router = useRouter();
    const tab = searchParams?.get('tab') || 'notice';

    // Data States
    const [notices, setNotices] = useState<Notice[]>([]);
    const [faqs, setFaqs] = useState<FAQ[]>([]);
    const [inquiries, setInquiries] = useState<OneToOneInquiry[]>([]);
    const [productInquiries, setProductInquiries] = useState<ProductInquiry[]>([]);
    const [reviews, setReviews] = useState<Review[]>([]);

    // Form States
    const [showForm, setShowForm] = useState(false);

    // Notice Form
    const [noticeForm, setNoticeForm] = useState({ title: '', content: '', category: 'StyleShop', author: 'Admin' });

    // FAQ Form
    const [faqForm, setFaqForm] = useState({ question: '', answer: '', category: '주문' });

    // Answer Modal State
    const [selectedInquiry, setSelectedInquiry] = useState<OneToOneInquiry | ProductInquiry | null>(null);
    const [selectedInquiryType, setSelectedInquiryType] = useState<InquiryType>('oto');
    const [answerText, setAnswerText] = useState('');

    // Customer Info State for Modal
    const [customerInfo, setCustomerInfo] = useState<{ user?: User, orders: Order[], product?: Product } | null>(null);

    useEffect(() => {
        initializeBoardData();
        refreshData();
    }, [tab]);

    const refreshData = () => {
        if (tab === 'notice') setNotices(getNotices());
        if (tab === 'faq') setFaqs(getFAQs());
        if (tab === 'inquiry') setInquiries(getAllOneToOneInquiries());
        if (tab === 'product_inquiry') setProductInquiries(getAllProductInquiries());
        if (tab === 'review') setReviews(getAllReviews());
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

    const openAnswerModal = (inquiry: OneToOneInquiry | ProductInquiry, type: InquiryType) => {
        setSelectedInquiry(inquiry);
        setSelectedInquiryType(type);
        setAnswerText(inquiry.answer || '');

        // Fetch Customer Info
        const userId = inquiry.userId;
        const user = getUserByEmail(userId);
        const orders = getOrders(userId); // Fetches orders for this user

        // Fetch Product Info if applicable
        let product: Product | undefined;
        if (type === 'product' && 'productId' in inquiry) {
            product = getProductById((inquiry as ProductInquiry).productId);
        }

        setCustomerInfo({ user, orders, product });
    };

    const handleAnswerSubmit = () => {
        if (!selectedInquiry || !answerText.trim()) {
            showToast('답변 내용을 입력해주세요.', 'error');
            return;
        }

        if (selectedInquiryType === 'oto') {
            updateOneToOneInquiry(selectedInquiry.id, {
                answer: answerText.trim(),
                status: 'Answered'
            });
        } else {
            updateProductInquiry(selectedInquiry.id, {
                answer: answerText.trim()
                // ProductInquiry doesn't strictly have 'status' in interface but we can assume answer presence = done
            });
        }

        refreshData();
        setSelectedInquiry(null);
        setAnswerText('');
        setCustomerInfo(null);
        showToast('답변이 등록되었습니다.', 'success');
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">게시판 관리</h1>
                <div className="flex gap-2 text-sm">
                    {/* Simple Tabs for easier navigation inside page if needed */}
                    {[
                        { id: 'notice', label: '공지사항' },
                        { id: 'faq', label: 'FAQ' },
                        { id: 'inquiry', label: '1:1문의' },
                        { id: 'product_inquiry', label: '상품문의' },
                        { id: 'review', label: '상품후기' }
                    ].map(t => (
                        <button
                            key={t.id}
                            onClick={() => router.push(`/admin/board?tab=${t.id}`)}
                            className={`px-3 py-1 rounded border ${tab === t.id ? 'bg-black text-white' : 'bg-white hover:bg-gray-50'}`}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>
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

                {/* 1:1 INQUIRY TAB */}
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
                                        <td className="p-3">
                                            <div className="font-medium">{i.title}</div>
                                            {i.answer && (
                                                <div className="mt-1 text-xs text-blue-600">
                                                    답변: {i.answer.length > 40 ? `${i.answer.slice(0, 40)}...` : i.answer}
                                                </div>
                                            )}
                                        </td>
                                        <td className="p-3 text-gray-400">{new Date(i.createdAt).toLocaleDateString()}</td>
                                        <td className="p-3">
                                            <button
                                                onClick={() => openAnswerModal(i, 'oto')}
                                                className="px-3 py-1.5 text-xs border rounded hover:bg-black hover:text-white transition-colors"
                                            >
                                                {i.answer ? '수정' : '답변'}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {inquiries.length === 0 && <tr><td colSpan={5} className="p-10 text-center text-gray-400">문의 내역이 없습니다.</td></tr>}
                            </tbody>
                        </table>
                    </>
                )}

                {/* PRODUCT INQUIRY TAB */}
                {tab === 'product_inquiry' && (
                    <>
                        <h2 className="text-lg font-bold mb-4">상품 문의 관리</h2>
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="p-3">상태</th>
                                    <th className="p-3">작성자</th>
                                    <th className="p-3">내용</th>
                                    <th className="p-3">작성일</th>
                                    <th className="p-3">관리</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {productInquiries.map(i => (
                                    <tr key={i.id} className="hover:bg-gray-50">
                                        <td className="p-3">
                                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${i.answer ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                                {i.answer ? '답변완료' : '대기중'}
                                            </span>
                                        </td>
                                        <td className="p-3">{i.userName}</td>
                                        <td className="p-3">
                                            <div className="font-medium max-w-md truncate">{i.content}</div>
                                            {i.isSecret && <span className="text-xs text-gray-400">🔒 비밀글</span>}
                                        </td>
                                        <td className="p-3 text-gray-400">{new Date(i.createdAt).toLocaleDateString()}</td>
                                        <td className="p-3">
                                            <button
                                                onClick={() => openAnswerModal(i, 'product')}
                                                className="px-3 py-1.5 text-xs border rounded hover:bg-black hover:text-white transition-colors"
                                            >
                                                {i.answer ? '수정' : '답변'}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {productInquiries.length === 0 && <tr><td colSpan={5} className="p-10 text-center text-gray-400">문의 내역이 없습니다.</td></tr>}
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

            {/* Answer Modal */}
            {selectedInquiry && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded flex flex-col md:flex-row gap-6">

                        {/* Left: Customer Info */}
                        <div className="w-full md:w-1/3 border-b md:border-b-0 md:border-r pb-6 md:pb-0 md:pr-6 space-y-6">
                            <h3 className="text-lg font-bold border-b pb-2">고객 정보</h3>
                            {customerInfo && customerInfo.user ? (
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between"><span className="text-gray-500">이름</span> <span className="font-bold">{customerInfo.user.name}</span></div>
                                    <div className="flex justify-between"><span className="text-gray-500">이메일</span> <span>{customerInfo.user.email}</span></div>
                                    <div className="flex justify-between"><span className="text-gray-500">연락처</span> <span>{customerInfo.user.phoneNumber || '정보없음'}</span></div>
                                </div>
                            ) : (
                                <div className="text-gray-400 text-sm">회원 정보를 찾을 수 없습니다.</div>
                            )}

                            {customerInfo && customerInfo.product && (
                                <div>
                                    <h4 className="font-bold text-sm mb-2 mt-4 text-gray-500">문의 상품</h4>
                                    <div className="flex gap-3 border p-2 rounded bg-gray-50">
                                        <div className="w-12 h-12 relative flex-shrink-0 bg-gray-200">
                                            {customerInfo.product.images[0] && <Image src={customerInfo.product.images[0]} alt={customerInfo.product.name} fill className="object-cover" />}
                                        </div>
                                        <div className="text-xs overflow-hidden">
                                            <div className="font-bold truncate">{customerInfo.product.brand}</div>
                                            <div className="truncate text-gray-600">{customerInfo.product.name}</div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div>
                                <h4 className="font-bold text-sm mb-2 mt-4 text-gray-500 border-b pb-1">최근 주문 내역</h4>
                                {customerInfo && customerInfo.orders.length > 0 ? (
                                    <div className="space-y-2 max-h-40 overflow-y-auto">
                                        {customerInfo.orders.slice(0, 3).map(order => (
                                            <div key={order.id} className="text-xs bg-gray-50 p-2 rounded">
                                                <div className="flex justify-between font-bold mb-1">
                                                    <span>{new Date(order.date).toLocaleDateString()}</span>
                                                    <span>{order.status}</span>
                                                </div>
                                                <div className="text-gray-500 truncate">{order.items[0]?.name} 외 {order.items.length - 1}건</div>
                                                <div className="text-right mt-1">₩{order.totalPrice.toLocaleString()}</div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-gray-400 text-xs text-center py-4">주문 내역이 없습니다.</div>
                                )}
                            </div>
                        </div>

                        {/* Right: Inquiry Content & Answer */}
                        <div className="flex-1 flex flex-col">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-bold">
                                    {selectedInquiryType === 'oto' ? '1:1 문의 답변' : '상품 문의 답변'}
                                </h3>
                                <button
                                    onClick={() => setSelectedInquiry(null)}
                                    className="text-gray-400 hover:text-black"
                                >
                                    ✕
                                </button>
                            </div>

                            <div className="mb-6 flex-1">
                                <div className="flex gap-2 mb-2">
                                    {selectedInquiryType === 'oto' ? (
                                        <span className="bg-gray-100 text-xs px-2 py-1 rounded">{(selectedInquiry as OneToOneInquiry).category}</span>
                                    ) : (
                                        <span className="bg-gray-100 text-xs px-2 py-1 rounded">상품문의</span>
                                    )}
                                    <span className={`text-xs px-2 py-1 rounded ${selectedInquiry.answer ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                        {selectedInquiry.answer ? '답변완료' : '대기중'}
                                    </span>
                                </div>

                                {'title' in selectedInquiry && <h4 className="font-bold mb-2">{(selectedInquiry as OneToOneInquiry).title}</h4>}

                                <div className="p-4 bg-gray-50 rounded text-sm whitespace-pre-wrap min-h-[100px]">
                                    {selectedInquiry.content}
                                </div>
                                <div className="mt-2 text-xs text-gray-400">
                                    {new Date(selectedInquiry.createdAt).toLocaleString('ko-KR')}
                                </div>
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm font-bold mb-2">답변 내용</label>
                                <textarea
                                    value={answerText}
                                    onChange={(e) => setAnswerText(e.target.value)}
                                    placeholder="고객에게 전달할 답변을 입력하세요..."
                                    className="w-full border p-4 text-sm h-40 resize-none focus:border-blue-500 outline-none rounded"
                                />
                            </div>

                            <div className="flex gap-3 mt-auto">
                                <button
                                    onClick={() => setSelectedInquiry(null)}
                                    className="flex-1 py-3 border text-sm font-bold hover:bg-gray-50 transition-colors rounded"
                                >
                                    취소
                                </button>
                                <button
                                    onClick={handleAnswerSubmit}
                                    className="flex-1 py-3 bg-black text-white text-sm font-bold hover:bg-gray-900 transition-colors rounded"
                                >
                                    답변 등록
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
