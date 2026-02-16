import { Pool } from 'pg';
import * as dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

dotenv.config({ path: '.env.local' });

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: true,
});

async function seedUsers() {
    const client = await pool.connect();
    try {
        console.log("🔐 Seeding Users...");

        // Remove existing users to avoid unique constraint errors during re-seed
        await client.query("DELETE FROM users WHERE email IN ('admin@sweetnsugary.com', 'user@sweetnsugary.com')");

        const salt = await bcrypt.genSalt(10);
        const adminHash = await bcrypt.hash("admin123", salt);
        const userHash = await bcrypt.hash("user123", salt);

        // 1. Admin User
        await client.query(`
        INSERT INTO users (username, email, password_hash, role)
        VALUES ($1, $2, $3, $4)
    `, ['Admin', 'admin@sweetnsugary.com', adminHash, 'admin']);
        console.log(" - Admin created: admin@sweetnsugary.com / admin123");

        // 2. Customer User
        await client.query(`
        INSERT INTO users (username, email, password_hash, role)
        VALUES ($1, $2, $3, $4)
    `, ['Demo User', 'user@sweetnsugary.com', userHash, 'customer']);
        console.log(" - Customer created: user@sweetnsugary.com / user123");

        console.log("🎉 User Seeding Complete!");
    } catch (error) {
        console.error("❌ User Seeding Failed:", error);
    } finally {
        client.release();
        await pool.end();
    }
}

seedUsers();
