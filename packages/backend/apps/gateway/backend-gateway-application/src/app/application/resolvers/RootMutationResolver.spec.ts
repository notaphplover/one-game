import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { models as graphqlModels } from '@cornie-js/api-graphql-models';
import { models as apiModels } from '@cornie-js/api-models';
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
        graphqlModels.CreateAuthMutationCreateAuthByCodeArgs,
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
        graphqlModels.CreateAuthMutationCreateAuthByCredentialsArgs,
        'emailPasswordAuthCreateInput'
      >
    >
  >;
  let createUserMock: jest.Mock<
    graphqlModels.ResolverFn<
      graphqlModels.ResolversTypes['User'],
      unknown,
      Request,
      graphqlModels.RequireFields<
        graphqlModels.CreateUserMutationCreateUserArgs,
        'userCreateInput'
      >
    >
  >;

  let createAuthMutationMock: jest.Mocked<
    graphqlModels.CreateAuthMutationResolvers<Request>
  >;
  let createUserMutationMock: jest.Mocked<
    graphqlModels.CreateUserMutationResolvers<Request>
  >;

  let rootMutationResolver: RootMutationResolver;

  beforeAll(() => {
    createAuthByCodeMock = jest.fn();
    createAuthByCredentialsMock = jest.fn();
    createUserMock = jest.fn();

    createAuthMutationMock = {
      createAuthByCode: createAuthByCodeMock,
      createAuthByCredentials: createAuthByCredentialsMock,
    } as Partial<
      jest.Mocked<graphqlModels.CreateAuthMutationResolvers<Request>>
    > as jest.Mocked<graphqlModels.CreateAuthMutationResolvers<Request>>;

    createUserMutationMock = {
      createUser: createUserMock,
    } as Partial<
      jest.Mocked<graphqlModels.CreateUserMutationResolvers<Request>>
    > as jest.Mocked<graphqlModels.CreateUserMutationResolvers<Request>>;

    rootMutationResolver = new RootMutationResolver(
      createAuthMutationMock,
      createUserMutationMock,
    );
  });

  describe('.createAuthByCode', () => {
    let authV1Fixture: apiModels.AuthV1;

    beforeAll(() => {
      authV1Fixture = {
        jwt: 'jwt fixture',
      };
    });

    describe('when called', () => {
      let parentFixture: graphqlModels.RootMutation;
      let argsFixture: graphqlModels.CreateAuthMutationCreateAuthByCodeArgs;
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
          Promise.resolve(authV1Fixture),
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

      it('should call createAuthMutation.createAuthByCode()', () => {
        expect(createAuthByCodeMock).toHaveBeenCalledTimes(1);
        expect(createAuthByCodeMock).toHaveBeenCalledWith(
          parentFixture,
          argsFixture,
          requestFixture,
          infoFixture,
        );
      });

      it('should return AuthV1', () => {
        expect(result).toBe(authV1Fixture);
      });
    });
  });

  describe('.createAuthByCredentials', () => {
    let authV1Fixture: apiModels.AuthV1;

    beforeAll(() => {
      authV1Fixture = {
        jwt: 'jwt fixture',
      };
    });

    describe('when called', () => {
      let parentFixture: graphqlModels.RootMutation;
      let argsFixture: graphqlModels.CreateAuthMutationCreateAuthByCredentialsArgs;
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
          Promise.resolve(authV1Fixture),
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

      it('should call createAuthMutation.createAuthByCredentialsMock()', () => {
        expect(createAuthByCredentialsMock).toHaveBeenCalledTimes(1);
        expect(createAuthByCredentialsMock).toHaveBeenCalledWith(
          parentFixture,
          argsFixture,
          requestFixture,
          infoFixture,
        );
      });

      it('should return AuthV1', () => {
        expect(result).toBe(authV1Fixture);
      });
    });
  });

  describe('.createUser', () => {
    let userV1Fixture: apiModels.UserV1;

    beforeAll(() => {
      userV1Fixture = {
        active: false,
        id: 'id',
        name: 'name',
      };
    });

    describe('when called', () => {
      let parentFixture: graphqlModels.RootMutation;
      let argsFixture: graphqlModels.CreateUserMutationCreateUserArgs;
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

        createUserMock.mockReturnValueOnce(Promise.resolve(userV1Fixture));

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

      it('should call createUserMutation.createUser()', () => {
        expect(createUserMock).toHaveBeenCalledTimes(1);
        expect(createUserMock).toHaveBeenCalledWith(
          parentFixture,
          argsFixture,
          requestFixture,
          infoFixture,
        );
      });

      it('should return UserV1', () => {
        expect(result).toBe(userV1Fixture);
      });
    });
  });
});
