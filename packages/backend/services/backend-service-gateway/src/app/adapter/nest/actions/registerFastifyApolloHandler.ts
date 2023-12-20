import { ApolloServer } from '@apollo/server';
import { fastifyApolloHandler } from '@as-integrations/fastify';
import { models as graphqlModels } from '@cornie-js/api-graphql-models';
import { Builder, Handler } from '@cornie-js/backend-common';
import {
  Context,
  ContextImplementation,
} from '@cornie-js/backend-gateway-application';
import { batchedGetSpecByGameIdHandlerBuilderSymbol } from '@cornie-js/backend-gateway-application/games';
import {
  Request,
  RequestFromFastifyRequestBuilder,
} from '@cornie-js/backend-http';
import { INestApplicationContext } from '@nestjs/common';
import { FastifyInstance, FastifyRequest } from 'fastify';

const HEADER_WHITELIST: string[] = ['authorization'];

export function registerFastifyApolloHandler(
  apolloServer: ApolloServer<Context>,
  fastifyServer: FastifyInstance,
  nestApplicationContext: INestApplicationContext,
): void {
  const requestFromFastifyRequestBuilder: RequestFromFastifyRequestBuilder =
    nestApplicationContext.get(RequestFromFastifyRequestBuilder);

  const gameSpecByGameIdHandlerBuilder: Builder<
    Handler<[string], graphqlModels.GameSpec | undefined>,
    [Request]
  > = nestApplicationContext.get(batchedGetSpecByGameIdHandlerBuilderSymbol);

  fastifyServer.post(
    '/',
    fastifyApolloHandler(apolloServer, {
      context: async (fastifyRequest: FastifyRequest): Promise<Context> => {
        const request: Request =
          requestFromFastifyRequestBuilder.build(fastifyRequest);

        for (const key of Object.keys(request.headers)) {
          if (!HEADER_WHITELIST.includes(key)) {
            // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
            delete request.headers[key];
          }
        }

        return new ContextImplementation(
          request,
          gameSpecByGameIdHandlerBuilder,
        );
      },
    }),
  );
}
