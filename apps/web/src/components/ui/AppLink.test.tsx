import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { AppLink } from './AppLink';
import { I18nProvider, translate } from '../../i18n/I18nProvider';
import type { Locale } from '../../i18n';

function renderLink(href: string) {
  const navigate = vi.fn();
  render(
    <I18nProvider
      locale={'en' satisfies Locale}
      setLocale={() => undefined}
      t={(key) => translate('en', key)}
      navigate={navigate}
    >
      <AppLink href={href}>Open</AppLink>
    </I18nProvider>,
  );
  const link = screen.getByRole('link', { name: 'Open' });
  const allowedDefault = fireEvent.click(link);
  return { link, navigate, allowedDefault };
}

describe('AppLink', () => {
  it.each(['javascript:alert(1)', 'data:text/html,unsafe', 'http://[invalid'])(
    'blocks %s',
    (href) => {
      const { navigate, allowedDefault } = renderLink(href);
      expect(allowedDefault).toBe(false);
      expect(navigate).not.toHaveBeenCalled();
    },
  );
});
