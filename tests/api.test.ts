import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { createApp } from '../server.ts';
import type { Express } from 'express';
import type { Server } from 'node:http';

/**
 * API smoke tests against the real Express app (server-side).
 * Covers health, demo request_pilot gating, unknown-slug 404, and error states.
 */
let app: Express;
let server: Server;
let baseUrl: string;

beforeAll(async () => {
  app = await createApp();
  await new Promise<void>((resolve) => {
    server = app.listen(0, '127.0.0.1', () => resolve());
  });
  const address = server.address();
  baseUrl = `http://127.0.0.1:${typeof address === 'object' && address ? address.port : 0}`;
});

afterAll(async () => {
  await new Promise<void>((resolve) => server.close(() => resolve()));
});

describe('API', () => {
  it('GET /api/health returns ok', async () => {
    const res = await fetch(`${baseUrl}/api/health`);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.status).toBe('ok');
  });

  it('POST /api/demo/run with unknown slug returns 404 error state', async () => {
    const res = await fetch(`${baseUrl}/api/demo/run`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug: 'no-such-product', input: {} }),
    });
    expect(res.status).toBe(404);
    const body = await res.json();
    expect(body.status).toBe('error');
  });

  it('POST /api/demo/run returns REQUEST_PILOT when no AI key/flag configured', async () => {
    const res = await fetch(`${baseUrl}/api/demo/run`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug: 'contract-review-copilot', input: { contractText: 'x'.repeat(250) } }),
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(['request_pilot']).toContain(body.status);
    expect(body.productSlug).toBe('contract-review-copilot');
  });

  it('POST /api/demo/run for a product without a public demo returns REQUEST_PILOT', async () => {
    const res = await fetch(`${baseUrl}/api/demo/run`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug: 'ma-due-diligence-workbench', input: {} }),
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.status).toBe('request_pilot');
  });

  it('fullKONK health endpoint responds (server-side route preserved)', async () => {
    const res = await fetch(`${baseUrl}/api/fullkonk/health`);
    expect(res.status).toBe(200);
  });
});
