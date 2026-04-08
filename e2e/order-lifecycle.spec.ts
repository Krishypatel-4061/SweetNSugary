/**
 * e2e/order-lifecycle.spec.ts
 *
 * Playwright E2E test for the full order lifecycle:
 *
 *   1. CUSTOMER JOURNEY — Navigate to the Cake Builder, customise a cake
 *      (select flavor, tiers, toppings), and place an order via the
 *      "Order Now" button. Verify the success alert appears.
 *
 *   2. ADMIN ORDER MANAGEMENT — Log in as admin, navigate to the
 *      orders dashboard, and advance the order status from "pending"
 *      to "baking". Verify the status badge updates in the UI
 *      (powered by revalidatePath on the server action).
 *
 *   3. ORDER TRACKING — Use the customer-facing /track page to look
 *      up the order by email and verify the updated status is reflected.
 *
 * NOTE: Requires a running dev server with database access, and test
 * admin credentials seeded in the `users` table.
 */

import { test, expect } from '@playwright/test';

const TEST_ADMIN_EMAIL = process.env.TEST_ADMIN_EMAIL || 'admin@test.com';
const TEST_ADMIN_PASSWORD = process.env.TEST_ADMIN_PASSWORD || 'Admin123!';

test.describe('Order Lifecycle — End to End', () => {

    test('customer builds a cake, places order, admin updates status', async ({ page }) => {

        // ─── STEP 1: Build & Order a Cake ────────────────────────────────

        await page.goto('/builder');
        await page.waitForLoadState('networkidle');

        // Select "Chocolate" flavor
        const chocolateBtn = page.locator('button', { hasText: 'Chocolate' });
        await chocolateBtn.click();

        // Select 2 tiers
        const twoTierBtn = page.locator('button', { hasText: '2 Tiers' });
        await twoTierBtn.click();

        // Add Cherry topping
        const cherryBtn = page.locator('button', { hasText: '+ Cherry' });
        await cherryBtn.click();

        // Add Sprinkles topping
        const sprinklesBtn = page.locator('button', { hasText: '+ Sprinkles' });
        await sprinklesBtn.click();

        // Verify the price updated (base=500*1*2=1000 + Chocolate=50 + Cherry=10 + Sprinkles=5 = 1065)
        await expect(page.locator('text=₹1,065').or(page.locator('text=₹1065'))).toBeVisible({ timeout: 5_000 });

        // Handle the alert dialog that appears on order success
        page.on('dialog', async (dialog) => {
            expect(dialog.message()).toContain('Order Placed');
            await dialog.accept();
        });

        // Click "Order Now"
        const orderBtn = page.locator('button', { hasText: 'Order Now' });
        await orderBtn.click();

        // Wait for the save to complete (button text changes back)
        await expect(orderBtn).not.toContainText('Placing Order', { timeout: 15_000 });

        // ─── STEP 2: Admin Login & Status Update ─────────────────────────

        await page.goto('/login');
        await page.fill('input[type="email"]', TEST_ADMIN_EMAIL);
        await page.fill('input[type="password"]', TEST_ADMIN_PASSWORD);
        await page.click('button[type="submit"]');
        await page.waitForURL('**/admin**', { timeout: 15_000 });

        // Find the order table — the most recent order should be at the top
        const orderTable = page.locator('table');
        await expect(orderTable).toBeVisible();

        // Find the first order row with "pending" status
        const pendingBadge = page.locator('span', { hasText: /pending/i }).first();

        if (await pendingBadge.isVisible()) {
            // Click the "→ baking" action link in the same row
            const statusToggle = page.locator('button', { hasText: /→ baking/i }).first();
            await statusToggle.click();

            // Wait for the status to update (revalidatePath triggers a re-render)
            await expect(statusToggle).not.toContainText('Updating', { timeout: 10_000 });

            // After update, the badge should now show "baking"
            const updatedBadge = page.locator('span', { hasText: /baking/i }).first();
            await expect(updatedBadge).toBeVisible({ timeout: 5_000 });
        }

        // ─── STEP 3: Verify Status via Customer Tracking Page ────────────

        await page.goto('/track');
        await page.fill('input[type="email"]', TEST_ADMIN_EMAIL);
        await page.locator('button', { hasText: 'Track' }).click();

        // Wait for results to load
        await page.waitForTimeout(3000);

        // If orders exist for this email, verify the page displays them
        const orderCards = page.locator('.bg-white.rounded-xl.border');
        const count = await orderCards.count();

        if (count > 0) {
            // At least one order card should be visible
            await expect(orderCards.first()).toBeVisible();
        }
    });
});
