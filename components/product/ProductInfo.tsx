// components/product/ProductInfo.tsx
type Props = {
    name: string;
    brand: string;
    price: number;
    sale_price: number | null;
};

export default function ProductInfo({ name, brand, price, sale_price }: Props) {
    const discountRate = sale_price ? Math.round(((price - sale_price) / price) * 100) : 0;

    return (
        <div className="space-y-6">
            <div className="space-y-1">
                <h3 className="text-sm font-bold text-blue-600">{brand}</h3>
                <h1 className="text-2xl font-bold text-gray-900">{name}</h1>
            </div>

            <div className="flex items-baseline gap-2">
                <span className="text-xl font-bold">{(sale_price || price).toLocaleString()}</span>
                {sale_price && (
                    <>
                        <span className="text-sm text-gray-400 line-through">{price.toLocaleString()}</span>
                        <span className="text-sm font-bold text-red-500">{discountRate}%</span>
                    </>
                )}
            </div>

            <div className="h-px bg-gray-200" />
        </div>
    );
}
