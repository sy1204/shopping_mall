// app/admin/layout.tsx
'use client';

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, logout, isLoading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [hoveredMenu, setHoveredMenu] = useState<string | null>(null);

    // Close mobile menu when route changes
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [pathname]);

    useEffect(() => {
        if (!isLoading) {
            if (!user || user.isAdmin !== true) {
                if (pathname !== '/admin/login') {
                    alert('관리자 권한이 필요합니다.');
                    router.push('/admin/login');
                }
            }
        }
    }, [user, isLoading, router, pathname]);

    const activeSection = useMemo(() => {
        if (pathname.startsWith('/admin/products')) return 'products';
        if (pathname.startsWith('/admin/orders')) return 'orders';
        if (pathname.startsWith('/admin/users')) return 'users';
        if (pathname.startsWith('/admin/board')) return 'board';
        if (pathname.startsWith('/admin/design')) return 'design';
        if (pathname.startsWith('/admin/stats')) return 'stats';
        if (pathname.startsWith('/admin/settings')) return 'settings';
        return 'dashboard';
    }, [pathname]);

    const subMenus = useMemo(() => {
        switch (activeSection) {
            case 'products':
                return [
                    { label: '전체 상품 관리', href: '/admin/products' },
                    { label: '상품 등록', href: '/admin/products/new' },
                ];
            case 'orders':
                return [
                    { label: '전체 주문 통합', href: '/admin/orders' },
                    { label: '배송 관리', href: '/admin/orders?filter=delivery' },
                    { label: '취소/교환/반품', href: '/admin/orders?filter=claims' },
                ];
            case 'users':
                return [
                    { label: '회원 목록', href: '/admin/users' },
                ];
            case 'board':
                return [
                    { label: '공지사항 관리', href: '/admin/board?tab=notice' },
                    { label: 'FAQ 관리', href: '/admin/board?tab=faq' },
                    { label: '1:1 문의 관리', href: '/admin/board?tab=inquiry' },
                    { label: '상품 문의 관리', href: '/admin/board?tab=product_inquiry' },
                    { label: '상품 후기 관리', href: '/admin/board?tab=review' },
                ];
            case 'design':
                return [
                    { label: '메인 배너 관리', href: '/admin/design?tab=banner' },
                    { label: '팝업 관리', href: '/admin/design?tab=popup' },
                    { label: '디자인 설정', href: '/admin/design?tab=settings' },
                ];
            case 'stats':
                return [
                    { label: '매출 통계', href: '/admin/stats?tab=sales' },
                    { label: '방문자 통계', href: '/admin/stats?tab=visitors' },
                ];
            case 'settings':
                return [
                    { label: '기본 설정', href: '/admin/settings' },
                    { label: '약관/정책 관리', href: '/admin/settings?tab=terms' },
                ];
            default: // dashboard
                return [
                    { label: '대시보드 홈', href: '/admin' },
                ];
        }
    }, [activeSection]);

    if (pathname === '/admin/login') {
        return <>{children}</>;
    }

    if (isLoading || !user || !user.isAdmin) return null;

    return (
        <div className="flex flex-col h-screen bg-white">
            {/* Top Navigation Bar (GNB) */}
            <header className="h-16 bg-black text-white flex items-center px-4 md:px-6 justify-between flex-shrink-0 z-20 relative">
                <div className="flex items-center gap-4 md:gap-12">
                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2 -ml-2 text-white hover:bg-gray-800 rounded"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        ) : (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                        )}
                    </button>

                    <Link href="/admin" className="flex flex-col hover:opacity-80 transition-opacity">
                        <h1 className="text-xl font-bold tracking-tight">ADMIN</h1>
                        <span className="text-[10px] text-gray-400 -mt-1 hidden md:block">Management System</span>
                    </Link>

                    <Link href="/" target="_blank" className="flex items-center gap-1 text-xs text-gray-400 hover:text-white border border-gray-700 px-2 py-1 rounded transition-colors">
                        <span className="hidden md:inline">Shop Home</span>
                        <span className="md:hidden">Shop</span>
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                    </Link>

                    <nav className="hidden md:flex gap-1 relative">
                        {[
                            { id: 'products', label: '상품 관리', href: '/admin/products' },
                            { id: 'orders', label: '주문 관리', href: '/admin/orders' },
                            { id: 'users', label: '회원 관리', href: '/admin/users' },
                            { id: 'board', label: '게시판 관리', href: '/admin/board' },
                            { id: 'design', label: '전시 관리', href: '/admin/design' },
                            { id: 'stats', label: '통계 관리', href: '/admin/stats' },
                            { id: 'settings', label: '시스템 관리', href: '/admin/settings' },
                        ].map(menu => {
                            const menuSubItems = (() => {
                                switch (menu.id) {
                                    case 'products':
                                        return [
                                            { label: '전체 상품 관리', href: '/admin/products' },
                                            { label: '상품 등록', href: '/admin/products/new' },
                                        ];
                                    case 'orders':
                                        return [
                                            { label: '전체 주문 통합', href: '/admin/orders' },
                                            { label: '배송 관리', href: '/admin/orders?filter=delivery' },
                                            { label: '취소/교환/반품', href: '/admin/orders?filter=claims' },
                                        ];
                                    case 'users':
                                        return [
                                            { label: '회원 목록', href: '/admin/users' },
                                        ];
                                    case 'board':
                                        return [
                                            { label: '공지사항 관리', href: '/admin/board?tab=notice' },
                                            { label: 'FAQ 관리', href: '/admin/board?tab=faq' },
                                            { label: '1:1 문의 관리', href: '/admin/board?tab=inquiry' },
                                            { label: '상품 후기 관리', href: '/admin/board?tab=review' },
                                        ];
                                    case 'design':
                                        return [
                                            { label: '메인 배너 관리', href: '/admin/design?tab=banner' },
                                            { label: '팝업 관리', href: '/admin/design?tab=popup' },
                                            { label: '디자인 설정', href: '/admin/design?tab=settings' },
                                        ];
                                    case 'stats':
                                        return [
                                            { label: '매출 통계', href: '/admin/stats?tab=sales' },
                                            { label: '방문자 통계', href: '/admin/stats?tab=visitors' },
                                        ];
                                    case 'settings':
                                        return [
                                            { label: '기본 설정', href: '/admin/settings?tab=basic' },
                                            { label: '약관/정책 관리', href: '/admin/settings?tab=policy' },
                                        ];
                                    default:
                                        return [];
                                }
                            })();

                            return (
                                <div
                                    key={menu.id}
                                    className="relative"
                                    onMouseEnter={() => setHoveredMenu(menu.id)}
                                    onMouseLeave={() => setHoveredMenu(null)}
                                >
                                    <Link
                                        href={menu.href}
                                        className={`block px-4 py-5 text-sm font-medium transition-colors border-b-4 ${activeSection === menu.id
                                            ? 'border-white text-white'
                                            : 'border-transparent text-gray-400 hover:text-white'
                                            }`}
                                    >
                                        {menu.label}
                                    </Link>

                                    {/* Dropdown Menu */}
                                    {hoveredMenu === menu.id && menuSubItems.length > 0 && (
                                        <div className="absolute top-full left-0 bg-gray-800 shadow-lg rounded-b-md py-2 min-w-[200px] z-50">
                                            {menuSubItems.map((subItem, idx) => (
                                                <Link
                                                    key={idx}
                                                    href={subItem.href}
                                                    className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                                                >
                                                    {subItem.label}
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </nav>
                </div>

                <div className="flex items-center gap-4">
                    <div className="text-right hidden md:block">
                        <p className="text-sm font-bold">{user.name} 님</p>
                        <p className="text-xs text-gray-400">최고 관리자</p>
                    </div>
                    <button
                        onClick={() => {
                            logout();
                            router.push('/');
                        }}
                        className="text-xs border border-gray-600 px-3 py-1.5 rounded hover:bg-gray-800 transition-colors"
                    >
                        로그아웃
                    </button>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden relative">
                {/* Mobile Backdrop */}
                {isMobileMenuOpen && (
                    <div
                        className="absolute inset-0 bg-black bg-opacity-50 z-10 md:hidden"
                        onClick={() => setIsMobileMenuOpen(false)}
                    />
                )}

                {/* Left Sidebar (LNB) */}
                <aside className={`
                    absolute md:relative z-20 h-full w-64 bg-white border-r flex-shrink-0 overflow-y-auto transition-transform duration-200 ease-in-out
                    ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
                `}>
                    <div className="p-6">
                        {/* Mobile Main Menu (Section Switcher) */}
                        <div className="md:hidden space-y-1 mb-6 pb-6 border-b">
                            <h2 className="text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">SECTIONS</h2>
                            {[
                                { id: 'dashboard', label: '대시보드 홈', href: '/admin' },
                                { id: 'products', label: '상품 관리', href: '/admin/products' },
                                { id: 'orders', label: '주문 관리', href: '/admin/orders' },
                                { id: 'users', label: '회원 관리', href: '/admin/users' },
                                { id: 'board', label: '게시판 관리', href: '/admin/board' },
                                { id: 'design', label: '전시 관리', href: '/admin/design' },
                                { id: 'stats', label: '통계 관리', href: '/admin/stats' },
                                { id: 'settings', label: '시스템 관리', href: '/admin/settings' },
                            ].map(item => (
                                <Link
                                    key={item.id}
                                    href={item.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`block px-3 py-2 rounded text-sm font-bold ${activeSection === item.id ? 'bg-black text-white' : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </div>

                        <h2 className="text-xs font-bold text-gray-400 mb-4 uppercase tracking-wider">
                            {activeSection === 'dashboard' && 'DASHBOARD'}
                            {activeSection === 'products' && 'PRODUCT'}
                            {activeSection === 'orders' && 'ORDER'}
                            {activeSection === 'users' && 'USER'}
                            {activeSection === 'board' && 'BOARD'}
                            {activeSection === 'design' && 'DESIGN'}
                            {activeSection === 'stats' && 'STATISTICS'}
                            {activeSection === 'settings' && 'SYSTEM'}
                        </h2>
                        <nav className="space-y-1">
                            {subMenus.map(menu => (
                                <Link
                                    key={menu.label}
                                    href={menu.href}
                                    className={`block px-3 py-2 rounded text-sm transition-colors ${pathname === menu.href
                                        ? 'bg-gray-100 text-black font-bold'
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-black'
                                        }`}
                                >
                                    {menu.label}
                                </Link>
                            ))}
                        </nav>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 overflow-auto p-4 md:p-10 w-full">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
