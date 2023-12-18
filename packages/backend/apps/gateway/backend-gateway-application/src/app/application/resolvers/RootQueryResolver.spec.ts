import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { models as graphqlModels } from '@cornie-js/api-graphql-models';
import { GraphQLResolveInfo } from 'graphql';

import { CanonicalResolver } from '../../../foundation/graphql/application/models/CanonicalResolver';
import { Context } from '../../../foundation/graphql/application/models/Context';
import { RootQueryResolver } from './RootQueryResolver';

function buildTestTuples(): [
  string,
  graphqlModels.ResolverFn<
    unknown,
    graphqlModels.RootQuery,
    Context,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    any
  >,
  jest.Mock,
][] {
  const gameQueryResolverMock: jest.Mocked<
    CanonicalResolver<graphqlModels.GameQueryResolvers<Context>>
  > = {
    gameById: jest.fn(),
    myGames: jest.fn(),
  } as Partial<
    jest.Mocked<CanonicalResolver<graphqlModels.GameQueryResolvers<Context>>>
  > as jest.Mocked<
    CanonicalResolver<graphqlModels.GameQueryResolvers<Context>>
  >;

  const userQueryResolverMock: jest.Mocked<
    CanonicalResolver<graphqlModels.UserQueryResolvers<Context>>
  > = {
    userById: jest.fn(),
    userMe: jest.fn(),
  } as Partial<
    jest.Mocked<CanonicalResolver<graphqlModels.UserQueryResolvers<Context>>>
  > as jest.Mocked<
    CanonicalResolver<graphqlModels.UserQueryResolvers<Context>>
  >;

  const rootQueryResolver: RootQueryResolver = new RootQueryResolver(
    gameQueryResolverMock,
    userQueryResolverMock,
  );

  return [
    [
      'gameById',
      rootQueryResolver.gameById.bind(rootQueryResolver),
      gameQueryResolverMock.gameById as jest.Mock,
    ],
    [
      'myGames',
      rootQueryResolver.myGames.bind(rootQueryResolver),
      gameQueryResolverMock.myGames as jest.Mock,
    ],
    [
      'userById',
      rootQueryResolver.userById.bind(rootQueryResolver),
      userQueryResolverMock.userById as jest.Mock,
    ],
    [
      'userMe',
      rootQueryResolver.userMe.bind(rootQueryResolver),
      userQueryResolverMock.userMe as jest.Mock,
    ],
  ];
}

describe(RootQueryResolver.name, () => {
  describe.each<
    [
      string,
      graphqlModels.ResolverFn<
        unknown,
        graphqlModels.RootQuery,
        Context,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        any
      >,
      jest.Mock,
    ]
  >(buildTestTuples())(
    '.%s',
    (
      _: string,
      resolver: graphqlModels.ResolverFn<
        unknown,
        graphqlModels.RootQuery,
        Context,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        any
      >,
      resolverMock: jest.Mock,
    ) => {
      describe('when called', () => {
        let parentFixture: graphqlModels.RootQuery;
        let argsFixture: unknown;
        let contextFixture: Context;
        let infoFixture: GraphQLResolveInfo;

        let resolverResultFixture: unknown;

        let result: unknown;

        beforeAll(async () => {
          parentFixture = Symbol() as unknown as graphqlModels.RootQuery;
          argsFixture = Symbol();
          contextFixture = Symbol() as unknown as Context;
          infoFixture = Symbol() as unknown as GraphQLResolveInfo;

          resolverResultFixture = Symbol();

          resolverMock.mockReturnValueOnce(
            Promise.resolve(resolverResultFixture),
          );

          result = await resolver(
            parentFixture,
            argsFixture,
            contextFixture,
            infoFixture,
          );
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call resolverMock()', () => {
          expect(resolverMock).toHaveBeenCalledTimes(1);
          expect(resolverMock).toHaveBeenCalledWith(
            parentFixture,
            argsFixture,
            contextFixture,
            infoFixture,
          );
        });

        it('should return result', () => {
          expect(result).toBe(resolverResultFixture);
        });
      });
    },
  );
});
