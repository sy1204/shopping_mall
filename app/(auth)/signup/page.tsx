// app/(auth)/signup/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

// Daum Postcode API types
declare global {
    interface Window {
        daum: {
            Postcode: new (options: {
                oncomplete: (data: {
                    zonecode: string;
                    roadAddress: string;
                    jibunAddress: string;
                    userSelectedType: string;
                    buildingName: string;
                }) => void;
            }) => {
                open: () => void;
            };
        };
    }
}

export default function SignupPage() {
    const router = useRouter();
    const { register } = useAuth();

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        name: '',
        phone: '',
        zonecode: '',
        address: '',
        addressDetail: ''
    });
    const [error, setError] = useState('');
    const [agreed, setAgreed] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        const script = document.createElement('script');
        script.src = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
        script.async = true;
        document.head.appendChild(script);

        return () => {
            if (document.head.contains(script)) {
                document.head.removeChild(script);
            }
        };
    }, []);

    const openPostcodeSearch = () => {
        if (!window.daum) {
            alert('주소 검색 서비스를 로드하는 중입니다. 잠시 후 다시 시도해주세요.');
            return;
        }

        new window.daum.Postcode({
            oncomplete: (data) => {
                const address = data.userSelectedType === 'R' ? data.roadAddress : data.jibunAddress;
                setFormData(prev => ({
                    ...prev,
                    zonecode: data.zonecode,
                    address: address
                }));
            }
        }).open();
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.email || !formData.password || !formData.name) {
            setError('필수 항목을 모두 입력해주세요.');
            return;
        }

        if (formData.password.length < 6) {
            setError('비밀번호는 6자 이상이어야 합니다.');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('비밀번호가 일치하지 않습니다.');
            return;
        }

        if (!agreed) {
            setError('이용약관에 동의해주세요.');
            return;
        }

        if (isLoading) return;
        setIsLoading(true);

        const result = await register(
            formData.email,
            formData.password,
            formData.name,
            formData.phone,
            {
                zonecode: formData.zonecode,
                address: formData.address,
                addressDetail: formData.addressDetail
            }
        );

        if (result.success) {
            if (window.confirm('🎉 회원가입이 완료되었습니다! 메인 페이지로 이동합니다.')) {
                router.push('/');
            } else {
                router.push('/');
            }
        } else {
            setError(result.error || '회원가입에 실패했습니다.');
        }
        setIsLoading(false);
    };

    if (!isMounted) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-pulse text-gray-400 font-mono text-sm">[ 로딩 중... ]</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex">
            {/* Left: Visual */}
            <div className="hidden lg:block lg:w-1/2 bg-[var(--neural-black)] relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <pattern id="signupGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5"></path>
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#signupGrid)"></rect>
                    </svg>
                </div>

                <div className="absolute inset-0 flex items-center justify-center text-white p-16">
                    <div className="max-w-md">
                        <div className="w-2 h-2 bg-[var(--primary)] rounded-full animate-pulse mb-8"></div>
                        <h2 className="text-4xl font-serif leading-tight mb-6">
                            뉴럴 링크에<br />
                            <span className="text-[var(--primary)] italic">연결</span>하세요.
                        </h2>
                        <p className="text-gray-400 leading-relaxed">
                            회원이 되시면 AI 기반 맞춤형 스타일 추천,
                            위시리스트, 주문 관리 등 다양한 서비스를 이용하실 수 있습니다.
                        </p>
                    </div>
                </div>
            </div>

            {/* Right: Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16 overflow-y-auto">
                <div className="w-full max-w-md">
                    <Link
                        href="/"
                        className="inline-block text-3xl font-serif tracking-widest mb-8"
                    >
                        [ N<span className="text-[var(--primary)]">-</span>D ]
                    </Link>

                    <h1 className="text-2xl font-serif mb-2">회원가입</h1>
                    <p className="text-sm text-gray-500 mb-8">
                        새로운 계정을 만들고 뉴럴 링크에 연결하세요.
                    </p>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 text-sm mb-6">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest mb-2">
                                이름 <span className="text-[var(--primary)]">*</span>
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="홍길동"
                                className="w-full border-b-2 border-gray-200 py-3 focus:border-[var(--primary)] outline-none transition-colors bg-transparent"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest mb-2">
                                이메일 <span className="text-[var(--primary)]">*</span>
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="example@email.com"
                                className="w-full border-b-2 border-gray-200 py-3 focus:border-[var(--primary)] outline-none transition-colors bg-transparent"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest mb-2">
                                    비밀번호 <span className="text-[var(--primary)]">*</span>
                                </label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="6자 이상"
                                    className="w-full border-b-2 border-gray-200 py-3 focus:border-[var(--primary)] outline-none transition-colors bg-transparent"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest mb-2">
                                    비밀번호 확인 <span className="text-[var(--primary)]">*</span>
                                </label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="다시 입력"
                                    className="w-full border-b-2 border-gray-200 py-3 focus:border-[var(--primary)] outline-none transition-colors bg-transparent"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest mb-2">
                                연락처
                            </label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="010-1234-5678"
                                className="w-full border-b-2 border-gray-200 py-3 focus:border-[var(--primary)] outline-none transition-colors bg-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest mb-2">
                                주소
                            </label>
                            <div className="flex gap-2 mb-2">
                                <input
                                    type="text"
                                    className="w-28 border-b-2 border-gray-200 py-2 bg-transparent"
                                    placeholder="우편번호"
                                    value={formData.zonecode}
                                    readOnly
                                />
                                <button
                                    type="button"
                                    onClick={openPostcodeSearch}
                                    className="nd-btn-secondary text-xs"
                                >
                                    주소 검색
                                </button>
                            </div>
                            <input
                                type="text"
                                className="w-full border-b-2 border-gray-200 py-2 mb-2 bg-gray-50"
                                placeholder="주소 검색 버튼을 클릭하세요"
                                value={formData.address}
                                readOnly
                            />
                            <input
                                type="text"
                                name="addressDetail"
                                value={formData.addressDetail}
                                onChange={handleChange}
                                className="w-full border-b-2 border-gray-200 py-3 focus:border-[var(--primary)] outline-none transition-colors bg-transparent"
                                placeholder="상세 주소 (동/호수 등)"
                            />
                        </div>

                        <div className="flex items-start gap-3 py-4">
                            <input
                                type="checkbox"
                                id="agree"
                                checked={agreed}
                                onChange={(e) => setAgreed(e.target.checked)}
                                className="mt-1 w-4 h-4 accent-[var(--primary)]"
                            />
                            <label htmlFor="agree" className="text-xs text-gray-500 leading-relaxed">
                                <span className="text-[var(--primary)] hover:underline cursor-pointer">이용약관</span> 및{' '}
                                <span className="text-[var(--primary)] hover:underline cursor-pointer">개인정보처리방침</span>에 동의합니다.
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="nd-btn-primary w-full justify-center disabled:opacity-50"
                        >
                            <span>{isLoading ? '[ 처리중... ]' : '[ 가입하기 ]'}</span>
                        </button>
                    </form>

                    <div className="mt-8 text-center text-xs uppercase tracking-widest">
                        <span className="text-gray-400">이미 계정이 있으신가요?</span>{' '}
                        <Link href="/auth/login" className="text-[var(--primary)] font-bold hover:underline">
                            로그인
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
