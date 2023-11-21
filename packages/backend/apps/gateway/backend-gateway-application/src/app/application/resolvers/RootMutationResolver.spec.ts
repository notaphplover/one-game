import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { models as graphqlModels } from '@cornie-js/api-graphql-models';
import { Request } from '@cornie-js/backend-http';
import { GraphQLResolveInfo } from 'graphql';

import { CanonicalResolver } from '../../../foundation/graphql/application/models/CanonicalResolver';
import { RootMutationResolver } from './RootMutationResolver';

function buildTestTuples(): [
  string,
  graphqlModels.ResolverFn<
    unknown,
    graphqlModels.RootMutation,
    Request,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    any
  >,
  jest.Mock,
][] {
  const authMutationMock: jest.Mocked<
    CanonicalResolver<graphqlModels.AuthMutationResolvers<Request>>
  > = {
    createAuthByCode: jest.fn(),
    createAuthByCredentials: jest.fn(),
  } as Partial<
    jest.Mocked<CanonicalResolver<graphqlModels.AuthMutationResolvers<Request>>>
  > as jest.Mocked<
    CanonicalResolver<graphqlModels.AuthMutationResolvers<Request>>
  >;

  const gameMutationMock: jest.Mocked<
    CanonicalResolver<graphqlModels.GameMutationResolvers<Request>>
  > = {
    createGame: jest.fn(),
    passGameTurn: jest.fn(),
    playGameCards: jest.fn(),
  } as Partial<
    jest.Mocked<CanonicalResolver<graphqlModels.GameMutationResolvers<Request>>>
  > as jest.Mocked<
    CanonicalResolver<graphqlModels.GameMutationResolvers<Request>>
  >;

  const userMutationMock: jest.Mocked<
    CanonicalResolver<graphqlModels.UserMutationResolvers<Request>>
  > = {
    createUser: jest.fn(),
    updateUserMe: jest.fn(),
  } as Partial<
    jest.Mocked<CanonicalResolver<graphqlModels.UserMutationResolvers<Request>>>
  > as jest.Mocked<
    CanonicalResolver<graphqlModels.UserMutationResolvers<Request>>
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
      'createUser',
      rootMutationResolver.createUser.bind(rootMutationResolver),
      userMutationMock.createUser as jest.Mock,
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
        graphqlModels.RootMutation,
        Request,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        any
      >,
      resolverMock: jest.Mock,
    ) => {
      describe('when called', () => {
        let parentFixture: graphqlModels.RootMutation;
        let argsFixture: unknown;
        let requestFixture: Request;
        let infoFixture: GraphQLResolveInfo;

        let resolverResultFixture: unknown;

        let result: unknown;

        beforeAll(async () => {
          parentFixture = Symbol() as unknown as graphqlModels.RootMutation;
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
