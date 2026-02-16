"use client";

import { useEffect } from "react";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-cream-puff text-center px-4">
            <h2 className="text-3xl font-serif font-bold text-warm-cocoa mb-4">
                Something went wrong! 🍰
            </h2>
            <p className="text-warm-cocoa/80 mb-8">
                Don&apos;t worry, our bakers are looking into it.
            </p>
            <button
                onClick={() => reset()}
                className="bg-dusty-rose text-white px-8 py-3 rounded-full font-bold hover:bg-opacity-90 transition shadow-lg"
            >
                Try Again 🔄
            </button>
        </div>
    );
}
