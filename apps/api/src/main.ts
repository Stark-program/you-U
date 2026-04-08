import { APP_NAME } from '@you-u/shared';

import { buildApp } from './app.js';
import { loadEnv } from './env.js';

const env = loadEnv();
const app = await buildApp();

app.log.info({ app: APP_NAME }, 'starting');

await app.listen({ host: env.host, port: env.port });
