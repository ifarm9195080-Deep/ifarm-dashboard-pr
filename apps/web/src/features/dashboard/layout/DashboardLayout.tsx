import { useEffect, useState, type ReactNode } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { DASHBOARD_NAVIGATION, ROUTES } from '../../../config/site';
import { useAuth } from '../../auth/AuthProvider';
import { useI18n } from '../../../i18n/I18nProvider';
import './DashboardLayout.css';

type NavIcon = (typeof DASHBOARD_NAVIGATION)[number]['icon'];

function Icon({ name }: { name: NavIcon | 'collapse' | 'bell' | 'user' | 'logout' }) {
  const paths: Record<typeof name, ReactNode> = {
    overview: (
      <>
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </>
    ),
    sensors: (
      <>
        <path d="M12 3v4m0 10v4M3 12h4m10 0h4" />
        <circle cx="12" cy="12" r="5" />
      </>
    ),
    cameras: (
      <>
        <path d="M4 7h3l2-2h6l2 2h3v12H4z" />
        <circle cx="12" cy="13" r="3" />
      </>
    ),
    reports: (
      <>
        <path d="M6 3h9l4 4v14H6z" />
        <path d="M14 3v5h5M9 13h7m-7 4h7" />
      </>
    ),
    thermal: (
      <>
        <path d="M14 14.5V5a3 3 0 0 0-6 0v9.5a5 5 0 1 0 6 0Z" />
        <path d="M11 11v6" />
      </>
    ),
    settings: (
      <>
        <circle cx="12" cy="12" r="3" />
        <path
          d="m19 13 2 1-2 4-2-1a8 8 0 0 1-2 1l-.5 2h-4L10 18a8 8 0 0 1-2-1l-2 1-2-4 2-1a8 8 0 0 1 0-2L4 10l2-4 2 1a8 8 0 0 1 2-1l.5-2h4L15 6a8 8 0 0 1 2 1l2-1 2 4-2 1a8 8 0 0 1 0 2Z"
          transform="translate(-1 -1)"
        />
      </>
    ),
    collapse: <path d="m15 18-6-6 6-6" />,
    bell: (
      <>
        <path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9Zm-8 12h4" />
      </>
    ),
    user: (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M5 21v-2a7 7 0 0 1 14 0v2" />
      </>
    ),
    logout: (
      <>
        <path d="M10 17l5-5-5-5m5 5H3" />
        <path d="M12 3h7a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-7" />
      </>
    ),
  };
  const path = new Map(Object.entries(paths)).get(name);
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {path}
    </svg>
  );
}

export function DashboardLayout({ children }: { children: ReactNode }) {
  const { t, locale, setLocale } = useI18n();
  const { user, logout } = useAuth();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const page = DASHBOARD_NAVIGATION.find((item) => item.path === location.pathname);
  const pageTitle = page
    ? t(page.label)
    : location.pathname === ROUTES.dashboard
      ? t('dashboardOverview')
      : t('pageNotFound');

  async function handleLogout() {
    try {
      await logout();
    } catch {
      // AuthProvider clears the in-memory session even when the API is unavailable.
    }
  }

  useEffect(() => {
    if (!mobileOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMobileOpen(false);
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => {
      window.removeEventListener('keydown', closeOnEscape);
    };
  }, [mobileOpen]);

  return (
    <div
      className={`dashboard-shell${collapsed ? ' is-collapsed' : ''}${mobileOpen ? ' mobile-open' : ''}`}
    >
      {mobileOpen && (
        <button
          className="dashboard-scrim"
          aria-label={t('closeNavigation')}
          onClick={() => {
            setMobileOpen(false);
          }}
        />
      )}
      <aside className="dashboard-sidebar" aria-label={t('dashboardNavigation')}>
        <div className="dashboard-brand">
          <span className="dashboard-brand__mark" aria-hidden="true">
            i
          </span>
          <span className="dashboard-brand__name">i-Farm</span>
          <button
            className="dashboard-collapse"
            aria-label={collapsed ? t('expandSidebar') : t('collapseSidebar')}
            aria-expanded={!collapsed}
            onClick={() => {
              setCollapsed((value) => !value);
            }}
          >
            <Icon name="collapse" />
          </button>
        </div>
        <div className="dashboard-farm">
          <span className="dashboard-farm__avatar" aria-hidden="true">
            ⌂
          </span>
          <span className="dashboard-farm__copy">
            <strong>{t('demoFarm')}</strong>
            <small>{t('farmWorkspace')}</small>
          </span>
        </div>
        <nav className="dashboard-nav" aria-label={t('dashboardNavigation')}>
          {DASHBOARD_NAVIGATION.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === ROUTES.dashboard}
              className={({ isActive }) => `dashboard-nav__link${isActive ? ' is-active' : ''}`}
              onClick={() => {
                setMobileOpen(false);
              }}
              title={collapsed ? t(item.label) : undefined}
            >
              <Icon name={item.icon} />
              <span>{t(item.label)}</span>
            </NavLink>
          ))}
        </nav>
        <div className="dashboard-sidebar__bottom">
          <span className="dashboard-status-dot" />
          <span>{t('systemOnline')}</span>
        </div>
      </aside>
      <div className="dashboard-main">
        <header className="dashboard-topbar">
          <button
            className="dashboard-mobile-menu"
            aria-label={t('openNavigation')}
            aria-expanded={mobileOpen}
            onClick={() => {
              setMobileOpen(true);
            }}
          >
            <span />
            <span />
            <span />
          </button>
          <div className="dashboard-heading">
            <p>{t('dashboardWorkspace')}</p>
            <h1>{pageTitle}</h1>
          </div>
          <div className="dashboard-topbar__actions">
            <div className="dashboard-topbar__farm">
              <span>{t('currentFarm')}</span>
              <strong>{t('demoFarm')}</strong>
            </div>
            <button
              className="dashboard-icon-button"
              aria-label={t('notifications')}
              title={t('notifications')}
            >
              <Icon name="bell" />
              <i />
            </button>
            <button
              className="dashboard-language"
              aria-label={t('languageLabel')}
              onClick={() => {
                setLocale(locale === 'en' ? 'ar' : 'en');
              }}
            >
              {t('toggleLanguage')}
            </button>
            <div className="dashboard-user">
              <span className="dashboard-user__avatar">
                <Icon name="user" />
              </span>
              <span className="dashboard-user__copy">
                <strong>{user?.displayName ?? t('dashboardUser')}</strong>
                <small>{t('farmOwner')}</small>
              </span>
            </div>
            <button className="dashboard-logout" onClick={() => void handleLogout()}>
              <Icon name="logout" />
              <span>{t('signOut')}</span>
            </button>
          </div>
        </header>
        <main className="dashboard-content">{children}</main>
      </div>
    </div>
  );
}
