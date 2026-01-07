// utils/dummyData.ts
import { Product, CartItem, Order, AdminUser, Review, ProductInquiry, Notice, FAQ, OneToOneInquiry } from "@/types";

// --- Products ---
export const DUMMY_PRODUCTS: Product[] = [
    {
        id: 'p1',
        name: '에센셜 오버핏 울 코트 - 카멜',
        brand: 'LOW CLASSIC',
        price: 348000,
        original_price: 498000,
        discount_rate: 30,
        images: [
            'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=1000&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?q=80&w=1000&auto=format&fit=crop'
        ],
        category: '아우터',
        is_best: true,
        like_count: 1240,
        review_count: 45,
        story_content: '# 타임리스 우아함\n고밀도 울 블렌드 소재로 제작되어...'
    },
    {
        id: 'p2',
        name: '아치 로고 후디 - 멜란지 그레이',
        brand: 'THISISNEVERTHAT',
        price: 89000,
        images: [
            'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1000&auto=format&fit=crop'
        ],
        category: '상의',
        is_new: true,
        like_count: 532,
        review_count: 12
    },
    // Product removed
];

// --- Helpers ---
export const createDummyCartItem = (product: Product, quantity: number = 1, size: string = 'M'): CartItem => ({
    ...product,
    cartItemId: `${product.id}-${size}-${Date.now()}`,
    quantity,
    selectedOptions: { size }
});

// --- Orders ---
export const DUMMY_ORDERS: Order[] = [
    {
        id: 'ord_sample_1',
        date: '2025-12-20T10:00:00Z',
        items: [createDummyCartItem(DUMMY_PRODUCTS[0], 1, 'M')],
        totalPrice: 348000,
        shippingAddress: { name: '김민수', address: '서울시 강남구 테헤란로 123', phone: '010-1234-5678' },
        status: 'Delivered',
        trackingNumber: '1234567890',
        usedPoints: 0,
        earnedPoints: 3480,
        userId: 'user1@example.com'
    },
    {
        id: 'ord_sample_2',
        date: '2026-01-02T09:15:00Z',
        items: [createDummyCartItem(DUMMY_PRODUCTS[1], 2, 'L')],
        totalPrice: 178000,
        shippingAddress: { name: '박지훈', address: '인천시 남동구 구월동 789', phone: '010-1111-2222' },
        status: 'Preparing',
        usedPoints: 0,
        earnedPoints: 1780,
        userId: 'user1@example.com'
    }
];

// --- Users ---
export const DUMMY_USERS: AdminUser[] = [
    {
        id: 'u1',
        email: 'user1@example.com',
        name: '김민수',
        joinDate: '2025-12-01',
        status: 'Active',
        points: 5000,
        totalOrders: 15,
        totalSpent: 1250000,
        phoneNumber: '010-1234-5678',
        address: '서울시 강남구 테헤란로 123',
        addressDetail: '101동'
    }
];

// --- Board Data ---
export const DUMMY_NOTICES: Notice[] = [
    {
        id: 'not_1',
        title: '[공지] 2026 S/S 신상품 출시 안내',
        content: '새로운 봄/여름 컬렉션이 출시되었습니다.',
        category: 'StyleShop',
        author: 'Admin',
        createdAt: '2026-01-01T10:00:00Z'
    }
];

export const DUMMY_FAQS: FAQ[] = [
    {
        id: 'faq_1',
        question: '교환/환불은 어떻게 하나요?',
        answer: '상품 수령 후 7일 이내 가능합니다.',
        category: '교환/환불'
    }
];
