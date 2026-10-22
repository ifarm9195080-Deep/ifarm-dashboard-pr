import { useLocation } from 'react-router-dom';
import { DASHBOARD_NAVIGATION, ROUTES } from '../../../config/site';
import { useI18n } from '../../../i18n/I18nProvider';

const pageKeys = new Map<string, (typeof DASHBOARD_NAVIGATION)[number]['label']>(
  DASHBOARD_NAVIGATION.map(({ path, label }) => [path, label]),
);

export function DashboardPage() {
  const { t, locale } = useI18n();
  const path = useLocation().pathname;
  const label = pageKeys.get(path);
  const isOverview = path === ROUTES.dashboard;

  if (!label && !isOverview) {
    return (
      <section className="dashboard-placeholder" aria-labelledby="dashboard-page-title">
        <h2 id="dashboard-page-title">{t('pageNotFound')}</h2>
        <p>{t('pageNotFoundText')}</p>
      </section>
    );
  }

  if (!isOverview) {
    return (
      <section className="dashboard-placeholder" aria-labelledby="dashboard-page-title">
        <span className="dashboard-eyebrow">{t('dashboardWorkspace')}</span>
        <h2 id="dashboard-page-title">{t(label ?? 'dashboardOverview')}</h2>
        <p>{t('featurePlaceholder')}</p>
      </section>
    );
  }

  return (
    <>
      <section className="dashboard-overview-welcome" aria-labelledby="dashboard-welcome-title">
        <div>
          <span className="dashboard-eyebrow">{t('farmOverview')}</span>
          <h2 id="dashboard-welcome-title">{t('welcomeToFarm')}</h2>
          <p>{t('overviewIntro')}</p>
        </div>
        <span className="dashboard-date">
          {new Intl.DateTimeFormat(locale === 'ar' ? 'ar-EG' : 'en', {
            dateStyle: 'full',
          }).format(new Date())}
        </span>
      </section>
      <section className="dashboard-empty-state" aria-label={t('overviewSummary')}>
        <div className="dashboard-empty-state__illustration" aria-hidden="true">
          ✦
        </div>
        <h2>{t('dashboardReadyTitle')}</h2>
        <p>{t('dashboardReadyText')}</p>
      </section>
    </>
  );
}
