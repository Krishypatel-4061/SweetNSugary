import { Pool } from 'pg';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: true,
});

async function testConnection() {
    try {
        const client = await pool.connect();
        const res = await client.query('SELECT NOW()');
        console.log(`✅ Success: Connected to Neon DB at ${res.rows[0].now}`);
        client.release();
        process.exit(0);
    } catch (err: any) {
        console.error('❌ Failure: Could not connect to DB.', err.message);
        process.exit(1);
    } finally {
        await pool.end();
    }
}

testConnection();
