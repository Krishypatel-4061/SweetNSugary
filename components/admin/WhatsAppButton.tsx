/**
 * components/admin/WhatsAppButton.tsx
 *
 * A small action button that opens a pre-filled WhatsApp message
 * in a new tab, allowing the admin to quickly notify a customer
 * about the current status of their order.
 *
 * WhatsApp deep-link format:
 *   https://wa.me/<phone>?text=<url-encoded-message>
 */

"use client";

import { MessageCircle } from "lucide-react";

interface WhatsAppButtonProps {
    /** Customer's phone number with country code, no "+" (e.g. "919876543210") */
    phoneNumber: string;
    /** The unique order identifier for display in the message */
    orderId: string | number;
    /** Customer's name used to personalise the WhatsApp message */
    customerName: string;
    /** Current order status shown in the message (e.g. "baking", "ready") */
    status: string;
}

export default function WhatsAppButton({
    phoneNumber,
    orderId,
    customerName,
    status,
}: WhatsAppButtonProps) {
    // Build a personalised message pre-filled in WhatsApp
    const message = `Hello ${customerName}! 🎂 Your order #${orderId} is currently *${status.toUpperCase()}* at Sweet N Sugary. We'll keep you updated!`;
    const waLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

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
