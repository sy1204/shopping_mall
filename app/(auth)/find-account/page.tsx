// app/(auth)/find-account/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function FindAccountPage() {
    const [step, setStep] = useState<'input' | 'sent'>('input');
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Timer state
    const [timeLeft, setTimeLeft] = useState(60);
    const [canResend, setCanResend] = useState(false);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (step === 'sent' && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            setCanResend(true);
        }
        return () => clearInterval(interval);
    }, [step, timeLeft]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Mock API call delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        setIsLoading(false);
        setStep('sent');
        setTimeLeft(60);
        setCanResend(false);
    };

    const handleResend = async () => {
        if (!canResend) return;
        setIsLoading(true);

        // Mock Resend API
        await new Promise(resolve => setTimeout(resolve, 1000));

        setIsLoading(false);
        alert('인증 메일이 재전송되었습니다.');
        setTimeLeft(60);
        setCanResend(false);
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50">
            <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold mb-2">
                        {step === 'input' ? '비밀번호 찾기' : '메일 전송 완료'}
                    </h1>
                    <p className="text-sm text-gray-500">
                        {step === 'input'
                            ? '가입하신 이메일 주소를 입력해 주세요.'
                            : `${email} 로 비밀번호 재설정 링크를 보냈습니다.`}
                    </p>
                </div>

                {step === 'input' ? (
                    <form onSubmit={handleSend} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                이메일
                            </label>
                            <input
                                id="email"
                                type="email"
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-black focus:border-black"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none disabled:opacity-50"
                        >
                            {isLoading ? '전송 중...' : '인증 메일 보내기'}
                        </button>
                    </form>
                ) : (
                    <div className="space-y-6">
                        <div className="text-center py-6 bg-gray-50 rounded border border-gray-100">
                            <svg className="w-12 h-12 text-green-500 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                            </svg>
                            <p className="text-sm text-gray-600">
                                메일함을 확인해주세요.<br />
                                메일이 오지 않았다면 스팸함을 확인하거나<br />
                                아래 재전송 버튼을 눌러주세요.
                            </p>
                        </div>

                        <button
                            onClick={handleResend}
                            disabled={!canResend || isLoading}
                            className={`w-full py-3 px-4 border rounded-md text-sm font-medium transition-colors
                                ${canResend
                                    ? 'border-gray-300 text-gray-700 hover:bg-gray-50'
                                    : 'border-gray-200 text-gray-400 bg-gray-50 cursor-not-allowed'}`}
                        >
                            {isLoading ? '전송 중...' : canResend ? '인증 메일 재전송' : `재전송 가능까지 ${timeLeft}초`}
                        </button>
                    </div>
                )}

                <div className="mt-6 text-center">
                    <Link href="/auth/login" className="text-sm text-gray-600 hover:text-black hover:underline">
                        로그인 페이지로 돌아가기
                    </Link>
                </div>
            </div>
        </div>
    );
}
