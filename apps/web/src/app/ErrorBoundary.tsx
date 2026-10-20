import { Component, type ReactNode } from 'react';
import { ar } from '../i18n/ar';
import { en } from '../i18n/en';

type ErrorBoundaryProps = { children: ReactNode };
type ErrorBoundaryState = { hasError: boolean };

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  override state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  override componentDidCatch() {
    // Keep rendering errors inside the app without exposing implementation details.
  }

  override render() {
    if (this.state.hasError) {
      const isArabic = document.documentElement.lang === 'ar';
      return (
        <main className="placeholder-page">
          <p role="alert">{isArabic ? ar.errorFallback : en.errorFallback}</p>
        </main>
      );
    }

    return this.props.children;
  }
}
