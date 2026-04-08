export type AppEnv = {
  host: string;
  port: number;
  databaseUrl: string;
};

export function loadEnv(): AppEnv {
  const port = Number(process.env.PORT ?? 3001);
  const host = process.env.HOST ?? '0.0.0.0';
  const databaseUrl =
    process.env.DATABASE_URL ?? 'postgres://youu:youu@localhost:5432/youu';

  return { host, port, databaseUrl };
}
