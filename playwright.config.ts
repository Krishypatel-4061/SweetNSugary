/**
 * playwright.config.ts
 *
 * Playwright E2E test configuration for SweetNSugary.
 * Tests run against the local Next.js dev server on port 3000.
 * The webServer block auto-starts `npm run dev` before tests
 * and waits for port 3000 to become available.
 */

import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
    testDir: './e2e',
    fullyParallel: false,  // Sequential — tests share DB state
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: 1,            // Single worker to avoid auth/order race conditions
    reporter: 'html',
    timeout: 60_000,       // 60s per test — accounts for SSR + DB latency

    use: {
        baseURL: 'http://localhost:3000',
        trace: 'on-first-retry',
        screenshot: 'only-on-failure',
    },

    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },
    ],

    // Auto-start the dev server before running E2E tests
    webServer: {
        command: 'npm run dev',
        url: 'http://localhost:3000',
        reuseExistingServer: true, // Don't restart if already running
        timeout: 120_000,
    },
});
