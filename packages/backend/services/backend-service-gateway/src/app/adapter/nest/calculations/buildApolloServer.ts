import { ApolloServer } from '@apollo/server';
import { fastifyApolloDrainPlugin } from '@as-integrations/fastify';
import { readApiGraphqlSchemas } from '@cornie-js/api-graphql-schemas-provider';
import { Builder } from '@cornie-js/backend-common';
import {
  ApplicationResolver,
  Context,
} from '@cornie-js/backend-gateway-application';
import { GraphQlErrorFromErrorBuilder } from '@cornie-js/backend-graphql';
import { INestApplicationContext } from '@nestjs/common';
import { FastifyInstance } from 'fastify';
import { GraphQLError } from 'graphql';

import { buildApolloApplicationResolver } from '../../apollo/calculations/buildApolloApplicationResolver';

export async function buildApolloServer(
  fastifyServer: FastifyInstance,
  nestApplicationContext: INestApplicationContext,
): Promise<ApolloServer<Context>> {
  const graphqlSchemas: string[] = await readApiGraphqlSchemas();

  const applicationResolver: ApplicationResolver =
    nestApplicationContext.get(ApplicationResolver);

  const graphQlErrorFromErrorBuilder: Builder<GraphQLError, [unknown]> =
    nestApplicationContext.get(GraphQlErrorFromErrorBuilder);

  const apolloServer: ApolloServer<Context> = new ApolloServer({
    plugins: [fastifyApolloDrainPlugin(fastifyServer)],
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    resolvers: buildApolloApplicationResolver(
      applicationResolver,
      graphQlErrorFromErrorBuilder,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ) as any,
    typeDefs: graphqlSchemas,
  });

  await apolloServer.start();

  return apolloServer;
}
