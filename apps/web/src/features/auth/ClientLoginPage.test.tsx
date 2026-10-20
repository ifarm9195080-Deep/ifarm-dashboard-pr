import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes, useNavigate } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { http, HttpResponse } from 'msw';
import { server } from '../../mocks/server';
import { AuthProvider } from './AuthProvider';
import { ClientLoginPage } from '../../App';
import { I18nProvider, translate } from '../../i18n/I18nProvider';
import type { CopyKey } from '../../i18n';

function LoginHarness() {
  const navigate = useNavigate();
  return (
    <I18nProvider
      locale="en"
      setLocale={() => undefined}
      t={(key: CopyKey) => translate('en', key)}
      navigate={navigate}
    >
      <Routes>
        <Route path="/dashboard/login" element={<ClientLoginPage />} />
        <Route path="/dashboard" element={<p>Dashboard welcome</p>} />
      </Routes>
    </I18nProvider>
  );
}

function renderLogin() {
  return render(
    <MemoryRouter initialEntries={['/dashboard/login']}>
      <AuthProvider>
        <LoginHarness />
      </AuthProvider>
    </MemoryRouter>,
  );
}

describe('client login form', () => {
  it('shows existing required-field messages', async () => {
    const user = userEvent.setup();
    renderLogin();
    await user.click(screen.getByRole('button', { name: 'Sign In' }));
    expect(await screen.findByText('Username is required.')).toBeInTheDocument();
    expect(screen.getByText('Password is required.')).toBeInTheDocument();
    expect(screen.getByText('Account ID is required.')).toBeInTheDocument();
  });

  it('uses one generic error for rejected credentials', async () => {
    server.use(
      http.post('*/auth/login', () =>
        HttpResponse.json({ message: 'Invalid credentials' }, { status: 401 }),
      ),
    );
    const user = userEvent.setup();
    renderLogin();
    await user.type(screen.getByPlaceholderText('Enter your username'), 'client');
    await user.type(screen.getByPlaceholderText('Enter your password'), 'invalid');
    await user.type(screen.getByPlaceholderText('Enter your account ID'), 'external-id');
    await user.click(screen.getByRole('button', { name: 'Sign In' }));
    expect(await screen.findByText('Invalid credentials')).toBeInTheDocument();
  });

  it('submits through MSW and follows the safe internal redirect', async () => {
    const user = userEvent.setup();
    renderLogin();
    await user.type(screen.getByPlaceholderText('Enter your username'), 'client');
    await user.type(screen.getByPlaceholderText('Enter your password'), 'sample-password');
    await user.type(screen.getByPlaceholderText('Enter your account ID'), 'external-id');
    await user.click(screen.getByRole('button', { name: 'Sign In' }));
    expect(await screen.findByText('Dashboard welcome')).toBeInTheDocument();
  });
});
