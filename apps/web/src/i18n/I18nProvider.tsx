import { createContext, useContext, useMemo, type ReactNode } from 'react';
import type { CopyKey, Locale } from './index';
import { en } from './en';
import { ar } from './ar';

export type I18nValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: CopyKey) => string;
  navigate: (to: string) => void;
};

const copy = { en, ar };
const I18nContext = createContext<I18nValue | null>(null);

type I18nProviderProps = I18nValue & { children: ReactNode };

export function I18nProvider({ children, locale, setLocale, t, navigate }: I18nProviderProps) {
  const value = useMemo(
    () => ({ locale, setLocale, t, navigate }),
    [locale, setLocale, t, navigate],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const value = useContext(I18nContext);
  if (!value) throw new Error('useI18n must be used inside I18nProvider');
  return value;
}

export function translate(locale: Locale, key: CopyKey) {
  return copy[locale][key];
}
