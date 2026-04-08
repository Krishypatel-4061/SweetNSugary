/**
 * jest.config.ts
 *
 * Jest configuration for SweetNSugary.
 * Uses ts-jest to run TypeScript tests directly.
 * Configured with moduleNameMapper to resolve the @/* path alias
 * used throughout the Next.js project.
 */

import type { Config } from 'jest';

const config: Config = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: ['<rootDir>/__tests__'],
    testMatch: ['**/*.test.ts', '**/*.test.tsx'],
    moduleNameMapper: {
        // Mirror the tsconfig @/* → ./* path alias
        '^@/(.*)$': '<rootDir>/$1',
    },
    transform: {
        '^.+\\.tsx?$': ['ts-jest', {
            tsconfig: 'tsconfig.json',
        }],
    },
    // Ignore Playwright tests — those run via npx playwright test
    testPathIgnorePatterns: ['/node_modules/', '/e2e/'],
    // Clear mocks between every test to prevent state leakage
    clearMocks: true,
    // Collect coverage from source files (not test files)
    collectCoverageFrom: [
        'app/**/*.ts',
        'lib/**/*.ts',
        '!app/**/*.tsx', // Exclude React components from unit coverage
    ],
};

export default config;
