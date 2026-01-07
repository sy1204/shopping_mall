'use client';

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
    getNotices, addNotice, getFAQs, addFAQ,
    getAllOneToOneInquiries, getAllReviews,
    getAllProductInquiries, updateOneToOneInquiry, updateProductInquiry,
    initializeBoardData
} from "@/utils/boardStorage";
import { getOrders } from "@/utils/orderStorage";
import { getUsers } from "@/utils/userStorage";
import { getProductById } from "@/utils/productStorage";
import { Notice, FAQ, OneToOneInquiry, Review, ProductInquiry, Order, AdminUser, Product } from "@/types";
import { useToast } from "@/context/ToastContext";

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

    // Notice & FAQ Forms
    const [noticeForm, setNoticeForm] = useState({ title: '', content: '', category: 'StyleShop', author: 'Admin' });
    const [faqForm, setFaqForm] = useState({ question: '', answer: '', category: '주문' });

    // Answer Modal State
    const [selectedInquiry, setSelectedInquiry] = useState<{
        item: OneToOneInquiry | ProductInquiry,
        type: 'oto' | 'product'
    } | null>(null);
    const [answerText, setAnswerText] = useState('');

    // Customer Support Info (for Modal)
    const [customerInfo, setCustomerInfo] = useState<AdminUser | undefined>(undefined);
    const [customerOrders, setCustomerOrders] = useState<Order[]>([]);
    const [inquiredProduct, setInquiredProduct] = useState<Product | undefined>(undefined);

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

    const openAnswerModal = (item: OneToOneInquiry | ProductInquiry, type: 'oto' | 'product') => {
        // Reset Info
        setCustomerInfo(undefined);
        setCustomerOrders([]);
        setInquiredProduct(undefined);

        // Fetch Customer Info
        const allUsers = getUsers();
        // Assuming userId matches email or id. In this app, userId is often email.
        // check if item.userId matches user.email or user.id
        const user = allUsers.find(u => u.email === item.userId || u.id === item.userId);
        setCustomerInfo(user);

        // Fetch Orders
        if (item.userId) {
            const orders = getOrders(item.userId); // This function filters by userEmail
            setCustomerOrders(orders.slice(0, 5)); // Recent 5 orders
        }

        // Fetch Product (if product inquiry)
        if (type === 'product') {
            const pId = (item as ProductInquiry).productId;
            if (pId) {
                const product = getProductById(pId);
                setInquiredProduct(product);
            }
        }

        setSelectedInquiry({ item, type });
        setAnswerText(item.answer || '');
    };

    const handleAnswerSubmit = () => {
        if (!selectedInquiry || !answerText.trim()) {
            showToast('답변 내용을 입력해주세요.', 'error');
            return;
        }

        const { item, type } = selectedInquiry;

        if (type === 'oto') {
            updateOneToOneInquiry(item.id, {
                answer: answerText.trim(),
                status: 'Answered'
            });
        } else {
            updateProductInquiry(item.id, {
                answer: answerText.trim(),
                // ProductInquiry might not have 'status' field in type definition, 
                // but checking types/index.ts usually it does or implies it. 
                // Wait, types: ProductInquiry { isSecret, content, answer, ... } - No Status?
                // If no status, we just set answer.
            });
        }

        refreshData();
        setSelectedInquiry(null);
        setAnswerText('');
        showToast('답변이 등록되었습니다.', 'success');
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">게시판 관리</h1>
                <div className="flex gap-2">
                    {/* Tab Navigation (Simple version, could be improved) */}
                    {/* Actually layout handles menu, but here we can have sub-tabs or just rely on layout params. 
                        Users/Orders/etc are separate pages. But Board has internal tabs. */}
                    {/* The Layout sidebar links to ?tab=notice etc. so we use that. */}
                </div>
            </div>

            {/* Internal Tabs if needed for quick switch, though Sidebar has them. 
                Let's add a quick tab bar here for convenience if sidebar is complex. */}
            <div className="flex gap-1 mb-6 border-b">
                {[
                    { id: 'notice', label: '공지사항' },
                    { id: 'faq', label: 'FAQ' },
                    { id: 'inquiry', label: '1:1 문의' },
                    { id: 'product_inquiry', label: '상품 문의' },
                    { id: 'review', label: '상품 후기' },
                ].map(t => (
                    <button
                        key={t.id}
                        onClick={() => handleTabChange(t.id)}
                        className={`px-4 py-2 text-sm font-bold border-b-2 transition-colors ${tab === t.id ? 'border-black text-black' : 'border-transparent text-gray-400 hover:text-gray-600'
                            }`}
                    >
                        {t.label}
                    </button>
                ))}
            </div>

            <div className="bg-white border rounded p-6 min-h-[500px]">
                {/* NOTICE TAB */}
                {tab === 'notice' && (
                    <>
                        <div className="flex justify-between mb-4">
                            <h2 className="text-lg font-bold">공지사항 목록</h2>
                            <button onClick={() => setShowForm(!showForm)} className="bg-blue-600 text-white px-4 py-2 text-sm rounded font-bold">
                                {showForm ? '닫기' : '+ 공지 등록'}
                            </button>
                        </div>
                        {showForm && (
                            <form onSubmit={handleNoticeSubmit} className="mb-8 p-4 bg-gray-50 border rounded">
                                {/* ... Notice Form ... */}
                                <div className="grid gap-4">
                                    <input type="text" placeholder="제목" className="border p-2 w-full" value={noticeForm.title} onChange={e => setNoticeForm({ ...noticeForm, title: e.target.value })} required />
                                    <select className="border p-2 w-full" value={noticeForm.category} onChange={e => setNoticeForm({ ...noticeForm, category: e.target.value as any })}>
                                        <option value="StyleShop">스타일 숍</option>
                                        <option value="Customer">고객센터</option>
                                    </select>
                                    <textarea placeholder="내용" className="border p-2 w-full h-32" value={noticeForm.content} onChange={e => setNoticeForm({ ...noticeForm, content: e.target.value })} required />
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
                                        <td className="p-3"><span className="bg-gray-100 px-2 py-1 rounded-full text-xs">{n.category}</span></td>
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
                        {/* Similar FAQ Setup */}
                        <div className="flex justify-between mb-4">
                            <h2 className="text-lg font-bold">FAQ 관리</h2>
                            <button onClick={() => setShowForm(!showForm)} className="bg-blue-600 text-white px-4 py-2 text-sm rounded font-bold">
                                {showForm ? '닫기' : '+ FAQ 등록'}
                            </button>
                        </div>
                        {showForm && (
                            <form onSubmit={handleFAQSubmit} className="mb-8 p-4 bg-gray-50 border rounded">
                                <div className="grid gap-4">
                                    <input type="text" placeholder="질문 (Q)" className="border p-2 w-full" value={faqForm.question} onChange={e => setFaqForm({ ...faqForm, question: e.target.value })} required />
                                    <select className="border p-2 w-full" value={faqForm.category} onChange={e => setFaqForm({ ...faqForm, category: e.target.value })} required>
                                        <option value="주문">주문</option>
                                        <option value="배송">배송</option>
                                        <option value="교환/환불">교환/환불</option>
                                        <option value="기타">기타</option>
                                    </select>
                                    <textarea placeholder="답변 (A)" className="border p-2 w-full h-32" value={faqForm.answer} onChange={e => setFaqForm({ ...faqForm, answer: e.target.value })} required />
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
                                    <th className="p-3">고객</th>
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
                                            <div className="font-medium cursor-pointer hover:underline" onClick={() => openAnswerModal(i, 'oto')}>{i.title}</div>
                                        </td>
                                        <td className="p-3 text-gray-600">{i.userId}</td>
                                        <td className="p-3 text-gray-400">{new Date(i.createdAt).toLocaleDateString()}</td>
                                        <td className="p-3">
                                            <button onClick={() => openAnswerModal(i, 'oto')} className="px-3 py-1.5 text-xs border rounded hover:bg-black hover:text-white transition-colors">
                                                {i.answer ? '수정' : '답변'}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {inquiries.length === 0 && <tr><td colSpan={6} className="p-10 text-center text-gray-400">데이터가 없습니다.</td></tr>}
                            </tbody>
                        </table>
                    </>
                )}

                {/* PRODUCT INQUIRY TAB (NEW) */}
                {tab === 'product_inquiry' && (
                    <>
                        <h2 className="text-lg font-bold mb-4">상품 문의 내역</h2>
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="p-3">상태</th>
                                    <th className="p-3">상품ID</th>
                                    <th className="p-3">문의내용</th>
                                    <th className="p-3">고객</th>
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
                                        <td className="p-3 text-gray-500 font-mono text-xs">{i.productId?.substring(0, 8)}...</td>
                                        <td className="p-3 max-w-md truncate">
                                            <div className="font-medium cursor-pointer hover:underline" onClick={() => openAnswerModal(i, 'product')}>{i.content}</div>
                                        </td>
                                        <td className="p-3 text-gray-600">{i.userName} ({i.userId})</td>
                                        <td className="p-3 text-gray-400">{new Date(i.createdAt).toLocaleDateString()}</td>
                                        <td className="p-3">
                                            <button onClick={() => openAnswerModal(i, 'product')} className="px-3 py-1.5 text-xs border rounded hover:bg-black hover:text-white transition-colors">
                                                {i.answer ? '수정' : '답변'}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {productInquiries.length === 0 && <tr><td colSpan={6} className="p-10 text-center text-gray-400">데이터가 없습니다.</td></tr>}
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

            {/* INTEGRATED ANSWER/DETAIL MODAL */}
            {selectedInquiry && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded shadow-2xl flex flex-col md:flex-row">

                        {/* LEFT: Inquiry & Answer */}
                        <div className="flex-1 p-8 border-r">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-bold">
                                    {selectedInquiry.type === 'oto' ? '1:1 문의 답변' : '상품 문의 답변'}
                                </h3>
                            </div>

                            <div className="mb-6">
                                <div className="flex gap-2 mb-2">
                                    {selectedInquiry.type === 'oto' && (
                                        <span className="bg-gray-100 text-xs px-2 py-1 rounded">{(selectedInquiry.item as OneToOneInquiry).category}</span>
                                    )}
                                    <span className={`text-xs px-2 py-1 rounded ${selectedInquiry.item.answer ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                        {selectedInquiry.item.answer ? '답변완료' : '대기중'}
                                    </span>
                                </div>
                                {selectedInquiry.type === 'oto' && (
                                    <h4 className="font-bold mb-2">{(selectedInquiry.item as OneToOneInquiry).title}</h4>
                                )}
                                <div className="p-4 bg-gray-50 rounded text-sm whitespace-pre-wrap min-h-[100px]">
                                    {selectedInquiry.item.content}
                                </div>
                                <div className="mt-2 text-xs text-gray-400">
                                    작성일: {new Date(selectedInquiry.item.createdAt).toLocaleString('ko-KR')}
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

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setSelectedInquiry(null)}
                                    className="flex-1 py-3 border text-sm font-bold hover:bg-gray-50 transition-colors rounded"
                                >
                                    닫기
                                </button>
                                <button
                                    onClick={handleAnswerSubmit}
                                    className="flex-1 py-3 bg-black text-white text-sm font-bold hover:bg-gray-900 transition-colors rounded"
                                >
                                    답변 등록
                                </button>
                            </div>
                        </div>

                        {/* RIGHT: Customer & Order Info */}
                        <div className="w-full md:w-80 p-8 bg-gray-50">
                            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-6 border-b pb-2">Customer Info</h3>

                            {/* User Details */}
                            <div className="mb-8">
                                <h4 className="font-bold mb-2 text-sm">
                                    {customerInfo?.name ||
                                        (selectedInquiry.type === 'product' ? (selectedInquiry.item as ProductInquiry).userName : selectedInquiry.item.userId)}
                                </h4>
                                <div className="text-sm text-gray-600 space-y-1">
                                    <div className="flex justify-between">
                                        <span className="text-gray-400 text-xs">ID/Email</span>
                                        <span>{customerInfo?.email || selectedInquiry.item.userId}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400 text-xs">Phone</span>
                                        <span>{customerInfo?.phoneNumber || '-'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400 text-xs">Join Date</span>
                                        <span>{customerInfo?.joinDate || '-'}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Inquired Product (if applicable) */}
                            {inquiredProduct && (
                                <div className="mb-8">
                                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4 border-b pb-2">Inquired Product</h3>
                                    <div className="flex gap-3 items-start">
                                        {inquiredProduct.images && inquiredProduct.images[0] && (
                                            <img src={inquiredProduct.images[0]} alt="Product" className="w-12 h-16 object-cover rounded bg-gray-200" />
                                        )}
                                        <div>
                                            <div className="text-xs font-bold line-clamp-2">{inquiredProduct.name}</div>
                                            <div className="text-xs text-gray-500 mt-1">{inquiredProduct.brand}</div>
                                            <div className="text-xs font-mono mt-1">₩ {inquiredProduct.price.toLocaleString()}</div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Recent Orders */}
                            <div>
                                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4 border-b pb-2">Recent Orders</h3>
                                {customerOrders.length > 0 ? (
                                    <div className="space-y-4">
                                        {customerOrders.map(order => (
                                            <div key={order.id} className="bg-white p-3 rounded border text-xs shadow-sm">
                                                <div className="flex justify-between text-gray-400 mb-1">
                                                    <span>{new Date(order.date).toLocaleDateString()}</span>
                                                    <span className="font-mono">{order.status}</span>
                                                </div>
                                                <div className="font-medium truncate">
                                                    {order.items[0]?.name}
                                                </div>
                                                {order.items.length > 1 && (
                                                    <div className="text-gray-400">
                                                        + {order.items.length - 1} more items
                                                    </div>
                                                )}
                                                <div className="text-right font-bold mt-1">₩ {order.totalPrice.toLocaleString()}</div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-xs text-gray-400 text-center py-4">No recent orders</div>
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
}
