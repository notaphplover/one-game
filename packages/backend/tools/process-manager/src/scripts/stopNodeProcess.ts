#!/usr/bin/env node

import { readFileSync } from 'node:fs';
import { kill } from 'node:process';

const [, , processIdPath]: string[] = process.argv;

if (processIdPath === undefined) {
  throw new Error('Expected process id path');
}

const processId: number = parseInt(readFileSync(processIdPath).toString());
const signal: NodeJS.Signals = 'SIGINT';

kill(processId, signal);
