// app/(shop)/mypage/page.tsx
'use client';

import { useAuth } from "@/context/AuthContext";
import { User, Order, Review, ProductInquiry } from "@/types";
import { getOrders, updateOrderStatus } from "@/utils/orderStorage";
import { getMyReviews, getMyProductInquiries } from "@/utils/boardStorage";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import OneToOneSection from "@/components/board/OneToOneSection";

// Define Active status types
const ACTIVE_STATUSES = ['Paid', 'Preparing', 'Shipped', 'Delivered'];

export default function MyPage() {
    const { user, logout, isLoading, updateUser } = useAuth();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('orders'); // orders, reviews, qna, oto, profile

    // Data States
    const [orders, setOrders] = useState<Order[]>([]);
    const [myReviews, setMyReviews] = useState<Review[]>([]);
    const [myQna, setMyQna] = useState<ProductInquiry[]>([]);

    // UI States
    const [showTracking, setShowTracking] = useState<string | null>(null); // Order ID for tracking modal

    useEffect(() => {
        if (!isLoading && !user) {
            router.push('/auth/login');
        }
    }, [user, isLoading, router]);

    const refreshData = () => {
        if (!user) return;
        setOrders(getOrders((user as User).email));
        setMyReviews(getMyReviews((user as User).email));
        setMyQna(getMyProductInquiries((user as User).email));
    };

    useEffect(() => {
        refreshData();
    }, [user, activeTab]);

    const handleConfirmPurchase = (order: Order) => {
        if (!confirm('구매를 확정하시겠습니까? 포인트가 적립됩니다.')) return;

        // 1. Update Order Status
        updateOrderStatus(order.id, 'Confirmed');

        // 2. Add Points to User
        if (user) {
            const newPoints = ((user as User).points || 0) + order.earnedPoints;
            updateUser({ points: newPoints });
            alert(`구매가 확정되었습니다. ${order.earnedPoints.toLocaleString()}P가 적립되었습니다.`);
        }
        refreshData();
    };

    const handleRequestClaim = (orderId: string, type: 'Return' | 'Exchange') => {
        if (!confirm(`${type === 'Return' ? '반품' : '교환'}을 신청하시겠습니까?`)) return;
        updateOrderStatus(orderId, type === 'Return' ? 'Return Requested' : 'Exchange Requested');
        alert('신청이 접수되었습니다.');
        refreshData();
    };

    if (isLoading || !user) return null;

    const typedUser = user as User;
    const activeOrders = orders.filter(o => ACTIVE_STATUSES.includes(o.status));
    const pastOrders = orders.filter(o => !ACTIVE_STATUSES.includes(o.status));

    return (
        <div className="container mx-auto px-4 py-12">
            <h1 className="text-3xl font-bold mb-10">마이 페이지</h1>

            <div className="flex flex-col lg:flex-row gap-12">
                {/* Profile Sidebar */}
                <div className="w-full lg:w-1/4">
                    <div className="bg-white border p-6 sticky top-24">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center text-xl font-bold text-white">
                                {typedUser.name[0].toUpperCase()}
                            </div>
                            <div>
                                <h2 className="font-bold">{typedUser.name}</h2>
                                <p className="text-sm text-gray-500">{typedUser.email}</p>
                            </div>
                        </div>

                        <div className="mb-6 p-4 bg-white border text-center">
                            <p className="text-xs text-gray-500 mb-1">나의 적립금</p>
                            <p className="text-xl font-bold text-blue-600">{(typedUser.points || 0).toLocaleString()} P</p>
                        </div>

                        <button
                            onClick={logout}
                            className="text-sm text-gray-500 hover:text-black underline block mb-6"
                        >
                            로그아웃
                        </button>

                        {/* Navigation Menu (Desktop Sidebar style) */}
                        <nav className="space-y-1">
                            {[
                                { id: 'orders', label: '주문 내역' },
                                { id: 'reviews', label: '나의 상품 후기' },
                                { id: 'qna', label: '나의 상품 문의' },
                                { id: 'oto', label: '1:1 문의' },
                                { id: 'profile', label: '개인정보 수정' },
                            ].map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`w-full text-left py-3 px-2 border-l-2 text-sm font-medium transition-colors ${activeTab === tab.id
                                        ? 'border-black text-black'
                                        : 'border-transparent text-gray-500 hover:text-gray-800'
                                        }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </nav>
                    </div>
                </div>

                {/* Main Content */}
                <div className="w-full lg:w-3/4">

                    {/* Orders Tab */}
                    {activeTab === 'orders' && (
                        <div className="space-y-12">
                            {/* Active Orders */}
                            <section>
                                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                                    진행 중인 주문
                                    <span className="bg-black text-white text-xs px-2 py-1 rounded-full">{activeOrders.length}</span>
                                </h2>
                                {activeOrders.length === 0 ? (
                                    <div className="text-center py-10 bg-white border text-gray-400 text-sm">
                                        진행 중인 주문이 없습니다.
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        {activeOrders.map((order) => (
                                            <div key={order.id} className="border p-6 bg-white">
                                                <div className="flex justify-between items-start mb-4 pb-4 border-b">
                                                    <div>
                                                        <span className="font-bold mr-3">{new Date(order.date).toLocaleDateString()}</span>
                                                        <span className="text-sm text-gray-500">주문번호 {order.id}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="inline-block px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded">
                                                            {order.status}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="space-y-4 mb-4">
                                                    {order.items.map((item, idx) => (
                                                        <div key={idx} className="flex gap-4">
                                                            <div className="relative w-16 h-20 bg-gray-100 flex-shrink-0">
                                                                <Image src={item.images[0]} alt={item.name} fill className="object-cover" unoptimized />
                                                            </div>
                                                            <div>
                                                                <p className="font-bold text-sm">{item.brand}</p>
                                                                <p className="text-sm">{item.name}</p>
                                                                <p className="text-xs text-gray-500">{item.selectedOptions.size} / 수량: {item.quantity}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>

                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => setShowTracking(order.id)}
                                                        className="px-4 py-2 border text-sm hover:bg-gray-50"
                                                    >
                                                        배송조회
                                                    </button>
                                                    <button
                                                        onClick={() => handleRequestClaim(order.id, 'Exchange')}
                                                        className="px-4 py-2 border text-sm hover:bg-gray-50"
                                                    >
                                                        교환신청
                                                    </button>
                                                    <button
                                                        onClick={() => handleRequestClaim(order.id, 'Return')}
                                                        className="px-4 py-2 border text-sm hover:bg-gray-50"
                                                    >
                                                        반품신청
                                                    </button>
                                                    <button
                                                        onClick={() => handleConfirmPurchase(order)}
                                                        className="px-4 py-2 bg-black text-white text-sm font-bold hover:bg-gray-800"
                                                    >
                                                        구매확정
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </section>

                            {/* Past Orders */}
                            <section>
                                <h2 className="text-xl font-bold mb-6 text-gray-400">과거 주문 내역</h2>
                                {pastOrders.length === 0 ? (
                                    <div className="text-center py-10 bg-white border text-gray-400 text-sm">
                                        과거 주문 내역이 없습니다.
                                    </div>
                                ) : (
                                    <div className="space-y-6 opacity-75">
                                        {pastOrders.map((order) => (
                                            <div key={order.id} className="border p-6 bg-white">
                                                <div className="flex justify-between items-start mb-4 pb-4 border-b">
                                                    <div>
                                                        <span className="font-bold mr-3">{new Date(order.date).toLocaleDateString()}</span>
                                                        <span className="text-sm text-gray-500">주문번호 {order.id}</span>
                                                    </div>
                                                    <span className="inline-block px-3 py-1 bg-gray-200 text-gray-600 text-xs font-bold rounded">
                                                        {order.status}
                                                    </span>
                                                </div>
                                                {/* Items summary */}
                                                <div className="text-sm text-gray-600">
                                                    {order.items[0].name} {order.items.length > 1 ? `외 ${order.items.length - 1}건` : ''}
                                                </div>
                                                <div className="mt-2 text-right font-bold">
                                                    {order.totalPrice.toLocaleString()}원
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </section>
                        </div>
                    )}

                    {/* Other Tabs */}
                    {activeTab === 'reviews' && (
                        <div>
                            <h2 className="text-xl font-bold mb-6">나의 상품 후기</h2>
                            {myReviews.map(review => (
                                <div key={review.id} className="border p-6 mb-4">
                                    <div className="flex justify-between mb-2">
                                        <span className="text-yellow-400 text-sm">{'★'.repeat(review.rating)}</span>
                                        <span className="text-xs text-gray-400">{new Date(review.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <p className="text-sm">{review.content}</p>
                                </div>
                            ))}
                            {myReviews.length === 0 && <p className="text-gray-400 text-center py-10">내역이 없습니다.</p>}
                        </div>
                    )}

                    {activeTab === 'qna' && (
                        <div>
                            <h2 className="text-xl font-bold mb-6">나의 상품 문의</h2>
                            {myQna.map(qna => (
                                <div key={qna.id} className="border p-6 mb-4">
                                    <div className="flex items-center gap-2 mb-2 text-sm">
                                        {!qna.answer ? <span className="bg-gray-200 px-1.5 py-0.5 text-xs text-gray-600 rounded">대기중</span> : <span className="bg-black text-white px-1.5 py-0.5 text-xs rounded">답변완료</span>}
                                        <span className="text-gray-400 text-xs">{new Date(qna.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <p className="text-sm">{qna.content}</p>
                                </div>
                            ))}
                            {myQna.length === 0 && <p className="text-gray-400 text-center py-10">내역이 없습니다.</p>}
                        </div>
                    )}

                    {activeTab === 'oto' && <OneToOneSection />}

                    {activeTab === 'profile' && (
                        <div className="border p-8 text-center bg-white">
                            <h2 className="text-xl font-bold mb-4">개인정보 수정</h2>
                            <p className="text-gray-500 mb-8">
                                회원님의 소중한 개인정보를 안전하게 보호하기 위해<br />
                                비밀번호를 다시 한 번 확인합니다.
                            </p>
                            <button
                                onClick={() => router.push('/mypage/check-password')}
                                className="bg-black text-white px-8 py-3 font-bold hover:bg-gray-800 transition-colors"
                            >
                                비밀번호 확인 후 수정하기
                            </button>
                        </div>
                    )}

                </div>
            </div>

            {/* Mock Tracking Modal */}
            {showTracking && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowTracking(null)}>
                    <div className="bg-white p-6 w-96 max-w-full" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold">배송 조회</h3>
                            <button onClick={() => setShowTracking(null)}>✕</button>
                        </div>
                        <div className="space-y-4 text-sm">
                            <div className="border-l-2 border-black pl-4 py-1 relative">
                                <div className="absolute -left-[5px] top-2 w-2 h-2 rounded-full bg-black"></div>
                                <p className="font-bold">배송완료</p>
                                <p className="text-gray-500">2026-01-03 14:00</p>
                                <p>문 앞 배송 완료</p>
                            </div>
                            <div className="border-l-2 border-gray-200 pl-4 py-1 relative">
                                <div className="absolute -left-[5px] top-2 w-2 h-2 rounded-full bg-gray-300"></div>
                                <p className="font-bold text-gray-500">배송출발</p>
                                <p className="text-gray-500">2026-01-02 09:00</p>
                                <p>서울터미널</p>
                            </div>
                            <div className="bg-gray-50 p-3 rounded text-xs text-gray-500 mt-4">
                                * 이는 데모용 가상 배송 정보입니다.
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
