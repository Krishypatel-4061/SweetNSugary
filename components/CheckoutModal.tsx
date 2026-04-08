/**
 * components/CheckoutModal.tsx
 *
 * Guest Checkout overlay for the Cake Builder.
 * Collects the customer's name and email before confirming the order.
 * Styled to match the Sweet N Sugary warm bakery design system.
 */

"use client";

import { useState, useRef, useEffect } from "react";

interface CheckoutModalProps {
    totalPrice: number;
    onClose: () => void;
    onConfirm: (name: string, email: string) => void;
}

export default function CheckoutModal({ totalPrice, onClose, onConfirm }: CheckoutModalProps) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [errors, setErrors] = useState<{ name?: string; email?: string }>({});
    const nameRef = useRef<HTMLInputElement>(null);

    // Auto-focus the name field when the modal opens
    useEffect(() => {
        nameRef.current?.focus();
    }, []);

    // Close modal on Escape key
    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [onClose]);

    const validate = (): boolean => {
        const newErrors: { name?: string; email?: string } = {};

        if (!name.trim()) {
            newErrors.name = "Name is required";
        }

        if (!email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            newErrors.email = "Please enter a valid email";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            onConfirm(name.trim(), email.trim().toLowerCase());
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center"
            role="dialog"
            aria-modal="true"
            aria-labelledby="checkout-title"
        >
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal Card */}
            <div className="relative w-full max-w-md mx-4 bg-[#F9F5F0] rounded-2xl shadow-2xl border border-[#5D4037]/10 overflow-hidden animate-in">
                {/* Header */}
                <div className="bg-[#5D4037] px-6 py-5 flex items-center justify-between">
                    <div>
                        <h2
                            id="checkout-title"
                            className="text-xl font-serif font-bold text-white"
                        >
                            Complete Your Order
                        </h2>
                        <p className="text-white/70 text-xs mt-0.5">
                            We&apos;ll send your order confirmation here
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-white/60 hover:text-white transition text-2xl leading-none"
                        aria-label="Close checkout"
                    >
                        ×
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">

                    {/* Name Field */}
                    <div>
                        <label
                            htmlFor="checkout-name"
                            className="block text-xs font-bold text-[#5D4037] uppercase tracking-widest mb-1.5"
                        >
                            Your Name
                        </label>
                        <input
                            ref={nameRef}
                            id="checkout-name"
                            type="text"
                            value={name}
                            onChange={e => { setName(e.target.value); setErrors(prev => ({ ...prev, name: undefined })); }}
                            placeholder="e.g. Priya Sharma"
                            className={`w-full px-4 py-3 rounded-xl border bg-white text-[#5D4037] placeholder:text-[#5D4037]/30 focus:outline-none focus:ring-2 focus:ring-[#5D4037]/40 transition ${
                                errors.name ? "border-red-400 ring-2 ring-red-200" : "border-[#5D4037]/20"
                            }`}
                        />
                        {errors.name && (
                            <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                        )}
                    </div>

                    {/* Email Field */}
                    <div>
                        <label
                            htmlFor="checkout-email"
                            className="block text-xs font-bold text-[#5D4037] uppercase tracking-widest mb-1.5"
                        >
                            Email Address
                        </label>
                        <input
                            id="checkout-email"
                            type="email"
                            value={email}
                            onChange={e => { setEmail(e.target.value); setErrors(prev => ({ ...prev, email: undefined })); }}
                            placeholder="e.g. priya@email.com"
                            className={`w-full px-4 py-3 rounded-xl border bg-white text-[#5D4037] placeholder:text-[#5D4037]/30 focus:outline-none focus:ring-2 focus:ring-[#5D4037]/40 transition ${
                                errors.email ? "border-red-400 ring-2 ring-red-200" : "border-[#5D4037]/20"
                            }`}
                        />
                        {errors.email && (
                            <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                        )}
                    </div>

                    {/* Order Summary */}
                    <div className="bg-white rounded-xl p-4 border border-[#5D4037]/10 flex items-center justify-between">
                        <span className="text-sm text-[#5D4037]/60 font-medium">Order Total</span>
                        <span className="text-2xl font-serif font-bold text-[#5D4037]">₹{totalPrice}</span>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        className="w-full py-4 bg-[#5D4037] text-white font-bold rounded-xl shadow-lg hover:bg-[#4a332a] active:scale-[0.98] transition-all"
                    >
                        Confirm Order 🎂
                    </button>

                    <p className="text-[10px] text-[#5D4037]/40 text-center">
                        By placing this order you agree to our terms. Payment is collected on delivery.
                    </p>
                </form>
            </div>

            {/* Entry animation */}
            <style jsx>{`
                .animate-in {
                    animation: modalIn 0.25s ease-out;
                }
                @keyframes modalIn {
                    from { opacity: 0; transform: translateY(16px) scale(0.97); }
                    to   { opacity: 1; transform: translateY(0) scale(1); }
                }
            `}</style>
        </div>
    );
}
