/**
 * __tests__/unit/product-actions.test.ts
 *
 * Unit tests for the Product Server Actions (app/admin/products/actions.ts).
 *
 * Strategy:
 *   - Mock the `pg` pool so no real database is required.
 *   - Mock `next/cache` revalidatePath since it's a Next.js server-only API.
 *   - Test the Zod validation layer independently:
 *     • Rejects negative prices
 *     • Rejects missing required fields
 *     • Rejects invalid image URLs
 *     • Accepts well-formed payloads
 *   - Test the createProduct and deleteProduct functions end-to-end
 *     (through the mock layer).
 */

// ── Mocks (must be defined before imports) ──────────────────────────────────

jest.mock('@/lib/db', () => {
    const mockQuery = jest.fn().mockResolvedValue({ rows: [] });
    const mockRelease = jest.fn();
    const mockConnect = jest.fn().mockResolvedValue({
        query: mockQuery,
        release: mockRelease,
    });
    return {
        __esModule: true,
        default: { connect: mockConnect },
        __mockQuery: mockQuery,
        __mockRelease: mockRelease,
        __mockConnect: mockConnect,
    };
});

jest.mock('next/cache', () => ({
    revalidatePath: jest.fn(),
}));

// ── Imports ─────────────────────────────────────────────────────────────────

import { createProduct, deleteProduct } from '@/app/admin/products/actions';
import { revalidatePath } from 'next/cache';

// Pull out mock references for assertions
const db = require('@/lib/db');
const mockQuery = db.__mockQuery as jest.Mock;
const mockConnect = db.__mockConnect as jest.Mock;

// ── Helpers ─────────────────────────────────────────────────────────────────

/** Build a FormData object from a plain key-value record */
function buildFormData(data: Record<string, string>): FormData {
    const fd = new FormData();
    Object.entries(data).forEach(([key, val]) => fd.append(key, val));
    return fd;
}

/** Canonical valid product payload */
const VALID_PRODUCT = {
    name: 'Chocolate Truffle',
    slug: 'chocolate-truffle',
    description: 'A rich chocolate cake with truffle layers',
    price: '1200',
    category: 'Premium',
    image_url: 'https://example.com/cake.jpg',
};

// ── Test Suite ──────────────────────────────────────────────────────────────

describe('Product Server Actions — Zod Validation', () => {

    beforeEach(() => {
        jest.clearAllMocks();
        mockQuery.mockResolvedValue({ rows: [] });
    });

    // ── Rejection Cases ─────────────────────────────────────────────────

    test('rejects negative price', async () => {
        const fd = buildFormData({ ...VALID_PRODUCT, price: '-50' });
        const result = await createProduct(fd);

        expect(result.success).toBe(false);
        expect(result.error).toBeDefined();
        // DB should never be touched on validation failure
        expect(mockQuery).not.toHaveBeenCalled();
    });

    test('rejects missing product name', async () => {
        const fd = buildFormData({ ...VALID_PRODUCT, name: '' });
        const result = await createProduct(fd);

        expect(result.success).toBe(false);
        expect(result.error).toBeDefined();
        expect(mockQuery).not.toHaveBeenCalled();
    });

    test('rejects missing slug', async () => {
        const fd = buildFormData({ ...VALID_PRODUCT, slug: '' });
        const result = await createProduct(fd);

        expect(result.success).toBe(false);
        expect(result.error).toBeDefined();
        expect(mockQuery).not.toHaveBeenCalled();
    });

    test('rejects missing category', async () => {
        const fd = buildFormData({ ...VALID_PRODUCT, category: '' });
        const result = await createProduct(fd);

        expect(result.success).toBe(false);
        expect(result.error).toBeDefined();
        expect(mockQuery).not.toHaveBeenCalled();
    });

    test('rejects invalid image URL', async () => {
        const fd = buildFormData({ ...VALID_PRODUCT, image_url: 'not-a-url' });
        const result = await createProduct(fd);

        expect(result.success).toBe(false);
        expect(result.error).toBeDefined();
        expect(mockQuery).not.toHaveBeenCalled();
    });

    test('rejects non-numeric price (NaN)', async () => {
        const fd = buildFormData({ ...VALID_PRODUCT, price: 'abc' });
        const result = await createProduct(fd);

        expect(result.success).toBe(false);
        expect(result.error).toBeDefined();
        expect(mockQuery).not.toHaveBeenCalled();
    });

    // ── Acceptance Cases ────────────────────────────────────────────────

    test('accepts valid product and inserts into DB', async () => {
        const fd = buildFormData(VALID_PRODUCT);
        const result = await createProduct(fd);

        expect(result.success).toBe(true);
        expect(mockConnect).toHaveBeenCalledTimes(1);
        expect(mockQuery).toHaveBeenCalledTimes(1);

        // Verify the INSERT query received the correct values
        const [sql, params] = mockQuery.mock.calls[0];
        expect(sql).toContain('INSERT INTO products');
        expect(params).toEqual([
            'Chocolate Truffle',
            'chocolate-truffle',
            'A rich chocolate cake with truffle layers',
            1200,         // Zod coerces string → number
            'Premium',
            'https://example.com/cake.jpg',
        ]);
    });

    test('accepts product with empty description (optional field)', async () => {
        // FormData always sends strings — when omitted, formData.get() returns null.
        // But if the field is sent as empty string, Zod's optional() still accepts it.
        const fd = buildFormData({ ...VALID_PRODUCT, description: '' });
        const result = await createProduct(fd);

        expect(result.success).toBe(true);
        expect(mockQuery).toHaveBeenCalledTimes(1);
    });

    test('accepts zero price (free product)', async () => {
        const fd = buildFormData({ ...VALID_PRODUCT, price: '0' });
        const result = await createProduct(fd);

        expect(result.success).toBe(true);
        expect(mockQuery).toHaveBeenCalledTimes(1);
    });

    test('revalidates /menu and /admin/products on success', async () => {
        const fd = buildFormData(VALID_PRODUCT);
        await createProduct(fd);

        expect(revalidatePath).toHaveBeenCalledWith('/menu');
        expect(revalidatePath).toHaveBeenCalledWith('/admin/products');
    });

    test('handles database errors gracefully', async () => {
        mockQuery.mockRejectedValueOnce(new Error('unique_violation'));

        const fd = buildFormData(VALID_PRODUCT);
        const result = await createProduct(fd);

        expect(result.success).toBe(false);
        expect(result.error).toBe('unique_violation');
    });
});

describe('Product Server Actions — deleteProduct', () => {

    beforeEach(() => {
        jest.clearAllMocks();
        mockQuery.mockResolvedValue({ rows: [] });
    });

    test('deletes product by numeric ID', async () => {
        const result = await deleteProduct(42);

        expect(result.success).toBe(true);
        expect(mockQuery).toHaveBeenCalledWith(
            'DELETE FROM products WHERE id = $1',
            [42]
        );
    });

    test('deletes product by string ID', async () => {
        const result = await deleteProduct('99');

        expect(result.success).toBe(true);
        expect(mockQuery).toHaveBeenCalledWith(
            'DELETE FROM products WHERE id = $1',
            ['99']
        );
    });

    test('revalidates paths after deletion', async () => {
        await deleteProduct(1);

        expect(revalidatePath).toHaveBeenCalledWith('/menu');
        expect(revalidatePath).toHaveBeenCalledWith('/admin/products');
    });

    test('handles delete failure gracefully', async () => {
        mockQuery.mockRejectedValueOnce(new Error('fk_constraint'));

        const result = await deleteProduct(1);
        expect(result.success).toBe(false);
        expect(result.error).toBe('fk_constraint');
    });
});
