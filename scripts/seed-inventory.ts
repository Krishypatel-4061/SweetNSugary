import { Pool } from 'pg';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: true,
});

const INGREDIENTS = ["Flour", "Sugar", "Chocolate", "Eggs", "Vanilla Extract"];

async function seed() {
    const client = await pool.connect();
    try {
        console.log("Dropping old table if exists...");
        await client.query("DROP TABLE IF EXISTS inventory_logs");

        console.log("Creating inventory_logs table...");
        await client.query(`
      CREATE TABLE inventory_logs (
        id SERIAL PRIMARY KEY,
        ingredient_name TEXT NOT NULL,
        usage_amount DECIMAL NOT NULL,
        date DATE NOT NULL DEFAULT CURRENT_DATE
      );
    `);

        console.log("Clearing old data...");
        await client.query("DELETE FROM inventory_logs");

        console.log("Seeding data...");
        const values: any[] = [];
        const placeholders: string[] = [];
        let placeholderIndex = 1;

        // Generate data for the last 180 days
        for (let i = 0; i < 180; i++) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];

            // Base usage + random fluctuation + weekend spike
            const isWeekend = date.getDay() === 0 || date.getDay() === 6;

            INGREDIENTS.forEach(ingredient => {
                let baseParams = { mean: 10, dev: 2 };
                if (ingredient === "Flour") baseParams = { mean: 50, dev: 10 };
                if (ingredient === "Sugar") baseParams = { mean: 30, dev: 5 };
                if (ingredient === "Chocolate") baseParams = { mean: 20, dev: 8 };

                let amount = baseParams.mean + (Math.random() * baseParams.dev * 2 - baseParams.dev);
                if (isWeekend) amount *= 1.5; // More baking on weekends

                // Add some seasonality/trend (e.g. slight increase over time)
                amount *= (1 + (180 - i) / 360);

                placeholders.push(`($${placeholderIndex++}, $${placeholderIndex++}, $${placeholderIndex++})`);
                values.push(ingredient, amount.toFixed(2), dateStr);
            });
        }

        // Insert in batches to avoid query parameter limits if necessary, but 180*5 is fine (900 params)
        const query = `
      INSERT INTO inventory_logs (ingredient_name, usage_amount, date)
      VALUES ${placeholders.join(", ")}
    `;

        await client.query(query, values);

        console.log(`Successfully seeded ${180 * INGREDIENTS.length} logs!`);

    } catch (error) {
        console.error("Error seeding data:", error);
    } finally {
        client.release();
        await pool.end();
    }
}

seed();
