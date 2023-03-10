#!/usr/bin/env node

import path from 'node:path';
import { argv } from 'node:process';
import { promisifiedExec } from './utils/promisifiedExec.mjs';

const migrationName = argv[2];

const DATASOURCE_MODULE_PATH =
  'lib/app/adapter/nest/scripts/provideTypeOrmDatasource.js';
const MIGRATIONS_FOLDER = 'src/app/adapter/typeorm/migrations';

const migrationFileArgument = path.join(MIGRATIONS_FOLDER, migrationName);

let execCommand = `pnpm exec typeorm migration:generate -d ${DATASOURCE_MODULE_PATH} ${migrationFileArgument}`;

try {
  await promisifiedExec(execCommand, { interactive: true });
} catch (error) {
  if (typeof error.code === 'number') {
    console.warn(
      `Warning: Received a non-zero code ${error.code} from child process. Exiting process with same code.`,
    );
    process.exit(error.code);
  } else {
    throw error;
  }
}
