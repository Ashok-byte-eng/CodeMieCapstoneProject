import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * Vite config with dev proxy to backend.
 */
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:4000'
    }
  }
});
