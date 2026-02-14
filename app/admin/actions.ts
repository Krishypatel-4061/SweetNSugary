"use server";

import pool from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function updateOrderStatus(orderId: number, newStatus: string) {
    try {
        const client = await pool.connect();
        await client.query("UPDATE orders SET status = $1 WHERE id = $2", [
            newStatus,
            orderId,
        ]);
        client.release();
        revalidatePath("/admin");
        return { success: true };
    } catch (error) {
        console.error("Failed to update order status:", error);
        return { success: false, error: "Failed to update status" };
    }
}
