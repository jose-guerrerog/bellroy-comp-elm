// vitest.config.ts
import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'url';
import elm from 'vite-plugin-elm';

import path from 'path';

// Convert URL to filepath for import.meta.url
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [elm()],

  build: {
    rollupOptions: {
      external: [/^elm-stuff\//]
    }
  },

  test: {
    // Use the jsdom environment for DOM testing
    environment: 'jsdom',
    
    // Include tests from the tests directory
    include: ['tests/**/*.{test,spec}.{js,ts,jsx,tsx}'],
    
    // Load setup file
    setupFiles: ['tests/setup.ts'],
    
    // Provide global variables
    globals: true,
    
    // Coverage configuration
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/']
    }
  },

  // Resolve source files for proper imports in tests
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
});