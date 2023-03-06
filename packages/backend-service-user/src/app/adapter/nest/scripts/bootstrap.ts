import helmet from '@fastify/helmet';
import { ConsoleLogger, INestApplication, LoggerService } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';

import { registerSignalHandlers } from '../actions/registerSignalHandlers';
import { AppModule } from '../modules/AppModule';

const SERVICE_PORT: number = 3000;

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

  registerSignalHandlers(nestApplication, logger);

  await nestApplication.listen(SERVICE_PORT);

  logger.log(`Application is running on: ${await nestApplication.getUrl()}`);
}

void bootstrap();
