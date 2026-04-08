import { resolve } from 'node:path';

export type AppEnv = {
  host: string;
  port: number;
  /** Absolute path to the SQLite database file. */
  databasePath: string;
};

function resolveSqlitePath(raw: string): string {
  const trimmed = raw.trim();
  const pathPart = trimmed.startsWith('file:') ? trimmed.slice('file:'.length) : trimmed;
  return resolve(process.cwd(), pathPart);
}

export function loadEnv(): AppEnv {
  const port = Number(process.env.PORT ?? 3001);
  const host = process.env.HOST ?? '0.0.0.0';
  const databaseUrl = process.env.DATABASE_URL ?? 'file:./data/local.db';
  const databasePath = resolveSqlitePath(databaseUrl);

  return { host, port, databasePath };
}
