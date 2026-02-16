import Link from "next/link";

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-cream-puff text-center px-4">
            <h1 className="text-9xl font-serif font-bold text-dusty-rose mb-4">404</h1>
            <h2 className="text-3xl font-bold text-warm-cocoa mb-6">
                Oops! This page has crumbled. 🍪
            </h2>
            <p className="text-lg text-warm-cocoa/80 mb-8 max-w-md">
                We can&apos;t seem to find the page you&apos;re looking for. It might have been eaten or never existed.
            </p>
            <Link
                href="/"
                className="bg-warm-cocoa text-cream-puff px-8 py-3 rounded-full font-bold hover:bg-opacity-90 transition shadow-lg"
            >
                Return Home 🏠
            </Link>
        </div>
    );
}
