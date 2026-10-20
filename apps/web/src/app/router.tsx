import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { ErrorBoundary } from './ErrorBoundary';
import { en } from '../i18n/en';
import { AuthProvider } from '../features/auth/AuthProvider';

const App = lazy(() => import('../App'));

function AppRoute() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Suspense fallback={<p role="status">{en.loading}</p>}>
          <App />
        </Suspense>
      </AuthProvider>
    </ErrorBoundary>
  );
}

function RouteError() {
  return (
    <main className="placeholder-page">
      <p role="alert">{en.errorFallback}</p>
    </main>
  );
}

const paths = ['/', '/dashboard', '/dashboard/login', '/store', '/ai', '*'];

export const router = createBrowserRouter(
  paths.map((path) => ({
    path,
    element: <AppRoute />,
    errorElement: <RouteError />,
  })),
);
