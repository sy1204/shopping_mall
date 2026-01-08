// app/admin/products/[id]/page.tsx
import { notFound } from 'next/navigation';
import { getProductById } from '@/utils/productStorage';

type Props = {
    params: Promise<{ id: string }>;
};

export default async function ProductDetailAdminPage(props: Props) {
    const params = await props.params;
    const product = await getProductById(params.id);

    if (!product) {
        notFound();
    }

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">{product.name} 상세</h1>
            <div className="bg-white border rounded p-6">
                <p className="text-sm text-gray-500">Product ID: {product.id}</p>
                <p>브랜드: {product.brand}</p>
                <p>가격: ₩{product.price.toLocaleString()}</p>
            </div>
        </div>
    );
}
