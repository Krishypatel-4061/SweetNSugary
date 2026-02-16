"use client";

import { useState } from "react";
import Image from "next/image";

type Product = {
    id: number | string;
    name: string;
    price: string;
    image_url: string;
    description: string;
    category: string;
};

type MenuClientProps = {
    groupedProducts: Record<string, Product[]>;
};

export default function MenuClient({ groupedProducts }: MenuClientProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Helper to render a section
    const renderSection = (title: string, products: Product[]) => {
        if (!products || products.length === 0) return null;
        return (
            <section className="mb-20" key={title}>
                <div className="flex items-center gap-4 mb-10">
                    <h2 className="text-3xl font-serif font-bold text-warm-cocoa">{title}</h2>
                    <div className="h-px bg-warm-cocoa/20 flex-grow"></div>
                </div>
                <div className="grid md:grid-cols-3 gap-8">
                    {products.map((product, index) => (
                        <div
                            key={product.id}
                            className={`group fade-in ${index % 3 === 0
                                ? "delay-100"
                                : index % 3 === 1
                                    ? "delay-200"
                                    : "delay-300"
                                }`}
                        >
                            <div className="relative overflow-hidden rounded-xl aspect-[4/5] mb-4">
                                <Image
                                    src={product.image_url}
                                    alt={product.name}
                                    fill
                                    className="object-cover group-hover:scale-110 transition duration-500"
                                />
                            </div>
                            <div className="flex justify-between items-start text-warm-cocoa">
                                <div>
                                    <h3 className="text-xl font-bold font-serif mb-1">
                                        {product.name}
                                    </h3>
                                    <p className="text-sm opacity-70">{product.description}</p>
                                </div>
                                <span className="text-dusty-rose font-bold">{product.price}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        );
    };

    return (
        <main className="pb-24">
            {/* Header */}
            <header className="py-20 text-center relative overflow-hidden pt-32">
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-dusty-rose opacity-10 rounded-full blur-3xl"></div>
                <div className="container mx-auto px-6 relative z-10">
                    <span className="text-dusty-rose font-bold tracking-widest uppercase text-sm mb-4 block">
                        Handcrafted Delights
                    </span>
                    <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6 text-warm-cocoa">
                        Our Menu
                    </h1>
                    <p className="max-w-2xl mx-auto text-lg text-warm-cocoa/80 mb-8">
                        Explore our menu of handcrafted delights! From customized wedding
                        cakes to eggless cookies and tea-time treats. The sweetest menu in
                        Jamnagar, Gujarat.
                    </p>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-sage-green text-white rounded-full font-bold hover:bg-opacity-90 transition"
                    >
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                            />
                        </svg>
                        View Flavor Guide
                    </button>
                </div>
            </header>

            {/* Menu Sections */}
            <div className="container mx-auto px-6">
                {renderSection("Custom Cakes", groupedProducts["Custom Cakes"])}
                {renderSection("Cookies & Jars", groupedProducts["Cookies & Jars"])}

                {/* Ready to Eat - Special Layout handled separately or just generic? 
            Original had 4 columns and icons. For simplicity, treating as generic for now 
            unless I want to preserve the exact icons layout. 
            The DB schema calls for 'image_url', so I'll stick to image layout. 
            If I want icons, I'd need extra logic. 
            For Phase 2 dynamic, images are better.
        */}
                {renderSection("Ready-to-Eat Treats", groupedProducts["Ready-to-Eat Treats"])}
            </div>

            {/* Flavor Guide Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-cream-puff p-8 w-full max-w-2xl rounded-2xl shadow-2xl relative animate-in fade-in zoom-in duration-200">
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-4 right-4 text-warm-cocoa hover:text-dusty-rose"
                        >
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                        <h2 className="text-3xl font-serif font-bold mb-6 text-center text-warm-cocoa">
                            Flavor Guide
                        </h2>
                        <div className="space-y-6 text-warm-cocoa">
                            <div>
                                <h3 className="font-bold text-dusty-rose mb-2 uppercase tracking-wide text-xs">
                                    Classics
                                </h3>
                                <p className="text-sm">
                                    Vanilla Bean, Double Chocolate, Red Velvet, Pineapple
                                </p>
                            </div>
                            <div>
                                <h3 className="font-bold text-dusty-rose mb-2 uppercase tracking-wide text-xs">
                                    Premium
                                </h3>
                                <p className="text-sm">
                                    Biscoff, Nutella Hazelnut, Rasmalai, Blueberry Cheesecake
                                </p>
                            </div>
                            <div>
                                <h3 className="font-bold text-dusty-rose mb-2 uppercase tracking-wide text-xs">
                                    Frostings
                                </h3>
                                <p className="text-sm">
                                    Swiss Meringue Buttercream, Chocolate Ganache, Whipped Cream
                                </p>
                            </div>
                            <div className="bg-white p-4 rounded-lg mt-6">
                                <p className="text-xs text-center italic opacity-70">
                                    * All cakes are available in Eggless options. Custom flavors
                                    available on request.
                                </p>
                            </div>
                        </div>
                        <div className="mt-8 text-center">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-6 py-2 bg-warm-cocoa text-cream-puff rounded-full font-bold text-sm"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}
