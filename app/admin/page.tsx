// app/admin/page.tsx
'use client';

import { getOrders } from "@/utils/orderStorage";
import { DUMMY_PRODUCTS } from "@/utils/dummyData";
import { useState, useEffect } from "react";

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        totalSales: 0,
        totalOrders: 0,
        totalProducts: 0,
        activeOrders: 0,
        recentOrders: [] as any[]
    });

    useEffect(() => {
        const fetchStats = async () => {
            const orders = await getOrders();
            const totalSales = orders.reduce((sum, order) => sum + order.totalPrice, 0);
            const totalOrders = orders.length;
            const totalProducts = DUMMY_PRODUCTS.length;
            const activeOrders = orders.filter(o => ['Paid', 'Preparing', 'Shipped'].includes(o.status)).length;

            setStats({
                totalSales,
                totalOrders,
                totalProducts,
                activeOrders,
                recentOrders: orders
            });
        };
        fetchStats();
    }, []);

    const { totalSales, totalOrders, totalProducts, activeOrders, recentOrders } = stats;

    return (
        <div>
            <h2 className="text-2xl font-bold mb-8">대시보드</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <div className="bg-white p-6 shadow-sm rounded-lg border">
                    <p className="text-sm text-gray-400 mb-1">총 매출</p>
                    <p className="text-2xl font-bold">₩ {totalSales.toLocaleString()}</p>
                </div>
                <div className="bg-white p-6 shadow-sm rounded-lg border">
                    <p className="text-sm text-gray-400 mb-1">총 주문 수</p>
                    <p className="text-2xl font-bold">{totalOrders.toLocaleString()}건</p>
                </div>
                <div className="bg-white p-6 shadow-sm rounded-lg border">
                    <p className="text-sm text-gray-400 mb-1">진행 중 주문</p>
                    <p className="text-2xl font-bold text-blue-600">{activeOrders.toLocaleString()}건</p>
                </div>
                <div className="bg-white p-6 shadow-sm rounded-lg border">
                    <p className="text-sm text-gray-400 mb-1">등록 상품 수</p>
                    <p className="text-2xl font-bold">{totalProducts.toLocaleString()}개</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-lg border shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold">최근 주문</h3>
                        <a href="/admin/orders" className="text-xs text-blue-600 hover:underline">더보기</a>
                    </div>
                    <div className="space-y-4">
                        {recentOrders.slice(0, 5).map(order => (
                            <div key={order.id} className="flex justify-between items-center py-2 border-b last:border-0">
                                <div>
                                    <p className="font-bold text-sm">주문번호 {order.id}</p>
                                    <p className="text-xs text-gray-500">{new Date(order.date).toLocaleDateString()}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-medium">₩ {order.totalPrice.toLocaleString()}</p>
                                    <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">{order.status}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg border shadow-sm">
                    <h3 className="font-bold mb-4">시스템 상태</h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">데이터베이스 연결</span>
                            <span className="text-xs text-green-600 font-bold bg-green-50 px-2 py-1 rounded">정상 (Healthy)</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">마지막 백업</span>
                            <span className="text-xs text-gray-500">2026-01-04 03:00 AM</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">서버 상태</span>
                            <span className="text-xs text-green-600 font-bold bg-green-50 px-2 py-1 rounded">가동 중 (Online)</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
