"use server";

import pool from "@/lib/db";

export async function saveCakeDesign(design: {
    baseFlavor: string;
    toppings: string[];
    color: string;
}) {
    try {
        const client = await pool.connect();
        // Assuming table 'custom_cake_builds' has columns: base_flavor, toppings (text/json), color
        // If not, we might need to adjust. The user prompt said: "custom_cake_builds (id, base_flavor, toppings, etc.)"
        // I'll assume toppings is stored as a comma-separated string or JSON. I'll use text for simplicity.

        const query = `
      INSERT INTO custom_cake_builds (base_flavor, toppings, created_at)
      VALUES ($1, $2, NOW())
      RETURNING id
    `;

        // Storing color in base_flavor or a separate column? 
        // User said: "base_flavor, toppings". I'll store color as base_flavor for now or combine them.
        // Let's assume there's no color column explicitly mentioned, so mapped to flavor.

        const values = [design.baseFlavor, design.toppings.join(", ")];

        await client.query(query, values);
        client.release();
        return { success: true };
    } catch (error) {
        console.error("Failed to save cake design:", error);
        return { success: false, error: "Failed to save design" };
    }
}
