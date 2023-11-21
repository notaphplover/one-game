import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { models as graphqlModels } from '@cornie-js/api-graphql-models';
import { Request } from '@cornie-js/backend-http';
import { GraphQLResolveInfo } from 'graphql';

import { RootQueryResolver } from './RootQueryResolver';

describe(RootQueryResolver.name, () => {
  let gameByIdMock: jest.Mock<
    graphqlModels.ResolverFn<
      graphqlModels.Maybe<graphqlModels.ResolversTypes['Game']>,
      unknown,
      Request,
      graphqlModels.RequireFields<graphqlModels.GameQueryGameByIdArgs, 'id'>
    >
  >;

  let myGamesMock: jest.Mock<
    graphqlModels.ResolverFn<
      Array<graphqlModels.ResolversTypes['Game']>,
      unknown,
      Request,
      Partial<graphqlModels.RootQueryMyGamesArgs>
    >
  >;

  let gameQueryResolverMock: jest.Mocked<
    graphqlModels.GameQueryResolvers<Request>
  >;

  let userByIdMock: jest.Mock<
    graphqlModels.ResolverFn<
      graphqlModels.Maybe<graphqlModels.ResolversTypes['User']>,
      unknown,
      Request,
      graphqlModels.RequireFields<graphqlModels.UserQueryUserByIdArgs, 'id'>
    >
  >;

  let userMeMock: jest.Mock<
    graphqlModels.ResolverFn<
      graphqlModels.Maybe<graphqlModels.ResolversTypes['User']>,
      unknown,
      Request,
      Record<string, unknown>
    >
  >;

  let userQueryResolverMock: jest.Mocked<
    graphqlModels.UserQueryResolvers<Request>
  >;

  let rootQueryResolver: RootQueryResolver;

  beforeAll(() => {
    myGamesMock = jest.fn();
    gameByIdMock = jest.fn();

    gameQueryResolverMock = {
      gameById: gameByIdMock,
      myGames: myGamesMock,
    } as Partial<
      jest.Mocked<graphqlModels.GameQueryResolvers<Request>>
    > as jest.Mocked<graphqlModels.GameQueryResolvers<Request>>;

    userByIdMock = jest.fn();
    userMeMock = jest.fn();

    userQueryResolverMock = {
      userById: userByIdMock,
      userMe: userMeMock,
    } as Partial<
      jest.Mocked<graphqlModels.UserQueryResolvers<Request>>
    > as jest.Mocked<graphqlModels.UserQueryResolvers<Request>>;

    rootQueryResolver = new RootQueryResolver(
      gameQueryResolverMock,
      userQueryResolverMock,
    );
  });

  describe('.gameById', () => {
    let gameFixture: graphqlModels.Game;

    beforeAll(() => {
      gameFixture = Symbol() as unknown as graphqlModels.Game;
    });

    describe('when called', () => {
      let parentFixture: graphqlModels.RootQuery;
      let argsFixture: graphqlModels.GameQueryGameByIdArgs;
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

        gameByIdMock.mockReturnValueOnce(Promise.resolve(gameFixture));

        result = await rootQueryResolver.gameById(
          parentFixture,
          argsFixture,
          requestFixture,
          infoFixture,
        );
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call gameQueryResolver.gameById()', () => {
        expect(gameByIdMock).toHaveBeenCalledTimes(1);
        expect(gameByIdMock).toHaveBeenCalledWith(
          parentFixture,
          argsFixture,
          requestFixture,
          infoFixture,
        );
      });

      it('should return Game', () => {
        expect(result).toBe(gameFixture);
      });
    });
  });

  describe('.myGames', () => {
    let gameFixture: graphqlModels.Game;

    beforeAll(() => {
      gameFixture = Symbol() as unknown as graphqlModels.Game;
    });

    describe('when called', () => {
      let parentFixture: graphqlModels.RootQuery;
      let argsFixture: Partial<graphqlModels.RootQueryMyGamesArgs>;
      let requestFixture: Request;
      let infoFixture: GraphQLResolveInfo;

      let result: unknown;

      beforeAll(async () => {
        parentFixture = Symbol() as unknown as graphqlModels.RootQuery;
        argsFixture = {
          findMyGamesInput: {
            page: 1,
            pageSize: null,
            status: 'active',
          },
        };
        requestFixture = Symbol() as unknown as Request;
        infoFixture = Symbol() as unknown as GraphQLResolveInfo;

        myGamesMock.mockReturnValueOnce(Promise.resolve([gameFixture]));

        result = await rootQueryResolver.myGames(
          parentFixture,
          argsFixture,
          requestFixture,
          infoFixture,
        );
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call gameQueryResolver.myGames()', () => {
        expect(myGamesMock).toHaveBeenCalledTimes(1);
        expect(myGamesMock).toHaveBeenCalledWith(
          parentFixture,
          argsFixture,
          requestFixture,
          infoFixture,
        );
      });

      it('should return Game', () => {
        expect(result).toStrictEqual([gameFixture]);
      });
    });
  });

  describe('.userById', () => {
    let userFixture: graphqlModels.User;

    beforeAll(() => {
      userFixture = Symbol() as unknown as graphqlModels.User;
    });

    describe('when called', () => {
      let parentFixture: graphqlModels.RootQuery;
      let argsFixture: graphqlModels.UserQueryUserByIdArgs;
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

        userByIdMock.mockReturnValueOnce(Promise.resolve(userFixture));

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

      it('should call userQueryResolver.userById()', () => {
        expect(userByIdMock).toHaveBeenCalledTimes(1);
        expect(userByIdMock).toHaveBeenCalledWith(
          parentFixture,
          argsFixture,
          requestFixture,
          infoFixture,
        );
      });

      it('should return UserV1', () => {
        expect(result).toBe(userFixture);
      });
    });
  });

  describe('.userMe', () => {
    let userFixture: graphqlModels.User;

    beforeAll(() => {
      userFixture = Symbol() as unknown as graphqlModels.User;
    });

    describe('when called', () => {
      let parentFixture: graphqlModels.RootQuery;
      let argsFixture: Record<string, unknown>;
      let requestFixture: Request;
      let infoFixture: GraphQLResolveInfo;

      let result: unknown;

      beforeAll(async () => {
        parentFixture = Symbol() as unknown as graphqlModels.RootQuery;
        argsFixture = {};
        requestFixture = Symbol() as unknown as Request;
        infoFixture = Symbol() as unknown as GraphQLResolveInfo;

        userMeMock.mockReturnValueOnce(Promise.resolve(userFixture));

        result = await rootQueryResolver.userMe(
          parentFixture,
          argsFixture,
          requestFixture,
          infoFixture,
        );
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call userQueryResolver.userMe()', () => {
        expect(userMeMock).toHaveBeenCalledTimes(1);
        expect(userMeMock).toHaveBeenCalledWith(
          parentFixture,
          argsFixture,
          requestFixture,
          infoFixture,
        );
      });

      it('should return UserV1', () => {
        expect(result).toBe(userFixture);
      });
    });
  });
});
