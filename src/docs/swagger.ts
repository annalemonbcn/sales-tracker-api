import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const openApiBundlePath = fileURLToPath(
  new URL('./openapi.bundle.json', import.meta.url),
);

export const swaggerSpec = JSON.parse(
  readFileSync(openApiBundlePath, 'utf8'),
) as Record<string, unknown>;
