// app/admin/design/page.tsx
'use client';

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";

interface Banner {
    id: number;
    title: string;
    image: string;
    status: 'Active' | 'Inactive';
}

interface Popup {
    id: number;
    title: string;
    image: string;
    link: string;
    status: 'Active' | 'Inactive';
}

function DesignContent() {
    const searchParams = useSearchParams();
    const tab = searchParams?.get('tab') || 'banner';

    const [banners, setBanners] = useState<Banner[]>([
        { id: 1, title: 'Winter Collection', image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b', status: 'Inactive' },
        { id: 2, title: 'New Arrivals', image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d', status: 'Active' },
    ]);

    const [popups, setPopups] = useState<Popup[]>([
        { id: 1, title: 'Event Popup', image: 'https://images.unsplash.com/photo-1607082350899-7e105aa886ae', link: '/events', status: 'Inactive' },
        { id: 2, title: 'Sale Popup', image: 'https://images.unsplash.com/photo-1607082349566-187342175e2f', link: '/shop', status: 'Active' },
    ]);

    // Modal states
    const [showBannerModal, setShowBannerModal] = useState(false);
    const [showPopupModal, setShowPopupModal] = useState(false);
    const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
    const [editingPopup, setEditingPopup] = useState<Popup | null>(null);

    // Form states
    const [bannerForm, setBannerForm] = useState({ title: '', image: '' });
    const [popupForm, setPopupForm] = useState({ title: '', image: '', link: '' });
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    // Design Settings State
    const [brandColor, setBrandColor] = useState('#E2C49C');

    useEffect(() => {
        const savedColor = localStorage.getItem('brand-color');
        if (savedColor) setBrandColor(savedColor);

        // Load banners and popups from localStorage
        const savedBanners = localStorage.getItem('admin-banners');
        const savedPopups = localStorage.getItem('admin-popups');
        if (savedBanners) setBanners(JSON.parse(savedBanners));
        if (savedPopups) setPopups(JSON.parse(savedPopups));
    }, []);

    // Save to localStorage when state changes
    useEffect(() => {
        localStorage.setItem('admin-banners', JSON.stringify(banners));
    }, [banners]);

    useEffect(() => {
        localStorage.setItem('admin-popups', JSON.stringify(popups));
    }, [popups]);

    const handleSaveDesign = () => {
        localStorage.setItem('brand-color', brandColor);
        window.dispatchEvent(new Event('storage'));
        alert('디자인 설정이 저장되었습니다.');
        window.location.reload();
    };

    // Banner Active Toggle - Only one active at a time
    const handleBannerActivate = (id: number) => {
        setBanners(prev => prev.map(b => ({
            ...b,
            status: b.id === id ? 'Active' : 'Inactive'
        })));
        alert('배너가 활성화되었습니다. 다른 배너는 비활성화됩니다.');
    };

    // Popup Active Toggle - Only one active at a time
    const handlePopupActivate = (id: number) => {
        setPopups(prev => prev.map(p => ({
            ...p,
            status: p.id === id ? 'Active' : 'Inactive'
        })));
        alert('팝업이 활성화되었습니다. 다른 팝업은 비활성화됩니다.');
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (ev) => setSelectedImage(ev.target?.result as string);
            reader.readAsDataURL(file);
        }
    };

    // Banner CRUD
    const openBannerModal = (banner?: Banner) => {
        if (banner) {
            setEditingBanner(banner);
            setBannerForm({ title: banner.title, image: banner.image });
            setSelectedImage(banner.image);
        } else {
            setEditingBanner(null);
            setBannerForm({ title: '', image: '' });
            setSelectedImage(null);
        }
        setShowBannerModal(true);
    };

    const handleSaveBanner = () => {
        const image = selectedImage || bannerForm.image;
        if (!bannerForm.title || !image) {
            alert('제목과 이미지를 입력해주세요.');
            return;
        }
        if (editingBanner) {
            setBanners(prev => prev.map(b =>
                b.id === editingBanner.id ? { ...b, title: bannerForm.title, image } : b
            ));
        } else {
            setBanners(prev => [...prev, {
                id: Date.now(),
                title: bannerForm.title,
                image,
                status: 'Inactive'
            }]);
        }
        setShowBannerModal(false);
        setSelectedImage(null);
        alert('배너가 저장되었습니다.');
    };

    const handleDeleteBanner = (id: number) => {
        if (!confirm('배너를 삭제하시겠습니까?')) return;
        setBanners(prev => prev.filter(b => b.id !== id));
    };

    // Popup CRUD
    const openPopupModal = (popup?: Popup) => {
        if (popup) {
            setEditingPopup(popup);
            setPopupForm({ title: popup.title, image: popup.image, link: popup.link });
            setSelectedImage(popup.image);
        } else {
            setEditingPopup(null);
            setPopupForm({ title: '', image: '', link: '' });
            setSelectedImage(null);
        }
        setShowPopupModal(true);
    };

    const handleSavePopup = () => {
        const image = selectedImage || popupForm.image;
        if (!popupForm.title || !image) {
            alert('제목과 이미지를 입력해주세요.');
            return;
        }
        if (editingPopup) {
            setPopups(prev => prev.map(p =>
                p.id === editingPopup.id ? { ...p, title: popupForm.title, image, link: popupForm.link } : p
            ));
        } else {
            setPopups(prev => [...prev, {
                id: Date.now(),
                title: popupForm.title,
                image,
                link: popupForm.link,
                status: 'Inactive'
            }]);
        }
        setShowPopupModal(false);
        setSelectedImage(null);
        alert('팝업이 저장되었습니다.');
    };

    const handleDeletePopup = (id: number) => {
        if (!confirm('팝업을 삭제하시겠습니까?')) return;
        setPopups(prev => prev.filter(p => p.id !== id));
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">전시 관리</h1>
            </div>

            {/* Banner Tab */}
            {tab === 'banner' && (
                <div className="bg-white border rounded p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="font-bold">메인 배너 관리</h2>
                        <button
                            onClick={() => openBannerModal()}
                            className="bg-black text-white px-4 py-2 rounded text-sm font-bold"
                        >
                            + 배너 등록
                        </button>
                    </div>
                    <p className="text-sm text-gray-500 mb-4">
                        💡 &quot;활성화&quot; 버튼을 누르면 해당 배너가 메인 히어로 섹션에 표시됩니다. (동시에 1개만 활성화)
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {banners.map(banner => (
                            <div key={banner.id} className="border rounded overflow-hidden">
                                <div className="relative h-48 bg-gray-100">
                                    <Image src={banner.image} alt={banner.title} fill className="object-cover" unoptimized />
                                    <div className={`absolute top-2 right-2 px-2 py-1 text-xs font-bold rounded shadow ${banner.status === 'Active' ? 'bg-green-500 text-white' : 'bg-white text-gray-600'
                                        }`}>
                                        {banner.status === 'Active' ? '✓ 활성' : '비활성'}
                                    </div>
                                </div>
                                <div className="p-4">
                                    <span className="font-bold block mb-3">{banner.title}</span>
                                    <div className="flex gap-2">
                                        {banner.status === 'Inactive' && (
                                            <button
                                                onClick={() => handleBannerActivate(banner.id)}
                                                className="flex-1 bg-green-600 text-white py-2 rounded text-sm font-bold hover:bg-green-700"
                                            >
                                                활성화
                                            </button>
                                        )}
                                        <button
                                            onClick={() => openBannerModal(banner)}
                                            className="flex-1 border border-gray-300 py-2 rounded text-sm hover:bg-gray-50"
                                        >
                                            수정
                                        </button>
                                        <button
                                            onClick={() => handleDeleteBanner(banner.id)}
                                            className="px-3 border border-red-300 text-red-600 py-2 rounded text-sm hover:bg-red-50"
                                        >
                                            삭제
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Popup Tab */}
            {tab === 'popup' && (
                <div className="bg-white border rounded p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="font-bold">팝업 관리</h2>
                        <button
                            onClick={() => openPopupModal()}
                            className="bg-black text-white px-4 py-2 rounded text-sm font-bold"
                        >
                            + 팝업 등록
                        </button>
                    </div>
                    <p className="text-sm text-gray-500 mb-4">
                        💡 &quot;활성화&quot; 버튼을 누르면 해당 팝업이 메인 페이지에 표시됩니다. (동시에 1개만 활성화)
                    </p>
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="p-3 text-left">미리보기</th>
                                <th className="p-3 text-left">제목</th>
                                <th className="p-3 text-left">링크</th>
                                <th className="p-3 text-center">상태</th>
                                <th className="p-3 text-right">관리</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {popups.map(popup => (
                                <tr key={popup.id}>
                                    <td className="p-3">
                                        <div className="w-16 h-16 relative bg-gray-100">
                                            <Image src={popup.image} alt={popup.title} fill className="object-cover" unoptimized />
                                        </div>
                                    </td>
                                    <td className="p-3 font-medium">{popup.title}</td>
                                    <td className="p-3 text-gray-500">{popup.link || '-'}</td>
                                    <td className="p-3 text-center">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${popup.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                                            }`}>
                                            {popup.status === 'Active' ? '✓ 활성' : '비활성'}
                                        </span>
                                    </td>
                                    <td className="p-3 text-right space-x-2">
                                        {popup.status === 'Inactive' && (
                                            <button
                                                onClick={() => handlePopupActivate(popup.id)}
                                                className="bg-green-600 text-white px-3 py-1 rounded text-xs font-bold hover:bg-green-700"
                                            >
                                                활성화
                                            </button>
                                        )}
                                        <button
                                            onClick={() => openPopupModal(popup)}
                                            className="text-blue-600 hover:underline text-sm"
                                        >
                                            수정
                                        </button>
                                        <button
                                            onClick={() => handleDeletePopup(popup.id)}
                                            className="text-red-600 hover:underline text-sm"
                                        >
                                            삭제
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Settings Tab */}
            {tab === 'settings' && (
                <div className="bg-white border rounded p-8 max-w-2xl">
                    <h2 className="text-xl font-bold mb-6">디자인 설정</h2>
                    <div className="space-y-8">
                        <div className="space-y-4">
                            <label className="block text-sm font-bold text-gray-700">포인트 컬러 영역</label>
                            <div className="flex items-center gap-6">
                                <div className="flex flex-col gap-2">
                                    <div className="w-20 h-20 rounded-lg border-2 border-gray-100 shadow-sm" style={{ backgroundColor: brandColor }} />
                                    <span className="text-[10px] text-center font-mono text-gray-400 uppercase">Preview</span>
                                </div>
                                <div className="flex-1 space-y-3">
                                    <div className="flex items-center gap-2">
                                        <input type="color" value={brandColor} onChange={(e) => setBrandColor(e.target.value)} className="w-12 h-12 p-1 bg-white border rounded cursor-pointer" />
                                        <input type="text" value={brandColor} onChange={(e) => setBrandColor(e.target.value)} className="flex-1 border rounded px-3 py-2.5 font-mono text-sm uppercase" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="pt-6 border-t">
                            <button onClick={handleSaveDesign} className="w-full bg-black text-white py-4 rounded font-bold hover:bg-gray-800 transition-colors">
                                설정 저장하기
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Banner Upload Modal */}
            {showBannerModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowBannerModal(false)}>
                    <div className="bg-white rounded-lg p-6 max-w-md w-full m-4" onClick={e => e.stopPropagation()}>
                        <h3 className="font-bold text-lg mb-4">{editingBanner ? '배너 수정' : '배너 등록'}</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold mb-1">배너 제목</label>
                                <input
                                    type="text"
                                    value={bannerForm.title}
                                    onChange={(e) => setBannerForm({ ...bannerForm, title: e.target.value })}
                                    className="w-full border rounded p-2"
                                    placeholder="배너 제목 입력"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-1">이미지 업로드</label>
                                <input type="file" accept="image/*" onChange={handleImageUpload} className="w-full border rounded p-2" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-1">또는 이미지 URL</label>
                                <input
                                    type="text"
                                    value={bannerForm.image}
                                    onChange={(e) => setBannerForm({ ...bannerForm, image: e.target.value })}
                                    className="w-full border rounded p-2"
                                    placeholder="https://..."
                                />
                            </div>
                            {(selectedImage || bannerForm.image) && (
                                <div className="relative w-full h-48 bg-gray-100 rounded overflow-hidden">
                                    <Image src={selectedImage || bannerForm.image} alt="Preview" fill className="object-cover" unoptimized />
                                </div>
                            )}
                            <div className="flex gap-2">
                                <button onClick={() => setShowBannerModal(false)} className="flex-1 border rounded py-2">취소</button>
                                <button onClick={handleSaveBanner} className="flex-1 bg-black text-white rounded py-2">저장</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Popup Upload Modal */}
            {showPopupModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowPopupModal(false)}>
                    <div className="bg-white rounded-lg p-6 max-w-md w-full m-4" onClick={e => e.stopPropagation()}>
                        <h3 className="font-bold text-lg mb-4">{editingPopup ? '팝업 수정' : '팝업 등록'}</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold mb-1">팝업 제목</label>
                                <input
                                    type="text"
                                    value={popupForm.title}
                                    onChange={(e) => setPopupForm({ ...popupForm, title: e.target.value })}
                                    className="w-full border rounded p-2"
                                    placeholder="팝업 제목 입력"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-1">클릭 시 이동 링크</label>
                                <input
                                    type="text"
                                    value={popupForm.link}
                                    onChange={(e) => setPopupForm({ ...popupForm, link: e.target.value })}
                                    className="w-full border rounded p-2"
                                    placeholder="/events 또는 https://..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-1">이미지 업로드</label>
                                <input type="file" accept="image/*" onChange={handleImageUpload} className="w-full border rounded p-2" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-1">또는 이미지 URL</label>
                                <input
                                    type="text"
                                    value={popupForm.image}
                                    onChange={(e) => setPopupForm({ ...popupForm, image: e.target.value })}
                                    className="w-full border rounded p-2"
                                    placeholder="https://..."
                                />
                            </div>
                            {(selectedImage || popupForm.image) && (
                                <div className="relative w-full h-48 bg-gray-100 rounded overflow-hidden">
                                    <Image src={selectedImage || popupForm.image} alt="Preview" fill className="object-cover" unoptimized />
                                </div>
                            )}
                            <div className="flex gap-2">
                                <button onClick={() => setShowPopupModal(false)} className="flex-1 border rounded py-2">취소</button>
                                <button onClick={handleSavePopup} className="flex-1 bg-black text-white rounded py-2">저장</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function AdminDesignPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <DesignContent />
        </Suspense>
    );
}
