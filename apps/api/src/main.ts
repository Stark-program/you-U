import { config as loadDotenv } from 'dotenv';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { APP_NAME } from '@you-u/shared';

import { buildApp } from './app.js';
import { initDb } from './db/index.js';
import { runMigrations } from './db/migrate.js';
import { loadEnv } from './env.js';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
loadDotenv({ path: resolve(repoRoot, '.env') });

const env = loadEnv();
const migrationsFolder = resolve(dirname(fileURLToPath(import.meta.url)), '../drizzle');
const db = initDb(env.databasePath);
await runMigrations(db, migrationsFolder);

const app = await buildApp();

app.log.info({ app: APP_NAME }, 'starting');

await app.listen({ host: env.host, port: env.port });
