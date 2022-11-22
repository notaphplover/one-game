#!/usr/bin/env node

import { argv } from 'node:process';
import { promisifiedExec } from '../src/promisifiedExec.js';

const TURBOREPO_ROOT_PACKAGE_NAME = '//';
const TURBOREPO_TASK_NOT_FOUND_MAGIC_STRING = '\u003cNONEXISTENT\u003e';

const PACKAGES_DIRECTORY_PREFIX = 'packages/';

const baseRef = argv[2];
const taskToDryRun = argv[3];

const stringifiedDryRun = (
  await promisifiedExec(
    `pnpm exec turbo run ${taskToDryRun} --filter ...[${baseRef}] --dry=json`,
  )
).trim();

const dryRunResult = JSON.parse(stringifiedDryRun);

/** @type {Array.<string>} */
const dryResultPackageNames = dryRunResult.packages.filter(
  (packageName) => packageName !== TURBOREPO_ROOT_PACKAGE_NAME,
);

const tasks = dryRunResult.tasks.filter((task) =>
  dryResultPackageNames.some(
    (packageName) =>
      task.taskId === `${packageName}#${taskToDryRun}` &&
      !task.command.includes(TURBOREPO_TASK_NOT_FOUND_MAGIC_STRING),
  ),
);

/** @type {Array.<string>} */
const packageNames = tasks.map((task) =>
  task.directory.replace(PACKAGES_DIRECTORY_PREFIX, ''),
);

console.log(JSON.stringify(packageNames));
