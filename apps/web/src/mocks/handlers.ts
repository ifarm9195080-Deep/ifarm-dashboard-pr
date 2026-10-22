import { http, HttpResponse } from 'msw';
import { loginRequestSchema } from '../shared/api/schemas';

// Development-only adapter: main.tsx loads this worker only when no real API URL is configured.
const mockUser = {
  id: 'mock-user',
  username: 'demo',
  displayName: 'iFarm Client',
};

let mockSessionActive = false;

export function resetMockAuth() {
  mockSessionActive = false;
}

function issueMockAccessToken() {
  return `development-${crypto.randomUUID()}`;
}

export const handlers = [
  http.post('*/auth/login', async ({ request }) => {
    const body = loginRequestSchema.safeParse(await request.json());
    if (!body.success)
      return HttpResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    mockSessionActive = true;
    return HttpResponse.json({
      accessToken: issueMockAccessToken(),
      user: { ...mockUser, username: body.data.username },
    });
  }),
  http.get('*/auth/me', () =>
    mockSessionActive
      ? HttpResponse.json(mockUser)
      : HttpResponse.json({ message: 'Unauthenticated' }, { status: 401 }),
  ),
  http.post('*/auth/refresh', () =>
    mockSessionActive
      ? HttpResponse.json({ accessToken: issueMockAccessToken() })
      : HttpResponse.json({ message: 'Unauthenticated' }, { status: 401 }),
  ),
  http.post('*/auth/logout', () => {
    mockSessionActive = false;
    return HttpResponse.json({ success: true });
  }),
];
