#!/usr/bin/env node

import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisifiedExec } from '../utils/promisifiedExec.mjs';

const command = 'docker compose up -d';

const cwd = resolve(dirname(fileURLToPath(import.meta.url)), '..');

await promisifiedExec(command, {
  cwd,
  interactive: true,
});
