import { FastifyAdapter } from '@nestjs/platform-fastify';

export function enableCors(
  fastifyAdapter: FastifyAdapter,
  corsOrigins: string[],
): void {
  fastifyAdapter.enableCors({
    allowedHeaders: [
      'Access-Control-Allow-Origin',
      'Origin',
      'X-Requested-With',
      'Accept',
      'Content-Type',
      'Authorization',
    ],
    credentials: true,
    exposedHeaders: 'Authorization',
    methods: ['GET', 'PUT', 'OPTIONS', 'POST', 'DELETE'],
    origin: corsOrigins,
  });
}
