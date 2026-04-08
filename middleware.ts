/**
 * middleware.ts
 *
 * Next.js Edge Middleware — runs before every matching request.
 * Guards the /admin route by checking for a valid auth_token cookie.
 * If the cookie is missing, the user is redirected to the login page.
 *
 * Note: Deep JWT verification (role check) is performed inside the
 * server components/pages themselves, since `jsonwebtoken` is a
 * Node.js-only library and cannot run in the Edge Runtime.
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    // Protect all routes under /admin
    if (request.nextUrl.pathname.startsWith('/admin')) {
        const token = request.cookies.get('auth_token')?.value;

        // If no auth token exists, redirect to the login page
        if (!token) {
            const loginUrl = new URL('/login', request.url);
            // Pass the original path so we can redirect back after login
            loginUrl.searchParams.set('from', request.nextUrl.pathname);
            return NextResponse.redirect(loginUrl);
        }
    }

    // Allow the request to proceed normally
    return NextResponse.next();
}

// Apply this middleware only to /admin and its sub-routes
export const config = {
    matcher: '/admin/:path*',
};
