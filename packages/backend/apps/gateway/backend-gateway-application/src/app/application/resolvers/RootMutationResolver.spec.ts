import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { models as graphqlModels } from '@cornie-js/api-graphql-models';
import { GraphQLResolveInfo } from 'graphql';

import { CanonicalResolver } from '../../../foundation/graphql/application/models/CanonicalResolver';
import { Context } from '../../../foundation/graphql/application/models/Context';
import { RootMutationResolver } from './RootMutationResolver';

function buildTestTuples(): [
  string,
  graphqlModels.ResolverFn<
    unknown,
    graphqlModels.RootMutation,
    Context,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    any
  >,
  jest.Mock,
][] {
  const authMutationMock: jest.Mocked<
    CanonicalResolver<graphqlModels.AuthMutationResolvers<Context>>
  > = {
    createAuthByCode: jest.fn(),
    createAuthByCredentials: jest.fn(),
  } as Partial<
    jest.Mocked<CanonicalResolver<graphqlModels.AuthMutationResolvers<Context>>>
  > as jest.Mocked<
    CanonicalResolver<graphqlModels.AuthMutationResolvers<Context>>
  >;

  const gameMutationMock: jest.Mocked<
    CanonicalResolver<graphqlModels.GameMutationResolvers<Context>>
  > = {
    createGame: jest.fn(),
    createGameSlot: jest.fn(),
    passGameTurn: jest.fn(),
    playGameCards: jest.fn(),
  } as Partial<
    jest.Mocked<CanonicalResolver<graphqlModels.GameMutationResolvers<Context>>>
  > as jest.Mocked<
    CanonicalResolver<graphqlModels.GameMutationResolvers<Context>>
  >;

  const userMutationMock: jest.Mocked<
    CanonicalResolver<graphqlModels.UserMutationResolvers<Context>>
  > = {
    createUser: jest.fn(),
    deleteUserMe: jest.fn(),
    updateUserMe: jest.fn(),
  } as Partial<
    jest.Mocked<CanonicalResolver<graphqlModels.UserMutationResolvers<Context>>>
  > as jest.Mocked<
    CanonicalResolver<graphqlModels.UserMutationResolvers<Context>>
  >;

  const rootMutationResolver: RootMutationResolver = new RootMutationResolver(
    authMutationMock,
    gameMutationMock,
    userMutationMock,
  );

  return [
    [
      'createAuthByCode',
      rootMutationResolver.createAuthByCode.bind(rootMutationResolver),
      authMutationMock.createAuthByCode as jest.Mock,
    ],
    [
      'createAuthByCredentials',
      rootMutationResolver.createAuthByCredentials.bind(rootMutationResolver),
      authMutationMock.createAuthByCredentials as jest.Mock,
    ],
    [
      'createGame',
      rootMutationResolver.createGame.bind(rootMutationResolver),
      gameMutationMock.createGame as jest.Mock,
    ],
    [
      'createGameSlot',
      rootMutationResolver.createGameSlot.bind(rootMutationResolver),
      gameMutationMock.createGameSlot as jest.Mock,
    ],
    [
      'createUser',
      rootMutationResolver.createUser.bind(rootMutationResolver),
      userMutationMock.createUser as jest.Mock,
    ],
    [
      'deleteUserMe',
      rootMutationResolver.deleteUserMe.bind(rootMutationResolver),
      userMutationMock.deleteUserMe as jest.Mock,
    ],
    [
      'passGameTurn',
      rootMutationResolver.passGameTurn.bind(rootMutationResolver),
      gameMutationMock.passGameTurn as jest.Mock,
    ],
    [
      'playGameCards',
      rootMutationResolver.playGameCards.bind(rootMutationResolver),
      gameMutationMock.playGameCards as jest.Mock,
    ],
    [
      'updateUserMe',
      rootMutationResolver.updateUserMe.bind(rootMutationResolver),
      userMutationMock.updateUserMe as jest.Mock,
    ],
  ];
}

describe(RootMutationResolver.name, () => {
  describe.each<
    [
      string,
      graphqlModels.ResolverFn<
        unknown,
        graphqlModels.RootMutation,
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
        graphqlModels.RootMutation,
        Context,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        any
      >,
      resolverMock: jest.Mock,
    ) => {
      describe('when called', () => {
        let parentFixture: graphqlModels.RootMutation;
        let argsFixture: unknown;
        let contextFixture: Context;
        let infoFixture: GraphQLResolveInfo;

        let resolverResultFixture: unknown;

        let result: unknown;

        beforeAll(async () => {
          parentFixture = Symbol() as unknown as graphqlModels.RootMutation;
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
