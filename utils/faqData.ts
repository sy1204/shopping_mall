// utils/faqData.ts
export interface FAQItem {
    category: string;
    question: string;
    answer: string;
}

export const FAQ_DATA: FAQItem[] = [
    {
        category: 'Delivery',
        question: 'When will my order arrive?',
        answer: 'Standard shipping takes 3-5 business days. You can track your order in "My Page".'
    },
    {
        category: 'Delivery',
        question: 'Do you ship internationally?',
        answer: 'Currently, we only ship within South Korea. We plan to expand to international shipping soon.'
    },
    {
        category: 'Order/Payment',
        question: 'What payment methods do you accept?',
        answer: 'We accept Credit Cards (Visa, MasterCard, Amex) and Virtual Account transfers.'
    },
    {
        category: 'Returns/Exchange',
        question: 'How can I return an item?',
        answer: 'You can request a return within 7 days of receipt. Go to "My Page" > "Order History" and click "Return Request".'
    },
    {
        category: 'Product',
        question: 'Are your products authentic?',
        answer: 'Yes, 29CM STYLE only sells 100% authentic products sourced directly from brands.'
    }
];
