import React from 'react';
import ReactDOM from 'react-dom/client';
import { router } from './app/router';
import { RouterProvider } from 'react-router-dom';
import './styles.css';
import '@fontsource/arimo/latin-400.css';
import '@fontsource/arimo/latin-500.css';
import '@fontsource/arimo/latin-600.css';
import '@fontsource/arimo/latin-700.css';
import '@fontsource/noto-sans-arabic/arabic-400.css';
import '@fontsource/noto-sans-arabic/arabic-500.css';
import '@fontsource/noto-sans-arabic/arabic-600.css';
import '@fontsource/noto-sans-arabic/arabic-700.css';
import '@fontsource/noto-sans-arabic/latin-400.css';
import '@fontsource/noto-sans-arabic/latin-500.css';
import '@fontsource/noto-sans-arabic/latin-600.css';
import '@fontsource/noto-sans-arabic/latin-700.css';

const root = document.getElementById('root');

if (!root) throw new Error('Root element not found');
const container = root;

async function bootstrap() {
  if (import.meta.env.DEV) {
    const { worker } = await import('./mocks/browser');
    await worker.start({ onUnhandledRequest: 'bypass' });
  }

  ReactDOM.createRoot(container).render(
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>,
  );
}

void bootstrap();
