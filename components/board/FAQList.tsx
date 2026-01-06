// components/board/FAQList.tsx
'use client';

import { FAQ_DATA } from "@/utils/faqData";
import { useState } from "react";

export default function FAQList() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggle = (idx: number) => {
        setOpenIndex(openIndex === idx ? null : idx);
    };

    return (
        <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold mb-8 text-center">FAQ</h1>
            <div className="border-t border-black">
                {FAQ_DATA.map((item, idx) => (
                    <div key={idx} className="border-b">
                        <button
                            onClick={() => toggle(idx)}
                            className="flex justify-between items-center w-full py-5 text-left hover:bg-gray-50 px-2 transition-colors"
                        >
                            <div className="flex items-center gap-4">
                                <span className="text-sm text-gray-500 font-bold w-24">{item.category}</span>
                                <span className="text-lg font-medium">Q. {item.question}</span>
                            </div>
                            <span className="text-xl px-4">{openIndex === idx ? '-' : '+'}</span>
                        </button>
                        {openIndex === idx && (
                            <div className="bg-gray-50 p-6 text-gray-700 leading-relaxed">
                                {item.answer}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
