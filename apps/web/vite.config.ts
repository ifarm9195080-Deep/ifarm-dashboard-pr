import { readFileSync } from 'node:fs';
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

const mockWorkerScript = readFileSync(
  new URL('./node_modules/msw/lib/mockServiceWorker.js', import.meta.url),
);

function serveMockWorker(): Plugin {
  return {
    name: 'serve-msw-worker-in-development',
    configureServer(server) {
      server.middlewares.use('/mockServiceWorker.js', (_request, response) => {
        response.setHeader('Content-Type', 'application/javascript');
        response.end(mockWorkerScript);
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), serveMockWorker()],
  build: { sourcemap: false },
  // Keep the development server local by default; share the production preview via an approved tunnel.
  server: { host: '127.0.0.1' },
});
