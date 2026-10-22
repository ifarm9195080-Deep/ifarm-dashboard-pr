import { useEffect, useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes, useNavigate } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { AuthProvider } from '../../auth/AuthProvider';
import { ProtectedRoute } from '../../auth/ProtectedRoute';
import { ClientLoginPage } from '../../../App';
import { I18nProvider, translate } from '../../../i18n/I18nProvider';
import type { CopyKey, Locale } from '../../../i18n';
import { DashboardLayout } from './DashboardLayout';
import { DashboardPage } from '../pages/DashboardPage';

function TestApp() {
  const routerNavigate = useNavigate();
  const navigate = (to: string) => {
    void routerNavigate(to);
  };
  const [locale, setLocale] = useState<Locale>('en');
  const t = (key: CopyKey) => translate(locale, key);
  useEffect(() => {
    document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
  }, [locale]);

  return (
    <I18nProvider locale={locale} setLocale={setLocale} t={t} navigate={navigate}>
      <Routes>
        <Route path="/dashboard/login" element={<ClientLoginPage />} />
        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <DashboardPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </I18nProvider>
  );
}

function renderApp(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <AuthProvider>
        <TestApp />
      </AuthProvider>
    </MemoryRouter>,
  );
}

async function signIn(user: ReturnType<typeof userEvent.setup>) {
  await user.type(await screen.findByPlaceholderText('Enter your username'), 'farmer');
  await user.type(screen.getByPlaceholderText('Enter your password'), 'development-only');
  await user.type(screen.getByPlaceholderText('Enter your account ID'), 'demo-farm');
  await user.click(screen.getByRole('button', { name: 'Sign In' }));
}

describe('dashboard shell and protected navigation', () => {
  it('redirects unauthenticated nested routes to sign in', async () => {
    renderApp('/dashboard/cameras');
    expect(await screen.findByRole('heading', { name: 'Sign in' })).toBeInTheDocument();
  });

  it('sends a successful sign in to Overview', async () => {
    const user = userEvent.setup();
    renderApp('/dashboard/login');
    await signIn(user);
    expect(
      await screen.findByRole('heading', { name: 'Welcome to your farm' }),
    ).toBeInTheDocument();
  });

  it('logs out and protects the dashboard again', async () => {
    const user = userEvent.setup();
    renderApp('/dashboard/login');
    await signIn(user);
    await user.click(await screen.findByRole('button', { name: 'Sign out' }));
    expect(await screen.findByRole('heading', { name: 'Sign in' })).toBeInTheDocument();
  });

  it('collapses the sidebar while keeping its navigation controls available', async () => {
    const user = userEvent.setup();
    renderApp('/dashboard');
    await screen.findByRole('heading', { name: 'Sign in' });
    await signIn(user);
    const toggle = await screen.findByRole('button', { name: 'Collapse sidebar' });
    await user.click(toggle);
    expect(screen.getByRole('button', { name: 'Expand sidebar' })).toHaveAttribute(
      'aria-expanded',
      'false',
    );
    const sensorsLink = screen.getByRole('link', { name: 'Sensors' });
    expect(sensorsLink).toBeInTheDocument();
    await user.click(sensorsLink);
    expect(await screen.findByRole('heading', { name: 'Sensors', level: 2 })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Sensors' })).toHaveAttribute('aria-current', 'page');
  });

  it('switches the shell to Arabic and RTL', async () => {
    const user = userEvent.setup();
    renderApp('/dashboard/login');
    await signIn(user);
    await user.click(await screen.findByRole('button', { name: 'Language' }));
    expect(await screen.findByRole('heading', { name: 'مرحبًا بك في مزرعتك' })).toBeInTheDocument();
    expect(document.documentElement.dir).toBe('rtl');
    expect(screen.getByRole('navigation', { name: 'التنقل في لوحة التحكم' })).toBeInTheDocument();
  });
});
