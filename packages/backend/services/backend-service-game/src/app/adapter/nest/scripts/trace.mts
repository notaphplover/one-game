import {
  EnvModule,
  Environment,
  EnvironmentService,
} from '@cornie-js/backend-app-game-env';
import { PyroscopeProfiler, Tracer } from '@cornie-js/backend-monitoring';
import { INestApplicationContext } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

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
    serviceName: '@cornie-js/backend-service-game',
    tracerUrl: environment.grafanaTraceUrl,
  });

  tracer.start();

  configureKillSignals(() => void tracer.stop());
}

async function configureProfiler(environment: Environment): Promise<void> {
  if (!environment.grafanaPyroscopeEnabled) {
    return;
  }

  const profiler: PyroscopeProfiler = await PyroscopeProfiler.create({
    applicationName: 'cornie-js-backend-service-game',
    serverAddress: environment.grafanaPyroscopeUrl,
  });

  profiler.start();

  configureKillSignals(() => void profiler.stop());
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
