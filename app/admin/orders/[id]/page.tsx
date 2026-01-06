// app/admin/orders/[id]/page.tsx
'use client';

import { getOrders, updateOrderStatus } from "@/utils/orderStorage";
import { Order } from "@/types";
import { useRouter } from "next/navigation";
import { useEffect, useState, use } from "react";
import Image from "next/image";

type Props = {
    params: Promise<{ id: string }>;
};

export default function OrderDetailPage({ params }: Props) {
    const router = useRouter();
    const resolvedParams = use(params);
    const orderId = resolvedParams.id;
    const [order, setOrder] = useState<Order | null>(null);

    useEffect(() => {
        const orders = getOrders();
        const found = orders.find(o => o.id === orderId);
        if (found) {
            setOrder(found);
        } else {
            alert('Order not found');
            router.push('/admin/orders');
        }
    }, [orderId, router]);

    const handleStatusChange = (newStatus: Order['status']) => {
        if (!order) return;
        if (confirm(`Change status from "${order.status}" to "${newStatus}"?`)) {
            updateOrderStatus(order.id, newStatus);
            setOrder(prev => prev ? { ...prev, status: newStatus } : null);
        }
    };

    if (!order) return <div className="p-8 font-mono">LOADING_ORDER_DATA...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <button onClick={() => router.back()} className="text-gray-500 hover:text-black">
                    ← 주문 목록으로 돌아가기
                </button>
            </div>

            <div className="bg-white border rounded shadow-sm p-8 mb-8">
                <div className="flex justify-between items-start border-b pb-6 mb-6">
                    <div>
                        <h1 className="text-2xl font-bold mb-2">주문번호 #{order.id}</h1>
                        <p className="text-gray-500">{new Date(order.date).toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                        <span className={`inline-block px-4 py-2 rounded text-sm font-bold mb-2
                            ${order.status === 'Paid' ? 'bg-blue-100 text-blue-800' :
                                order.status === 'Cancelled' ? 'bg-red-100 text-red-800' : 'bg-gray-100'}`}>
                            {order.status === 'Paid' ? '결제완료' :
                                order.status === 'Preparing' ? '준비중' :
                                    order.status === 'Shipped' ? '배송중' :
                                        order.status === 'Delivered' ? '배송완료' :
                                            order.status === 'Confirmed' ? '구매확정' :
                                                order.status === 'Cancelled' ? '취소됨' :
                                                    order.status === 'Return Requested' ? '반품신청됨' :
                                                        order.status === 'Exchange Requested' ? '교환신청됨' : order.status}
                        </span>
                        {/* Status Actions */}
                        <div className="flex gap-2 justify-end mt-2">
                            {['Paid', 'Preparing', 'Shipped', 'Delivered', 'Confirmed'].includes(order.status) && (
                                <select
                                    className="border rounded p-1 text-sm bg-gray-50"
                                    onChange={(e) => handleStatusChange(e.target.value as Order['status'])}
                                    value=""
                                >
                                    <option value="" disabled>상태 변경...</option>
                                    <option value="Preparing">준비중</option>
                                    <option value="Shipped">배송중</option>
                                    <option value="Delivered">배송완료</option>
                                </select>
                            )}

                            {/* Claim Management Buttons */}
                            {order.status === 'Return Requested' && (
                                <button
                                    onClick={() => handleStatusChange('Return Completed')}
                                    className="px-3 py-1 bg-red-600 text-white text-xs font-bold rounded hover:bg-red-700"
                                >
                                    반품 승인
                                </button>
                            )}

                            {order.status === 'Exchange Requested' && (
                                <button
                                    onClick={() => handleStatusChange('Exchange Completed')}
                                    className="px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded hover:bg-blue-700"
                                >
                                    교환 승인
                                </button>
                            )}

                            {['Paid', 'Preparing'].includes(order.status) && (
                                <button
                                    onClick={() => handleStatusChange('Cancelled')}
                                    className="px-3 py-1 border border-red-200 text-red-600 text-xs font-bold rounded hover:bg-red-50"
                                >
                                    주문 취소
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Order Items */}
                    <div>
                        <h3 className="font-bold border-b pb-2 mb-4">주문 상품</h3>
                        <div className="space-y-4">
                            {order.items.map((item, idx) => (
                                <div key={idx} className="flex gap-4">
                                    <div className="relative w-16 h-20 bg-gray-100 flex-shrink-0">
                                        <Image src={item.images[0]} alt={item.name} fill className="object-cover" unoptimized />
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm">{item.brand}</p>
                                        <p className="text-sm">{item.name}</p>
                                        <p className="text-xs text-gray-500">옵션: {item.selectedOptions.size} / 수량: {item.quantity}</p>
                                        <p className="text-sm font-medium mt-1">₩ {item.price.toLocaleString()}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-between items-center border-t pt-4 mt-4 font-bold">
                            <span>총 결제 금액</span>
                            <span className="text-lg">₩ {order.totalPrice.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm text-gray-500 mt-2">
                            <span>사용 포인트</span>
                            <span>- {order.usedPoints.toLocaleString()} P</span>
                        </div>
                        <div className="flex justify-between items-center text-sm text-blue-600 mt-1">
                            <span>적립 예정 포인트</span>
                            <span>+ {order.earnedPoints.toLocaleString()} P</span>
                        </div>
                    </div>

                    {/* Customer Info */}
                    <div>
                        <h3 className="font-bold border-b pb-2 mb-4">배송 정보</h3>
                        <div className="space-y-3 text-sm">
                            <div className="flex">
                                <span className="w-24 text-gray-500">수령인</span>
                                <span>{order.shippingAddress.name}</span>
                            </div>
                            <div className="flex">
                                <span className="w-24 text-gray-500">연락처</span>
                                <span>{order.shippingAddress.phone}</span>
                            </div>
                            <div className="flex">
                                <span className="w-24 text-gray-500">배송지</span>
                                <div>
                                    <p>{order.shippingAddress.address}</p>
                                </div>
                            </div>
                        </div>

                        {order.trackingNumber && (
                            <div className="mt-6 p-4 bg-gray-50 rounded">
                                <p className="text-xs text-gray-500 mb-1">운송장 번호</p>
                                <p className="font-bold">{order.trackingNumber}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
