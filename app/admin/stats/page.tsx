// app/admin/stats/page.tsx
'use client';

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function AdminStatsPage() {
    const searchParams = useSearchParams();
    const tab = searchParams?.get('tab') || 'sales';

    const salesData = [
        { date: '2026-01-01', revenue: 5420000, orders: 12 },
        { date: '2026-01-02', revenue: 3210000, orders: 8 },
        { date: '2026-01-03', revenue: 7830000, orders: 15 },
        { date: '2026-01-04', revenue: 4560000, orders: 10 },
    ];

    const visitorData = [
        { date: '2026-01-01', visitors: 1250, pageViews: 4320 },
        { date: '2026-01-02', visitors: 980, pageViews: 3210 },
        { date: '2026-01-03', visitors: 1540, pageViews: 5680 },
        { date: '2026-01-04', visitors: 1320, pageViews: 4890 },
    ];

    const totalRevenue = salesData.reduce((sum, d) => sum + d.revenue, 0);
    const totalOrders = salesData.reduce((sum, d) => sum + d.orders, 0);
    const avgOrderValue = totalRevenue / totalOrders;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">통계 관리</h1>
            </div>

            {tab === 'sales' && (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white border rounded-lg p-6">
                            <div className="text-gray-500 text-sm mb-2">총 매출</div>
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
                    </div>

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
                                    {salesData.map(data => (
                                        <tr key={data.date} className="hover:bg-gray-50">
                                            <td className="p-3">{data.date}</td>
                                            <td className="p-3 text-right font-medium">₩ {data.revenue.toLocaleString()}</td>
                                            <td className="p-3 text-right">{data.orders}건</td>
                                            <td className="p-3 text-right">₩ {Math.round(data.revenue / data.orders).toLocaleString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="bg-white border rounded-lg p-6">
                        <h2 className="font-bold mb-4">매출 차트 (Mock)</h2>
                        <div className="h-64 flex items-end justify-around gap-4 border-l border-b p-4">
                            {salesData.map((data, idx) => {
                                const maxRevenue = Math.max(...salesData.map(d => d.revenue));
                                const height = (data.revenue / maxRevenue) * 100;
                                return (
                                    <div key={idx} className="flex-1 flex flex-col items-center">
                                        <div
                                            className="w-full bg-blue-500 rounded-t"
                                            style={{ height: `${height}%` }}
                                        />
                                        <div className="text-xs mt-2 text-gray-600">{data.date.slice(5)}</div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

            {tab === 'visitors' && (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white border rounded-lg p-6">
                            <div className="text-gray-500 text-sm mb-2">총 방문자</div>
                            <div className="text-2xl font-bold">{visitorData.reduce((s, d) => s + d.visitors, 0).toLocaleString()}명</div>
                        </div>
                        <div className="bg-white border rounded-lg p-6">
                            <div className="text-gray-500 text-sm mb-2">총 페이지뷰</div>
                            <div className="text-2xl font-bold">{visitorData.reduce((s, d) => s + d.pageViews, 0).toLocaleString()}회</div>
                        </div>
                    </div>

                    <div className="bg-white border rounded-lg p-6">
                        <h2 className="font-bold mb-4">일별 방문 통계</h2>
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="p-3 text-left">날짜</th>
                                    <th className="p-3 text-right">방문자</th>
                                    <th className="p-3 text-right">페이지뷰</th>
                                    <th className="p-3 text-right">평균 체류</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {visitorData.map(data => (
                                    <tr key={data.date}>
                                        <td className="p-3">{data.date}</td>
                                        <td className="p-3 text-right">{data.visitors.toLocaleString()}명</td>
                                        <td className="p-3 text-right">{data.pageViews.toLocaleString()}회</td>
                                        <td className="p-3 text-right">{(data.pageViews / data.visitors).toFixed(1)}페이지</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
