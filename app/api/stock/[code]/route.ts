import { NextResponse } from 'next/server';

export async function GET(
    request: Request,
    { params }: { params: { code: string } }
) {
    const { code } = params;
    const url = `https://m.stock.naver.com/api/stock/${code}/integration`;

    try {
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            },
            next: { revalidate: 60 } // Cache for 1 minute
        });

        if (!response.ok) throw new Error('Failed to fetch from Naver');

        const data = await response.json();

        // Extracting information based on the user's Python script
        const stockName = data.stockName;
        const currentPrice = data.dealTrendInfos?.[0]?.closePrice;

        let marketCap = '';
        let per = '';
        let pbr = '';

        data.totalInfos?.forEach((info: any) => {
            if (info.code === 'marketValue') marketCap = info.value;
            if (info.code === 'per') per = info.value;
            if (info.code === 'pbr') pbr = info.value;
        });

        return NextResponse.json({
            stockName,
            currentPrice,
            marketCap,
            per,
            pbr,
            updatedAt: new Date().toISOString()
        });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
