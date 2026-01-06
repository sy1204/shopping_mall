// components/mypage/ProfileForm.tsx
'use client';

import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ProfileForm() {
    const { user, updateUser, deleteUser } = useAuth();
    const router = useRouter();

    // Local state for form fields
    const [name, setName] = useState(user?.name || '');
    const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || '');
    const [address, setAddress] = useState(user?.address || '');
    const [addressDetail, setAddressDetail] = useState(user?.addressDetail || '');
    const [zipCode, setZipCode] = useState(user?.zipCode || '');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateUser({
            name,
            phoneNumber,
            address,
            addressDetail,
            zipCode
        });
        alert('회원정보가 수정되었습니다.');
    };

    const handleWithdraw = () => {
        if (confirm('정말로 탈퇴하시겠습니까? 탈퇴 시 모든 정보가 삭제됩니다.')) {
            deleteUser();
            alert('회원 탈퇴가 완료되었습니다.');
            router.push('/');
        }
    };

    if (!user) return null;

    return (
        <div className="max-w-2xl">
            <h2 className="text-xl font-bold mb-6">회원정보 수정</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-bold mb-2">이메일 (아이디)</label>
                    <input
                        type="text"
                        value={user.email}
                        disabled
                        className="w-full border p-3 bg-gray-100 text-gray-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-bold mb-2">이름</label>
                    <input
                        type="text"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        className="w-full border p-3"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-bold mb-2">휴대전화</label>
                    <input
                        type="tel"
                        value={phoneNumber}
                        onChange={e => setPhoneNumber(e.target.value)}
                        className="w-full border p-3"
                        placeholder="010-0000-0000"
                    />
                </div>
                <div className="grid grid-cols-3 gap-2">
                    <div className="col-span-3">
                        <label className="block text-sm font-bold mb-2">주소</label>
                    </div>
                    <div className="col-span-1">
                        <input
                            type="text"
                            value={zipCode}
                            onChange={e => setZipCode(e.target.value)}
                            className="w-full border p-3"
                            placeholder="우편번호"
                        />
                    </div>
                    <div className="col-span-2">
                        {/* In a real app, integrate Daum Postcode API here */}
                        <button type="button" className="bg-black text-white px-4 py-3 text-sm font-bold w-full">
                            우편번호 검색
                        </button>
                    </div>
                    <div className="col-span-3">
                        <input
                            type="text"
                            value={address}
                            onChange={e => setAddress(e.target.value)}
                            className="w-full border p-3"
                            placeholder="기본 주소"
                        />
                    </div>
                    <div className="col-span-3">
                        <input
                            type="text"
                            value={addressDetail}
                            onChange={e => setAddressDetail(e.target.value)}
                            className="w-full border p-3"
                            placeholder="상세 주소"
                        />
                    </div>
                </div>

                <div className="pt-6 border-t">
                    <button type="submit" className="bg-black text-white px-8 py-3 font-bold">
                        정보 수정
                    </button>
                </div>
            </form>

            <div className="mt-12 pt-12 border-t">
                <h3 className="text-lg font-bold mb-4 text-red-600">회원 탈퇴</h3>
                <p className="text-sm text-gray-500 mb-4">
                    탈퇴 시 작성한 리뷰, 게시글 및 주문 내역 등 모든 정보가 삭제되며 복구할 수 없습니다.
                </p>
                <button
                    onClick={handleWithdraw}
                    className="border border-red-200 text-red-500 px-4 py-2 text-sm hover:bg-red-50"
                >
                    회원 탈퇴하기
                </button>
            </div>
        </div>
    );
}
