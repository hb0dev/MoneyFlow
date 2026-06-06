import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Vite configuration for the MoneyFlow React application.
// During development, API calls to /api are proxied to the Express server.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
    },
  },
});
