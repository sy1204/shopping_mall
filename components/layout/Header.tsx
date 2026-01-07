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
            <header className="sticky top-0 z-50 w-full border-b border-[var(--tech-silver)] border-opacity-20 bg-white/95 backdrop-blur-md">
                <div className="container mx-auto flex h-16 items-center justify-between px-4">
                    {/* [N-D] Logo - prevent wrapping */}
                    <Link
                        href="/"
                        className="font-logo text-2xl md:text-4xl font-black tracking-tight text-[var(--neural-black)] hover:text-[var(--brand-accent)] transition-colors whitespace-nowrap shrink-0"
                    >
                        [N-D]
                    </Link>

                    {/* GNB - Hidden on mobile */}
                    <nav className="hidden lg:flex gap-8 text-sm font-medium font-mono">
                        <Link
                            href="/shop"
                            className="group flex items-center gap-2 hover:text-[var(--brand-accent)] transition-colors"
                        >
                            <span>[N-to-D] ESSENTIALS</span>
                        </Link>
                        <Link
                            href="/events"
                            className="group flex items-center gap-2 hover:text-[var(--brand-accent)] transition-colors"
                        >
                            <span>[N-in-D] HERITAGE</span>
                        </Link>
                        <Link
                            href="/open-shop"
                            className="group flex items-center gap-2 hover:text-[var(--brand-accent)] transition-colors"
                        >
                            <span>[N-beyond-D] LAB</span>
                        </Link>
                    </nav>

                    {/* Desktop Utilities - Hidden on mobile */}
                    <div className="hidden md:flex items-center gap-4 text-sm font-mono">
                        <span className="text-[var(--tech-silver)] opacity-30">─</span>

                        <button
                            onClick={() => setIsSearchOpen(!isSearchOpen)}
                            className="hover:text-[var(--brand-accent)] transition-colors"
                        >
                            {isSearchOpen ? '[ X ]' : 'SEARCH'}
                        </button>

                        {user?.isAdmin && (
                            <Link
                                href="/admin"
                                className="text-[var(--brand-accent)] font-semibold hover:underline"
                            >
                                ADMIN
                            </Link>
                        )}

                        {user ? (
                            <button
                                onClick={logout}
                                className="hover:text-[var(--neural-black)] text-[var(--tech-silver)] transition-colors"
                            >
                                LOGOUT
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
                            className="hover:text-[var(--brand-accent)] transition-colors"
                        >
                            MY PAGE
                        </Link>

                        <Link href="/checkout" className="relative hover:text-[var(--brand-accent)] transition-colors">
                            CART
                            {cartCount > 0 && (
                                <span className="absolute -top-2 -right-3 flex items-center justify-center">
                                    <Node state="active" size="sm" pulsing />
                                    <span className="ml-1 text-[10px] font-bold text-[var(--brand-accent)]">
                                        {cartCount}
                                    </span>
                                </span>
                            )}
                        </Link>
                    </div>

                    {/* Mobile: Cart + Hamburger */}
                    <div className="flex md:hidden items-center gap-3">
                        <Link href="/checkout" className="relative text-sm font-mono">
                            CART
                            {cartCount > 0 && (
                                <span className="absolute -top-2 -right-3 flex items-center justify-center">
                                    <Node state="active" size="sm" pulsing />
                                    <span className="ml-1 text-[10px] font-bold text-[var(--brand-accent)]">
                                        {cartCount}
                                    </span>
                                </span>
                            )}
                        </Link>
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="p-2 text-xl"
                            aria-label="메뉴"
                        >
                            {isMobileMenuOpen ? '✕' : '☰'}
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
