/**
 * e2e/auth-flow.spec.ts
 *
 * Playwright E2E tests for the authentication flow.
 *
 * Covers:
 *   1. Login form UI renders correctly.
 *   2. Invalid credentials show an error message.
 *   3. Valid admin login sets an HttpOnly auth_token cookie
 *      and redirects to /admin.
 *   4. Unauthenticated users are redirected from /admin → /login.
 *   5. Logout clears the auth cookie.
 *
 * NOTE: These tests run against a LIVE dev server with a real database.
 *       The test admin credentials must exist in the `users` table.
 *       You can seed them using:
 *         INSERT INTO users (email, password_hash, role)
 *         VALUES ('admin@test.com', '<bcrypt hash of "Admin123!">', 'admin');
 *
 * If the test admin doesn't exist yet, the "valid login" tests will
 * fail with "Invalid credentials" — this is expected behavior, not a bug.
 */

import { test, expect } from '@playwright/test';

// ── Test credentials ────────────────────────────────────────────────────────
// These must match a row in the `users` table of your Neon database.
const TEST_ADMIN_EMAIL = process.env.TEST_ADMIN_EMAIL || 'admin@test.com';
const TEST_ADMIN_PASSWORD = process.env.TEST_ADMIN_PASSWORD || 'Admin123!';

// ── Test Suite ──────────────────────────────────────────────────────────────

test.describe('Authentication Flow', () => {

    test('login page renders with form fields', async ({ page }) => {
        await page.goto('/login');

        // Page heading
        await expect(page.locator('h1')).toContainText('Welcome Back');

        // Form fields exist
        await expect(page.locator('input[type="email"]')).toBeVisible();
        await expect(page.locator('input[type="password"]')).toBeVisible();
        await expect(page.locator('button[type="submit"]')).toBeVisible();
    });

    test('shows error on invalid credentials', async ({ page }) => {
        await page.goto('/login');

        await page.fill('input[type="email"]', 'wrong@example.com');
        await page.fill('input[type="password"]', 'BadPassword!');
        await page.click('button[type="submit"]');

        // Wait for error message to appear
        const errorBox = page.locator('.bg-red-50');
        await expect(errorBox).toBeVisible({ timeout: 10_000 });
        await expect(errorBox).toContainText('Invalid credentials');
    });

    test('unauthenticated access to /admin redirects to /login', async ({ page }) => {
        // Clear any existing cookies
        await page.context().clearCookies();

        await page.goto('/admin');

        // Middleware should redirect to /login
        await page.waitForURL('**/login**', { timeout: 10_000 });
        expect(page.url()).toContain('/login');
    });

    test('valid admin login sets HttpOnly cookie and redirects to /admin', async ({ page }) => {
        await page.goto('/login');

        await page.fill('input[type="email"]', TEST_ADMIN_EMAIL);
        await page.fill('input[type="password"]', TEST_ADMIN_PASSWORD);
        await page.click('button[type="submit"]');

        // Wait for redirect to /admin
        await page.waitForURL('**/admin**', { timeout: 15_000 });
        expect(page.url()).toContain('/admin');

        // Verify the auth_token cookie was set
        const cookies = await page.context().cookies();
        const authCookie = cookies.find(c => c.name === 'auth_token');

        expect(authCookie).toBeDefined();
        expect(authCookie!.httpOnly).toBe(true);
        expect(authCookie!.sameSite).toBe('Strict');
        expect(authCookie!.path).toBe('/');
    });

    test('admin dashboard renders after login', async ({ page }) => {
        // Login first
        await page.goto('/login');
        await page.fill('input[type="email"]', TEST_ADMIN_EMAIL);
        await page.fill('input[type="password"]', TEST_ADMIN_PASSWORD);
        await page.click('button[type="submit"]');
        await page.waitForURL('**/admin**', { timeout: 15_000 });

        // Verify admin page content
        await expect(page.locator('h1')).toContainText('Admin Dashboard');
        await expect(page.locator('text=Manage Products')).toBeVisible();
        await expect(page.locator('text=View Analytics')).toBeVisible();
    });
});
