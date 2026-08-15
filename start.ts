import { createApp } from './server';

const port = Number(process.env.PORT) || 3000;

void createApp().then(app => {
  app.listen(port, '0.0.0.0', () => {
    console.log(`KONKRED Executive Server running on http://localhost:${port}`);
  });
}).catch(error => {
  console.error('Failed to start KONKRED server:', error);
  process.exitCode = 1;
});
