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

    // Fix hydration issues
    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Load Daum Postcode script
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

    // Open Daum Postcode popup
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

        // Validation
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

        if (isLoading) return; // Prevent double submit
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
            // Use window.confirm to give user feedback but ensure flow continues
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

    // Show loading until client-side hydration is complete
    if (!isMounted) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-gray-500">로딩 중...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
            <div className="max-w-md w-full bg-white p-8 border shadow-sm rounded">
                <div className="text-center mb-8">
                    <Link href="/" className="text-2xl font-bold tracking-tighter">[N-D]</Link>
                    <h1 className="text-xl font-bold mt-4">회원가입</h1>
                    <p className="text-sm text-gray-500 mt-2">새로운 계정을 만들어보세요</p>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded text-sm mb-6">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold mb-1">
                            이름 <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="홍길동"
                            className="w-full border p-3 rounded focus:border-black outline-none"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold mb-1">
                            이메일 <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="example@email.com"
                            className="w-full border p-3 rounded focus:border-black outline-none"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold mb-1">
                            비밀번호 <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="6자 이상"
                            className="w-full border p-3 rounded focus:border-black outline-none"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold mb-1">
                            비밀번호 확인 <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="비밀번호를 다시 입력"
                            className="w-full border p-3 rounded focus:border-black outline-none"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold mb-1">
                            연락처
                        </label>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="010-1234-5678"
                            className="w-full border p-3 rounded focus:border-black outline-none"
                        />
                    </div>

                    {/* Address with Daum Postcode */}
                    <div>
                        <label className="block text-sm font-bold mb-1">
                            주소
                        </label>
                        <div className="flex gap-2 mb-2">
                            <input
                                type="text"
                                className="w-28 border p-3 bg-gray-50 rounded"
                                placeholder="우편번호"
                                value={formData.zonecode}
                                readOnly
                            />
                            <button
                                type="button"
                                onClick={openPostcodeSearch}
                                className="px-4 py-2 bg-black text-white text-sm font-bold hover:bg-gray-800 rounded"
                            >
                                주소 검색
                            </button>
                        </div>
                        <input
                            type="text"
                            className="w-full border p-3 mb-2 bg-gray-50 rounded"
                            placeholder="주소 검색 버튼을 클릭하세요"
                            value={formData.address}
                            readOnly
                        />
                        <input
                            type="text"
                            name="addressDetail"
                            value={formData.addressDetail}
                            onChange={handleChange}
                            className="w-full border p-3 rounded focus:border-black outline-none"
                            placeholder="상세 주소 (동/호수 등)"
                        />
                    </div>

                    <div className="flex items-start gap-2 py-2">
                        <input
                            type="checkbox"
                            id="agree"
                            checked={agreed}
                            onChange={(e) => setAgreed(e.target.checked)}
                            className="mt-1"
                        />
                        <label htmlFor="agree" className="text-sm text-gray-600">
                            <span className="text-blue-600 hover:underline cursor-pointer">이용약관</span> 및{' '}
                            <span className="text-blue-600 hover:underline cursor-pointer">개인정보처리방침</span>에 동의합니다.
                        </label>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-black text-white py-4 font-bold hover:bg-gray-800 transition-colors rounded disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? '처리중...' : '가입하기'}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-gray-500">
                    이미 계정이 있으신가요?{' '}
                    <Link href="/auth/login" className="text-black font-bold hover:underline">
                        로그인
                    </Link>
                </div>
            </div>
        </div>
    );
}
