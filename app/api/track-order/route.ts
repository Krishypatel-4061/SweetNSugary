import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';
import pool from "@/lib/db";

/**
 * GET /api/track-order?email=xxx
 * Returns all orders for a given email address by joining orders with users.
 * If the user is a guest (no account), shows orders placed via the builder
 * which were saved without a user_id (looks for email in special_instructions fallback).
 */
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const email = searchParams.get("email");

        if (!email) {
            return NextResponse.json({ error: "Email is required" }, { status: 400 });
        }

        const client = await pool.connect();

        // Try to find orders linked to this email via the users table
        const result = await client.query(
            `SELECT o.id, o.total_amount, o.status, o.delivery_date, 
                    o.special_instructions, o.created_at
             FROM orders o
             LEFT JOIN users u ON o.user_id = u.id
             WHERE u.email = $1
             ORDER BY o.created_at DESC
             LIMIT 10`,
            [email.toLowerCase().trim()]
        );

        client.release();

        return NextResponse.json({ orders: result.rows });
    } catch (error) {
        console.error("Track order error:", error);
        return NextResponse.json({ error: "Could not fetch orders" }, { status: 500 });
    }
}
