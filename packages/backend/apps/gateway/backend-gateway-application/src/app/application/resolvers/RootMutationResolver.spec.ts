import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { models as graphqlModels } from '@cornie-js/api-graphql-models';
import { Request } from '@cornie-js/backend-http';
import { GraphQLResolveInfo } from 'graphql';

import { RootMutationResolver } from './RootMutationResolver';

describe(RootMutationResolver.name, () => {
  let createAuthByCodeMock: jest.Mock<
    graphqlModels.ResolverFn<
      graphqlModels.ResolversTypes['Auth'],
      unknown,
      Request,
      graphqlModels.RequireFields<
        graphqlModels.AuthMutationCreateAuthByCodeArgs,
        'codeAuthCreateInput'
      >
    >
  >;
  let createAuthByCredentialsMock: jest.Mock<
    graphqlModels.ResolverFn<
      graphqlModels.ResolversTypes['Auth'],
      unknown,
      Request,
      graphqlModels.RequireFields<
        graphqlModels.AuthMutationCreateAuthByCredentialsArgs,
        'emailPasswordAuthCreateInput'
      >
    >
  >;
  let createGameMock: jest.Mock<
    graphqlModels.ResolverFn<
      graphqlModels.ResolversTypes['Game'],
      unknown,
      Request,
      graphqlModels.RequireFields<
        graphqlModels.GameMutationCreateGameArgs,
        'gameCreateInput'
      >
    >
  >;
  let createUserMock: jest.Mock<
    graphqlModels.ResolverFn<
      graphqlModels.ResolversTypes['User'],
      unknown,
      Request,
      graphqlModels.RequireFields<
        graphqlModels.UserMutationCreateUserArgs,
        'userCreateInput'
      >
    >
  >;

  let authMutationMock: jest.Mocked<
    graphqlModels.AuthMutationResolvers<Request>
  >;
  let gameMutationMock: jest.Mocked<
    graphqlModels.GameMutationResolvers<Request>
  >;
  let userMutationMock: jest.Mocked<
    graphqlModels.UserMutationResolvers<Request>
  >;

  let rootMutationResolver: RootMutationResolver;

  beforeAll(() => {
    createAuthByCodeMock = jest.fn();
    createAuthByCredentialsMock = jest.fn();
    createGameMock = jest.fn();
    createUserMock = jest.fn();

    authMutationMock = {
      createAuthByCode: createAuthByCodeMock,
      createAuthByCredentials: createAuthByCredentialsMock,
    } as Partial<
      jest.Mocked<graphqlModels.AuthMutationResolvers<Request>>
    > as jest.Mocked<graphqlModels.AuthMutationResolvers<Request>>;

    gameMutationMock = {
      createGame: createGameMock,
    } as Partial<
      jest.Mocked<graphqlModels.GameMutationResolvers<Request>>
    > as jest.Mocked<graphqlModels.GameMutationResolvers<Request>>;

    userMutationMock = {
      createUser: createUserMock,
    } as Partial<
      jest.Mocked<graphqlModels.UserMutationResolvers<Request>>
    > as jest.Mocked<graphqlModels.UserMutationResolvers<Request>>;

    rootMutationResolver = new RootMutationResolver(
      authMutationMock,
      gameMutationMock,
      userMutationMock,
    );
  });

  describe('.createAuthByCode', () => {
    let graphQlAuthFixture: graphqlModels.Auth;

    beforeAll(() => {
      graphQlAuthFixture = {
        jwt: 'jwt fixture',
      };
    });

    describe('when called', () => {
      let parentFixture: graphqlModels.RootMutation;
      let argsFixture: graphqlModels.AuthMutationCreateAuthByCodeArgs;
      let requestFixture: Request;
      let infoFixture: GraphQLResolveInfo;

      let result: unknown;

      beforeAll(async () => {
        parentFixture = Symbol() as unknown as graphqlModels.RootMutation;
        argsFixture = {
          codeAuthCreateInput: {
            code: 'code fixture',
          },
        };
        requestFixture = Symbol() as unknown as Request;
        infoFixture = Symbol() as unknown as GraphQLResolveInfo;

        createAuthByCodeMock.mockReturnValueOnce(
          Promise.resolve(graphQlAuthFixture),
        );

        result = await rootMutationResolver.createAuthByCode(
          parentFixture,
          argsFixture,
          requestFixture,
          infoFixture,
        );
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call authMutation.createAuthByCode()', () => {
        expect(createAuthByCodeMock).toHaveBeenCalledTimes(1);
        expect(createAuthByCodeMock).toHaveBeenCalledWith(
          parentFixture,
          argsFixture,
          requestFixture,
          infoFixture,
        );
      });

      it('should return GraphQL Auth', () => {
        expect(result).toBe(graphQlAuthFixture);
      });
    });
  });

  describe('.createAuthByCredentials', () => {
    let graphQlAuthFixture: graphqlModels.Auth;

    beforeAll(() => {
      graphQlAuthFixture = {
        jwt: 'jwt fixture',
      };
    });

    describe('when called', () => {
      let parentFixture: graphqlModels.RootMutation;
      let argsFixture: graphqlModels.AuthMutationCreateAuthByCredentialsArgs;
      let requestFixture: Request;
      let infoFixture: GraphQLResolveInfo;

      let result: unknown;

      beforeAll(async () => {
        parentFixture = Symbol() as unknown as graphqlModels.RootMutation;
        argsFixture = {
          emailPasswordAuthCreateInput: {
            email: 'email@fixture.com',
            password: 'password',
          },
        };
        requestFixture = Symbol() as unknown as Request;
        infoFixture = Symbol() as unknown as GraphQLResolveInfo;

        createAuthByCredentialsMock.mockReturnValueOnce(
          Promise.resolve(graphQlAuthFixture),
        );

        result = await rootMutationResolver.createAuthByCredentials(
          parentFixture,
          argsFixture,
          requestFixture,
          infoFixture,
        );
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call authMutation.createAuthByCredentialsMock()', () => {
        expect(createAuthByCredentialsMock).toHaveBeenCalledTimes(1);
        expect(createAuthByCredentialsMock).toHaveBeenCalledWith(
          parentFixture,
          argsFixture,
          requestFixture,
          infoFixture,
        );
      });

      it('should return GraphQL Auth', () => {
        expect(result).toBe(graphQlAuthFixture);
      });
    });
  });

  describe('.createGame', () => {
    let graphQlGameFixture: graphqlModels.Game;

    beforeAll(() => {
      graphQlGameFixture = Symbol() as unknown as graphqlModels.Game;
    });

    describe('when called', () => {
      let parentFixture: graphqlModels.RootMutation;
      let argsFixture: graphqlModels.GameMutationCreateGameArgs;
      let requestFixture: Request;
      let infoFixture: GraphQLResolveInfo;

      let result: unknown;

      beforeAll(async () => {
        parentFixture = Symbol() as unknown as graphqlModels.RootMutation;
        argsFixture =
          Symbol() as unknown as graphqlModels.GameMutationCreateGameArgs;
        requestFixture = Symbol() as unknown as Request;
        infoFixture = Symbol() as unknown as GraphQLResolveInfo;

        createGameMock.mockReturnValueOnce(Promise.resolve(graphQlGameFixture));

        result = await rootMutationResolver.createGame(
          parentFixture,
          argsFixture,
          requestFixture,
          infoFixture,
        );
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call gameMutation.createGame()', () => {
        expect(createGameMock).toHaveBeenCalledTimes(1);
        expect(createGameMock).toHaveBeenCalledWith(
          parentFixture,
          argsFixture,
          requestFixture,
          infoFixture,
        );
      });

      it('should return GraphQL game', () => {
        expect(result).toBe(graphQlGameFixture);
      });
    });
  });

  describe('.createUser', () => {
    let graphQlUserFixture: graphqlModels.User;

    beforeAll(() => {
      graphQlUserFixture = {
        active: false,
        id: 'id',
        name: 'name',
      };
    });

    describe('when called', () => {
      let parentFixture: graphqlModels.RootMutation;
      let argsFixture: graphqlModels.UserMutationCreateUserArgs;
      let requestFixture: Request;
      let infoFixture: GraphQLResolveInfo;

      let result: unknown;

      beforeAll(async () => {
        parentFixture = Symbol() as unknown as graphqlModels.RootMutation;
        argsFixture = {
          userCreateInput: {
            email: 'email-fixture',
            name: 'name-fixture',
            password: 'password-fixture',
          },
        };
        requestFixture = Symbol() as unknown as Request;
        infoFixture = Symbol() as unknown as GraphQLResolveInfo;

        createUserMock.mockReturnValueOnce(Promise.resolve(graphQlUserFixture));

        result = await rootMutationResolver.createUser(
          parentFixture,
          argsFixture,
          requestFixture,
          infoFixture,
        );
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call userMutation.createUser()', () => {
        expect(createUserMock).toHaveBeenCalledTimes(1);
        expect(createUserMock).toHaveBeenCalledWith(
          parentFixture,
          argsFixture,
          requestFixture,
          infoFixture,
        );
      });

      it('should return GraphQL User', () => {
        expect(result).toBe(graphQlUserFixture);
      });
    });
  });
});
