import { GET } from '@/app/api/health/route';

// `connection()` only resolves inside a real request scope; the probe is a
// pure function otherwise, so stub the request-time marker for the unit test.
jest.mock('next/server', () => {
  const actual = jest.requireActual('next/server');
  return {
    ...actual,
    connection: jest.fn().mockResolvedValue(undefined),
  };
});

describe('health route', () => {
  it('reports capability without leaking the credential', async () => {
    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(response.headers.get('Cache-Control')).toBe('no-store');
    expect(body).toEqual({
      status: 'ok',
      aiConfigured: expect.any(Boolean),
      model: expect.any(String),
    });
    expect(JSON.stringify(body)).not.toMatch(/api[_-]?key|secret|bearer/i);
  });
});
