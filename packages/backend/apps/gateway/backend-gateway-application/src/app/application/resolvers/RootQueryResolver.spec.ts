import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { models as graphqlModels } from '@cornie-js/api-graphql-models';
import { Request } from '@cornie-js/backend-http';
import { GraphQLResolveInfo } from 'graphql';

import { CanonicalResolver } from '../../../foundation/graphql/application/models/CanonicalResolver';
import { RootQueryResolver } from './RootQueryResolver';

function buildTestTuples(): [
  string,
  graphqlModels.ResolverFn<
    unknown,
    graphqlModels.RootQuery,
    Request,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    any
  >,
  jest.Mock,
][] {
  const gameQueryResolverMock: jest.Mocked<
    CanonicalResolver<graphqlModels.GameQueryResolvers<Request>>
  > = {
    gameById: jest.fn(),
    myGames: jest.fn(),
  } as Partial<
    jest.Mocked<CanonicalResolver<graphqlModels.GameQueryResolvers<Request>>>
  > as jest.Mocked<
    CanonicalResolver<graphqlModels.GameQueryResolvers<Request>>
  >;

  const userQueryResolverMock: jest.Mocked<
    CanonicalResolver<graphqlModels.UserQueryResolvers<Request>>
  > = {
    userById: jest.fn(),
    userMe: jest.fn(),
  } as Partial<
    jest.Mocked<CanonicalResolver<graphqlModels.UserQueryResolvers<Request>>>
  > as jest.Mocked<
    CanonicalResolver<graphqlModels.UserQueryResolvers<Request>>
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
        Request,
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
        Request,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        any
      >,
      resolverMock: jest.Mock,
    ) => {
      describe('when called', () => {
        let parentFixture: graphqlModels.RootQuery;
        let argsFixture: unknown;
        let requestFixture: Request;
        let infoFixture: GraphQLResolveInfo;

        let resolverResultFixture: unknown;

        let result: unknown;

        beforeAll(async () => {
          parentFixture = Symbol() as unknown as graphqlModels.RootQuery;
          argsFixture = Symbol();
          requestFixture = Symbol() as unknown as Request;
          infoFixture = Symbol() as unknown as GraphQLResolveInfo;

          resolverResultFixture = Symbol();

          resolverMock.mockReturnValueOnce(
            Promise.resolve(resolverResultFixture),
          );

          result = await resolver(
            parentFixture,
            argsFixture,
            requestFixture,
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
            requestFixture,
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
