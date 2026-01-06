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

    return (
        <>
            <header className="sticky top-0 z-50 w-full border-b border-[var(--tech-silver)] border-opacity-20 bg-white/95 backdrop-blur-md">
                <div className="container mx-auto flex h-16 items-center justify-between px-4">
                    {/* [N-D] Logo */}
                    <Link
                        href="/"
                        className="font-logo text-4xl font-black tracking-tight text-[var(--neural-black)] hover:text-[var(--brand-accent)] transition-colors"
                    >
                        [N-D]
                    </Link>

                    {/* GNB - [N-D] Navigation Structure */}
                    <nav className="hidden md:flex gap-8 text-sm font-medium font-mono">
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

                    {/* Utilities */}
                    <div className="flex items-center gap-5 text-sm font-mono">
                        {/* Dash Separator */}
                        <span className="hidden md:inline text-[var(--tech-silver)] opacity-30">─</span>

                        {/* Search */}
                        <button
                            onClick={() => setIsSearchOpen(!isSearchOpen)}
                            className="hover:text-[var(--brand-accent)] transition-colors"
                        >
                            {isSearchOpen ? '[ CLOSE ]' : 'SEARCH'}
                        </button>

                        {/* Admin Link (Conditional) */}
                        {user?.isAdmin && (
                            <Link
                                href="/admin"
                                className="text-[var(--brand-accent)] font-semibold hover:underline"
                            >
                                ADMIN
                            </Link>
                        )}

                        {user ? (
                            <>
                                <button
                                    onClick={logout}
                                    className="hover:text-[var(--neural-black)] text-[var(--tech-silver)] transition-colors"
                                >
                                    LOGOUT
                                </button>
                            </>
                        ) : (
                            <Link
                                href="/auth/login"
                                className="hover:text-[var(--brand-accent)] transition-colors"
                            >
                                LOGIN
                            </Link>
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
                </div>
            </header>

            {/* Search Overlay */}
            {isSearchOpen && (
                <div className="bg-white border-b border-[var(--tech-silver)] border-opacity-20 py-6 animate-in slide-in-from-top-2">
                    <div className="container mx-auto px-4">
                        <form onSubmit={handleSearch} className="relative">
                            <div className="flex items-center gap-4">
                                <span className="font-mono text-[var(--tech-silver)]">[</span>
                                <input
                                    type="search"
                                    placeholder="검색어를 입력하세요 (예: 코트, 자켓)"
                                    className="flex-1 text-xl font-serif border-b-2 border-[var(--neural-black)] py-2 focus:outline-none focus:border-[var(--brand-accent)] transition-colors"
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
                                <span className="font-mono text-[var(--tech-silver)]">]</span>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
