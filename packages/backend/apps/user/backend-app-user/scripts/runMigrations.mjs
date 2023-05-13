#!/usr/bin/env node

import { promisifiedExec } from './utils/promisifiedExec.mjs';
import { datasourceModulePath } from './utils/datasourceModulePath.mjs';

const DATASOURCE_MODULE_PATH = datasourceModulePath;

let execCommand = `pnpm exec typeorm migration:run -d ${DATASOURCE_MODULE_PATH}`;

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
