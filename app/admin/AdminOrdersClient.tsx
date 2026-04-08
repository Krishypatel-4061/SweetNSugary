"use client";

import { updateOrderStatus } from "./actions";
import { useState } from "react";

type Order = {
    id: number;
    status: string;
    total_amount: number;
    special_instructions: string;
    delivery_date: string;
    created_at: string;
};

export default function AdminOrdersClient({ orders }: { orders: Order[] }) {
    const [loadingId, setLoadingId] = useState<number | null>(null);

    // Cycles: pending → baking → ready → completed
    const NEXT_STATUS: Record<string, string> = {
        pending: "baking",
        baking: "ready",
        ready: "completed",
        completed: "pending",
    };

    const STATUS_BADGE: Record<string, string> = {
        pending: "bg-yellow-100 text-yellow-800",
        baking: "bg-orange-100 text-orange-800",
        ready: "bg-green-100 text-green-800",
        completed: "bg-gray-100 text-gray-500",
    };

    const handleStatusUpdate = async (id: number, currentStatus: string) => {
        const newStatus = NEXT_STATUS[currentStatus.toLowerCase()] || "pending";
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
                            <th className="p-4">Description</th>
                            <th className="p-4">Date</th>
                            <th className="p-4">Amount</th>
                            <th className="p-4">Status</th>
                            <th className="p-4">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {orders.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="p-8 text-center text-gray-500">
                                    No orders found.
                                </td>
                            </tr>
                        ) : (
                            orders.map((order) => (
                                <tr key={order.id} className="hover:bg-cream-puff/50 transition">
                                    <td className="p-4 font-bold text-warm-cocoa">#{order.id}</td>
                                    <td className="p-4 text-sm text-gray-600 max-w-[200px] truncate">
                                        {order.special_instructions || "—"}
                                    </td>
                                    <td className="p-4 text-sm text-gray-600">
                                        {new Date(order.created_at || Date.now()).toLocaleDateString("en-IN")}
                                    </td>
                                    <td className="p-4 font-bold text-warm-cocoa">
                                        ₹{order.total_amount}
                                    </td>
                                    <td className="p-4">
                                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${STATUS_BADGE[order.status.toLowerCase()] || "bg-gray-100 text-gray-500"}`}>
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
                                                : `→ ${NEXT_STATUS[order.status.toLowerCase()] || "pending"}`}
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
