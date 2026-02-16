import { Pool } from 'pg';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: true,
});

async function migrate() {
    const client = await pool.connect();
    try {
        console.log("⚠️  Starting Schema Migration... This will WIPE existing data.");

        // Drop tables in reverse order of dependencies
        await client.query(`DROP TABLE IF EXISTS orders CASCADE;`);
        await client.query(`DROP TABLE IF EXISTS custom_cake_builds CASCADE;`);
        await client.query(`DROP TABLE IF EXISTS inventory_logs CASCADE;`);
        await client.query(`DROP TABLE IF EXISTS ingredients CASCADE;`);
        await client.query(`DROP TABLE IF EXISTS products CASCADE;`);
        await client.query(`DROP TABLE IF EXISTS users CASCADE;`);
        // Drop the old inventory_logs if it was standalone
        await client.query(`DROP TABLE IF EXISTS inventory_logs CASCADE;`);

        console.log("✅ Tables Dropped.");
        console.log("🏗️  Creating New Tables...");

        // 1. USERS
        await client.query(`
      CREATE TABLE users (
          id SERIAL PRIMARY KEY,
          username VARCHAR(50) UNIQUE NOT NULL,
          email VARCHAR(100) UNIQUE NOT NULL,
          password_hash TEXT NOT NULL,
          role VARCHAR(20) DEFAULT 'customer',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
        console.log(" - Users table created.");

        // 2. PRODUCTS
        await client.query(`
      CREATE TABLE products (
          id SERIAL PRIMARY KEY,
          name VARCHAR(100) NOT NULL,
          slug VARCHAR(100) UNIQUE NOT NULL,
          description TEXT,
          price DECIMAL(10, 2) NOT NULL,
          category VARCHAR(50),
          image_url TEXT,
          meta_title VARCHAR(150),
          meta_description VARCHAR(250),
          is_active BOOLEAN DEFAULT TRUE
      );
    `);
        console.log(" - Products table created.");

        // 3. INGREDIENTS
        await client.query(`
      CREATE TABLE ingredients (
          id SERIAL PRIMARY KEY,
          name VARCHAR(100) NOT NULL,
          unit VARCHAR(20) NOT NULL,
          current_stock DECIMAL(10, 2) DEFAULT 0.00,
          reorder_level DECIMAL(10, 2) DEFAULT 5.00,
          last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
        console.log(" - Ingredients table created.");

        // 4. INVENTORY LOGS
        await client.query(`
      CREATE TABLE inventory_logs (
          id SERIAL PRIMARY KEY,
          ingredient_id INT REFERENCES ingredients(id),
          change_amount DECIMAL(10, 2) NOT NULL,
          reason VARCHAR(100),
          log_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
        console.log(" - Inventory Logs table created.");

        // 5. CUSTOM 3D CAKE BUILDS
        await client.query(`
      CREATE TABLE custom_cake_builds (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          user_id INT REFERENCES users(id),
          base_flavor VARCHAR(50),
          frosting_type VARCHAR(50),
          toppings JSONB,
          cake_shape VARCHAR(20),
          estimated_price DECIMAL(10, 2),
          ai_generated_image_url TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
        console.log(" - Custom Cake Builds table created.");

        // 6. ORDERS
        await client.query(`
      CREATE TABLE orders (
          id SERIAL PRIMARY KEY,
          user_id INT REFERENCES users(id),
          total_amount DECIMAL(10, 2) NOT NULL,
          status VARCHAR(20) DEFAULT 'pending',
          payment_status VARCHAR(20) DEFAULT 'unpaid',
          delivery_date DATE NOT NULL,
          special_instructions TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
        console.log(" - Orders table created.");

        // Optional: Seed an initial admin user for easy access
        // Password is 'admin123' (hashed) - Placeholder for now, simple hash or plain for demo if needed
        // But user requested functional login. We'll handle seeding later or now.
        // Let's just create tables for now.

        console.log("🎉 Schema Migration Complete!");

    } catch (error) {
        console.error("❌ Migration Failed:", error);
    } finally {
        client.release();
        await pool.end();
    }
}

migrate();
