import {
  EnvModule,
  Environment,
  EnvironmentService,
} from '@cornie-js/backend-app-user-env';
import { PyroscopeProfiler, Tracer } from '@cornie-js/backend-monitoring';
import { INestApplicationContext } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

const envApplicationContext: INestApplicationContext =
  await NestFactory.createApplicationContext(EnvModule);

const environmentService: EnvironmentService =
  envApplicationContext.get(EnvironmentService);

const environment: Environment = environmentService.getEnvironment();

const tracer: Tracer = new Tracer({
  serviceName: '@cornie-js/backend-service-user',
  tracerUrl: environment.grafanaTraceUrl,
});

tracer.start();

const profiler: PyroscopeProfiler = new PyroscopeProfiler({
  applicationName: 'cornie-js-backend-service-user',
  samplingDurationMs: 10000,
  samplingIntervalBytes: 1048576,
  samplingIntervalMs: 10,
  serverAddress: 'http://localhost:4040',
  stackDepth: 64,
});

profiler.start();
