"use client";

import { updateOrderStatus } from "./actions";
import { useState } from "react";

type Order = {
    id: number;
    user_id: number; // or string depending on schema
    status: string;
    delivery_date: string; // or Date
    total_amount: number; // Assuming this exists
    items: string; // JSON or text
    created_at: string;
};

export default function AdminOrdersClient({ orders }: { orders: Order[] }) {
    const [loadingId, setLoadingId] = useState<number | null>(null);

    const handleStatusUpdate = async (id: number, currentStatus: string) => {
        const newStatus = currentStatus === "Pending" ? "Completed" : "Pending";
        setLoadingId(id);
        await updateOrderStatus(id, newStatus);
        setLoadingId(null);
    };

    return (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-warm-cocoa/10">
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-warm-cocoa text-cream-puff uppercase text-sm tracking-wider">
                        <tr>
                            <th className="p-4">Order ID</th>
                            <th className="p-4">Date</th>
                            <th className="p-4">Status</th>
                            <th className="p-4">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {orders.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="p-8 text-center text-gray-500">No orders found.</td>
                            </tr>
                        ) : (
                            orders.map((order) => (
                                <tr key={order.id} className="hover:bg-cream-puff/50 transition">
                                    <td className="p-4 font-bold text-warm-cocoa">#{order.id}</td>
                                    <td className="p-4 text-sm text-gray-600">
                                        {new Date(order.created_at || Date.now()).toLocaleDateString()}
                                    </td>
                                    <td className="p-4">
                                        <span
                                            className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${order.status === "Completed"
                                                ? "bg-sage-green/20 text-sage-green"
                                                : "bg-yellow-100 text-yellow-800"
                                                }`}
                                        >
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <button
                                            onClick={() => handleStatusUpdate(order.id, order.status)}
                                            disabled={loadingId === order.id}
                                            className="text-xs font-bold text-dusty-rose hover:text-warm-cocoa underline disabled:opacity-50"
                                        >
                                            {loadingId === order.id
                                                ? "Updating..."
                                                : order.status === "Pending"
                                                    ? "Mark Completed"
                                                    : "Mark Pending"}
                                        </button>
                                    </td>
                                </tr>
                            )))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
