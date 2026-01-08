// app/admin/orders/page.tsx
'use client';

import { getOrders, updateOrderStatus } from "@/utils/orderStorage";
import { Order } from "@/types";
import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useToast } from "@/context/ToastContext";

export default function AdminOrdersPage() {
    const { showToast } = useToast();
    const searchParams = useSearchParams();
    const filter = searchParams?.get('filter');

    const [orders, setOrders] = useState<Order[]>([]);
    const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);

    const applyFilter = useCallback((allOrders: Order[], currentFilter: string | null) => {
        if (currentFilter === 'delivery') {
            return allOrders.filter(o => ['Paid', 'Preparing', 'Shipped', 'Delivered'].includes(o.status));
        } else if (currentFilter === 'claims') {
            return allOrders.filter(o => ['Cancelled', 'Return Requested', 'Exchange Requested'].includes(o.status));
        } else {
            return allOrders;
        }
    }, []);

    useEffect(() => {
        const fetchOrders = async () => {
            const allOrders = await getOrders();
            setOrders(allOrders);
            setFilteredOrders(applyFilter(allOrders, filter));
        };
        fetchOrders();
    }, [filter, applyFilter]);

    const handleStatusChange = async (orderId: string, newStatus: string) => {
        if (window.confirm(`주문 상태를 "${newStatus}"(으)로 변경하시겠습니까?`)) {
            await updateOrderStatus(orderId, newStatus as Order['status']);
            const updated = await getOrders();
            setOrders(updated);
            setFilteredOrders(applyFilter(updated, filter));
            showToast('상태가 업데이트되었습니다.', 'success');
        }
    };

    const handleMemoUpdate = async (orderId: string, newMemo: string) => {
        const currentOrder = orders.find(o => o.id === orderId);
        if (currentOrder && currentOrder.adminMemo === newMemo) return;

        await updateOrderStatus(orderId, currentOrder?.status as Order['status'], { adminMemo: newMemo });
        const updated = await getOrders();
        setOrders(updated);
        setFilteredOrders(applyFilter(updated, filter));
        showToast('메모가 저장되었습니다.', 'info');
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold font-mono tracking-tight uppercase">Order Management</h1>
            </div>

            <div className="bg-white border border-[var(--tech-silver)] border-opacity-20 shadow-sm overflow-x-auto">
                <table className="w-full text-left text-sm min-w-[1000px]">
                    <thead className="bg-gray-50 border-b border-[var(--tech-silver)] border-opacity-20 font-mono">
                        <tr>
                            <th className="p-4 font-bold text-[var(--tech-silver)] uppercase tracking-widest text-[10px] w-32">Order ID</th>
                            <th className="p-4 font-bold text-[var(--tech-silver)] uppercase tracking-widest text-[10px]">Product / Option</th>
                            <th className="p-4 font-bold text-[var(--tech-silver)] uppercase tracking-widest text-[10px] text-right">Total Price</th>
                            <th className="p-4 font-bold text-[var(--tech-silver)] uppercase tracking-widest text-[10px]">Status</th>
                            <th className="p-4 font-bold text-[var(--tech-silver)] uppercase tracking-widest text-[10px]">Admin Memo</th>
                            <th className="p-4 font-bold text-[var(--tech-silver)] uppercase tracking-widest text-[10px] text-right w-32">Date</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredOrders.map(order => (
                            <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                <td className="p-4">
                                    <Link href={`/admin/orders/${order.id}`} className="font-mono text-xs text-blue-600 hover:underline">
                                        #{order.id.replace('ord_', '')}
                                    </Link>
                                </td>
                                <td className="p-4">
                                    <div className="font-bold text-[var(--neural-black)]">{order.items[0].name}</div>
                                    <div className="text-[10px] font-mono text-[var(--tech-silver)] uppercase tracking-wider">
                                        {Object.entries(order.items[0].selectedOptions || {}).map(([k, v]) => `${k}: ${v}`).join(', ')}
                                        {order.items.length > 1 && ` 외 ${order.items.length - 1}건`}
                                    </div>
                                    {/* Claim Reason Display */}
                                    {(order.returnReason || order.exchangeReason) && (
                                        <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs">
                                            <span className="font-bold text-yellow-800">
                                                {order.returnReason ? '반품 사유: ' : '교환 사유: '}
                                            </span>
                                            <span className="text-yellow-900">
                                                {order.returnReason || order.exchangeReason}
                                            </span>
                                            {order.exchangeRequest && (
                                                <div className="mt-1 text-yellow-900">
                                                    <span className="font-bold">희망 옵션:</span> {order.exchangeRequest}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </td>
                                <td className="p-4 text-right font-mono font-bold">
                                    ₩{order.totalPrice.toLocaleString()}
                                </td>
                                <td className="p-4">
                                    <select
                                        value={order.status}
                                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                        className="border border-[var(--tech-silver)] border-opacity-30 rounded px-2 py-1 bg-white text-[10px] font-mono focus:border-[var(--brand-accent)] outline-none"
                                    >
                                        <option value="Paid">결제완료</option>
                                        <option value="Preparing">배송준비중</option>
                                        <option value="Shipped">배송중</option>
                                        <option value="Delivered">배송완료</option>
                                        <option value="Confirmed">구매확정</option>
                                        <option value="Cancelled">취소됨</option>
                                        <option value="Return Requested">반품신청</option>
                                        <option value="Exchange Requested">교환신청</option>
                                    </select>
                                </td>
                                <td className="p-4">
                                    <div className="relative group">
                                        <input
                                            type="text"
                                            defaultValue={order.adminMemo || ''}
                                            placeholder="메모를 입력하세요..."
                                            onBlur={(e) => handleMemoUpdate(order.id, e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    handleMemoUpdate(order.id, (e.target as HTMLInputElement).value);
                                                    (e.target as HTMLInputElement).blur();
                                                }
                                            }}
                                            className="w-full bg-gray-50 border border-transparent focus:border-[var(--brand-accent)] focus:bg-white px-3 py-1.5 text-xs font-mono transition-all outline-none rounded"
                                        />
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 pointer-events-none">
                                            <span className="text-[8px] text-[var(--tech-silver)] font-bold tracking-tighter uppercase">AUTO-SAVE</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4 text-right font-mono text-xs text-[var(--tech-silver)]">
                                    {new Date(order.date).toLocaleDateString('ko-KR', {
                                        year: '2-digit',
                                        month: '2-digit',
                                        day: '2-digit'
                                    })}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredOrders.length === 0 && (
                    <div className="p-20 text-center text-[var(--tech-silver)] font-mono text-xs uppercase tracking-[0.2em]">
                        NO ORDERS FOUND IN THIS SECTION
                    </div>
                )}
            </div>
        </div>
    );
}
