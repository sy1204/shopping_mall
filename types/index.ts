// types/index.ts

export interface Product {
    id: string;
    name: string;
    brand: string;
    price: number;
    original_price?: number;
    discount_rate?: number;
    images: string[];
    category: string;
    is_new?: boolean;
    is_best?: boolean;
    like_count: number;
    review_count: number;
    story_content?: string;
}

export interface CartItem extends Product {
    cartItemId: string;
    quantity: number;
    selectedOptions: {
        size?: string;
        color?: string;
    };
}

export interface User {
    email: string;
    name: string;
    phoneNumber?: string;
    zonecode?: string;
    address?: string;
    addressDetail?: string;
    zipCode?: string;
    isAdmin?: boolean;
    points?: number;
}

export interface AdminUser extends User {
    id: string;
    joinDate: string;
    status: 'Active' | 'Inactive' | 'Banned';
    totalOrders: number;
    totalSpent: number;
}

export interface Order {
    id: string;
    date: string;
    items: CartItem[];
    totalPrice: number;
    shippingAddress: {
        name: string;
        address: string;
        phone: string;
    };
    status: 'Pending' | 'Paid' | 'Preparing' | 'Shipped' | 'Delivered' | 'Confirmed' | 'Cancelled' | 'Return Requested' | 'Exchange Requested' | 'Return Completed' | 'Exchange Completed';
    claimStatus?: string;
    trackingNumber?: string;
    usedPoints: number;
    earnedPoints: number;
    adminMemo?: string;
    // Claim reason fields
    returnReason?: string;
    exchangeReason?: string;
    exchangeRequest?: string; // Desired exchange option
    userId: string;
}

export interface Review {
    id: string;
    productId: string;
    userId: string;
    userName: string;
    rating: number;
    content: string;
    images: string[];
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
