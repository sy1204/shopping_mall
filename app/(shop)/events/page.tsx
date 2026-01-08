// app/(shop)/events/page.tsx
import Image from 'next/image';

export default function EventsPage() {
    const events = [
        {
            id: 1,
            title: "2026 S/S Collection Preview",
            subtitle: "새로운 계절, 새로운 스타일을 미리 만나보세요. 이번 시즌 주목해야 할 컬러와 실루엣을 먼저 공개합니다.",
            image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=1000&auto=format&fit=crop",
            period: "2026.01.15 - 02.28",
            tag: "NEW"
        },
        {
            id: 2,
            title: "설날 특별 기획전",
            subtitle: "가족과 함께하는 명절, 품격 있는 선물 세트부터 편안한 홈웨어까지. 전 상품 최대 30% 할인.",
            image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1000&auto=format&fit=crop",
            period: "2026.01.20 - 01.31",
            tag: "SALE"
        },
        {
            id: 3,
            title: "Minimalist Essentials",
            subtitle: "단순함이 주는 강력한 힘. 시간이 지나도 변하지 않는 클래식 아이템 컬렉션.",
            image: "https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=1000&auto=format&fit=crop",
            period: "상시 진행",
            tag: "ONGOING"
        },
        {
            id: 4,
            title: "신규 회원 5,000P 지급",
            subtitle: "지금 가입하면 5,000 포인트 즉시 지급! 첫 구매 시 바로 사용 가능합니다.",
            image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=1000&auto=format&fit=crop",
            period: "상시 진행",
            tag: "BENEFIT"
        },
        {
            id: 5,
            title: "Accessories Special",
            subtitle: "디테일의 차이가 스타일의 완성을 만듭니다. 가방, 슈즈, 주얼리 특별전.",
            image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1000&auto=format&fit=crop",
            period: "2026.01.10 - 02.10",
            tag: "SPECIAL"
        },
        {
            id: 6,
            title: "친구 초대 이벤트",
            subtitle: "친구를 초대하면 나도, 친구도 각각 3,000P 적립! 함께하면 더 좋은 혜택.",
            image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=1000&auto=format&fit=crop",
            period: "상시 진행",
            tag: "INVITE"
        }
    ];

    const getTagStyle = (tag: string) => {
        const styles: Record<string, string> = {
            'NEW': 'bg-blue-600 text-white',
            'SALE': 'bg-red-600 text-white',
            'ONGOING': 'bg-gray-800 text-white',
            'BENEFIT': 'bg-green-600 text-white',
            'SPECIAL': 'bg-purple-600 text-white',
            'INVITE': 'bg-orange-500 text-white',
        };
        return styles[tag] || 'bg-gray-500 text-white';
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-2">Feature</h1>
            <p className="text-gray-500 mb-8">[N-D] STYLE이 제안하는 다채로운 기획전을 만나보세요.</p>

            <div className="grid gap-12">
                {events.map((event) => (
                    <div key={event.id} className="group cursor-pointer">
                        <div className="relative w-full h-[300px] md:h-[400px] bg-gray-100 mb-4 overflow-hidden rounded-lg">
                            <Image
                                src={event.image}
                                alt={event.title}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                                unoptimized
                            />
                            <div className="absolute top-4 left-4 flex gap-2">
                                <span className={`px-3 py-1 text-xs font-bold rounded ${getTagStyle(event.tag)}`}>
                                    {event.tag}
                                </span>
                            </div>
                        </div>
                        <div className="flex justify-between items-start">
                            <div>
                                <h2 className="text-2xl font-bold mb-1 group-hover:text-blue-600 transition-colors">{event.title}</h2>
                                <p className="text-gray-600">{event.subtitle}</p>
                            </div>
                            <span className="text-sm text-gray-400 whitespace-nowrap ml-4">{event.period}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
