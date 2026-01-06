// utils/productStorage.ts
import { Product, DUMMY_PRODUCTS } from "./dummyData";

const PRODUCT_STORAGE_KEY = 'shop_products';

export const getProducts = (): Product[] => {
    if (typeof window === 'undefined') return DUMMY_PRODUCTS;

    const saved = localStorage.getItem(PRODUCT_STORAGE_KEY);
    if (!saved) {
        // Initialize with dummy data if empty
        localStorage.setItem(PRODUCT_STORAGE_KEY, JSON.stringify(DUMMY_PRODUCTS));
        return DUMMY_PRODUCTS;
    }

    try {
        const products: Product[] = JSON.parse(saved);

        // Auto-sync images for dummy products (p1 to p10) to ensure latest high-quality images
        const updated = products.map(p => {
            const dummy = DUMMY_PRODUCTS.find(d => d.id === p.id);
            if (dummy && p.id.startsWith('p')) {
                return { ...p, images: dummy.images };
            }
            return p;
        });

        return updated;
    } catch (e) {
        console.error('Failed to parse products', e);
        return DUMMY_PRODUCTS;
    }
};

export const saveProduct = (productData: Omit<Product, 'id' | 'like_count' | 'review_count'>) => {
    const newProduct: Product = {
        ...productData,
        id: `prod_${Date.now()}`,
        like_count: 0,
        review_count: 0
    };

    const currentProducts = getProducts();
    const updatedProducts = [newProduct, ...currentProducts];

    localStorage.setItem(PRODUCT_STORAGE_KEY, JSON.stringify(updatedProducts));
    return newProduct;
};

export const updateProduct = (id: string, updates: Partial<Product>) => {
    const currentProducts = getProducts();
    const updatedProducts = currentProducts.map(p =>
        p.id === id ? { ...p, ...updates } : p
    );
    localStorage.setItem(PRODUCT_STORAGE_KEY, JSON.stringify(updatedProducts));
    return updatedProducts;
};

export const deleteProduct = (id: string) => {
    const currentProducts = getProducts();
    const updatedProducts = currentProducts.filter(p => p.id !== id);
    localStorage.setItem(PRODUCT_STORAGE_KEY, JSON.stringify(updatedProducts));
    return updatedProducts;
};

export const getProductById = (id: string): Product | undefined => {
    const products = getProducts();
    return products.find(p => p.id === id);
};
