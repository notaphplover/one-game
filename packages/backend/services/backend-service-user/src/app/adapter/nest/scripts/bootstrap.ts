import helmet from '@fastify/helmet';
import { ConsoleLogger, INestApplication, LoggerService } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';

import { EnvironmentService } from '../../../../foundation/env/application/services/EnvironmentService';
import { registerSignalHandlers } from '../actions/registerSignalHandlers';
import { AppModule } from '../modules/AppModule';

async function bootstrap() {
  const logger: LoggerService = new ConsoleLogger();
  const fastifyAdapter: FastifyAdapter = new FastifyAdapter();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-argument
  await fastifyAdapter.register(helmet as any);

  const nestApplication: INestApplication =
    await NestFactory.create<NestFastifyApplication>(
      AppModule,
      new FastifyAdapter(),
      {
        logger,
      },
    );

  const environmentService: EnvironmentService =
    nestApplication.get(EnvironmentService);

  registerSignalHandlers(nestApplication, logger);

  const port: number = environmentService.getEnvironment().port;

  await nestApplication.listen(port);

  logger.log(`Application is running on: ${await nestApplication.getUrl()}`);
}

void bootstrap();
