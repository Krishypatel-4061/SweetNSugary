/**
 * __tests__/unit/analyze-cake-image.test.ts
 *
 * Unit tests for the /api/analyze-cake-image endpoint.
 *
 * Strategy:
 *   - Mock the @google/generative-ai SDK entirely.
 *   - The mock returns a controlled JSON string → verifies the route
 *     correctly parses and returns the 3D cake configuration.
 *   - Tests edge cases: missing image, malformed AI response,
 *     and markdown-wrapped JSON output from Gemini.
 */

// ── Mock the Gemini SDK ─────────────────────────────────────────────────────

const mockGenerateContent = jest.fn();

jest.mock('@google/generative-ai', () => {
    return {
        GoogleGenerativeAI: jest.fn().mockImplementation(() => ({
            getGenerativeModel: jest.fn().mockReturnValue({
                generateContent: mockGenerateContent,
            }),
        })),
    };
});

// ── Import the route handler ────────────────────────────────────────────────

import { POST } from '@/app/api/analyze-cake-image/route';

// ── Helpers ─────────────────────────────────────────────────────────────────

/** Creates a fake Request with a FormData body containing an image file */
function createImageRequest(includeImage = true): Request {
    const formData = new FormData();
    if (includeImage) {
        // Create a minimal fake image file (1x1 pixel PNG header)
        const imageBuffer = new Uint8Array([
            137, 80, 78, 71, 13, 10, 26, 10,  // PNG signature
        ]);
        const file = new File([imageBuffer], 'test-cake.png', { type: 'image/png' });
        formData.append('image', file);
    }
    return new Request('http://localhost:3000/api/analyze-cake-image', {
        method: 'POST',
        body: formData,
    });
}

/** Canonical AI response that we control */
const MOCK_CAKE_CONFIG = {
    baseFlavor: 'Vanilla',
    color: '#FFC0CB',
    toppings: ['Cherry', 'Sprinkles'],
    scale: 1.2,
    tiers: 2,
    shape: 'Round',
    estimatedWeight: '1.5 kg',
};

// ── Test Suite ──────────────────────────────────────────────────────────────

describe('POST /api/analyze-cake-image', () => {

    beforeEach(() => {
        jest.clearAllMocks();
        // Set the env var the route handler expects
        process.env.GEMINI_API_KEY = 'test-api-key';
    });

    test('returns parsed 3D config from AI response', async () => {
        // Mock Gemini returning clean JSON
        mockGenerateContent.mockResolvedValue({
            response: {
                text: () => JSON.stringify(MOCK_CAKE_CONFIG),
            },
        });

        const req = createImageRequest();
        const res = await POST(req);
        const data = await res.json();

        expect(res.status).toBe(200);
        expect(data.baseFlavor).toBe('Vanilla');
        expect(data.color).toBe('#FFC0CB');
        expect(data.toppings).toEqual(['Cherry', 'Sprinkles']);
        expect(data.scale).toBe(1.2);
        expect(data.tiers).toBe(2);
        expect(data.shape).toBe('Round');
        expect(data.estimatedWeight).toBe('1.5 kg');
    });

    test('handles markdown-wrapped JSON from Gemini', async () => {
        // Gemini sometimes wraps JSON in ```json ... ``` markers
        const wrappedJson = '```json\n' + JSON.stringify(MOCK_CAKE_CONFIG) + '\n```';

        mockGenerateContent.mockResolvedValue({
            response: {
                text: () => wrappedJson,
            },
        });

        const req = createImageRequest();
        const res = await POST(req);
        const data = await res.json();

        expect(res.status).toBe(200);
        expect(data.baseFlavor).toBe('Vanilla');
        expect(data.color).toBe('#FFC0CB');
    });

    test('returns 400 when no image is provided', async () => {
        const req = createImageRequest(false);
        const res = await POST(req);
        const data = await res.json();

        expect(res.status).toBe(400);
        expect(data.error).toBe('No image provided');
    });

    test('returns 500 when AI SDK throws', async () => {
        mockGenerateContent.mockRejectedValue(new Error('rate_limit_exceeded'));

        const req = createImageRequest();
        const res = await POST(req);
        const data = await res.json();

        expect(res.status).toBe(500);
        expect(data.error).toBe('Failed to analyze image');
    });

    test('returns 500 when AI returns unparseable garbage', async () => {
        mockGenerateContent.mockResolvedValue({
            response: {
                text: () => 'This is not JSON at all, just rambling text about cakes...',
            },
        });

        const req = createImageRequest();
        const res = await POST(req);
        const data = await res.json();

        expect(res.status).toBe(500);
        expect(data.error).toBe('Failed to analyze image');
    });

    test('passes image data to Gemini in correct format', async () => {
        mockGenerateContent.mockResolvedValue({
            response: {
                text: () => JSON.stringify(MOCK_CAKE_CONFIG),
            },
        });

        const req = createImageRequest();
        await POST(req);

        // Verify the SDK was called with a prompt and inline image data
        expect(mockGenerateContent).toHaveBeenCalledTimes(1);
        const callArgs = mockGenerateContent.mock.calls[0][0];

        // First arg is the prompt string
        expect(typeof callArgs[0]).toBe('string');
        expect(callArgs[0]).toContain('baseFlavor');

        // Second arg is the inlineData object
        expect(callArgs[1]).toHaveProperty('inlineData');
        expect(callArgs[1].inlineData).toHaveProperty('data');
        expect(callArgs[1].inlineData).toHaveProperty('mimeType', 'image/png');
    });
});
