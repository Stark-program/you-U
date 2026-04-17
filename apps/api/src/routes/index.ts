import type { FastifyInstance } from 'fastify';

import { registerAiProfileRoutes } from './ai-profile.js';
import { registerHealthRoutes } from './health.js';

export async function registerRoutes(app: FastifyInstance): Promise<void> {
  await registerHealthRoutes(app);
  await registerAiProfileRoutes(app);
}
