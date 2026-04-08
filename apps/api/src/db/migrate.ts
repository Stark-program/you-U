import { migrate } from 'drizzle-orm/libsql/migrator';

import type { AppDatabase } from './index.js';

export async function runMigrations(
  db: AppDatabase,
  migrationsFolder: string,
): Promise<void> {
  await migrate(db, { migrationsFolder });
}
