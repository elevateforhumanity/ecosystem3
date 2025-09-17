import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    setupFiles: ['./vitest.setup.js'],
    environment: 'jsdom',
    environmentMatchGlobs: [
      // API + backend tests run in Node
      ['tests/**', 'node'],
      ['test/**', 'node']
    ],
    include: [
      'tests/**/*.spec.{js,ts}',
      'test/**/*.test.{js,ts}',
      'src/**/*.test.{js,jsx,ts,tsx}'
    ],
    coverage: {
      provider: 'v8',
      thresholds: { lines: 70, branches: 60, functions: 65, statements: 70 }
    }
  }
});