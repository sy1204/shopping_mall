// utils/dummyData.ts
export interface Product {
    id: string;
    name: string;
    brand: string;
    price: number;
    original_price?: number;
    discount_rate?: number;
    images: string[]; // First image is thumbnail
    category: string;
    is_new?: boolean;
    is_best?: boolean;
    like_count: number;
    review_count: number;
    story_content?: string; // Markdown or HTML for detailed story
}

export const DUMMY_PRODUCTS: Product[] = [
    {
        id: 'p1',
        name: 'Essential Oversized Wool Coat - Camel',
        brand: 'LOW CLASSIC',
        price: 348000,
        original_price: 498000,
        discount_rate: 30,
        images: [
            'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=1000&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?q=80&w=1000&auto=format&fit=crop'
        ],
        category: 'Outerwear',
        is_best: true,
        like_count: 1240,
        review_count: 45,
        story_content: `
# Timeless Elegance
Every winter, the coat we reach for is one that balances warmth with an effortless silhouette. The **Essential Oversized Wool Coat** by LOW CLASSIC redefines the standard for winter outerwear.

### Premium Wool Blend
Crafted from a high-density wool blend, this coat offers superior insulation without the heavy weight. The texture is soft to the touch, providing comfort even when worn over light layers.

### Signature Silhouette
The oversized fit is designed to drape naturally over the body, creating a sophisticated line that works well with both casual denim and formal trousers. The dropped shoulder design adds a relaxed modern touch.

### Detail Oriented
Every button, seam, and lining is meticulously finished. The hidden button closure maintains a clean, minimalist aesthetic, while the deep pockets offer practical functionality.

> "A coat that serves as a sanctuary against the cold, while making a bold style statement."

### Styling Guide
Pair it with a turtleneck and wide-leg trousers for a chic, monochrome look, or wear it over a slip dress for an elegant evening ensemble. The camel color is versatile enough to complement any palette.
    `
    },
    {
        id: 'p2',
        name: 'Arch Logo Hoodie - Melange Grey',
        brand: 'THISISNEVERTHAT',
        price: 89000,
        images: [
            'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1000&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1556821840-a17409556a31?q=80&w=1000&auto=format&fit=crop'
        ],
        category: 'Top',
        is_new: true,
        like_count: 532,
        review_count: 12,
        story_content: `
# Street Standard

Simply put, it's the hoodie you'll live in. 
Features the signature arch logo on the chest.
    `
    },
    {
        id: 'p3',
        name: 'Classic Leather Chelsea Boots',
        brand: 'DR. MARTENS',
        price: 240000,
        images: [
            'https://images.unsplash.com/photo-1542838686-37da4a9fd176?q=80&w=1000&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1638247025967-b4e38f687b76?q=80&w=1000&auto=format&fit=crop'
        ],
        category: 'Shoes',
        like_count: 890,
        review_count: 120,
        story_content: `
# Walk with Confidence

Durable, stylish, and iconic. The Chelsea boot that pairs with everything.
    `
    },
    {
        id: 'p4',
        name: 'Minimalist Pleated Wide Pants',
        brand: 'SYSTEM',
        price: 185000,
        original_price: 215000,
        discount_rate: 14,
        images: [
            'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=1000&auto=format&fit=crop'
        ],
        category: 'Bottom',
        like_count: 340,
        review_count: 8,
        story_content: `
# Fluid Movement

Pants that move with you. The pleats add depth and character to a simple silhouette.
    `
    },
    {
        id: 'p5',
        name: 'Vintage Wash Denim Jacket',
        brand: 'LEVIS',
        price: 129000,
        images: [
            'https://images.unsplash.com/photo-1495105787522-5334e3ffa0ef?q=80&w=1000&auto=format&fit=crop'
        ],
        category: 'Outerwear',
        is_new: true,
        like_count: 210,
        review_count: 5,
        story_content: `
# Forever Classic

The denim jacket that gets better with age.
    `
    },
    {
        id: 'p6',
        name: 'Soft Cashmere Knit Sweater',
        brand: 'COS',
        price: 150000,
        original_price: 190000,
        discount_rate: 21,
        images: [
            'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=1000&auto=format&fit=crop'
        ],
        category: 'Top',
        is_best: true,
        like_count: 1500,
        review_count: 89,
        story_content: `
# Pure Softness

Experience the luxury of 100% cashmere.
    `
    },
    {
        id: 'p7',
        name: 'Oversized Denim Shirt',
        brand: 'POLO RALPH LAUREN',
        price: 189000,
        images: [
            'https://images.unsplash.com/photo-1589310243389-96a5483213a8?q=80&w=1000&auto=format&fit=crop'
        ],
        category: 'Top',
        like_count: 310,
        review_count: 15,
        story_content: '# Classic American Style'
    },
    {
        id: 'p8',
        name: 'Canvas Tote Bag',
        brand: 'L.L.BEAN',
        price: 65000,
        images: [
            'https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=1000&auto=format&fit=crop'
        ],
        category: 'Bag',
        is_best: true,
        like_count: 890,
        review_count: 124,
        story_content: '# The Original Tote'
    },
    {
        id: 'p9',
        name: 'Leather Belt',
        brand: 'GUCCI',
        price: 650000,
        images: [
            'https://images.unsplash.com/photo-1614165933414-a03eaa6abc32?q=80&w=1000&auto=format&fit=crop'
        ],
        category: 'Accessories',
        like_count: 2200,
        review_count: 340,
        story_content: '# Signature Style'
    },
    {
        id: 'p10',
        name: 'Running Shoes 990v5',
        brand: 'NEW BALANCE',
        price: 239000,
        images: [
            'https://images.unsplash.com/photo-1539185441755-769473a23570?q=80&w=1000&auto=format&fit=crop'
        ],
        category: 'Shoes',
        is_new: true,
        like_count: 1560,
        review_count: 890,
        story_content: '# The Dad Shoe Icon'
    }
];

export function getProductById(id: string): Product | undefined {
    return DUMMY_PRODUCTS.find(p => p.id === id);
}
