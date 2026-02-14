"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <nav className="flex justify-between items-center py-4 px-6 md:px-16 absolute w-full z-30 bg-white/90 backdrop-blur-md md:bg-transparent shadow-sm md:shadow-none">
                {/* Logo Area */}
                <Link href="/" className="flex items-center gap-2">
                    <img
                        src="/images/logo.png"
                        alt="Sweet N Sugary Logo"
                        className="h-16 w-auto rounded-full border-2 border-warm-cocoa/10"
                    />
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex space-x-8 text-sm font-semibold tracking-widest uppercase items-center">
                    <Link href="/" className="hover:text-dusty-rose transition text-dusty-rose">
                        Home
                    </Link>
                    <Link href="/menu" className="hover:text-dusty-rose transition">
                        Menu
                    </Link>
                    {/* <Link href="#" className="hover:text-dusty-rose transition">About</Link> */}
                    <Link
                        href="/contact"
                        className="px-6 py-2 border border-warm-cocoa rounded-full hover:bg-warm-cocoa hover:text-cream-puff transition"
                    >
                        Contact
                    </Link>
                </div>

                {/* Mobile Menu Button */}
                <button
                    id="menu-btn"
                    className="md:hidden text-warm-cocoa focus:outline-none"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? (
                        <svg
                            className="w-8 h-8"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M6 18L18 6M6 6l12 12"
                            ></path>
                        </svg>
                    ) : (
                        <svg
                            className="w-8 h-8"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4 6h16M4 12h16m-7 6h7"
                            ></path>
                        </svg>
                    )}
                </button>
            </nav>

            {/* Mobile Menu Overlay */}
            <div
                id="mobile-menu"
                className={`fixed inset-0 bg-cream-puff z-20 pt-24 px-6 md:hidden transition-transform duration-300 ease-in-out ${isOpen ? "translate-y-0" : "-translate-y-full"
                    }`}
            >
                <div className="flex flex-col space-y-6 text-center text-xl font-serif font-bold text-warm-cocoa">
                    <Link href="/" className="hover:text-dusty-rose" onClick={() => setIsOpen(false)}>
                        Home
                    </Link>
                    <Link href="/menu" className="hover:text-dusty-rose" onClick={() => setIsOpen(false)}>
                        Menu
                    </Link>
                    {/* <Link href="#" className="hover:text-dusty-rose">About</Link> */}
                    <Link href="/contact" className="hover:text-dusty-rose" onClick={() => setIsOpen(false)}>
                        Contact Us
                    </Link>
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
