import { z } from 'zod';
import { refreshResponseSchema } from './schemas';
import { apiBaseUrl } from './apiConfig';

const timeoutMs = 10_000;
let accessToken: string | null = null;
let refreshInFlight: Promise<boolean> | null = null;

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly code: 'NETWORK' | 'HTTP' | 'INVALID_RESPONSE' | 'TIMEOUT',
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export function setAccessToken(token: string) {
  accessToken = token;
}

export function clearAccessToken() {
  accessToken = null;
}

function requestUrl(path: string) {
  return `${apiBaseUrl}${path.startsWith('/') ? path : `/${path}`}`;
}

async function refreshAccessToken() {
  if (!refreshInFlight) {
    refreshInFlight = (async () => {
      const controller = new AbortController();
      const timeout = window.setTimeout(() => {
        controller.abort();
      }, timeoutMs);
      try {
        const response = await fetch(requestUrl('/auth/refresh'), {
          method: 'POST',
          credentials: 'include',
          signal: controller.signal,
        });
        if (!response.ok) return false;
        const parsed = refreshResponseSchema.safeParse(await response.json());
        if (!parsed.success) return false;
        setAccessToken(parsed.data.accessToken);
        return true;
      } catch {
        return false;
      } finally {
        window.clearTimeout(timeout);
        refreshInFlight = null;
      }
    })();
  }
  return refreshInFlight;
}

export async function apiRequest<T>(
  path: string,
  schema: z.ZodType<T>,
  init: RequestInit = {},
): Promise<T> {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => {
    controller.abort();
  }, timeoutMs);

  async function send() {
    const headers = new Headers(init.headers);
    if (init.body && !headers.has('Content-Type')) headers.set('Content-Type', 'application/json');
    if (accessToken) headers.set('Authorization', `Bearer ${accessToken}`);

    return fetch(requestUrl(path), {
      ...init,
      headers,
      credentials: 'include',
      signal: controller.signal,
    });
  }

  try {
    let response = await send();
    if (response.status === 401 && path !== '/auth/login' && path !== '/auth/refresh') {
      if (await refreshAccessToken()) response = await send();
      else {
        clearAccessToken();
        window.dispatchEvent(new Event('ifarm:auth-expired'));
      }
    }
    if (!response.ok)
      throw new ApiError('The request could not be completed.', response.status, 'HTTP');
    const parsed = schema.safeParse(await response.json());
    if (!parsed.success)
      throw new ApiError('The server response was invalid.', 0, 'INVALID_RESPONSE');
    return parsed.data;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (controller.signal.aborted) throw new ApiError('The request timed out.', 0, 'TIMEOUT');
    throw new ApiError('The service is unavailable.', 0, 'NETWORK');
  } finally {
    window.clearTimeout(timeout);
  }
}
