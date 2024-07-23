import { PulsarConsumer } from '@cornie-js/backend-adapter-pulsar';
import {
  Environment,
  EnvironmentService,
} from '@cornie-js/backend-app-game-env';
import { GameTurnEndSignalMessageConsumer } from '@cornie-js/backend-game-adapter-pulsar';
import helmet from '@fastify/helmet';
import { ConsoleLogger, INestApplication, LoggerService } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';

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
        cors: true,
        logger,
      },
    );

  const environmentService: EnvironmentService =
    nestApplication.get(EnvironmentService);

  const consumers: PulsarConsumer<unknown>[] = [
    nestApplication.get(GameTurnEndSignalMessageConsumer),
  ];

  const environment: Environment = environmentService.getEnvironment();

  registerSignalHandlers(nestApplication, logger);

  const port: number = environment.consumerPort;

  await Promise.all([
    nestApplication.listen(port, environment.host),
    ...consumers.map(
      async (consumer: PulsarConsumer<unknown>): Promise<void> =>
        consumer.handleMessages(),
    ),
  ]);

  logger.log(`Application is running on: ${await nestApplication.getUrl()}`);
}

void bootstrap();
