const configuredApiBaseUrl = String(import.meta.env.VITE_API_BASE_URL ?? '').trim();

export const apiBaseUrl = configuredApiBaseUrl.replace(/\/+$/, '');

// The dev MSW worker is same-origin. An explicit API URL opts out of the mock adapter.
export const isDevelopmentMockMode = import.meta.env.DEV && apiBaseUrl.length === 0;
