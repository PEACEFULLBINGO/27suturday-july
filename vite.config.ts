import type {} from 'vitest/config';
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'node:path';

// StudyFlow Orbit — Vite config.
// `root` points at /src so index.html lives next to the app code (matches
// the project's feature-first layout); build output goes to /dist at the
// repo root, and /public is served as static assets (favicon, manifest, etc).
export default defineConfig({
  root: '.',
  publicDir: path.resolve(__dirname, 'public'),
  base: './',
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  build: {
    outDir: path.resolve(__dirname, 'dist'),
    emptyOutDir: true,
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: path.resolve(__dirname, 'tests/setup.ts'),
    include: [path.resolve(__dirname, 'tests/**/*.test.{ts,tsx}')],
  },
});
