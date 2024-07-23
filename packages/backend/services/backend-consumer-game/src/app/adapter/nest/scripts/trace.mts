import fs from 'node:fs/promises';
import path from 'node:path';

import {
  EnvModule,
  Environment,
  EnvironmentService,
} from '@cornie-js/backend-app-game-env';
import { PyroscopeProfiler, Tracer } from '@cornie-js/backend-monitoring';
import { INestApplicationContext } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { glob } from 'glob';

const KILL_SIGNALS: NodeJS.Signals[] = ['SIGINT', 'SIGTERM'];

function buildConfigureKillSignals(
  signals: NodeJS.Signals[],
): (callback: () => void) => void {
  return (callback: () => void): void => {
    for (const signal of signals) {
      process.once(signal, () => {
        callback();
      });
    }
  };
}

const configureKillSignals: (callback: () => void) => void =
  buildConfigureKillSignals(KILL_SIGNALS);

function configureTracer(environment: Environment): void {
  if (!environment.grafanaTraceEnabled) {
    return;
  }

  const tracer: Tracer = new Tracer({
    serviceName: '@cornie-js/backend-consumer-game',
    tracerUrl: environment.grafanaTraceUrl,
  });

  tracer.start();

  configureKillSignals(() => void tracer.stop());
}

async function configureProfiler(environment: Environment): Promise<void> {
  if (!environment.grafanaPyroscopeEnabled) {
    return;
  }

  const cornieJsPaths: Iterable<string> = await fetchCornieDependencies();

  const profiler: PyroscopeProfiler = await PyroscopeProfiler.create({
    applicationName: 'cornie-js-backend-consumer-game',
    serverAddress: environment.grafanaPyroscopeUrl,
    sourceMap: {
      searchDirectories: ['.', ...cornieJsPaths],
    },
  });

  profiler.start();

  configureKillSignals(() => void profiler.stop());
}

async function fetchPackageCornieDependencies(
  packagePath: string,
): Promise<string[]> {
  return Promise.all(
    (await glob(path.join(packagePath, 'node_modules', '@cornie-js', '*'))).map(
      async (path: string): Promise<string> => fs.realpath(path),
    ),
  );
}

async function fetchCornieDependencies(): Promise<Iterable<string>> {
  const pathsSet: Set<string> = new Set();

  let packagePaths: string[] = ['.'];

  while (packagePaths.length > 0) {
    packagePaths = (
      await Promise.all(packagePaths.map(fetchPackageCornieDependencies))
    )
      .flat()
      .filter((packagePath: string) => !pathsSet.has(packagePath));

    for (const packagePath of packagePaths) {
      pathsSet.add(packagePath);
    }
  }

  return pathsSet.values();
}

async function main(): Promise<void> {
  const envApplicationContext: INestApplicationContext =
    await NestFactory.createApplicationContext(EnvModule);

  const environmentService: EnvironmentService =
    envApplicationContext.get(EnvironmentService);

  const environment: Environment = environmentService.getEnvironment();

  configureTracer(environment);
  await configureProfiler(environment);
}

await main();
