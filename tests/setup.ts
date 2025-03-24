// tests/setup.ts
// This file will be automatically loaded before your tests run if configured in vitest.config.ts

// Import and configure any necessary test libraries
import { expect } from 'vitest';

// You can add custom matchers or setup global test configuration here
// For example, if you were using Testing Library, you might add:
// import '@testing-library/jest-dom';

// Example custom matcher
expect.extend({
  toBeValidHexColor(received) {
    const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    const pass = hexColorRegex.test(received);
    if (pass) {
      return {
        message: () => `expected ${received} not to be a valid hex color`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${received} to be a valid hex color`,
        pass: false,
      };
    }
  },
});

// Reset any side effects after each test
export function cleanup() {
  // Clean up any global side effects here
}