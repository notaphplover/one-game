import { Environment } from '@cornie-js/backend-gateway-env';
import cors, { FastifyCorsOptions } from '@fastify/cors';
import Fastify, { FastifyInstance, FastifyPluginCallback } from 'fastify';

export async function buildFastifyServer(
  env: Environment,
): Promise<FastifyInstance> {
  const fastifyServer: FastifyInstance = Fastify();

  const corsOptions: FastifyCorsOptions = {
    origin: env.corsOrigins,
  };

  await fastifyServer.register(
    cors as unknown as FastifyPluginCallback,
    corsOptions,
  );

  return fastifyServer;
}
