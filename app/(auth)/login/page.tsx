// app/(auth)/login/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
    const router = useRouter();
    const { login } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email) {
            setError('이메일을 입력해주세요.');
            return;
        }

        const success = await login(email, password);

        if (success) {
            router.push('/');
        } else {
            setError('이메일 또는 비밀번호가 올바르지 않습니다.');
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* Left: Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16">
                <div className="w-full max-w-md">
                    {/* Logo */}
                    <Link
                        href="/"
                        className="inline-block text-3xl font-serif tracking-widest mb-12"
                    >
                        [ N<span className="text-[var(--primary)]">-</span>D ]
                    </Link>

                    <h1 className="text-2xl font-serif mb-2">로그인</h1>
                    <p className="text-sm text-gray-500 mb-8">
                        뉴럴 링크에 연결하여 맞춤형 스타일을 경험하세요.
                    </p>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 text-sm mb-6">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest mb-2">
                                이메일
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => { setEmail(e.target.value); setError(''); }}
                                placeholder="example@email.com"
                                className="w-full border-b-2 border-gray-200 py-3 focus:border-[var(--primary)] outline-none transition-colors bg-transparent"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest mb-2">
                                비밀번호
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => { setPassword(e.target.value); setError(''); }}
                                placeholder="••••••••"
                                className="w-full border-b-2 border-gray-200 py-3 focus:border-[var(--primary)] outline-none transition-colors bg-transparent"
                            />
                        </div>

                        <button
                            type="submit"
                            className="nd-btn-primary w-full justify-center mt-8"
                        >
                            <span>[ 로그인 ]</span>
                        </button>
                    </form>

                    <div className="mt-8 flex justify-between text-xs uppercase tracking-widest">
                        <Link href="/find-account" className="text-gray-400 hover:text-[var(--primary)] transition-colors">
                            비밀번호 찾기
                        </Link>
                        <Link href="/signup" className="text-[var(--primary)] font-bold hover:underline">
                            회원가입
                        </Link>
                    </div>
                </div>
            </div>

            {/* Right: Visual */}
            <div className="hidden lg:block lg:w-1/2 bg-[var(--neural-black)] relative overflow-hidden">
                {/* Grid Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <pattern id="loginGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5"></path>
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#loginGrid)"></rect>
                    </svg>
                </div>

                {/* Content */}
                <div className="absolute inset-0 flex items-center justify-center text-white p-16">
                    <div className="max-w-md">
                        <div className="w-2 h-2 bg-[var(--primary)] rounded-full animate-pulse mb-8"></div>
                        <h2 className="text-4xl font-serif leading-tight mb-6">
                            <span className="text-[var(--primary)] italic">인공 직관</span>이<br />
                            당신의 스타일을 분석합니다.
                        </h2>
                        <p className="text-gray-400 leading-relaxed">
                            뉴럴 링크에 연결하여 AI 기반 맞춤형 스타일 추천을 받아보세요.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
