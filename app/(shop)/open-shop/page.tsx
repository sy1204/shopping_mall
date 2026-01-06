// app/(shop)/open-shop/page.tsx
export default function OpenShopPage() {
    const brands = [
        { id: 'b1', name: "LOW CLASSIC", category: "Contemporary", desc: "클래식을 기반으로 한 현대적인 감각" },
        { id: 'b2', name: "ANDERSSON BELL", category: "Unisex", desc: "북유럽 감성의 컨템포러리 스트릿 웨어" },
        { id: 'b3', name: "RECTO", category: "Designer", desc: "정형화되지 않은 자유로운 실루엣" },
        { id: 'b4', name: "AMOMENTO", category: "Minimal", desc: "시간이 지나도 변하지 않는 가치" },
        { id: 'b5', name: "INSILENCE", category: "Minimal", desc: "기본에 충실한 미니멀리즘" },
        { id: 'b6', name: "KUHO PLUS", category: "Contemporary", desc: "미니멀 영 컨템포러리 브랜드" },
    ];

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-2">Brand</h1>
            <p className="text-gray-500 mb-8">엄선된 디자이너 브랜드를 소개합니다.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {brands.map(brand => (
                    <div key={brand.id} className="border p-8 rounded-lg hover:border-black transition-colors cursor-pointer group flex flex-col items-center text-center justify-center h-48 bg-gray-50">
                        <h3 className="text-xl font-bold mb-2 group-hover:scale-110 transition-transform">{brand.name}</h3>
                        <span className="text-xs bg-black text-white px-2 py-1 rounded mb-3">{brand.category}</span>
                        <p className="text-sm text-gray-500">{brand.desc}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
