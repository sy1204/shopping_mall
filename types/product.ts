// types/product.ts
export type StoryBlock =
    | { type: 'header'; content: string }
    | { type: 'text'; content: string }
    | { type: 'image'; src: string; caption?: string }
    | { type: 'grid'; items: { type: 'image'; src: string; caption?: string }[] }
    | { type: 'footer'; title: string; content: string };

export interface ProductOption {
    sizes: string[];
    colors: string[];
}

export interface Product {
    id: string;
    name: string;
    brand: string;
    price: number;
    sale_price: number | null;
    images: string[] | null;
    category: string;
    description: string;
    story_content: StoryBlock[] | null;
    options: ProductOption | null;
    created_at: string;
}
