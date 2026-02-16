import { Pool } from 'pg';
import * as dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import * as crypto from 'crypto'; // Use crypto for simple hashing for now, or bcrypt if installed

dotenv.config({ path: '.env.local' });

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: true,
});

async function seed() {
    const client = await pool.connect();
    try {
        console.log("🌱 Seeding Initial Data...");

        // 1. Create Admin User
        // Start with simple plaintext or basic hash since we haven't set up full auth lib yet
        // efficient way: We'll implement real auth logic next, so let's use a placeholder hash logic
        // For now, let's assume we store passwords as-is or simple hash. 
        // IMPORTANT: In production, use bcrypt/argon2. User asked for "perfectly working".
        // We will install bcryptjs later in Part 2. For now, let's insert a known user.

        // Let's assume we will use bcryptjs. I'll mock a bcrypt hash for "admin123"
        // $2a$10$abcdef... is typical. 
        // Actually, let's just insert a dummy and update it when we build the auth system properly.
        // Or better, let's do it right. I'll skip user seeding until I install bcryptjs in Part 2.
        // Wait, user needs "login for admin". So I need a user.
        // I will insert a user with a placeholder password that my future Login API will recognize/replace.

        // Deleting existing users to avoid conflicts
        await client.query("DELETE FROM users");
        await client.query("DELETE FROM products");
        await client.query("DELETE FROM ingredients");

        // Insert Admin
        // Using a simple md5 for now just to have SOMETHING, or plain text if I handle it that way temporarily.
        // I'll stick to inserting proper data in the Auth phase.
        // ... Actually, let's just insert "admin123" as the hash and handle plain text check in dev mode if needed,
        // OR I will simply run `npm install bcryptjs` in the next step and seed then.
        // Let's seed Products and Ingredients first.

        // 2. SEED PRODUCTS
        const products = [
            {
                name: "Classic Chocolate Truffle",
                slug: "chocolate-truffle",
                description: "Rich chocolate sponge with dark chocolate ganache.",
                price: 1200.00,
                category: "Cake",
                image_url: "https://images.unsplash.com/photo-1578985545062-69928b1d9587"
            },
            {
                name: "Red Velvet Dream",
                slug: "red-velvet",
                description: "Soft red velvet sponge with cream cheese frosting.",
                price: 1400.00,
                category: "Cake",
                image_url: "https://images.unsplash.com/photo-1586788680434-30d32443f468"
            },
            {
                name: "Vanilla Bean Delight",
                slug: "vanilla-bean",
                description: "Classic vanilla sponge with vanilla buttercream.",
                price: 1000.00,
                category: "Cake",
                image_url: "https://images.unsplash.com/photo-1535141192574-5d4897c12636"
            },
            {
                name: "Blueberry Cheesecake Jar",
                slug: "blueberry-jar",
                description: "Layers of biscuit, cheesecake and blueberry compote.",
                price: 350.00,
                category: "Jar",
                image_url: "https://images.unsplash.com/photo-1559553156-2e97137af16f"
            }
        ];

        for (const p of products) {
            await client.query(`
            INSERT INTO products (name, slug, description, price, category, image_url)
            VALUES ($1, $2, $3, $4, $5, $6)
        `, [p.name, p.slug, p.description, p.price, p.category, p.image_url]);
        }
        console.log(` - Seeded ${products.length} products.`);

        // 3. SEED INGREDIENTS
        const ingredients = [
            { name: "Flour", unit: "kg", stock: 50.00 },
            { name: "Sugar", unit: "kg", stock: 40.00 },
            { name: "Dark Chocolate", unit: "kg", stock: 25.00 },
            { name: "Eggs", unit: "dozen", stock: 100.00 },
            { name: "Butter", unit: "kg", stock: 30.00 },
            { name: "Cream Cheese", unit: "kg", stock: 15.00 }
        ];

        for (const i of ingredients) {
            await client.query(`
            INSERT INTO ingredients (name, unit, current_stock, reorder_level)
            VALUES ($1, $2, $3, 10.00)
        `, [i.name, i.unit, i.stock]);
        }
        console.log(` - Seeded ${ingredients.length} ingredients.`);

        console.log("🎉 Initial Data Seeeding Complete!");

    } catch (error) {
        console.error("❌ Seeding Failed:", error);
    } finally {
        client.release();
        await pool.end();
    }
}

seed();
