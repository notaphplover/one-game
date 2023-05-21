import path from 'node:path';

import { packageDir } from './packageDirectory.mjs';

export const datasourceModulePath = path.resolve(
  packageDir,
  'lib/app/adapter/nest/scripts/provideTypeOrmDatasource.js',
);
