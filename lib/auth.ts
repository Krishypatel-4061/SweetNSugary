import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';

// Password Hashing
export async function hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
}

// JWT Handling
export function signToken(payload: { userId: number; role: string; email: string }) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });
}

export function verifyToken(token: string) {
    try {
        return jwt.verify(token, JWT_SECRET) as { userId: number; role: string; email: string; iat: number; exp: number };
    } catch {
        return null;
    }
}

// Session Management (Server Actions / API)
export async function getSession() {
    const cookieStore = cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) return null;

    return verifyToken(token);
}

export async function loginUser(userData: { userId: number; role: string; email: string }) {
    const token = signToken(userData);
    const cookieStore = cookies();
    cookieStore.set('auth_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24, // 1 day
        path: '/',
    });
}

export async function logoutUser() {
    const cookieStore = cookies();
    cookieStore.delete('auth_token');
}
