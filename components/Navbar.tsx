/**
 * components/Navbar.tsx
 *
 * Site-wide navigation bar for Sweet N Sugary.
 * Renders as an absolute overlay on the hero section, transitioning
 * to a white/glass style on smaller screens.
 *
 * Features:
 * - Checks /api/auth/me on mount to detect if a user is logged in.
 * - Shows "Admin" link if the logged-in user has the admin role.
 * - Toggles a full-screen mobile slide-down menu.
 * - Handles logout by calling the logout API route.
 */

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [user, setUser] = useState<{ role: string } | null>(null);
    const router = useRouter();

    // Check authentication status once on initial render
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await fetch('/api/auth/me');
                if (res.ok) {
                    const data = await res.json();
                    setUser(data.user);
                }
            } catch (err) {
                console.error("Auth check failed:", err);
            }
        };
        checkAuth();
    }, []);

    /** Calls the logout endpoint, clears user state, and redirects home. */
    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        setUser(null);
        router.push('/');
        router.refresh();
    };

    return (
        <>
            {/* ─── Desktop & Mobile Top Bar ──────────────────────────────── */}
            <nav className="flex justify-between items-center py-4 px-6 md:px-16 absolute w-full z-30 bg-white/90 backdrop-blur-md md:bg-transparent shadow-sm md:shadow-none">

                {/* Logo */}
                <Link href="/" className="flex items-center gap-2">
                    <img
                        src="/images/logo.png"
                        alt="Sweet N Sugary Logo"
                        className="h-16 w-auto rounded-full border-2 border-warm-cocoa/10"
                    />
                </Link>

                {/* Desktop Navigation Links */}
                <div className="hidden md:flex space-x-8 text-sm font-semibold tracking-widest uppercase items-center">
                    <Link href="/" className="hover:text-dusty-rose transition text-dusty-rose">Home</Link>
                    <Link href="/menu" className="hover:text-dusty-rose transition">Menu</Link>
                    <Link href="/builder" className="hover:text-dusty-rose transition">Design Cake</Link>
                    <Link href="/track" className="hover:text-dusty-rose transition">Track Order</Link>

                    {/* Admin link — only visible to admin users */}
                    {user?.role === 'admin' && (
                        <Link href="/admin" className="hover:text-dusty-rose transition text-xs font-bold text-purple-800">
                            Admin
                        </Link>
                    )}

                    {/* Auth: Login or Logout depending on session state */}
                    {!user ? (
                        <Link href="/login" className="hover:text-dusty-rose transition">Login</Link>
                    ) : (
                        <button onClick={handleLogout} className="hover:text-dusty-rose transition">
                            Logout
                        </button>
                    )}

                    <Link
                        href="/contact"
                        className="px-6 py-2 border border-warm-cocoa rounded-full hover:bg-warm-cocoa hover:text-cream-puff transition"
                    >
                        Contact
                    </Link>
                </div>

                {/* Mobile Hamburger / Close Button */}
                <button
                    id="menu-btn"
                    className="md:hidden text-warm-cocoa focus:outline-none"
                    onClick={() => setIsOpen(!isOpen)}
                    aria-label="Toggle navigation menu"
                >
                    {isOpen ? (
                        // Close (X) icon
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    ) : (
                        // Hamburger (≡) icon
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                        </svg>
                    )}
                </button>
            </nav>

            {/* ─── Mobile Full-Screen Menu ────────────────────────────────── */}
            <div
                id="mobile-menu"
                className={`fixed inset-0 bg-cream-puff z-20 pt-24 px-6 md:hidden transition-transform duration-300 ease-in-out ${isOpen ? "translate-y-0" : "-translate-y-full"}`}
            >
                <div className="flex flex-col space-y-6 text-center text-xl font-serif font-bold text-warm-cocoa">
                    <Link href="/" className="hover:text-dusty-rose" onClick={() => setIsOpen(false)}>Home</Link>
                    <Link href="/menu" className="hover:text-dusty-rose" onClick={() => setIsOpen(false)}>Menu</Link>
                    <Link href="/builder" className="hover:text-dusty-rose" onClick={() => setIsOpen(false)}>Design a Cake</Link>
                    <Link href="/track" className="hover:text-dusty-rose" onClick={() => setIsOpen(false)}>Track Order</Link>

                    {user?.role === 'admin' && (
                        <Link href="/admin" className="hover:text-dusty-rose text-purple-800" onClick={() => setIsOpen(false)}>
                            Admin Dashboard
                        </Link>
                    )}

                    {!user ? (
                        <Link href="/login" className="hover:text-dusty-rose" onClick={() => setIsOpen(false)}>Login</Link>
                    ) : (
                        <button onClick={() => { handleLogout(); setIsOpen(false); }} className="hover:text-dusty-rose">
                            Logout
                        </button>
                    )}

                    <Link href="/contact" className="hover:text-dusty-rose" onClick={() => setIsOpen(false)}>Contact Us</Link>

                    {/* WhatsApp CTA — quick order link in mobile menu */}
                    <div className="pt-8 border-t border-warm-cocoa/10">
                        <a
                            href="https://wa.me/919726805395"
                            className="block w-full bg-warm-cocoa text-cream-puff py-3 rounded-full text-base font-sans"
                        >
                            Order on WhatsApp
                        </a>
                    </div>
                </div>
            </div>
        </>
    );
}
