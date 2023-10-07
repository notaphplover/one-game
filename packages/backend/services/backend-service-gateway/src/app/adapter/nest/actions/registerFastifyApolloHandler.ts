import { ApolloServer } from '@apollo/server';
import { fastifyApolloHandler } from '@as-integrations/fastify';
import {
  Request,
  RequestFromFastifyRequestBuilder,
} from '@cornie-js/backend-http';
import { INestApplicationContext } from '@nestjs/common';
import { FastifyInstance, FastifyRequest } from 'fastify';

const HEADER_WHITELIST: string[] = ['authorization'];

export function registerFastifyApolloHandler(
  apolloServer: ApolloServer<Request>,
  fastifyServer: FastifyInstance,
  nestApplicationContext: INestApplicationContext,
): void {
  const requestFromFastifyRequestBuilder: RequestFromFastifyRequestBuilder =
    nestApplicationContext.get(RequestFromFastifyRequestBuilder);

  fastifyServer.post(
    '/',
    fastifyApolloHandler(apolloServer, {
      context: async (fastifyRequest: FastifyRequest): Promise<Request> => {
        const request: Request =
          requestFromFastifyRequestBuilder.build(fastifyRequest);

        for (const key of Object.keys(request.headers)) {
          if (!HEADER_WHITELIST.includes(key)) {
            // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
            delete request.headers[key];
          }
        }

        return request;
      },
    }),
  );
}
