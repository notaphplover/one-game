import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { models as graphqlModels } from '@cornie-js/api-graphql-models';
import { models as apiModels } from '@cornie-js/api-models';
import { Request } from '@cornie-js/backend-http';
import { GraphQLResolveInfo } from 'graphql';

import { RootQueryResolver } from './RootQueryResolver';

describe(RootQueryResolver.name, () => {
  let userByIdMock: jest.Mock<
    graphqlModels.ResolverFn<
      graphqlModels.Maybe<graphqlModels.ResolversTypes['User']>,
      unknown,
      Request,
      graphqlModels.RequireFields<
        graphqlModels.FindUsersQueryUserByIdArgs,
        'id'
      >
    >
  >;

  let findUsersQueryResolverMock: jest.Mocked<
    graphqlModels.FindUsersQueryResolvers<Request>
  >;

  let rootQueryResolver: RootQueryResolver;

  beforeAll(() => {
    userByIdMock = jest.fn();

    findUsersQueryResolverMock = {
      userById: userByIdMock,
    } as Partial<
      jest.Mocked<graphqlModels.FindUsersQueryResolvers<Request>>
    > as jest.Mocked<graphqlModels.FindUsersQueryResolvers<Request>>;

    rootQueryResolver = new RootQueryResolver(findUsersQueryResolverMock);
  });

  describe('.userById', () => {
    let userV1Fixture: apiModels.UserV1;

    describe('when called', () => {
      let parentFixture: graphqlModels.RootQuery;
      let argsFixture: graphqlModels.FindUsersQueryUserByIdArgs;
      let requestFixture: Request;
      let infoFixture: GraphQLResolveInfo;

      let result: unknown;

      beforeAll(async () => {
        parentFixture = Symbol() as unknown as graphqlModels.RootQuery;
        argsFixture = {
          id: 'id fixture',
        };
        requestFixture = Symbol() as unknown as Request;
        infoFixture = Symbol() as unknown as GraphQLResolveInfo;

        userByIdMock.mockReturnValueOnce(Promise.resolve(userV1Fixture));

        result = await rootQueryResolver.userById(
          parentFixture,
          argsFixture,
          requestFixture,
          infoFixture,
        );
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call findUsersQueryResolver.userById()', () => {
        expect(userByIdMock).toHaveBeenCalledTimes(1);
        expect(userByIdMock).toHaveBeenCalledWith(
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
