import { SAFE_POST_LOGIN_ROUTES, ROUTES } from '../../config/site';

const allowedPaths = new Set<string>(SAFE_POST_LOGIN_ROUTES);

export function getSafeRedirect(value: string | null, origin: string) {
  const fallback = ROUTES.dashboard;
  if (!value || !value.startsWith('/') || value.startsWith('//')) return fallback;

  try {
    const target = new URL(value, origin);
    if (target.origin !== origin || !allowedPaths.has(target.pathname)) return fallback;
    return target.pathname;
  } catch {
    return fallback;
  }
}
