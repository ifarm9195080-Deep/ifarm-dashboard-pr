import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ErrorBoundary } from './ErrorBoundary';
import { en } from '../i18n/en';

function BrokenView(): never {
  throw new Error('private diagnostic');
}

describe('ErrorBoundary', () => {
  it('shows a generic message and does not display diagnostics', () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    render(
      <ErrorBoundary>
        <BrokenView />
      </ErrorBoundary>,
    );
    expect(screen.getByRole('alert')).toHaveTextContent(en.errorFallback);
    expect(screen.queryByText('private diagnostic')).not.toBeInTheDocument();
    errorSpy.mockRestore();
  });
});
