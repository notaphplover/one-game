import { ApolloServer } from '@apollo/server';
import {
  Environment,
  EnvironmentService,
} from '@cornie-js/backend-gateway-env';
import { Request } from '@cornie-js/backend-http';
import { INestApplicationContext } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { FastifyInstance } from 'fastify';

import { registerFastifyApolloHandler } from '../actions/registerFastifyApolloHandler';
import { registerSignalHandlers } from '../actions/registerSignalHandlers';
import { buildApolloServer } from '../calculations/buildApolloServer';
import { buildFastifyServer } from '../calculations/buildFastifyServer';
import { GatewayModule } from '../modules/GatewayModule';

async function bootstrap(): Promise<void> {
  const nestApplicationContext: INestApplicationContext =
    await NestFactory.createApplicationContext(GatewayModule);

  const environmentService: EnvironmentService =
    nestApplicationContext.get(EnvironmentService);

  const env: Environment = environmentService.getEnvironment();

  const fastifyServer: FastifyInstance = await buildFastifyServer(env);

  const apolloServer: ApolloServer<Request> = await buildApolloServer(
    fastifyServer,
    nestApplicationContext,
  );

  registerSignalHandlers(apolloServer);

  registerFastifyApolloHandler(
    apolloServer,
    fastifyServer,
    nestApplicationContext,
  );

  await fastifyServer.listen({
    port: env.port,
  });
}

void bootstrap();
