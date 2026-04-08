"use client";

import { useState } from "react";
import { trackOrderByEmail } from "./action";

// Define the shape of the data we get back
interface TrackedOrder {
    id: number;
    status: string;
    amount: number;
    description: string;
    orderDate: string;
    deliveryDate: string;
}

export default function TrackOrderPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [orders, setOrders] = useState<TrackedOrder[]>([]);

    const handleTrack = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setLoading(true);
        setError("");
        setOrders([]);

        const result = await trackOrderByEmail(email);

        if (result.success && result.orders) {
            setOrders(result.orders);
        } else {
            setError(result.error || "Something went wrong.");
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-[#FAF8F5] pt-32 px-4 flex flex-col items-center">

            <div className="text-center mb-8">
                <h1 className="text-4xl font-serif font-bold text-[#4A3B32] mb-3">Track Your Order 🍰</h1>
                <p className="text-gray-500">Enter your email address to see your order status.</p>
            </div>

            <form onSubmit={handleTrack} className="flex gap-4 w-full max-w-md mb-8">
                <input
                    type="email"
                    required
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#4A3B32]/30"
                />
                <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-3 bg-[#4A3B32] text-white font-bold rounded-lg hover:bg-[#3A2A22] transition disabled:opacity-50"
                >
                    {loading ? "..." : "Track"}
                </button>
            </form>

            {error && (
                <div className="p-4 bg-red-50 text-red-600 rounded-lg max-w-md w-full text-center mb-8">
                    {error}
                </div>
            )}

            {/* Results Section */}
            {orders.length > 0 && (
                <div className="w-full max-w-3xl flex flex-col gap-4">
                    {orders.map((order) => (
                        <div key={order.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Order #{order.id}</p>
                                <h3 className="font-serif font-bold text-lg text-[#4A3B32]">{order.description}</h3>
                                <p className="text-sm text-gray-500">Ordered: {order.orderDate} • Delivery: {order.deliveryDate}</p>
                            </div>

                            <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                                <p className="font-bold text-[#4A3B32]">₹{order.amount}</p>
                                <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider
                                    ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                        order.status === 'baking' ? 'bg-orange-100 text-orange-700' :
                                            order.status === 'ready' ? 'bg-green-100 text-green-700' :
                                                'bg-gray-100 text-gray-700'}`}>
                                    {order.status}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="mt-12 text-center text-sm text-gray-400">
                Need help? <a href="#" className="text-[#E58B88] hover:underline">Chat with us on WhatsApp</a>
            </div>

        </div>
    );
}