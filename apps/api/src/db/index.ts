import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { pathToFileURL } from 'node:url';

import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import type { LibSQLDatabase } from 'drizzle-orm/libsql';

import * as schema from './schema.js';

export type AppDatabase = LibSQLDatabase<typeof schema>;

let _db: AppDatabase | null = null;

export function initDb(databasePath: string): AppDatabase {
  mkdirSync(dirname(databasePath), { recursive: true });
  const url = pathToFileURL(databasePath).href;
  const client = createClient({ url });
  _db = drizzle(client, { schema });
  return _db;
}

export function getDb(): AppDatabase {
  if (!_db) {
    throw new Error('Database not initialized');
  }
  return _db;
}

export { schema };
