// components/layout/Header.tsx
'use client';

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import Node from "@/components/ui/Node";

export default function Header() {
    const { cartCount } = useCart();
    const { user, logout } = useAuth();
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [searchKeyword, setSearchKeyword] = useState("");
    const router = useRouter();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchKeyword.trim()) {
            router.push(`/shop?q=${encodeURIComponent(searchKeyword)}`);
            setIsSearchOpen(false);
            setSearchKeyword("");
        }
    };

    const closeMobileMenu = () => setIsMobileMenuOpen(false);

    return (
        <>
            <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/95 backdrop-blur-md transition-all duration-300">
                <div className="max-w-[1920px] mx-auto flex h-20 items-center justify-between px-6 lg:px-12">
                    {/* [N-D] Logo */}
                    <Link
                        href="/"
                        className="nd-logo font-serif text-2xl lg:text-3xl font-light tracking-widest text-[var(--neural-black)] whitespace-nowrap shrink-0"
                    >
                        <span className="nd-logo-bracket nd-logo-bracket-left font-sans font-light">[</span>
                        <span className="font-bold">N</span>
                        <span className="text-[var(--primary)]">-</span>
                        <span className="font-bold">D</span>
                        <span className="nd-logo-bracket nd-logo-bracket-right font-sans font-light">]</span>
                    </Link>

                    {/* GNB - Hidden on mobile */}
                    {/* GNB Navigation */}
                    <nav className="hidden lg:flex items-center gap-12 text-xs uppercase tracking-[0.2em] font-medium">
                        <Link href="/shop" className="nd-link hover:text-[var(--primary)] transition-colors">
                            쇼핑
                        </Link>
                        <Link href="/events" className="nd-link hover:text-[var(--primary)] transition-colors">
                            에디토리얼
                        </Link>
                    </nav>

                    {/* Right Navigation */}
                    <nav className="hidden lg:flex items-center gap-8 text-xs uppercase tracking-[0.2em] font-medium">
                        <Link href="/chat" className="group flex items-center gap-1 hover:text-[var(--primary)] transition-colors">
                            <span className="text-[var(--primary)] opacity-0 group-hover:opacity-100 transition-opacity">●</span>
                            [ AI 큐레이터 ]
                        </Link>
                        <Link href="/open-shop" className="group flex items-center gap-1 hover:text-[var(--primary)] transition-colors">
                            <span className="text-[var(--primary)] opacity-0 group-hover:opacity-100 transition-opacity">●</span>
                            [ Brand Store ]
                        </Link>
                    </nav>

                    {/* Desktop Utilities - Hidden on mobile */}
                    {/* Utility Icons */}
                    <div className="hidden md:flex items-center gap-4">
                        <button
                            onClick={() => setIsSearchOpen(!isSearchOpen)}
                            className="hover:text-[var(--primary)] transition-colors p-2"
                            aria-label="검색"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                            </svg>
                        </button>

                        {user?.isAdmin && (
                            <Link
                                href="/admin"
                                className="text-[var(--primary)] font-semibold hover:underline"
                            >
                                ADMIN
                            </Link>
                        )}

                        {user ? (
                            <button
                                onClick={logout}
                                className="hover:text-[var(--primary)] text-[var(--tech-silver)] transition-colors p-2"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                                </svg>
                            </button>
                        ) : (
                            <>
                                <Link
                                    href="/auth/login"
                                    className="hover:text-[var(--brand-accent)] transition-colors"
                                >
                                    LOGIN
                                </Link>
                                <Link
                                    href="/signup"
                                    className="hover:text-[var(--brand-accent)] transition-colors"
                                >
                                    SIGNUP
                                </Link>
                            </>
                        )}

                        <Link
                            href="/mypage"
                            className="hover:text-[var(--primary)] transition-colors p-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                            </svg>
                        </Link>

                        <Link href="/checkout" className="relative hover:text-[var(--primary)] transition-colors p-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                            </svg>
                            {cartCount > 0 && (
                                <span className="absolute top-0 right-0 w-2 h-2 bg-[var(--primary)] rounded-full"></span>
                            )}
                        </Link>

                        {/* Tablet Hamburger (Visible on MD, Hidden on LG) */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="lg:hidden p-2 -mr-2 hover:text-[var(--brand-accent)] transition-colors"
                            aria-label="메뉴"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                            </svg>
                        </button>
                    </div>

                    {/* Mobile: Icon-based utilities - Minimal monochrome icons */}
                    <div className="flex md:hidden items-center gap-0.5">
                        {/* Search */}
                        <button
                            onClick={() => setIsSearchOpen(!isSearchOpen)}
                            className="p-2 hover:text-[var(--brand-accent)] transition-colors"
                            aria-label="검색"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                            </svg>
                        </button>

                        {/* Login/Logout */}
                        {user ? (
                            <button
                                onClick={logout}
                                className="p-2 hover:text-[var(--brand-accent)] transition-colors"
                                aria-label="로그아웃"
                                title="로그아웃"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                                </svg>
                            </button>
                        ) : (
                            <Link
                                href="/auth/login"
                                className="p-2 hover:text-[var(--brand-accent)] transition-colors"
                                aria-label="로그인"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                                </svg>
                            </Link>
                        )}

                        {/* Signup - only show when not logged in */}
                        {!user && (
                            <Link
                                href="/signup"
                                className="p-2 hover:text-[var(--brand-accent)] transition-colors"
                                aria-label="회원가입"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
                                </svg>
                            </Link>
                        )}

                        {/* My Page */}
                        <Link
                            href="/mypage"
                            className="p-2 hover:text-[var(--brand-accent)] transition-colors"
                            aria-label="마이페이지"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                            </svg>
                        </Link>

                        {/* Cart */}
                        <Link
                            href="/checkout"
                            className="relative p-2 hover:text-[var(--brand-accent)] transition-colors"
                            aria-label="장바구니"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                            </svg>
                            {cartCount > 0 && (
                                <span className="absolute top-0.5 right-0.5 flex items-center justify-center">
                                    <Node state="active" size="sm" pulsing />
                                    <span className="ml-0.5 text-[10px] font-bold text-[var(--brand-accent)]">
                                        {cartCount}
                                    </span>
                                </span>
                            )}
                        </Link>

                        {/* Hamburger Menu */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="p-2"
                            aria-label="메뉴"
                        >
                            {isMobileMenuOpen ? (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            ) : (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-40 bg-white md:hidden">
                    <div className="flex flex-col h-full">
                        {/* Mobile Menu Header */}
                        <div className="flex items-center justify-between h-16 px-4 border-b">
                            <Link href="/" className="font-logo text-2xl font-black" onClick={closeMobileMenu}>
                                [N-D]
                            </Link>
                            <button onClick={closeMobileMenu} className="p-2 text-xl">✕</button>
                        </div>

                        {/* Mobile Menu Links */}
                        <nav className="flex-1 overflow-y-auto py-6">
                            <div className="space-y-1 px-4">
                                <Link
                                    href="/shop"
                                    onClick={closeMobileMenu}
                                    className="block py-4 text-lg font-bold border-b hover:bg-gray-50"
                                >
                                    SHOP
                                </Link>
                                <Link
                                    href="/events"
                                    onClick={closeMobileMenu}
                                    className="block py-4 text-lg font-bold border-b hover:bg-gray-50"
                                >
                                    HERITAGE
                                </Link>
                                <Link
                                    href="/open-shop"
                                    onClick={closeMobileMenu}
                                    className="block py-4 text-lg font-bold border-b hover:bg-gray-50"
                                >
                                    LAB
                                </Link>
                            </div>

                            <div className="mt-6 px-4 space-y-1">
                                <button
                                    onClick={() => { setIsSearchOpen(true); closeMobileMenu(); }}
                                    className="block w-full text-left py-4 text-lg border-b hover:bg-gray-50"
                                >
                                    🔍 검색
                                </button>

                                {user?.isAdmin && (
                                    <Link
                                        href="/admin"
                                        onClick={closeMobileMenu}
                                        className="block py-4 text-lg border-b text-[var(--brand-accent)] hover:bg-gray-50"
                                    >
                                        ADMIN
                                    </Link>
                                )}

                                <Link
                                    href="/mypage"
                                    onClick={closeMobileMenu}
                                    className="block py-4 text-lg border-b hover:bg-gray-50"
                                >
                                    MY PAGE
                                </Link>

                                {user ? (
                                    <button
                                        onClick={() => { logout(); closeMobileMenu(); }}
                                        className="block w-full text-left py-4 text-lg border-b text-gray-500 hover:bg-gray-50"
                                    >
                                        로그아웃
                                    </button>
                                ) : (
                                    <>
                                        <Link
                                            href="/auth/login"
                                            onClick={closeMobileMenu}
                                            className="block py-4 text-lg border-b hover:bg-gray-50"
                                        >
                                            로그인
                                        </Link>
                                        <Link
                                            href="/signup"
                                            onClick={closeMobileMenu}
                                            className="block py-4 text-lg border-b hover:bg-gray-50"
                                        >
                                            회원가입
                                        </Link>
                                    </>
                                )}
                            </div>
                        </nav>
                    </div>
                </div>
            )}

            {/* Search Overlay */}
            {isSearchOpen && (
                <div className="bg-white border-b border-[var(--tech-silver)] border-opacity-20 py-6 animate-in slide-in-from-top-2">
                    <div className="container mx-auto px-4">
                        <form onSubmit={handleSearch} className="relative">
                            <div className="flex items-center gap-2 md:gap-4">
                                <span className="font-mono text-[var(--tech-silver)] hidden md:inline">[</span>
                                <input
                                    type="search"
                                    placeholder="검색어 입력..."
                                    className="flex-1 text-lg md:text-xl font-serif border-b-2 border-[var(--neural-black)] py-2 focus:outline-none focus:border-[var(--brand-accent)] transition-colors"
                                    value={searchKeyword}
                                    onChange={(e) => setSearchKeyword(e.target.value)}
                                    autoFocus
                                />
                                <button
                                    type="submit"
                                    className="font-mono text-xl hover:text-[var(--brand-accent)] transition-colors"
                                >
                                    →
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsSearchOpen(false)}
                                    className="font-mono text-xl hover:text-[var(--brand-accent)] transition-colors ml-2"
                                >
                                    ✕
                                </button>
                                <span className="font-mono text-[var(--tech-silver)] hidden md:inline">]</span>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
