import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/auth'; // We can't use node modules in edge runtime easily sometimes, but jwt-decode might work. 
// Actually, verifiedToken uses 'jsonwebtoken' which might not work in Edge Runtime.
// Standard middleware approach for Next.js with JWT: use 'jose' or just check cookie presence for now, 
// and let the server components do the deep validation.
// OR, we can just check if cookie exists.
// Let's try to decode if possible, but 'jsonwebtoken' is often Node-only.
// Safe bet: Check for cookie existence. If needed, verify role in layout/page.

export function middleware(request: NextRequest) {
    // 1. Check if it's an admin route
    if (request.nextUrl.pathname.startsWith('/admin')) {
        const token = request.cookies.get('auth_token')?.value;

        if (!token) {
            // Redirect to login
            const loginUrl = new URL('/login', request.url);
            loginUrl.searchParams.set('from', request.nextUrl.pathname);
            return NextResponse.redirect(loginUrl);
        }

        // Optional: Decode token to check role if we switch to 'jose' library
        // For now, presence of token is the first gate. 
        // The server components (Page/Layout) will verify validity and role.
    }

    return NextResponse.next();
}

export const config = {
    matcher: '/admin/:path*',
};
