// app/mypage/orders/[id]/page.tsx
'use client';

import { getOrders, updateOrderStatus, Order } from "@/utils/orderStorage";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from 'next/link';

export default function MyOrderPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const [order, setOrder] = useState<Order | null>(null);
    const [paramsId, setParamsId] = useState<string | null>(null);

    // Modal States
    const [showTracker, setShowTracker] = useState(false);
    const [showReturnForm, setShowReturnForm] = useState(false);
    const [returnReason, setReturnReason] = useState('');

    useEffect(() => {
        (async () => {
            const resolvedParams = await params;
            setParamsId(resolvedParams.id);
        })();
    }, [params]);

    useEffect(() => {
        if (!paramsId) return;
        const orders = getOrders();
        const found = orders.find(o => o.id === paramsId);
        if (found) {
            setOrder(found);
        } else {
            alert('Order not found');
            router.push('/mypage');
        }
    }, [paramsId, router]);

    const handleCancel = () => {
        if (!order) return;
        if (confirm('주문을 취소하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
            updateOrderStatus(order.id, 'Cancelled');
            setOrder({ ...order, status: 'Cancelled' });
            alert('주문이 취소되었습니다.');
        }
    };

    const handleReturnRequest = (e: React.FormEvent) => {
        e.preventDefault();
        if (!order) return;

        const type = 'Return Requested'; // Simple return for now
        updateOrderStatus(order.id, type, { adminMemo: `Reason: ${returnReason}` });
        setOrder({ ...order, status: type });
        setShowReturnForm(false);
        alert('반품 신청이 접수되었습니다.');
    };

    if (!order) return <div className="p-8 text-center">Loading...</div>;

    const canCancel = ['Paid', 'Preparing'].includes(order.status);
    const canReturn = ['Delivered'].includes(order.status);
    const canTrack = ['Shipped', 'Delivered'].includes(order.status);

    return (
        <div className="container mx-auto px-4 py-8">
            <Link href="/mypage" className="text-sm text-gray-500 hover:text-black mb-6 block">
                ← 마이페이지로 돌아가기
            </Link>

            <div className="bg-white border rounded-lg p-6 lg:p-10">
                <div className="flex flex-col md:flex-row justify-between md:items-center border-b pb-6 mb-8 gap-4">
                    <div>
                        <h1 className="text-2xl font-bold mb-1">
                            {order.status === 'Paid' ? '결제완료' :
                                order.status === 'Preparing' ? '상품준비중' :
                                    order.status === 'Shipped' ? '배송중' :
                                        order.status === 'Delivered' ? '배송완료' :
                                            order.status === 'Cancelled' ? '주문취소' :
                                                order.status === 'Return Requested' ? '반품신청' : order.status}
                        </h1>
                        <p className="text-gray-500 text-sm">주문번호 {order.id} | {new Date(order.date).toLocaleDateString()}</p>
                    </div>
                    <div className="flex gap-2">
                        {canTrack && (
                            <button
                                onClick={() => setShowTracker(true)}
                                className="px-4 py-2 border border-gray-300 rounded text-sm font-bold hover:bg-gray-50"
                            >
                                배송조회
                            </button>
                        )}
                        {canCancel && (
                            <button
                                onClick={handleCancel}
                                className="px-4 py-2 border border-gray-300 rounded text-sm font-bold text-red-600 hover:bg-red-50"
                            >
                                주문취소
                            </button>
                        )}
                        {canReturn && (
                            <button
                                onClick={() => setShowReturnForm(true)}
                                className="px-4 py-2 border border-gray-300 rounded text-sm font-bold hover:bg-gray-50"
                            >
                                교환/반품 신청
                            </button>
                        )}
                    </div>
                </div>

                <div className="space-y-6">
                    {order.items.map((item, idx) => (
                        <div key={idx} className="flex gap-6">
                            <div className="relative w-20 h-24 bg-gray-100 flex-shrink-0">
                                <Image src={item.images[0]} alt={item.name} fill className="object-cover" />
                            </div>
                            <div className="flex-1">
                                <p className="font-bold text-sm mb-1">{item.brand}</p>
                                <p className="text-sm mb-1">{item.name}</p>
                                <p className="text-xs text-gray-500 mb-2">옵션: {item.selectedOptions.size} / 수량: {item.quantity}</p>
                                <p className="font-bold text-sm">₩ {item.price.toLocaleString()}</p>
                            </div>
                            <div className="text-right">
                                {/* Only show Write Review if Delivered */}
                                {order.status === 'Delivered' && (
                                    <button
                                        onClick={() => alert('리뷰 작성 모달 열기 (구현 예정)')}
                                        className="text-xs bg-black text-white px-3 py-1.5 rounded"
                                    >
                                        리뷰 작성
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-10 pt-10 border-t grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div>
                        <h3 className="font-bold mb-4">배송지 정보</h3>
                        <div className="text-sm text-gray-600 space-y-1">
                            <p className="font-bold text-black">{order.shippingAddress.name}</p>
                            <p>{order.shippingAddress.phone}</p>
                            <p>{order.shippingAddress.address}</p>
                            <p className="text-xs text-gray-400 mt-2">{order.shippingAddress.memo}</p>
                        </div>
                    </div>
                    <div>
                        <h3 className="font-bold mb-4">결제 정보</h3>
                        <div className="text-sm space-y-2">
                            <div className="flex justify-between">
                                <span>상품 금액</span>
                                <span>₩ {order.totalPrice.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-blue-600">
                                <span>적립 혜택</span>
                                <span>+ {order.earnedPoints.toLocaleString()} P</span>
                            </div>
                            <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2">
                                <span>총 결제 금액</span>
                                <span>₩ {order.totalPrice.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tracking Modal */}
            {showTracker && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowTracker(false)}>
                    <div className="bg-white p-6 rounded-lg max-w-sm w-full m-4" onClick={e => e.stopPropagation()}>
                        <h3 className="font-bold text-lg mb-4">배송 조회</h3>
                        <div className="space-y-6 relative ml-2 border-l-2 border-gray-200 pl-6 py-2">
                            <div className="relative">
                                <div className="absolute -left-[31px] w-4 h-4 rounded-full bg-green-500 border-2 border-white"></div>
                                <p className="text-xs text-gray-500 mb-1">2026.01.04 14:00</p>
                                <p className="font-bold text-sm">배송 완료</p>
                                <p className="text-xs text-gray-600">고객님이 상품을 수령했습니다.</p>
                            </div>
                            <div className="relative opacity-50">
                                <div className="absolute -left-[31px] w-4 h-4 rounded-full bg-gray-300 border-2 border-white"></div>
                                <p className="text-xs text-gray-500 mb-1">2026.01.03 09:00</p>
                                <p className="font-bold text-sm">배송 출발</p>
                                <p className="text-xs text-gray-600">허브 터미널에서 출발했습니다.</p>
                            </div>
                        </div>
                        <button onClick={() => setShowTracker(false)} className="w-full mt-6 bg-black text-white py-3 rounded font-bold text-sm">닫기</button>
                    </div>
                </div>
            )}

            {/* Return Modal */}
            {showReturnForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowReturnForm(false)}>
                    <div className="bg-white p-6 rounded-lg max-w-sm w-full m-4" onClick={e => e.stopPropagation()}>
                        <h3 className="font-bold text-lg mb-4">교환/반품 신청</h3>
                        <form onSubmit={handleReturnRequest}>
                            <textarea
                                className="w-full border rounded p-3 text-sm h-32 mb-4"
                                placeholder="사유를 자세히 적어주세요 (예: 사이즈가 안 맞아요)"
                                value={returnReason}
                                onChange={e => setReturnReason(e.target.value)}
                                required
                            />
                            <div className="flex gap-2">
                                <button type="button" onClick={() => setShowReturnForm(false)} className="flex-1 bg-gray-100 py-3 rounded font-bold text-sm">취소</button>
                                <button type="submit" className="flex-1 bg-black text-white py-3 rounded font-bold text-sm">신청하기</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
