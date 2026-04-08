"use server";

import pool from "@/lib/db";
import { getSession } from "@/lib/auth";

/**
 * Saves a custom cake design as a new order in the database.
 * Now collects customer name and email from the Guest Checkout modal
 * so orders are no longer "ghost" entries without contact info.
 *
 * Links the order to the logged-in user (if any) so it shows up in the order tracker.
 * Delivery date defaults to 3 days from today (standard bakery prep time).
 */
export async function saveCakeDesign(design: {
    baseFlavor: string;
    toppings: string[];
    color: string;
    scale?: number;
    price?: number;
    customerName: string;
    customerEmail: string;
}) {
    try {
        // Get the logged-in user's ID (null if guest)
        const session = await getSession();
        const userId = session?.userId || null;

        const client = await pool.connect();

        // Default delivery date: 3 days from now
        const deliveryDate = new Date();
        deliveryDate.setDate(deliveryDate.getDate() + 3);

        // Build a readable summary for the admin to see
        const itemSummary = `Custom ${design.baseFlavor} Cake${design.toppings.length > 0 ? ` with ${design.toppings.join(", ")}` : ""}`;

        const result = await client.query(
            `INSERT INTO orders (user_id, total_amount, status, delivery_date, special_instructions, customer_name, customer_email, created_at)
             VALUES ($1, $2, 'pending', $3, $4, $5, $6, NOW())
             RETURNING id`,
            [
                userId,
                design.price || 500,
                deliveryDate.toISOString().split("T")[0],
                itemSummary,
                design.customerName,
                design.customerEmail,
            ]
        );

        client.release();
        return { success: true, orderId: result.rows[0].id };
    } catch (error) {
        console.error("❌ Failed to save cake order:", error);
        return { success: false, error: "Failed to save order" };
    }
}
