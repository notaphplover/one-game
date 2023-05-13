import path from 'node:path';

import { packageDir } from './packageDirectory.mjs';

export const migrationsFolder = path.resolve(
  packageDir,
  'src/app/adapter/typeorm/migrations',
);
