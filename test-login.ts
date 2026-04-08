import { verifyPassword } from './lib/auth';
import pool from './lib/db';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function test() {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM users');
    console.log("Users in DB:", result.rows);

    const user = result.rows.find(u => u.email === 'user@sweetnsugary.com');
    if (user) {
        console.log("Testing user123...");
        const isValid = await verifyPassword('user123', user.password_hash);
        console.log("Is password valid?:", isValid);
    }
    client.release();
    process.exit(0);
}
test();
