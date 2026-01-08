// app/admin/inquiries/page.tsx
'use client';

import { getAllProductInquiries, updateProductInquiry } from "@/utils/boardStorage";
import { ProductInquiry } from "@/types";
import { useState, useEffect } from "react";
import { useToast } from "@/context/ToastContext";

export default function AdminInquiriesPage() {
    const { showToast } = useToast();
    const [inquiries, setInquiries] = useState<ProductInquiry[]>([]);
    const [selectedInquiry, setSelectedInquiry] = useState<ProductInquiry | null>(null);
    const [answerText, setAnswerText] = useState('');
    const [filter, setFilter] = useState<'all' | 'pending' | 'answered'>('all');

    useEffect(() => {
        loadInquiries();
    }, []);

    const loadInquiries = async () => {
        const all = await getAllProductInquiries();
        setInquiries(all);
    };

    const filteredInquiries = inquiries.filter(inq => {
        if (filter === 'pending') return !inq.answer;
        if (filter === 'answered') return !!inq.answer;
        return true;
    });

    const openAnswerModal = (inquiry: ProductInquiry) => {
        setSelectedInquiry(inquiry);
        setAnswerText(inquiry.answer || '');
    };

    const handleSubmitAnswer = async () => {
        if (!selectedInquiry || !answerText.trim()) {
            showToast('답변 내용을 입력해주세요.', 'error');
            return;
        }

        await updateProductInquiry(selectedInquiry.id, { answer: answerText.trim() });
        loadInquiries();
        setSelectedInquiry(null);
        setAnswerText('');
        showToast('답변이 등록되었습니다.', 'success');
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold font-mono tracking-tight uppercase">Product Inquiries</h1>
                <div className="flex gap-2">
                    {(['all', 'pending', 'answered'] as const).map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-2 text-xs font-mono border transition-all ${filter === f
                                ? 'bg-[var(--neural-black)] text-white border-[var(--neural-black)]'
                                : 'bg-white text-[var(--tech-silver)] border-[var(--tech-silver)] border-opacity-30 hover:border-opacity-100'
                                }`}
                        >
                            {f === 'all' ? '전체' : f === 'pending' ? '대기중' : '답변완료'}
                        </button>
                    ))}
                </div>
            </div>

            <div className="bg-white border border-[var(--tech-silver)] border-opacity-20 shadow-sm">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 border-b border-[var(--tech-silver)] border-opacity-20 font-mono">
                        <tr>
                            <th className="p-4 font-bold text-[var(--tech-silver)] uppercase tracking-widest text-[10px] w-24">상태</th>
                            <th className="p-4 font-bold text-[var(--tech-silver)] uppercase tracking-widest text-[10px]">문의 내용</th>
                            <th className="p-4 font-bold text-[var(--tech-silver)] uppercase tracking-widest text-[10px] w-32">작성자</th>
                            <th className="p-4 font-bold text-[var(--tech-silver)] uppercase tracking-widest text-[10px] w-32">작성일</th>
                            <th className="p-4 font-bold text-[var(--tech-silver)] uppercase tracking-widest text-[10px] w-24 text-center">관리</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredInquiries.map(inq => (
                            <tr key={inq.id} className="hover:bg-gray-50 transition-colors">
                                <td className="p-4">
                                    {inq.answer ? (
                                        <span className="inline-block px-2 py-1 bg-green-100 text-green-700 text-[10px] font-bold rounded">
                                            답변완료
                                        </span>
                                    ) : (
                                        <span className="inline-block px-2 py-1 bg-yellow-100 text-yellow-700 text-[10px] font-bold rounded">
                                            대기중
                                        </span>
                                    )}
                                </td>
                                <td className="p-4">
                                    <div className="font-medium text-[var(--neural-black)] mb-1" title={inq.content}>
                                        {inq.content.length > 50 ? `${inq.content.slice(0, 50)}...` : inq.content}
                                    </div>
                                    {inq.isSecret && (
                                        <span className="text-[10px] text-[var(--tech-silver)]">🔒 비밀글</span>
                                    )}
                                    {inq.answer && (
                                        <div className="mt-2 p-2 bg-blue-50 text-xs text-blue-800 rounded">
                                            <span className="font-bold">답변: </span>
                                            {inq.answer.length > 60 ? `${inq.answer.slice(0, 60)}...` : inq.answer}
                                        </div>
                                    )}
                                </td>
                                <td className="p-4 font-mono text-xs text-[var(--tech-silver)]">
                                    {inq.userName}
                                </td>
                                <td className="p-4 font-mono text-xs text-[var(--tech-silver)]">
                                    {new Date(inq.createdAt).toLocaleDateString('ko-KR')}
                                </td>
                                <td className="p-4 text-center">
                                    <button
                                        onClick={() => openAnswerModal(inq)}
                                        className="px-3 py-1.5 text-xs font-mono border border-[var(--tech-silver)] border-opacity-30 hover:bg-[var(--neural-black)] hover:text-white transition-all rounded"
                                    >
                                        {inq.answer ? '수정' : '답변'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredInquiries.length === 0 && (
                    <div className="p-20 text-center text-[var(--tech-silver)] font-mono text-xs uppercase tracking-[0.2em]">
                        NO INQUIRIES FOUND
                    </div>
                )}
            </div>

            {/* Answer Modal */}
            {selectedInquiry && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold">문의 답변</h3>
                            <button
                                onClick={() => setSelectedInquiry(null)}
                                className="text-gray-400 hover:text-black"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="mb-6">
                            <label className="block text-xs font-bold text-[var(--tech-silver)] uppercase mb-2">
                                문의 내용
                            </label>
                            <div className="p-4 bg-gray-50 rounded text-sm whitespace-pre-wrap">
                                {selectedInquiry.content}
                            </div>
                            <div className="mt-2 text-xs text-[var(--tech-silver)]">
                                작성자: {selectedInquiry.userName} | {new Date(selectedInquiry.createdAt).toLocaleString('ko-KR')}
                            </div>
                        </div>

                        <div className="mb-6">
                            <label className="block text-xs font-bold text-[var(--tech-silver)] uppercase mb-2">
                                답변 내용
                            </label>
                            <textarea
                                value={answerText}
                                onChange={(e) => setAnswerText(e.target.value)}
                                placeholder="고객에게 전달할 답변을 입력하세요..."
                                className="w-full border p-4 text-sm h-40 resize-none focus:border-[var(--brand-accent)] outline-none"
                            />
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setSelectedInquiry(null)}
                                className="flex-1 py-3 border text-sm font-bold hover:bg-gray-50 transition-colors"
                            >
                                취소
                            </button>
                            <button
                                onClick={handleSubmitAnswer}
                                className="flex-1 py-3 bg-black text-white text-sm font-bold hover:bg-gray-900 transition-colors"
                            >
                                답변 등록
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
