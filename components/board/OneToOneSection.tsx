// components/board/OneToOneSection.tsx
'use client';

import { useAuth } from "@/context/AuthContext";
import { addOneToOneInquiry, getMyInquiries } from "@/utils/boardStorage";
import { getOrders } from "@/utils/orderStorage";
import { OneToOneInquiry, Order, CartItem } from "@/types";
import { useEffect, useState } from "react";

// Inquiry categories
const INQUIRY_CATEGORIES = [
    { value: '상품문의', label: '상품문의', needsProduct: true },
    { value: '주문/결제', label: '주문/결제', needsProduct: false },
    { value: '배송문의', label: '배송문의', needsProduct: false },
    { value: '교환/반품', label: '교환/반품', needsProduct: true },
    { value: '기타', label: '기타', needsProduct: false },
];

export default function OneToOneSection() {
    const { user } = useAuth();
    const [inquiries, setInquiries] = useState<OneToOneInquiry[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [orders, setOrders] = useState<Order[]>([]);
    const [selectedInquiry, setSelectedInquiry] = useState<OneToOneInquiry | null>(null);

    // Form states
    const [category, setCategory] = useState('주문/결제');
    const [selectedOrderId, setSelectedOrderId] = useState('');
    const [selectedProductName, setSelectedProductName] = useState('');
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    const currentCategoryConfig = INQUIRY_CATEGORIES.find(c => c.value === category);

    useEffect(() => {
        if (user) {
            setInquiries(getMyInquiries(user.email));
            setOrders(getOrders());
        }
    }, [user]);

    // Get unique products from orders
    const getOrderProducts = (): { orderId: string; product: CartItem }[] => {
        const products: { orderId: string; product: CartItem }[] = [];
        orders.forEach(order => {
            order.items.forEach(item => {
                products.push({ orderId: order.id, product: item });
            });
        });
        return products;
    };

    const handleCategoryChange = (newCategory: string) => {
        setCategory(newCategory);
        setSelectedOrderId('');
        setSelectedProductName('');
    };

    const handleProductSelect = (productName: string, orderId: string) => {
        setSelectedProductName(productName);
        setSelectedOrderId(orderId);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        // Validate product selection if needed
        if (currentCategoryConfig?.needsProduct && !selectedProductName) {
            alert('상품을 선택해주세요.');
            return;
        }

        // Build title with product info if applicable
        const finalTitle = selectedProductName
            ? `[${category}] ${selectedProductName} - ${title}`
            : `[${category}] ${title}`;

        addOneToOneInquiry({
            userId: user.email,
            category,
            title: finalTitle,
            content: selectedProductName
                ? `관련 상품: ${selectedProductName}\n주문번호: ${selectedOrderId}\n\n${content}`
                : content
        });

        alert('문의가 등록되었습니다.');
        setInquiries(getMyInquiries(user.email));

        // Reset
        setTitle('');
        setContent('');
        setSelectedOrderId('');
        setSelectedProductName('');
        setCategory('주문/결제');
        setShowForm(false);
    };

    const openDetail = (inq: OneToOneInquiry) => {
        setSelectedInquiry(inq);
    };

    return (
        <div className="mt-8">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">1:1 문의 내역</h2>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-black text-white px-4 py-2 text-sm font-bold hover:bg-gray-800 transition-colors"
                >
                    {showForm ? '닫기' : '문의하기'}
                </button>
            </div>

            {showForm && (
                <div className="bg-gray-50 p-6 border mb-8">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Category Selection */}
                        <div>
                            <label className="block text-sm font-bold mb-2">
                                문의 유형 <span className="text-red-500">*</span>
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {INQUIRY_CATEGORIES.map(cat => (
                                    <button
                                        key={cat.value}
                                        type="button"
                                        onClick={() => handleCategoryChange(cat.value)}
                                        className={`px-4 py-2 text-sm border rounded transition-colors ${category === cat.value
                                                ? 'bg-black text-white border-black'
                                                : 'bg-white text-gray-600 border-gray-300 hover:border-black'
                                            }`}
                                    >
                                        {cat.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Product Selection (conditional) */}
                        {currentCategoryConfig?.needsProduct && (
                            <div>
                                <label className="block text-sm font-bold mb-2">
                                    관련 상품 선택 <span className="text-red-500">*</span>
                                </label>
                                {getOrderProducts().length > 0 ? (
                                    <div className="max-h-48 overflow-y-auto border rounded bg-white">
                                        {getOrderProducts().map(({ orderId, product }, idx) => (
                                            <label
                                                key={`${orderId}-${product.cartItemId}-${idx}`}
                                                className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-50 border-b last:border-b-0 ${selectedProductName === product.name && selectedOrderId === orderId
                                                        ? 'bg-blue-50'
                                                        : ''
                                                    }`}
                                            >
                                                <input
                                                    type="radio"
                                                    name="product"
                                                    checked={selectedProductName === product.name && selectedOrderId === orderId}
                                                    onChange={() => handleProductSelect(product.name, orderId)}
                                                    className="w-4 h-4"
                                                />
                                                <div className="flex-grow">
                                                    <p className="text-sm font-medium">{product.name}</p>
                                                    <p className="text-xs text-gray-400">
                                                        {product.brand} | 주문번호: {orderId.replace('ord_', '').slice(0, 8)}...
                                                    </p>
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="p-4 bg-gray-100 text-center text-sm text-gray-500 rounded">
                                        주문 내역이 없습니다. 상품 구매 후 문의해주세요.
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Title */}
                        <div>
                            <label className="block text-sm font-bold mb-1">
                                제목 <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                required
                                placeholder="문의 제목을 입력해주세요"
                                className="w-full border p-2 focus:border-black outline-none"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </div>

                        {/* Content */}
                        <div>
                            <label className="block text-sm font-bold mb-1">
                                내용 <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                required
                                placeholder="문의 내용을 자세히 입력해주세요"
                                className="w-full border p-2 h-32 resize-none focus:border-black outline-none"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-black text-white py-3 font-bold hover:bg-gray-800 transition-colors"
                        >
                            등록하기
                        </button>
                    </form>
                </div>
            )}

            {/* Inquiry List */}
            <div className="border-t">
                <div className="grid grid-cols-12 bg-gray-100 p-2 text-sm font-bold text-center">
                    <div className="col-span-2">작성일</div>
                    <div className="col-span-2">카테고리</div>
                    <div className="col-span-6">제목</div>
                    <div className="col-span-2">상태</div>
                </div>
                {inquiries.map(inq => (
                    <div
                        key={inq.id}
                        onClick={() => openDetail(inq)}
                        className="grid grid-cols-12 p-3 text-sm border-b hover:bg-gray-50 items-center text-center cursor-pointer"
                    >
                        <div className="col-span-2 text-gray-500">{new Date(inq.createdAt).toLocaleDateString()}</div>
                        <div className="col-span-2">{inq.category}</div>
                        <div className="col-span-6 text-left px-2 font-medium truncate">
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

            {/* Detail Modal */}
            {selectedInquiry && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setSelectedInquiry(null)}>
                    <div className="bg-white p-8 max-w-lg w-full max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-lg">문의 상세</h3>
                            <button onClick={() => setSelectedInquiry(null)} className="text-gray-400 hover:text-black">✕</button>
                        </div>

                        <div className="mb-4">
                            <div className="flex gap-2 mb-2">
                                <span className="bg-gray-100 text-xs px-2 py-1 rounded">{selectedInquiry.category}</span>
                                <span className={`text-xs px-2 py-1 rounded ${selectedInquiry.status === 'Answered' ? 'bg-blue-100 text-blue-600' : 'bg-yellow-100 text-yellow-600'}`}>
                                    {selectedInquiry.status === 'Answered' ? '답변완료' : '대기중'}
                                </span>
                            </div>
                            <h4 className="font-bold mb-2">{selectedInquiry.title}</h4>
                            <p className="text-xs text-gray-400 mb-4">{new Date(selectedInquiry.createdAt).toLocaleString()}</p>
                            <div className="p-4 bg-gray-50 rounded text-sm whitespace-pre-wrap">
                                {selectedInquiry.content}
                            </div>
                        </div>

                        {selectedInquiry.answer && (
                            <div className="border-t pt-4">
                                <h4 className="font-bold text-sm mb-2 text-blue-600">관리자 답변</h4>
                                <div className="p-4 bg-blue-50 rounded text-sm whitespace-pre-wrap">
                                    {selectedInquiry.answer}
                                </div>
                            </div>
                        )}

                        <button
                            onClick={() => setSelectedInquiry(null)}
                            className="w-full mt-6 py-3 border font-bold hover:bg-gray-50 transition-colors"
                        >
                            닫기
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
