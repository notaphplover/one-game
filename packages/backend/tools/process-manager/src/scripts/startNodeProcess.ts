#!/usr/bin/env node

import { ChildProcess } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';

import { spawnProcess } from '../utils/spawnProcess';

const [, , scriptPath, processIdPath]: string[] = process.argv;

if (scriptPath === undefined) {
  throw new Error('Expected script path');
}

if (processIdPath === undefined) {
  throw new Error('Expected process id path');
}

const childProcess: ChildProcess = spawnProcess('node', {
  args: [scriptPath],
  detached: true,
});

if (childProcess.pid === undefined) {
  throw new Error('Expected process id when running command');
}

const directory: string = dirname(processIdPath);

mkdirSync(directory, {
  recursive: true,
});

writeFileSync(processIdPath, childProcess.pid.toString());
