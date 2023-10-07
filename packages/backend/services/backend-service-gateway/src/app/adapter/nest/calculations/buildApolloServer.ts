import { ApolloServer } from '@apollo/server';
import { fastifyApolloDrainPlugin } from '@as-integrations/fastify';
import { readApiGraphqlSchemas } from '@cornie-js/api-graphql-schemas-provider';
import { ApplicationResolver } from '@cornie-js/backend-gateway-application';
import { Request } from '@cornie-js/backend-http';
import { INestApplicationContext } from '@nestjs/common';
import { FastifyInstance } from 'fastify';

export async function buildApolloServer(
  fastifyServer: FastifyInstance,
  nestApplicationContext: INestApplicationContext,
): Promise<ApolloServer<Request>> {
  const graphqlSchemas: string[] = await readApiGraphqlSchemas();

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
  const applicationResolver: any =
    nestApplicationContext.get(ApplicationResolver);

  const apolloServer: ApolloServer<Request> = new ApolloServer({
    plugins: [fastifyApolloDrainPlugin(fastifyServer)],
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    resolvers: applicationResolver,
    typeDefs: graphqlSchemas,
  });

  await apolloServer.start();

  return apolloServer;
}
