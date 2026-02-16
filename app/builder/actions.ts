"use server";

import pool from "@/lib/db";

export async function saveCakeDesign(design: {
    baseFlavor: string;
    toppings: string[];
    color: string;
    scale?: number;
    price?: number;
}) {
    try {
        const client = await pool.connect();

        const query = `
      INSERT INTO custom_cake_builds (base_flavor, toppings, estimated_price, created_at)
      VALUES ($1, $2, $3, NOW())
      RETURNING id
    `;

        // Store details in JSON if needed, but for now map key fields
        // We'll store complex details in toppings JSONB if we change schema, 
        // but current schema has 'toppings' as JSONB. 
        // The previous code coerced it to string list in 'values' array? 
        // Wait, migrate-schema says "toppings JSONB". 
        // But the previous code in actions.ts did: `const designDetails = ...; values = [design.baseFlavor, designDetails]`
        // which implies it was inserting a string into 'toppings' column? 
        // If 'toppings' is JSONB, inserting a string might work if it's a valid JSON string, or fail.
        // Let's fix this to be proper JSON.

        const toppingsJson = JSON.stringify(design.toppings);
        const values = [design.baseFlavor, toppingsJson, design.price || 0];

        await client.query(query, values);
        client.release();
        return { success: true };
    } catch (error) {
        console.error("Failed to save cake design:", error);
        return { success: false, error: "Failed to save design" };
    }
}
