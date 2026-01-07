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
            // Error is handled in context or we can show generic
            // context login alerts errors usually, but here checking return
            setError('이메일 또는 비밀번호가 올바르지 않습니다.');
        }
    };

    // Quick login for demo
    const handleDemoLogin = () => {
        alert("현재 데이터베이스 연동 중으로 데모 로그인을 사용할 수 없습니다. 직접 회원가입 후 로그인해주세요.");
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
            <div className="max-w-md w-full bg-white p-8 border shadow-sm">
                <div className="text-center mb-8">
                    <Link href="/" className="text-2xl font-bold tracking-tighter">[N-D]</Link>
                    <h1 className="text-xl font-bold mt-4">로그인</h1>
                    <p className="text-sm text-gray-500 mt-2">계정에 로그인하세요</p>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded text-sm mb-6">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold mb-1">이메일</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => { setEmail(e.target.value); setError(''); }}
                            placeholder="example@email.com"
                            className="w-full border p-3 rounded focus:border-black outline-none"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold mb-1">비밀번호</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => { setPassword(e.target.value); setError(''); }}
                            placeholder="비밀번호를 입력하세요"
                            className="w-full border p-3 rounded focus:border-black outline-none"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-black text-white py-4 font-bold hover:bg-gray-800 transition-colors"
                    >
                        로그인
                    </button>
                </form>

                <div className="mt-4">
                    <button
                        onClick={handleDemoLogin}
                        className="w-full border border-gray-300 py-3 text-sm text-gray-600 hover:bg-gray-50 transition-colors rounded"
                    >
                        🎮 데모 계정으로 로그인
                    </button>
                </div>

                <div className="mt-6 flex justify-center gap-4 text-sm text-gray-500">
                    <Link href="/find-account" className="hover:text-black hover:underline">
                        아이디/비밀번호 찾기
                    </Link>
                </div>

                <div className="mt-6 pt-6 border-t text-center text-sm text-gray-500">
                    아직 계정이 없으신가요?{' '}
                    <Link href="/signup" className="text-black font-bold hover:underline">
                        회원가입
                    </Link>
                </div>
            </div>
        </div>
    );
}
