import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { models as graphqlModels } from '@cornie-js/api-graphql-models';
import {
  HttpClient,
  HttpClientEndpoints,
  Response,
} from '@cornie-js/api-http-client';
import { models as apiModels } from '@cornie-js/api-models';
import { AppError, AppErrorKind, Builder } from '@cornie-js/backend-common';
import { HttpStatus } from '@nestjs/common';

import { Context } from '../../../foundation/graphql/application/models/Context';
import { GameQueryResolver } from './GameQueryResolver';

describe(GameQueryResolver.name, () => {
  let httpClientMock: jest.Mocked<HttpClient>;
  let gameGraphQlFromGameV1BuilderMock: jest.Mocked<
    Builder<graphqlModels.Game, [apiModels.GameV1]>
  >;

  let gameQueryResolver: GameQueryResolver;

  beforeAll(() => {
    gameGraphQlFromGameV1BuilderMock = {
      build: jest.fn(),
    };

    httpClientMock = {
      endpoints: {
        getGame: jest.fn(),
        getGamesMine: jest.fn(),
      } as Partial<jest.Mocked<HttpClientEndpoints>>,
    } as Partial<jest.Mocked<HttpClient>> as jest.Mocked<HttpClient>;

    gameQueryResolver = new GameQueryResolver(
      gameGraphQlFromGameV1BuilderMock,
      httpClientMock,
    );
  });

  describe('.gameById', () => {
    describe('when called, and httpClient.endpoints.getGame() returns a Response with status code 200', () => {
      let firstArgFixture: unknown;
      let argsFixture: graphqlModels.GameQueryGameByIdArgs;
      let contextFixture: Context;

      let responseFixture: Response<
        Record<string, string>,
        apiModels.GameV1,
        HttpStatus.OK
      >;

      let gameFixture: graphqlModels.Game;

      let result: unknown;

      beforeAll(async () => {
        firstArgFixture = Symbol();
        argsFixture = {
          id: 'game-id',
        };
        contextFixture = {
          request: {
            headers: {},
            query: {},
            urlParameters: {},
          },
        } as Partial<Context> as Context;

        responseFixture = {
          body: Symbol() as unknown as apiModels.GameV1,
          headers: {},
          statusCode: HttpStatus.OK,
        };

        gameFixture = Symbol() as unknown as graphqlModels.Game;

        gameGraphQlFromGameV1BuilderMock.build.mockReturnValueOnce(gameFixture);

        httpClientMock.endpoints.getGame.mockResolvedValueOnce(responseFixture);

        result = await gameQueryResolver.gameById(
          firstArgFixture,
          argsFixture,
          contextFixture,
        );
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call httpClient.endpoints.getGame()', () => {
        expect(httpClientMock.endpoints.getGame).toHaveBeenCalledTimes(1);
        expect(httpClientMock.endpoints.getGame).toHaveBeenCalledWith(
          contextFixture.request.headers,
          {
            gameId: argsFixture.id,
          },
        );
      });

      it('should call gameGraphQlFromGameV1Builder.build()', () => {
        expect(gameGraphQlFromGameV1BuilderMock.build).toHaveBeenCalledTimes(1);
        expect(gameGraphQlFromGameV1BuilderMock.build).toHaveBeenCalledWith(
          responseFixture.body,
        );
      });

      it('should return response body', () => {
        expect(result).toBe(gameFixture);
      });
    });

    describe('when called, and httpClient.endpoints.getGame() returns a Response with status code 401', () => {
      let firstArgFixture: unknown;
      let argsFixture: graphqlModels.GameQueryGameByIdArgs;
      let contextFixture: Context;

      let responseFixture: Response<
        Record<string, string>,
        apiModels.ErrorV1,
        HttpStatus.UNAUTHORIZED
      >;

      let result: unknown;

      beforeAll(async () => {
        firstArgFixture = Symbol();
        argsFixture = {
          id: 'game-id',
        };
        contextFixture = {
          request: {
            headers: {},
            query: {},
            urlParameters: {},
          },
        } as Partial<Context> as Context;

        responseFixture = {
          body: {
            description: 'Error description fixture',
          },
          headers: {},
          statusCode: HttpStatus.UNAUTHORIZED,
        };

        httpClientMock.endpoints.getGame.mockResolvedValueOnce(responseFixture);

        try {
          await gameQueryResolver.gameById(
            firstArgFixture,
            argsFixture,
            contextFixture,
          );
        } catch (error: unknown) {
          result = error;
        }
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call httpClient.endpoints.getGame()', () => {
        expect(httpClientMock.endpoints.getGame).toHaveBeenCalledTimes(1);
        expect(httpClientMock.endpoints.getGame).toHaveBeenCalledWith(
          contextFixture.request.headers,
          {
            gameId: argsFixture.id,
          },
        );
      });

      it('should throw an AppError', () => {
        const expectedErrorProperties: Partial<AppError> = {
          kind: AppErrorKind.missingCredentials,
          message: responseFixture.body.description,
        };

        expect(result).toBeInstanceOf(AppError);
        expect(result).toStrictEqual(
          expect.objectContaining(expectedErrorProperties),
        );
      });
    });

    describe('when called, and httpClient.endpoints.getGame() returns a Response with status code 404', () => {
      let firstArgFixture: unknown;
      let argsFixture: graphqlModels.GameQueryGameByIdArgs;
      let contextFixture: Context;

      let responseFixture: Response<
        Record<string, string>,
        apiModels.ErrorV1,
        HttpStatus.NOT_FOUND
      >;

      let result: unknown;

      beforeAll(async () => {
        firstArgFixture = Symbol();
        argsFixture = {
          id: 'game-id',
        };
        contextFixture = {
          request: {
            headers: {},
            query: {},
            urlParameters: {},
          },
        } as Partial<Context> as Context;

        responseFixture = {
          body: {
            description: 'Error description fixture',
          },
          headers: {},
          statusCode: HttpStatus.NOT_FOUND,
        };

        httpClientMock.endpoints.getGame.mockResolvedValueOnce(responseFixture);

        result = await gameQueryResolver.gameById(
          firstArgFixture,
          argsFixture,
          contextFixture,
        );
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call httpClient.endpoints.getGame()', () => {
        expect(httpClientMock.endpoints.getGame).toHaveBeenCalledTimes(1);
        expect(httpClientMock.endpoints.getGame).toHaveBeenCalledWith(
          contextFixture.request.headers,
          {
            gameId: argsFixture.id,
          },
        );
      });

      it('should return null', () => {
        expect(result).toBeNull();
      });
    });
  });

  describe('.myGames', () => {
    let contextFixture: Context;

    beforeAll(() => {
      contextFixture = {
        request: {
          headers: {},
          query: {},
          urlParameters: {},
        },
      } as Partial<Context> as Context;
    });

    describe('having GameQueryMyGamesArgs with page', () => {
      let argsFixture: graphqlModels.GameQueryMyGamesArgs;

      beforeAll(() => {
        argsFixture = {
          findMyGamesInput: {
            page: 2,
            pageSize: null,
            status: null,
          },
        };
      });

      describe('when called, and httpClient.endpoints.getGamesMine() returns an OK Response', () => {
        let gameV1Fixture: apiModels.GameV1;
        let gameFixture: graphqlModels.Game;

        let result: unknown;

        beforeAll(async () => {
          gameV1Fixture = Symbol() as unknown as apiModels.GameV1;

          gameFixture = Symbol() as unknown as graphqlModels.Game;

          httpClientMock.endpoints.getGamesMine.mockResolvedValueOnce({
            body: [gameV1Fixture],
            headers: {},
            statusCode: HttpStatus.OK,
          });

          gameGraphQlFromGameV1BuilderMock.build.mockReturnValueOnce(
            gameFixture,
          );

          result = await gameQueryResolver.myGames(
            Symbol(),
            argsFixture,
            contextFixture,
          );
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call httpClient.endpoints.getGamesMine()', () => {
          expect(httpClientMock.endpoints.getGamesMine).toHaveBeenCalledTimes(
            1,
          );
          expect(httpClientMock.endpoints.getGamesMine).toHaveBeenCalledWith(
            contextFixture.request.headers,
            {
              page: (argsFixture.findMyGamesInput?.page as number).toString(),
            },
          );
        });

        it('should call gameGraphQlFromGameV1Builder.build()', () => {
          expect(gameGraphQlFromGameV1BuilderMock.build).toHaveBeenCalledTimes(
            1,
          );
          expect(gameGraphQlFromGameV1BuilderMock.build).toHaveBeenCalledWith(
            gameV1Fixture,
          );
        });

        it('should return a GameArray', () => {
          expect(result).toStrictEqual([gameFixture]);
        });
      });
    });

    describe('having GameQueryMyGamesArgs with pageSize', () => {
      let argsFixture: graphqlModels.GameQueryMyGamesArgs;

      beforeAll(() => {
        argsFixture = {
          findMyGamesInput: {
            page: null,
            pageSize: 10,
            status: null,
          },
        };
      });

      describe('when called, and httpClient.endpoints.getGamesMine() returns an OK Response', () => {
        let gameV1Fixture: apiModels.GameV1;
        let gameFixture: graphqlModels.Game;

        let result: unknown;

        beforeAll(async () => {
          gameV1Fixture = Symbol() as unknown as apiModels.GameV1;

          gameFixture = Symbol() as unknown as graphqlModels.Game;

          httpClientMock.endpoints.getGamesMine.mockResolvedValueOnce({
            body: [gameV1Fixture],
            headers: {},
            statusCode: HttpStatus.OK,
          });

          gameGraphQlFromGameV1BuilderMock.build.mockReturnValueOnce(
            gameFixture,
          );

          result = await gameQueryResolver.myGames(
            Symbol(),
            argsFixture,
            contextFixture,
          );
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call httpClient.endpoints.getGamesMine()', () => {
          expect(httpClientMock.endpoints.getGamesMine).toHaveBeenCalledTimes(
            1,
          );
          expect(httpClientMock.endpoints.getGamesMine).toHaveBeenCalledWith(
            contextFixture.request.headers,
            {
              pageSize: (
                argsFixture.findMyGamesInput?.pageSize as number
              ).toString(),
            },
          );
        });

        it('should call gameGraphQlFromGameV1Builder.build()', () => {
          expect(gameGraphQlFromGameV1BuilderMock.build).toHaveBeenCalledTimes(
            1,
          );
          expect(gameGraphQlFromGameV1BuilderMock.build).toHaveBeenCalledWith(
            gameV1Fixture,
          );
        });

        it('should return a GameArray', () => {
          expect(result).toStrictEqual([gameFixture]);
        });
      });
    });

    describe('having GameQueryMyGamesArgs with status', () => {
      let argsFixture: graphqlModels.GameQueryMyGamesArgs;

      beforeAll(() => {
        argsFixture = {
          findMyGamesInput: {
            page: null,
            pageSize: null,
            status: 'active',
          },
        };
      });

      describe('when called, and httpClient.endpoints.getGamesMine() returns an OK Response', () => {
        let gameV1Fixture: apiModels.GameV1;
        let gameFixture: graphqlModels.Game;

        let result: unknown;

        beforeAll(async () => {
          gameV1Fixture = Symbol() as unknown as apiModels.GameV1;

          gameFixture = Symbol() as unknown as graphqlModels.Game;

          httpClientMock.endpoints.getGamesMine.mockResolvedValueOnce({
            body: [gameV1Fixture],
            headers: {},
            statusCode: HttpStatus.OK,
          });

          gameGraphQlFromGameV1BuilderMock.build.mockReturnValueOnce(
            gameFixture,
          );

          result = await gameQueryResolver.myGames(
            Symbol(),
            argsFixture,
            contextFixture,
          );
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call httpClient.endpoints.getGamesMine()', () => {
          expect(httpClientMock.endpoints.getGamesMine).toHaveBeenCalledTimes(
            1,
          );
          expect(httpClientMock.endpoints.getGamesMine).toHaveBeenCalledWith(
            contextFixture.request.headers,
            {
              status: argsFixture.findMyGamesInput?.status,
            },
          );
        });

        it('should call gameGraphQlFromGameV1Builder.build()', () => {
          expect(gameGraphQlFromGameV1BuilderMock.build).toHaveBeenCalledTimes(
            1,
          );
          expect(gameGraphQlFromGameV1BuilderMock.build).toHaveBeenCalledWith(
            gameV1Fixture,
          );
        });

        it('should return a GameArray', () => {
          expect(result).toStrictEqual([gameFixture]);
        });
      });
    });

    describe('having GameQueryMyGamesArgs', () => {
      let argsFixture: graphqlModels.GameQueryMyGamesArgs;

      beforeAll(() => {
        argsFixture = {
          findMyGamesInput: {
            page: 2,
            pageSize: 10,
            status: 'active',
          },
        };
      });

      describe('when called, and httpClient.endpoints.getGamesMine() returns a Bad Request Response', () => {
        let gameFixture: graphqlModels.Game;

        let errorDescriptionFixture: string;

        let result: unknown;

        beforeAll(async () => {
          gameFixture = Symbol() as unknown as graphqlModels.Game;

          errorDescriptionFixture = 'error description fixture';

          httpClientMock.endpoints.getGamesMine.mockResolvedValueOnce({
            body: {
              description: errorDescriptionFixture,
            },
            headers: {},
            statusCode: HttpStatus.BAD_REQUEST,
          });

          gameGraphQlFromGameV1BuilderMock.build.mockReturnValueOnce(
            gameFixture,
          );

          try {
            await gameQueryResolver.myGames(
              Symbol(),
              argsFixture,
              contextFixture,
            );
          } catch (error: unknown) {
            result = error;
          }
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call httpClient.endpoints.getGamesMine()', () => {
          expect(httpClientMock.endpoints.getGamesMine).toHaveBeenCalledTimes(
            1,
          );
          expect(httpClientMock.endpoints.getGamesMine).toHaveBeenCalledWith(
            contextFixture.request.headers,
            {
              page: (argsFixture.findMyGamesInput?.page as number).toString(),
              pageSize: (
                argsFixture.findMyGamesInput?.pageSize as number
              ).toString(),
              status: argsFixture.findMyGamesInput?.status,
            },
          );
        });

        it('should throw an AppError', () => {
          const expectedErrorProperties: Partial<AppError> = {
            kind: AppErrorKind.contractViolation,
            message: errorDescriptionFixture,
          };

          expect(result).toBeInstanceOf(AppError);
          expect(result).toStrictEqual(
            expect.objectContaining(expectedErrorProperties),
          );
        });
      });
    });
  });
});
