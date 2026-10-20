import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthProvider';
import { ROUTES } from '../../config/site';
import { useI18n } from '../../i18n/I18nProvider';

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  const { t } = useI18n();

  if (isLoading) return <p role="status">{t('loading')}</p>;
  if (!isAuthenticated)
    return <Navigate to={ROUTES.dashboardLogin} replace state={{ from: location.pathname }} />;

  // This client guard only shapes UX. Real authorization must be enforced by the server.
  return children;
}
