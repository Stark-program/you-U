import type { FastifyInstance } from 'fastify';

import { getDb } from '../db/index.js';
import { users } from '../db/schema.js';

export async function registerHealthRoutes(app: FastifyInstance): Promise<void> {
  app.get('/health', async () => {
    await getDb().select().from(users).limit(1);
    return { ok: true, db: true };
  });
}
