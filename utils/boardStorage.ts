// utils/boardStorage.ts
export interface Review {
    id: string;
    productId: string;
    userId: string;
    userName: string;
    rating: number;
    content: string;
    images: string[]; // Base64 strings
    createdAt: string;
}

export interface ProductInquiry {
    id: string;
    productId: string;
    userId: string;
    userName: string;
    isSecret: boolean;
    content: string;
    answer?: string;
    createdAt: string;
}

export interface OneToOneInquiry {
    id: string;
    userId: string;
    category: string;
    title: string;
    content: string;
    answer?: string;
    status: 'Pending' | 'Answered';
    createdAt: string;
}

export interface Notice {
    id: string;
    title: string;
    content: string;
    category: 'StyleShop' | 'Customer';
    author: string;
    createdAt: string;
}

export interface FAQ {
    id: string;
    question: string;
    answer: string;
    category: string;
}

const STORAGE_KEYS = {
    REVIEWS: 'shop_reviews',
    PRODUCT_INQUIRIES: 'shop_product_inquiries',
    ONE_TO_ONE: 'shop_one_to_one',
    NOTICES: 'shop_notices',
    FAQS: 'shop_faqs',
};

// --- Helpers ---
const getItems = <T>(key: string): T[] => {
    if (typeof window === 'undefined') return [];
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : [];
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

// Admin getters (all items)
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

// --- Product Inquiries ---
export const getProductInquiries = (productId: string): ProductInquiry[] => {
    const all = getItems<ProductInquiry>(STORAGE_KEYS.PRODUCT_INQUIRIES);
    return all.filter(i => i.productId === productId).sort((a, b) =>
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

// --- 1:1 Inquiries ---
export const getMyInquiries = (userId: string): OneToOneInquiry[] => {
    const all = getItems<OneToOneInquiry>(STORAGE_KEYS.ONE_TO_ONE);
    return all.filter(i => i.userId === userId).sort((a, b) =>
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

export const getAllProductInquiries = (): ProductInquiry[] => {
    return getItems<ProductInquiry>(STORAGE_KEYS.PRODUCT_INQUIRIES).sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
};

// --- Notices ---
export const getNotices = (): Notice[] => {
    return getItems<Notice>(STORAGE_KEYS.NOTICES).sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
};

export const addNotice = (notice: Omit<Notice, 'id' | 'createdAt'>) => {
    const all = getItems<Notice>(STORAGE_KEYS.NOTICES);
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
    return getItems<FAQ>(STORAGE_KEYS.FAQS);
};

export const addFAQ = (faq: Omit<FAQ, 'id'>) => {
    const all = getItems<FAQ>(STORAGE_KEYS.FAQS);
    const newItem: FAQ = { ...faq, id: `faq_${Date.now()}` };
    saveItems(STORAGE_KEYS.FAQS, [newItem, ...all]);
    return newItem;
};

// --- 1:1 Admin Getters ---
export const getAllOneToOneInquiries = (): OneToOneInquiry[] => {
    return getItems<OneToOneInquiry>(STORAGE_KEYS.ONE_TO_ONE).sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
};

// --- Helpers for My Page (User Specific) ---
export const getMyReviews = (userId: string): Review[] => {
    const all = getItems<Review>(STORAGE_KEYS.REVIEWS);
    return all.filter(r => r.userId === userId).sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
};

export const getMyProductInquiries = (userId: string): ProductInquiry[] => {
    const all = getItems<ProductInquiry>(STORAGE_KEYS.PRODUCT_INQUIRIES);
    return all.filter(i => i.userId === userId).sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
};

// Initialize with dummy data
export function initializeBoardData() {
    if (typeof window === 'undefined') return;

    // Check if data already exists
    if (getNotices().length > 0) return;

    // Add 3 Notices
    addNotice({
        title: '[공지] 2026 S/S 신상품 출시 안내',
        content: '새로운 봄/여름 컬렉션이 출시되었습니다. 다양한 스타일을 만나보세요.',
        category: 'StyleShop',
        author: 'Admin'
    });
    addNotice({
        title: '[고객센터] 설 연휴 배송 일정 안내',
        content: '설 연휴 기간 동안 배송이 지연될 수 있습니다. 양해 부탁드립니다.',
        category: 'Customer',
        author: 'Admin'
    });
    addNotice({
        title: '[이벤트] 회원가입 감사 이벤트',
        content: '신규 회원 대상 10% 할인 쿠폰을 증정합니다.',
        category: 'StyleShop',
        author: 'Admin'
    });

    // Add 3 FAQs
    addFAQ({
        question: '교환/환불은 어떻게 하나요?',
        answer: '상품 수령 후 7일 이내 교환/환불이 가능합니다. 마이페이지에서 신청해주세요.',
        category: '교환/환불'
    });
    addFAQ({
        question: '배송은 얼마나 걸리나요?',
        answer: '주문 후 평균 2-3일 소요됩니다. 지역에 따라 차이가 있을 수 있습니다.',
        category: '배송'
    });
    addFAQ({
        question: '사이즈가 맞지 않으면 교환 가능한가요?',
        answer: '미착용 상태에서 태그가 부착되어 있는 경우 교환 가능합니다.',
        category: '사이즈'
    });

    // Add 3 1:1 Inquiries (dummy user)
    addOneToOneInquiry({
        userId: 'user_dummy',
        category: '주문',
        title: '주문 취소하고 싶어요',
        content: '어제 주문한 상품을 취소하고 싶습니다.'
    });
    addOneToOneInquiry({
        userId: 'user_dummy2',
        category: '배송',
        title: '배송이 늦어지고 있어요',
        content: '3일 전에 주문했는데 아직 배송이 시작되지 않았습니다.'
    });
    addOneToOneInquiry({
        userId: 'user_dummy3',
        category: '기타',
        title: '회원 정보 수정 문의',
        content: '이메일 주소를 변경하고 싶습니다.'
    });

    // Add 3 Reviews (for product P001)
    addReview({
        productId: 'P001',
        userId: 'user_review1',
        userName: '김OO',
        rating: 5,
        content: '디자인이 정말 예쁘고 착용감도 좋아요! 강력 추천합니다.',
        images: []
    });
    addReview({
        productId: 'P001',
        userId: 'user_review2',
        userName: '이OO',
        rating: 4,
        content: '품질은 좋은데 색상이 사진과 약간 달라요.',
        images: []
    });
    addReview({
        productId: 'P002',
        userId: 'user_review3',
        userName: '박OO',
        rating: 5,
        content: '가격 대비 정말 만족스러워요. 또 구매할게요!',
        images: []
    });
}

