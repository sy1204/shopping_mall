// app/admin/stats/page.tsx
'use client';

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { getOrders } from "@/utils/orderStorage";
import { Order } from "@/types";

// Visitor tracking utilities
const VISITOR_STORAGE_KEY = 'shop_visitor_stats';

interface VisitorData {
    date: string;
    visitors: number;
    pageViews: number;
}

const getVisitorStats = (): VisitorData[] => {
    if (typeof window === 'undefined') return [];
    const saved = localStorage.getItem(VISITOR_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
};

const trackVisit = () => {
    if (typeof window === 'undefined') return;

    const today = new Date().toISOString().split('T')[0];
    const stats = getVisitorStats();

    // Check if already visited today
    const sessionKey = `visited_${today}`;
    const alreadyVisited = sessionStorage.getItem(sessionKey);

    // Always count page view
    let todayStats = stats.find(s => s.date === today);

    if (!todayStats) {
        todayStats = { date: today, visitors: 0, pageViews: 0 };
        stats.push(todayStats);
    }

    todayStats.pageViews += 1;

    // Count unique visitor only once per day
    if (!alreadyVisited) {
        todayStats.visitors += 1;
        sessionStorage.setItem(sessionKey, 'true');
    }

    localStorage.setItem(VISITOR_STORAGE_KEY, JSON.stringify(stats));
};

// Call this on page load
if (typeof window !== 'undefined') {
    trackVisit();
}

interface DailySales {
    date: string;
    revenue: number;
    orders: number;
}

export default function AdminStatsPage() {
    const searchParams = useSearchParams();
    const tab = searchParams?.get('tab') || 'sales';

    const [salesData, setSalesData] = useState<DailySales[]>([]);
    const [visitorData, setVisitorData] = useState<VisitorData[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);

    useEffect(() => {
        const fetchStats = async () => {
            // Load orders and calculate sales data
            const allOrders = await getOrders();
            setOrders(allOrders);

            // Group orders by date
            const salesByDate: Record<string, DailySales> = {};

            allOrders.forEach(order => {
                const date = order.date.split('T')[0];
                if (!salesByDate[date]) {
                    salesByDate[date] = { date, revenue: 0, orders: 0 };
                }
                salesByDate[date].revenue += order.totalPrice;
                salesByDate[date].orders += 1;
            });

            // Convert to array and sort by date
            const salesArray = Object.values(salesByDate).sort((a, b) =>
                new Date(b.date).getTime() - new Date(a.date).getTime()
            ).slice(0, 7); // Last 7 days

            setSalesData(salesArray);

            // Load visitor stats
            const visitors = getVisitorStats().sort((a, b) =>
                new Date(b.date).getTime() - new Date(a.date).getTime()
            ).slice(0, 7);

            setVisitorData(visitors);
        };
        fetchStats();
    }, []);

    const totalRevenue = salesData.reduce((sum, d) => sum + d.revenue, 0);
    const totalOrders = salesData.reduce((sum, d) => sum + d.orders, 0);
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    const totalVisitors = visitorData.reduce((s, d) => s + d.visitors, 0);
    const totalPageViews = visitorData.reduce((s, d) => s + d.pageViews, 0);

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">통계 관리</h1>
            </div>

            {tab === 'sales' && (
                <div className="space-y-6">
                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="bg-white border rounded-lg p-6">
                            <div className="text-gray-500 text-sm mb-2">총 매출 (최근 7일)</div>
                            <div className="text-2xl font-bold">₩ {totalRevenue.toLocaleString()}</div>
                        </div>
                        <div className="bg-white border rounded-lg p-6">
                            <div className="text-gray-500 text-sm mb-2">총 주문</div>
                            <div className="text-2xl font-bold">{totalOrders}건</div>
                        </div>
                        <div className="bg-white border rounded-lg p-6">
                            <div className="text-gray-500 text-sm mb-2">평균 주문가</div>
                            <div className="text-2xl font-bold">₩ {Math.round(avgOrderValue).toLocaleString()}</div>
                        </div>
                        <div className="bg-white border rounded-lg p-6">
                            <div className="text-gray-500 text-sm mb-2">전체 주문</div>
                            <div className="text-2xl font-bold">{orders.length}건</div>
                        </div>
                    </div>

                    {/* Sales Table */}
                    <div className="bg-white border rounded-lg p-6">
                        <h2 className="font-bold mb-4">일별 매출 추이</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-50 border-b">
                                    <tr>
                                        <th className="p-3 text-left">날짜</th>
                                        <th className="p-3 text-right">매출</th>
                                        <th className="p-3 text-right">주문수</th>
                                        <th className="p-3 text-right">평균 주문가</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {salesData.length > 0 ? salesData.map(data => (
                                        <tr key={data.date} className="hover:bg-gray-50">
                                            <td className="p-3">{data.date}</td>
                                            <td className="p-3 text-right font-medium">₩ {data.revenue.toLocaleString()}</td>
                                            <td className="p-3 text-right">{data.orders}건</td>
                                            <td className="p-3 text-right">₩ {Math.round(data.revenue / data.orders).toLocaleString()}</td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan={4} className="p-10 text-center text-gray-400">
                                                매출 데이터가 없습니다.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Bar Chart */}
                    {salesData.length > 0 && (
                        <div className="bg-white border rounded-lg p-6">
                            <h2 className="font-bold mb-4">매출 차트</h2>
                            <div className="h-64 flex items-end justify-around gap-4 border-l border-b p-4">
                                {salesData.slice().reverse().map((data, idx) => {
                                    const maxRevenue = Math.max(...salesData.map(d => d.revenue));
                                    const height = maxRevenue > 0 ? (data.revenue / maxRevenue) * 100 : 0;
                                    return (
                                        <div key={idx} className="flex-1 flex flex-col items-center group">
                                            <div className="text-xs mb-2 opacity-0 group-hover:opacity-100 transition-opacity font-bold">
                                                ₩{(data.revenue / 10000).toFixed(0)}만
                                            </div>
                                            <div
                                                className="w-full bg-blue-500 hover:bg-blue-600 rounded-t transition-colors"
                                                style={{ height: `${height}%`, minHeight: height > 0 ? '4px' : '0' }}
                                            />
                                            <div className="text-xs mt-2 text-gray-600">{data.date.slice(5)}</div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {tab === 'visitors' && (
                <div className="space-y-6">
                    {/* Visitor Summary */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white border rounded-lg p-6">
                            <div className="text-gray-500 text-sm mb-2">총 방문자 (최근 7일)</div>
                            <div className="text-2xl font-bold">{totalVisitors.toLocaleString()}명</div>
                        </div>
                        <div className="bg-white border rounded-lg p-6">
                            <div className="text-gray-500 text-sm mb-2">총 페이지뷰</div>
                            <div className="text-2xl font-bold">{totalPageViews.toLocaleString()}회</div>
                        </div>
                        <div className="bg-white border rounded-lg p-6">
                            <div className="text-gray-500 text-sm mb-2">평균 페이지/방문</div>
                            <div className="text-2xl font-bold">
                                {totalVisitors > 0 ? (totalPageViews / totalVisitors).toFixed(1) : 0}페이지
                            </div>
                        </div>
                    </div>

                    {/* Today's Live Stats */}
                    <div className="bg-gradient-to-r from-green-50 to-blue-50 border rounded-lg p-6">
                        <h2 className="font-bold mb-2 flex items-center gap-2">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                            오늘 실시간 통계
                        </h2>
                        <div className="grid grid-cols-2 gap-4 mt-4">
                            {(() => {
                                const today = new Date().toISOString().split('T')[0];
                                const todayStats = visitorData.find(v => v.date === today);
                                return (
                                    <>
                                        <div>
                                            <div className="text-gray-600 text-sm">오늘 방문자</div>
                                            <div className="text-xl font-bold text-green-600">
                                                {todayStats?.visitors || 0}명
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-gray-600 text-sm">오늘 페이지뷰</div>
                                            <div className="text-xl font-bold text-blue-600">
                                                {todayStats?.pageViews || 0}회
                                            </div>
                                        </div>
                                    </>
                                );
                            })()}
                        </div>
                    </div>

                    {/* Visitor Table */}
                    <div className="bg-white border rounded-lg p-6">
                        <h2 className="font-bold mb-4">일별 방문 통계</h2>
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="p-3 text-left">날짜</th>
                                    <th className="p-3 text-right">방문자</th>
                                    <th className="p-3 text-right">페이지뷰</th>
                                    <th className="p-3 text-right">평균 페이지/방문</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {visitorData.length > 0 ? visitorData.map(data => (
                                    <tr key={data.date} className="hover:bg-gray-50">
                                        <td className="p-3">
                                            {data.date}
                                            {data.date === new Date().toISOString().split('T')[0] && (
                                                <span className="ml-2 text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded">오늘</span>
                                            )}
                                        </td>
                                        <td className="p-3 text-right">{data.visitors.toLocaleString()}명</td>
                                        <td className="p-3 text-right">{data.pageViews.toLocaleString()}회</td>
                                        <td className="p-3 text-right">
                                            {data.visitors > 0 ? (data.pageViews / data.visitors).toFixed(1) : 0}페이지
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={4} className="p-10 text-center text-gray-400">
                                            방문자 데이터가 없습니다. 페이지 방문 시 자동으로 기록됩니다.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
