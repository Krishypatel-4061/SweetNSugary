/**
 * components/admin/OrderKanban.tsx
 *
 * Visual Kanban board for the admin dashboard.
 * Displays all orders grouped into four status columns:
 *   Pending → Baking → Ready → Completed
 *
 * The admin can move orders between columns using arrow buttons,
 * and send WhatsApp status updates directly from each order card.
 *
 * State is managed locally with React useState. In a production
 * upgrade, each move would also call a server action to persist
 * the status change in the database.
 */

"use client";

import { useState } from "react";
import WhatsAppButton from "./WhatsAppButton";
import { motion } from "framer-motion";

/** Represents a single order row from the database */
type Order = {
    id: number | string;
    customer_name: string;
    items: string | unknown[];
    total_price: number | string;
    status: "pending" | "baking" | "ready" | "completed";
    phone?: string;
};

/** Ordered list of Kanban columns with display metadata */
const COLUMNS = [
    { id: "pending", label: "New Orders 🆕", color: "bg-yellow-50 border-yellow-200" },
    { id: "baking", label: "Baking 🔥", color: "bg-orange-50 border-orange-200" },
    { id: "ready", label: "Ready for Pickup 🎁", color: "bg-green-50 border-green-200" },
    { id: "completed", label: "Completed ✅", color: "bg-gray-50 border-gray-200" },
];

interface OrderKanbanProps {
    /** Initial orders fetched from the database on the server */
    initialOrders: Order[];
}

export default function OrderKanban({ initialOrders }: OrderKanbanProps) {
    const [orders, setOrders] = useState(initialOrders);

    /**
     * Moves an order to a new status column (optimistic UI update).
     * In a future version, this would also call updateOrderStatus() server action.
     */
    const moveOrder = (orderId: number | string, newStatus: Order["status"]) => {
        setOrders(prev =>
            prev.map(o => (o.id === orderId ? { ...o, status: newStatus } : o))
        );
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 overflow-x-auto pb-4">
            {COLUMNS.map((col, colIndex) => (
                <div key={col.id} className={`p-4 rounded-xl border ${col.color} min-h-[400px]`}>
                    {/* Column header with order count badge */}
                    <h3 className="font-bold text-warm-cocoa mb-4 flex justify-between items-center">
                        {col.label}
                        <span className="bg-white/50 px-2 py-0.5 rounded-full text-xs">
                            {orders.filter(o => o.status === col.id).length}
                        </span>
                    </h3>

                    {/* Order cards */}
                    <div className="space-y-3">
                        {orders
                            .filter(o => o.status === col.id)
                            .map(order => (
                                <motion.div
                                    key={order.id}
                                    layoutId={String(order.id)} // Animate card position when moved
                                    className="bg-white p-3 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition cursor-grab"
                                >
                                    {/* Order header: short ID + price */}
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="font-mono text-xs text-gray-400">
                                            #{String(order.id).slice(0, 6)}
                                        </span>
                                        <span className="font-bold text-warm-cocoa">
                                            ₹{order.total_price}
                                        </span>
                                    </div>

                                    <h4 className="font-bold text-sm text-gray-800 mb-1">
                                        {order.customer_name}
                                    </h4>
                                    <p className="text-xs text-gray-500 mb-3">
                                        {Array.isArray(order.items) ? order.items.length : 1} items
                                    </p>

                                    <div className="flex flex-wrap gap-2 justify-between items-center">
                                        {/* WhatsApp notification button */}
                                        <WhatsAppButton
                                            phoneNumber={order.phone || "919876543210"}
                                            orderId={order.id}
                                            customerName={order.customer_name}
                                            status={col.id}
                                        />

                                        {/* Navigation arrows to move order left or right */}
                                        <div className="flex gap-1">
                                            {colIndex > 0 && (
                                                <button
                                                    onClick={() => moveOrder(order.id, COLUMNS[colIndex - 1].id as Order["status"])}
                                                    className="text-gray-400 hover:text-warm-cocoa"
                                                    title="Move back"
                                                >
                                                    ⬅️
                                                </button>
                                            )}
                                            {colIndex < COLUMNS.length - 1 && (
                                                <button
                                                    onClick={() => moveOrder(order.id, COLUMNS[colIndex + 1].id as Order["status"])}
                                                    className="text-gray-400 hover:text-warm-cocoa"
                                                    title="Move forward"
                                                >
                                                    ➡️
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
