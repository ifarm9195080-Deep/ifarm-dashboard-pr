import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import App from '../App';
import { AuthProvider } from '../features/auth/AuthProvider';

function HistoryControls() {
  const navigate = useNavigate();
  return (
    <div className="sr-only">
      <button
        onClick={() => {
          void navigate(-1);
        }}
      >
        Test browser back
      </button>
      <button
        onClick={() => {
          void navigate(1);
        }}
      >
        Test browser forward
      </button>
    </div>
  );
}

function renderApp(initialPath = '/') {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <AuthProvider>
        <App />
        <HistoryControls />
      </AuthProvider>
    </MemoryRouter>,
  );
}

async function submitMockSignIn(user: ReturnType<typeof userEvent.setup>) {
  await user.type(await screen.findByPlaceholderText('Enter your username'), 'farm-user');
  await user.type(screen.getByPlaceholderText('Enter your password'), 'development-only');
  await user.type(screen.getByPlaceholderText('Enter your account ID'), 'farm-reference');
  await user.click(screen.getByRole('button', { name: 'Sign In' }));
}

describe('public i-Farm navigation flow', () => {
  it('opens the Welcome Page, returns from Sign In, then reaches Overview and supports history navigation', async () => {
    const user = userEvent.setup();
    renderApp();

    expect(
      await screen.findByRole('heading', { name: 'Bring smarter monitoring to your farm.' }),
    ).toBeInTheDocument();
    expect(screen.getByText('Interested in iFarm?')).toBeInTheDocument();

    await user.click(screen.getByRole('link', { name: 'Client Sign In' }));
    expect(await screen.findByRole('heading', { name: 'Sign in' })).toBeInTheDocument();
    await user.click(screen.getByRole('link', { name: 'Back to iFarm' }));
    expect(
      await screen.findByRole('heading', { name: 'Bring smarter monitoring to your farm.' }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole('link', { name: 'Client Sign In' }));
    await submitMockSignIn(user);
    expect(
      await screen.findByRole('heading', { name: 'Welcome to your farm' }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Test browser back' }));
    expect(await screen.findByRole('heading', { name: 'Sign in' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Test browser forward' }));
    expect(
      await screen.findByRole('heading', { name: 'Welcome to your farm' }),
    ).toBeInTheDocument();
  });

  it('keeps direct dashboard routes protected while Sign In remains public', async () => {
    renderApp('/dashboard/reports');
    expect(await screen.findByRole('heading', { name: 'Sign in' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Reports' })).not.toBeInTheDocument();
  });

  it('keeps the original company marketing page available', async () => {
    renderApp('/company');
    expect(await screen.findByRole('heading', { name: /We plan your land/ })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Explore Our Services/ })).toHaveAttribute(
      'href',
      '#services',
    );
  });

  it('preserves the public interest form behavior', async () => {
    const user = userEvent.setup();
    renderApp('/');
    await screen.findByRole('heading', { name: 'Bring smarter monitoring to your farm.' });
    await user.type(screen.getByLabelText('Email address'), 'not-an-email');
    await user.click(screen.getByRole('button', { name: 'Register your interest' }));
    expect(screen.getByText('Please enter a valid email address.')).toBeInTheDocument();
    await user.clear(screen.getByLabelText('Email address'));
    await user.type(screen.getByLabelText('Email address'), 'farm@example.com');
    await user.click(screen.getByRole('button', { name: 'Register your interest' }));
    expect(screen.getByText(/This form is not connected yet/)).toBeInTheDocument();
  });
});
