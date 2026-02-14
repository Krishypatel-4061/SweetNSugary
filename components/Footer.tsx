import Link from "next/link";

export default function Footer() {
    return (
        <footer className="bg-cream-puff text-warm-cocoa py-12 border-t border-warm-cocoa/10">
            <div className="container mx-auto px-6 grid md:grid-cols-3 gap-12">
                <div>
                    <Link href="/" className="flex items-center gap-2 mb-4">
                        <img
                            src="/images/logo.png"
                            alt="Sweet N Sugary Logo"
                            className="h-12 w-auto rounded-full border border-warm-cocoa/10"
                        />
                        <div className="text-xl font-serif font-bold tracking-wide">
                            Sweet N Sugary
                        </div>
                    </Link>
                    <p className="text-sm opacity-80 leading-relaxed">
                        Custom Cakes & Desserts in Jamnagar.<br />
                        Crafting edible memories. Made with Love.
                    </p>
                </div>
                <div>
                    <h4 className="font-bold uppercase tracking-widest text-sm mb-6">
                        Quick Links
                    </h4>
                    <div className="flex flex-col space-y-3 text-sm opacity-80">
                        <Link href="/" className="hover:text-dusty-rose">
                            Home
                        </Link>
                        <Link href="/menu" className="hover:text-dusty-rose">
                            Menu
                        </Link>
                        <Link href="/contact" className="hover:text-dusty-rose">
                            Contact
                        </Link>
                    </div>
                </div>
                <div>
                    <h4 className="font-bold uppercase tracking-widest text-sm mb-6">
                        Contact
                    </h4>
                    <p className="text-sm opacity-80 leading-relaxed mb-4">
                        Jamnagar, Gujarat<br />
                        <a href="tel:+919726805395" className="hover:text-dusty-rose font-bold">
                            Call: +91 97268 05395
                        </a><br />
                        <a
                            href="mailto:hello@sweetnsugary.com"
                            className="hover:text-dusty-rose"
                        >
                            hello@sweetnsugary.com
                        </a>
                    </p>
                    {/* Socials */}
                    <div className="flex space-x-4">
                        <a
                            href="https://www.instagram.com/sweet__n__sugary__/"
                            target="_blank"
                            className="text-warm-cocoa hover:text-dusty-rose transition"
                        >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
            <div className="text-center text-xs opacity-50 mt-12">
                &copy; 2024 Sweet N Sugary. All rights reserved.
            </div>
        </footer>
    );
}
