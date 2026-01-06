// utils/boardStorage.ts
import { Review, ProductInquiry, OneToOneInquiry, Notice, FAQ } from "@/types";
import { DUMMY_NOTICES, DUMMY_FAQS } from "./dummyData";

const STORAGE_KEYS = {
    REVIEWS: 'shop_reviews',
    PRODUCT_INQUIRIES: 'shop_product_inquiries',
    ONE_TO_ONE: 'shop_one_to_one',
    NOTICES: 'shop_notices',
    FAQS: 'shop_faqs',
};

const getItems = <T>(key: string, defaultValue: T[] = []): T[] => {
    if (typeof window === 'undefined') return defaultValue;
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : defaultValue;
};

const saveItems = <T>(key: string, items: T[]) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem(key, JSON.stringify(items));
    }
};

// --- Reviews ---
export const getReviews = (productId: string): Review[] => {
    const all = getItems<Review>(STORAGE_KEYS.REVIEWS);
    return all.filter(r => r.productId === productId).sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
};

export const getAllReviews = (): Review[] => {
    return getItems<Review>(STORAGE_KEYS.REVIEWS).sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
};

export const addReview = (review: Omit<Review, 'id' | 'createdAt'>) => {
    const all = getItems<Review>(STORAGE_KEYS.REVIEWS);
    const newReview: Review = {
        ...review,
        id: `rev_${Date.now()}`,
        createdAt: new Date().toISOString()
    };
    saveItems(STORAGE_KEYS.REVIEWS, [newReview, ...all]);
    return newReview;
};

export const getMyReviews = (userId: string): Review[] => {
    const all = getItems<Review>(STORAGE_KEYS.REVIEWS);
    return all.filter(r => r.userId === userId).sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
};

// --- Product Inquiries ---
export const getProductInquiries = (productId: string): ProductInquiry[] => {
    const all = getItems<ProductInquiry>(STORAGE_KEYS.PRODUCT_INQUIRIES);
    return all.filter(i => i.productId === productId).sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
};

export const getAllProductInquiries = (): ProductInquiry[] => {
    return getItems<ProductInquiry>(STORAGE_KEYS.PRODUCT_INQUIRIES).sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
};

export const addProductInquiry = (inquiry: Omit<ProductInquiry, 'id' | 'createdAt'>) => {
    const all = getItems<ProductInquiry>(STORAGE_KEYS.PRODUCT_INQUIRIES);
    const newInquiry: ProductInquiry = {
        ...inquiry,
        id: `inq_${Date.now()}`,
        createdAt: new Date().toISOString()
    };
    saveItems(STORAGE_KEYS.PRODUCT_INQUIRIES, [newInquiry, ...all]);
    return newInquiry;
};

export const getMyProductInquiries = (userId: string): ProductInquiry[] => {
    const all = getItems<ProductInquiry>(STORAGE_KEYS.PRODUCT_INQUIRIES);
    return all.filter(i => i.userId === userId).sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
};

// --- 1:1 Inquiries ---
export const getMyInquiries = (userId: string): OneToOneInquiry[] => {
    const all = getItems<OneToOneInquiry>(STORAGE_KEYS.ONE_TO_ONE);
    return all.filter(i => i.userId === userId).sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
};

export const getAllOneToOneInquiries = (): OneToOneInquiry[] => {
    return getItems<OneToOneInquiry>(STORAGE_KEYS.ONE_TO_ONE).sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
};

export const addOneToOneInquiry = (inquiry: Omit<OneToOneInquiry, 'id' | 'createdAt' | 'status'>) => {
    const all = getItems<OneToOneInquiry>(STORAGE_KEYS.ONE_TO_ONE);
    const newInquiry: OneToOneInquiry = {
        ...inquiry,
        id: `oto_${Date.now()}`,
        status: 'Pending',
        createdAt: new Date().toISOString()
    };
    saveItems(STORAGE_KEYS.ONE_TO_ONE, [newInquiry, ...all]);
    return newInquiry;
};

// --- Notices ---
export const getNotices = (): Notice[] => {
    return getItems<Notice>(STORAGE_KEYS.NOTICES, DUMMY_NOTICES).sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
};

export const addNotice = (notice: Omit<Notice, 'id' | 'createdAt'>) => {
    const all = getItems<Notice>(STORAGE_KEYS.NOTICES, DUMMY_NOTICES);
    const newItem: Notice = {
        ...notice,
        id: `not_${Date.now()}`,
        createdAt: new Date().toISOString()
    };
    saveItems(STORAGE_KEYS.NOTICES, [newItem, ...all]);
    return newItem;
};

// --- FAQs ---
export const getFAQs = (): FAQ[] => {
    return getItems<FAQ>(STORAGE_KEYS.FAQS, DUMMY_FAQS);
};

export const addFAQ = (faq: Omit<FAQ, 'id'>) => {
    const all = getItems<FAQ>(STORAGE_KEYS.FAQS, DUMMY_FAQS);
    const newItem: FAQ = { ...faq, id: `faq_${Date.now()}` };
    saveItems(STORAGE_KEYS.FAQS, [newItem, ...all]);
    return newItem;
};

// Initialize board data with dummy constants
export function initializeBoardData() {
    if (typeof window === 'undefined') return;
    if (getNotices().length > 0) return;
    saveItems(STORAGE_KEYS.NOTICES, DUMMY_NOTICES);
    saveItems(STORAGE_KEYS.FAQS, DUMMY_FAQS);
}
