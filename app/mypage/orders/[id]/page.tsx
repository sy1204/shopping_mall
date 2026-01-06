// app/mypage/orders/[id]/page.tsx
'use client';

import { getOrders, updateOrderStatus } from "@/utils/orderStorage";
import { Order } from "@/types";
import { useRouter } from "next/navigation";
import { useEffect, useState, use } from "react";
import Image from "next/image";
import Link from 'next/link';

type Props = {
    params: Promise<{ id: string }>;
};

export default function MyOrderPage({ params }: Props) {
    const router = useRouter();
    const resolvedParams = use(params);
    const orderId = resolvedParams.id;
    const [order, setOrder] = useState<Order | null>(null);

    // Modal States
    const [showTracker, setShowTracker] = useState(false);
    const [showReturnForm, setShowReturnForm] = useState(false);
    const [returnReason, setReturnReason] = useState('');

    useEffect(() => {
        const orders = getOrders();
        const found = orders.find(o => o.id === orderId);
        if (found) {
            setOrder(found);
        } else {
            alert('주문 내역을 찾을 수 없습니다.');
            router.push('/mypage');
        }
    }, [orderId, router]);

    const handleConfirmPurchase = () => {
        if (!order) return;
        if (!confirm('이미 받으신 상품에 대해 구매를 확정하시겠습니까? 포인트가 즉시 적립됩니다.')) return;
        updateOrderStatus(order.id, 'Confirmed');
        setOrder(prev => prev ? { ...prev, status: 'Confirmed' } : null);
        alert('구매가 확정되었습니다.');
    };

    const handleReturnRequest = (e: React.FormEvent) => {
        e.preventDefault();
        if (!order) return;
        updateOrderStatus(order.id, 'Return Requested');
        setOrder(prev => prev ? { ...prev, status: 'Return Requested' } : null);
        setShowReturnForm(false);
        alert('반품 신청이 접수되었습니다.');
    };

    if (!order) return <div className="p-8 font-mono">LOADING_ORDER_DATA...</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-6">
                <Link href="/mypage" className="text-gray-500 hover:text-black transition-colors">
                    ← 주문 내역 목록
                </Link>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Left: Detail Info */}
                <div className="flex-grow">
                    <div className="bg-white border p-6 mb-6">
                        <div className="flex justify-between items-center mb-6 pb-6 border-b">
                            <div>
                                <h1 className="text-xl font-bold">주문 상세 내역</h1>
                                <p className="text-sm text-gray-400 mt-1">{new Date(order.date).toLocaleString()} | 주문번호 {order.id}</p>
                            </div>
                            <span className="bg-black text-white px-3 py-1 text-xs font-bold rounded">
                                {order.status}
                            </span>
                        </div>

                        <div className="space-y-6">
                            {order.items.map((item, idx) => (
                                <div key={idx} className="flex gap-4">
                                    <div className="relative w-16 h-20 bg-gray-100 flex-shrink-0">
                                        <Image src={item.images[0]} alt={item.name} fill className="object-cover" unoptimized />
                                    </div>
                                    <div className="flex-grow">
                                        <p className="font-bold text-sm tracking-tight">{item.brand}</p>
                                        <p className="text-sm text-gray-600 mb-1">{item.name}</p>
                                        <p className="text-xs text-gray-400">옵션 : {item.selectedOptions.size} / 수량 : {item.quantity}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-bold">₩{item.price.toLocaleString()}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white border p-6">
                            <h2 className="font-bold mb-4 pb-2 border-b">배송 정보</h2>
                            <div className="space-y-2 text-sm">
                                <p><span className="text-gray-400 inline-block w-20">받는 분</span> {order.shippingAddress.name}</p>
                                <p><span className="text-gray-400 inline-block w-20">연락처</span> {order.shippingAddress.phone}</p>
                                <p><span className="text-gray-400 inline-block w-20">주소</span> {order.shippingAddress.address}</p>
                            </div>
                        </div>
                        <div className="bg-white border p-6">
                            <h2 className="font-bold mb-4 pb-2 border-b">결제 정보</h2>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-400">총 상품 금액</span>
                                    <span>₩{order.totalPrice.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">포인트 사용</span>
                                    <span className="text-blue-600">-{order.usedPoints.toLocaleString()} P</span>
                                </div>
                                <div className="flex justify-between font-bold pt-2 border-t mt-2">
                                    <span>총 결제 금액</span>
                                    <span className="text-lg">₩{(order.totalPrice - order.usedPoints).toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: Actions */}
                <div className="w-full lg:w-80 flex-shrink-0">
                    <div className="bg-white border p-6 sticky top-24">
                        <h2 className="font-bold mb-6">주문 관리</h2>
                        <div className="space-y-3">
                            {['Shipped', 'Delivered'].includes(order.status) && (
                                <button
                                    onClick={() => setShowTracker(true)}
                                    className="w-full py-3 border text-sm hover:bg-gray-50 transition-colors"
                                >
                                    배송 조회
                                </button>
                            )}

                            {['Delivered'].includes(order.status) && (
                                <button
                                    onClick={handleConfirmPurchase}
                                    className="w-full py-3 bg-black text-white text-sm font-bold hover:bg-gray-900 transition-colors"
                                >
                                    구매 확정
                                </button>
                            )}

                            {['Paid', 'Preparing', 'Shipped', 'Delivered'].includes(order.status) && (
                                <button
                                    onClick={() => setShowReturnForm(true)}
                                    className="w-full py-3 border text-sm text-gray-400 hover:text-red-500 transition-colors"
                                >
                                    반품/교환 신청
                                </button>
                            )}

                            {order.status === 'Confirmed' && (
                                <p className="text-center py-4 text-sm text-blue-600 font-bold border border-blue-100 bg-blue-50">
                                    구매가 확정된 주문입니다.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Tracking Modal */}
            {showTracker && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-in fade-in duration-300">
                    <div className="bg-white p-8 max-w-md w-full">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold">배송 상태 조회</h3>
                            <button onClick={() => setShowTracker(false)} className="text-gray-400 hover:text-black">✕</button>
                        </div>
                        <div className="relative pl-6 space-y-8 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-px before:bg-gray-200">
                            <div className="relative">
                                <div className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full bg-black"></div>
                                <p className="font-bold text-sm">배송 완료</p>
                                <p className="text-xs text-gray-400 mt-1">2026-01-03 14:00 | [광나루지점] 김** 기사님</p>
                            </div>
                            <div className="relative">
                                <div className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full bg-gray-200"></div>
                                <p className="font-bold text-sm text-gray-400">배송 중</p>
                                <p className="text-xs text-gray-400 mt-1">2026-01-03 09:00 | [서울터미널] 배송지로 이동 중입니다.</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Return Form Modal */}
            {showReturnForm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-in fade-in duration-300">
                    <div className="bg-white p-8 max-w-md w-full">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold">반품/교환 신청</h3>
                            <button onClick={() => setShowReturnForm(false)} className="text-gray-400 hover:text-black">✕</button>
                        </div>
                        <form onSubmit={handleReturnRequest}>
                            <div className="mb-6">
                                <label className="block text-sm text-gray-500 mb-2">신청 사유</label>
                                <textarea
                                    required
                                    className="w-full border p-3 text-sm h-32 resize-none"
                                    placeholder="구체적인 사유를 입력해주세요. (예: 사이즈가 너무 커요, 색상이 사진과 달라요 등)"
                                    value={returnReason}
                                    onChange={(e) => setReturnReason(e.target.value)}
                                ></textarea>
                            </div>
                            <button className="w-full py-4 bg-black text-white font-bold hover:bg-gray-900 transition-colors">
                                신청 완료
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
