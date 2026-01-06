// app/(shop)/page.tsx
import HeroBanner from "@/components/main/HeroBanner";
import ProductCard from "@/components/product/ProductCard";
import { DUMMY_PRODUCTS } from "@/utils/dummyData";

export default function Home() {
    return (
        <main className="min-h-screen">
            <HeroBanner />

            <section className="container mx-auto px-4 py-16">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold tracking-tight">Weekly Best</h2>
                    <span className="text-sm text-gray-500 cursor-pointer hover:text-black">
                        View More →
                    </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
                    {DUMMY_PRODUCTS.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </section>

            <section className="bg-gray-50 py-16">
                <div className="container mx-auto px-4">
                    <h2 className="text-2xl font-bold tracking-tight mb-8">New Arrivals</h2>
                    {/* Just reusing dummy products for demo purposes, sliced */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {DUMMY_PRODUCTS.slice(0, 4).map((product) => (
                            <ProductCard key={`new-${product.id}`} product={product} />
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
}
