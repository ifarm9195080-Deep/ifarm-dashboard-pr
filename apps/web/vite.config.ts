import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Keep the development server local by default; share the production preview via an approved tunnel.
  server: { host: '127.0.0.1' },
});
