// utils/productStorage.ts
import { Product } from "@/types";
import { DUMMY_PRODUCTS } from "./dummyData";

const PRODUCT_STORAGE_KEY = 'shop_products';

export const getProducts = (): Product[] => {
    if (typeof window === 'undefined') return DUMMY_PRODUCTS;

    const saved = localStorage.getItem(PRODUCT_STORAGE_KEY);
    if (!saved) {
        localStorage.setItem(PRODUCT_STORAGE_KEY, JSON.stringify(DUMMY_PRODUCTS));
        return DUMMY_PRODUCTS;
    }

    try {
        return JSON.parse(saved);
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
