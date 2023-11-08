import {
  EnvModule,
  Environment,
  EnvironmentService,
} from '@cornie-js/backend-app-user-env';
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
    serviceName: '@cornie-js/backend-service-user',
    tracerUrl: environment.grafanaTraceUrl,
  });

  tracer.start();

  configureKillSignals(() => void tracer.stop());
}

function configureProfiler(environment: Environment): void {
  if (!environment.grafanaPyroscopeEnabled) {
    return;
  }

  const MICROS_PER_SECOND: number = 1e6;
  const MS_PER_SECOND: number = 1e3;
  const SAMPLING_DURATION_SECONDS: number = 60;
  const SAMPLING_DURATION_MS: number =
    MS_PER_SECOND * SAMPLING_DURATION_SECONDS;
  const SAMPLING_HZ: number = 100;

  const profiler: PyroscopeProfiler = new PyroscopeProfiler({
    applicationName: 'cornie-js-backend-service-user',
    samplingDurationMs: SAMPLING_DURATION_MS,
    samplingIntervalBytes: 1048576,
    samplingIntervalMicros: MICROS_PER_SECOND / SAMPLING_HZ, // 100 Hz
    serverAddress: environment.grafanaPyroscopeUrl,
    stackDepth: 64,
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
  configureProfiler(environment);
}

await main();
