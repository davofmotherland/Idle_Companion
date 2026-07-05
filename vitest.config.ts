import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Run tests in Node.js environment
    environment: 'node',
    // Include test files from tests directory
    include: ['tests/**/*.test.ts'],
  },
  resolve: {
    // Allow importing from src directory
    alias: {
      '@': './src',
    },
  },
});
