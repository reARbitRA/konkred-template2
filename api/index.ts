import type { Express } from 'express';
import type { IncomingMessage, ServerResponse } from 'node:http';

let appPromise: Promise<Express> | undefined;

export default async function handler(request: IncomingMessage, response: ServerResponse): Promise<void> {
  try {
    appPromise ||= import('../lib/fullkonk-server.mjs').then(module => module.createApp());
    const app = await appPromise;
    app(request, response);
  } catch (error) {
    appPromise = undefined;
    response.statusCode = 500;
    response.setHeader('Content-Type', 'application/json; charset=utf-8');
    response.end(JSON.stringify({ error: error instanceof Error ? error.message : 'Server initialization failed.' }));
  }
}
