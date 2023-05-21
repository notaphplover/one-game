#!/usr/bin/env node

import path from 'node:path';
import { argv } from 'node:process';

import { promisifiedExec } from './utils/promisifiedExec.mjs';
import { datasourceModulePath } from './utils/datasourceModulePath.mjs';
import { migrationsFolder } from './utils/migrationsFolder.mjs';

const migrationName = argv[2];

const DATASOURCE_MODULE_PATH = datasourceModulePath;

const MIGRATIONS_FOLDER = migrationsFolder;

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
