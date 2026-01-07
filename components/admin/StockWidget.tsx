'use client';

import { useState, useEffect } from 'react';

interface StockData {
    stockName: string;
    currentPrice: string;
    marketCap: string;
    per: string;
    pbr: string;
    updatedAt: string;
}

export default function StockWidget({ defaultCode = '373220' }: { defaultCode?: string }) {
    const [data, setData] = useState<StockData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchStock = async (code: string) => {
        setLoading(true);
        try {
            const res = await fetch(`/api/stock/${code}`);
            const result = await res.json();
            if (result.error) throw new Error(result.error);
            setData(result);
            setError(null);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStock(defaultCode);
        const interval = setInterval(() => fetchStock(defaultCode), 60000); // 1 min refresh
        return () => clearInterval(interval);
    }, [defaultCode]);

    if (loading && !data) return (
        <div className="bg-white p-6 rounded-lg border shadow-sm animate-pulse h-full">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2 mb-6"></div>
            <div className="space-y-3">
                <div className="h-3 bg-gray-100 rounded"></div>
                <div className="h-3 bg-gray-100 rounded"></div>
            </div>
        </div>
    );

    if (error) return (
        <div className="bg-white p-6 rounded-lg border shadow-sm text-red-500 text-sm">
            주식 정보를 가져오는데 실패했습니다: {error}
        </div>
    );

    return (
        <div className="bg-white p-6 rounded-lg border shadow-sm h-full">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="font-bold text-gray-800 flex items-center gap-2">
                        <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                        실시간 주가 정보
                    </h3>
                    <p className="text-xs text-gray-400 mt-1">{data?.stockName} ({defaultCode})</p>
                </div>
                <button
                    onClick={() => fetchStock(defaultCode)}
                    className="text-[10px] bg-gray-100 hover:bg-gray-200 transition-colors px-2 py-1 rounded text-gray-500"
                >
                    새로고침
                </button>
            </div>

            <div className="mb-6">
                <span className="text-3xl font-black text-gray-900 tracking-tight">
                    {data?.currentPrice}
                </span>
                <span className="text-sm text-gray-500 ml-1 font-medium">KRW</span>
            </div>

            <div className="grid grid-cols-3 gap-2">
                <div className="bg-gray-50 p-2 rounded">
                    <p className="text-[10px] text-gray-400 mb-0.5 uppercase">Market Cap</p>
                    <p className="text-xs font-bold text-gray-700 truncate">{data?.marketCap}</p>
                </div>
                <div className="bg-gray-50 p-2 rounded">
                    <p className="text-[10px] text-gray-400 mb-0.5 uppercase">PER</p>
                    <p className="text-xs font-bold text-gray-700">{data?.per}</p>
                </div>
                <div className="bg-gray-50 p-2 rounded">
                    <p className="text-[10px] text-gray-400 mb-0.5 uppercase">PBR</p>
                    <p className="text-xs font-bold text-gray-700">{data?.pbr}</p>
                </div>
            </div>

            <p className="text-[9px] text-gray-300 mt-4 text-right italic">
                Last updated: {data ? new Date(data.updatedAt).toLocaleTimeString() : '-'}
            </p>
        </div>
    );
}
