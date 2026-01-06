// app/(shop)/events/page.tsx
import Image from 'next/image';

export default function EventsPage() {
    const events = [
        {
            id: 1,
            title: "2026 S/S Collection Preview",
            subtitle: "새로운 계절, 새로운 스타일을 미리 만나보세요.",
            image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=1000&auto=format&fit=crop"
        },
        {
            id: 2,
            title: "Minimalist Essentials",
            subtitle: "단순함이 주는 강력한 힘. 기본에 충실한 아이템.",
            image: "https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=1000&auto=format&fit=crop"
        },
        {
            id: 3,
            title: "Accessories Special",
            subtitle: "디테일의 차이가 스타일의 완성을 만듭니다.",
            image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1000&auto=format&fit=crop"
        }
    ];

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-2">Feature</h1>
            <p className="text-gray-500 mb-8">29CM STYLE이 제안하는 다채로운 기획전을 만나보세요.</p>

            <div className="grid gap-12">
                {events.map((event, index) => (
                    <div key={event.id} className="group cursor-pointer">
                        <div className="relative w-full h-[300px] md:h-[400px] bg-gray-100 mb-4 overflow-hidden rounded-lg">
                            <Image
                                src={event.image}
                                alt={event.title}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                                unoptimized
                            />
                        </div>
                        <h2 className="text-2xl font-bold mb-1 group-hover:text-blue-600 transition-colors">{event.title}</h2>
                        <p className="text-gray-600">{event.subtitle}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
