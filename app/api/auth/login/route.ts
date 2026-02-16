import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { verifyPassword, loginUser } from '@/lib/auth';

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json({ error: "Missing email or password" }, { status: 400 });
        }

        const client = await pool.connect();
        try {
            const result = await client.query('SELECT * FROM users WHERE email = $1', [email]);
            const user = result.rows[0];

            if (!user) {
                return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
            }

            const isValid = await verifyPassword(password, user.password_hash);

            if (!isValid) {
                return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
            }

            // Create Session
            await loginUser({ userId: user.id, role: user.role, email: user.email });

            return NextResponse.json({ success: true, role: user.role });

        } finally {
            client.release();
        }

    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
