"use server";

import pool from "@/lib/db";

export async function trackOrderByEmail(email: string) {
    try {
        const client = await pool.connect();

        // Fetch orders matching the email, ordered by newest first
        const result = await client.query(
            `SELECT id, status, total_amount, special_instructions, created_at, delivery_date 
             FROM orders 
             WHERE customer_email = $1 
             ORDER BY created_at DESC`,
            [email.toLowerCase().trim()]
        );

        client.release();

        if (result.rows.length === 0) {
            return { success: false, error: "We couldn't find any orders linked to that email." };
        }

        // We have to parse the rows to ensure dates are serializable for the client
        const orders = result.rows.map(row => ({
            id: row.id,
            status: row.status,
            amount: parseFloat(row.total_amount),
            description: row.special_instructions,
            orderDate: new Date(row.created_at).toLocaleDateString(),
            deliveryDate: new Date(row.delivery_date).toLocaleDateString()
        }));

        return { success: true, orders };
    } catch (error) {
        console.error("❌ Tracking fetch error:", error);
        return { success: false, error: "Failed to fetch tracking data. Please try again." };
    }
}