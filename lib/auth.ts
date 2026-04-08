/**
 * lib/auth.ts
 *
 * Authentication utilities for Sweet N Sugary.
 * Provides password hashing/verification (bcrypt) and
 * JWT-based session management via HTTP-only cookies.
 *
 * All functions in this file run on the server side only.
 */

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

// Read the JWT secret from environment variables (required in production)
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';

// ---------------------------------------------------------------------------
// Password Utilities
// ---------------------------------------------------------------------------

/**
 * Hashes a plain-text password using bcrypt with a salt of 10 rounds.
 * @param password - The plain-text password to hash.
 * @returns A bcrypt hash string safe to store in the database.
 */
export async function hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
}

/**
 * Compares a plain-text password against a stored bcrypt hash.
 * @param password - The plain-text password submitted by the user.
 * @param hash - The bcrypt hash stored in the database.
 * @returns True if the password matches, false otherwise.
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
}

// ---------------------------------------------------------------------------
// JWT Utilities
// ---------------------------------------------------------------------------

/**
 * Signs a JWT payload and returns the resulting token string.
 * Token expires after 1 day.
 * @param payload - User data to embed in the token.
 */
export function signToken(payload: { userId: number; role: string; email: string }) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });
}

/**
 * Verifies a JWT token and returns its decoded payload.
 * Returns null if the token is invalid or expired.
 * @param token - The JWT string to verify.
 */
export function verifyToken(token: string) {
    try {
        return jwt.verify(token, JWT_SECRET) as {
            userId: number;
            role: string;
            email: string;
            iat: number;
            exp: number;
        };
    } catch {
        return null;
    }
}

// ---------------------------------------------------------------------------
// Session Management
// ---------------------------------------------------------------------------

/**
 * Reads the auth_token cookie and returns the decoded user session.
 * Returns null if there is no active session.
 */
export async function getSession() {
    const cookieStore = cookies();
    const token = cookieStore.get('auth_token')?.value;
    if (!token) return null;
    return verifyToken(token);
}

/**
 * Creates a JWT, then stores it as a secure HTTP-only cookie.
 * Called on successful login.
 * @param userData - The authenticated user's data.
 */
export async function loginUser(userData: { userId: number; role: string; email: string }) {
    const token = signToken(userData);
    const cookieStore = cookies();
    cookieStore.set('auth_token', token, {
        httpOnly: true,                                         // Not accessible via JS (prevents XSS)
        secure: process.env.NODE_ENV === 'production',          // HTTPS only in production
        sameSite: 'strict',                                     // Prevents CSRF attacks
        maxAge: 60 * 60 * 24,                                   // 1 day in seconds
        path: '/',
    });
}

/**
 * Deletes the auth_token cookie, effectively logging the user out.
 */
export async function logoutUser() {
    const cookieStore = cookies();
    cookieStore.delete('auth_token');
}
