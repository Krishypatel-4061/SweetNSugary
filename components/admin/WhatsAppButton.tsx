"use client";

import { MessageCircle } from "lucide-react";

interface WhatsAppButtonProps {
    phoneNumber: string; // e.g. "919876543210"
    orderId: string | number;
    customerName: string;
    status: string;
}

export default function WhatsAppButton({ phoneNumber, orderId, customerName, status }: WhatsAppButtonProps) {
    const message = `Hello ${customerName}! Your order #${orderId} is currently *${status.toUpperCase()}* at Sweet N Sugary. 🎂`;
    const encodedMessage = encodeURIComponent(message);
    const waLink = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

    return (
        <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-3 py-1 bg-green-500 text-white rounded-full text-xs font-bold hover:bg-green-600 transition"
        >
            <MessageCircle size={14} />
            Send Update
        </a>
    );
}
