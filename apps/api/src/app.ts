import Fastify from 'fastify';

import { registerRoutes } from './routes/index.js';

export async function buildApp() {
  const app = Fastify({ logger: true });
  await registerRoutes(app);
  return app;
}
