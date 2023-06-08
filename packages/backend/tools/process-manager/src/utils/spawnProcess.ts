import { ChildProcess, SpawnOptions, spawn } from 'node:child_process';

export interface SpawnProcessOptions {
  args?: string[];
  cwd?: string;
  detached?: boolean;
}

export function spawnProcess(
  command: string,
  options: SpawnProcessOptions,
): ChildProcess {
  const spawnOptions: SpawnOptions = {
    cwd: options.cwd,
    detached: options.detached,
  };

  if (options.detached === true) {
    spawnOptions.stdio = 'ignore';
  }

  const childProcess: ChildProcess = spawn(
    command,
    [...(options.args ?? [])],
    spawnOptions,
  );

  if (options.detached === true) {
    childProcess.unref();
  }

  return childProcess;
}
