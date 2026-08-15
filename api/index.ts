import type { IncomingMessage, ServerResponse } from 'node:http';
import { createApp } from '../server.ts';

const appPromise = createApp();

export default async function handler(request: IncomingMessage, response: ServerResponse): Promise<void> {
  const app = await appPromise;
  app(request, response);
}
