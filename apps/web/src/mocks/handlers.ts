import { http, HttpResponse } from 'msw';
import { loginRequestSchema } from '../shared/api/schemas';

const mockUser = {
  id: 'mock-user',
  username: 'demo',
  displayName: 'iFarm Client',
};

export const handlers = [
  http.post('*/auth/login', async ({ request }) => {
    const body = loginRequestSchema.safeParse(await request.json());
    if (!body.success)
      return HttpResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    return HttpResponse.json({
      accessToken: 'mock-access-token',
      user: { ...mockUser, username: body.data.username },
    });
  }),
  http.get('*/auth/me', () => HttpResponse.json(mockUser)),
  http.post('*/auth/refresh', () =>
    HttpResponse.json({ accessToken: 'mock-refreshed-access-token' }),
  ),
  http.post('*/auth/logout', () => HttpResponse.json({ success: true })),
];
