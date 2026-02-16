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
        console.log("Cleaning inventory_logs...");
        await client.query("DELETE FROM inventory_logs");

        // Get Ingredients
        const res = await client.query("SELECT id, name FROM ingredients");
        const ingredientsMap = new Map(res.rows.map(r => [r.name, r.id]));

        if (ingredientsMap.size === 0) {
            console.log("No ingredients found. Run seed-initial-data.ts first.");
            return;
        }

        console.log("Seeding inventory logs...");
        const values: any[] = [];
        const placeholders: string[] = [];
        let placeholderIndex = 1;

        // Generate data for the last 180 days
        for (let i = 0; i < 180; i++) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0] + ' 10:00:00'; // Add time for timestamp

            const isWeekend = date.getDay() === 0 || date.getDay() === 6;

            INGREDIENTS.forEach(name => {
                const id = ingredientsMap.get(name);
                if (!id) return;

                let baseParams = { mean: 10, dev: 2 };
                if (name === "Flour") baseParams = { mean: 50, dev: 10 };
                if (name === "Sugar") baseParams = { mean: 30, dev: 5 };
                if (name === "Chocolate") baseParams = { mean: 20, dev: 8 };

                let amount = baseParams.mean + (Math.random() * baseParams.dev * 2 - baseParams.dev);
                if (isWeekend) amount *= 1.5;
                amount *= (1 + (180 - i) / 360);

                // Usage is negative change
                const changeAmount = -parseFloat(amount.toFixed(2));

                placeholders.push(`($${placeholderIndex++}, $${placeholderIndex++}, $${placeholderIndex++}, $${placeholderIndex++})`);
                values.push(id, changeAmount, 'Daily Usage', dateStr);
            });
        }

        const query = `
      INSERT INTO inventory_logs (ingredient_id, change_amount, reason, log_date)
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
