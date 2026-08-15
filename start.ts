import express from 'express';
import path from 'node:path';
import { createApp } from './server';

const port = Number(process.env.PORT) || 3000;

void createApp().then(async app => {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer } = await import('vite');
    const vite = await createServer({ server: { middlewareMode: true, allowedHosts: true }, appType: 'spa' });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (_request, response) => response.sendFile(path.join(distPath, 'index.html')));
  }
  app.listen(port, '0.0.0.0', () => {
    console.log(`KONKRED Executive Server running on http://localhost:${port}`);
  });
}).catch(error => {
  console.error('Failed to start KONKRED server:', error);
  process.exitCode = 1;
});
