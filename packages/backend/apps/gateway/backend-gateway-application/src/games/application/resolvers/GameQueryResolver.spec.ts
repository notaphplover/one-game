import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { models as graphqlModels } from '@cornie-js/api-graphql-models';
import { HttpClient } from '@cornie-js/api-http-client';
import { models as apiModels } from '@cornie-js/api-models';
import { AppError, AppErrorKind, Builder } from '@cornie-js/backend-common';
import { Request } from '@cornie-js/backend-http';
import { HttpStatus } from '@nestjs/common';

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
      getGamesMine: jest.fn(),
    } as Partial<jest.Mocked<HttpClient>> as jest.Mocked<HttpClient>;

    gameQueryResolver = new GameQueryResolver(
      gameGraphQlFromGameV1BuilderMock,
      httpClientMock,
    );
  });

  describe('.myGames', () => {
    let requestFixture: Request;

    beforeAll(() => {
      requestFixture = {
        headers: {},
        query: {},
        urlParameters: {},
      };
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

      describe('when called, and httpClient.getGamesMine() returns an OK Response', () => {
        let gameV1Fixture: apiModels.GameV1;
        let gameFixture: graphqlModels.Game;

        let result: unknown;

        beforeAll(async () => {
          gameV1Fixture = Symbol() as unknown as apiModels.GameV1;

          gameFixture = Symbol() as unknown as graphqlModels.Game;

          httpClientMock.getGamesMine.mockResolvedValueOnce({
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
            requestFixture,
          );
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call httpClient.getGamesMine()', () => {
          expect(httpClientMock.getGamesMine).toHaveBeenCalledTimes(1);
          expect(httpClientMock.getGamesMine).toHaveBeenCalledWith(
            requestFixture.headers,
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

      describe('when called, and httpClient.getGamesMine() returns an OK Response', () => {
        let gameV1Fixture: apiModels.GameV1;
        let gameFixture: graphqlModels.Game;

        let result: unknown;

        beforeAll(async () => {
          gameV1Fixture = Symbol() as unknown as apiModels.GameV1;

          gameFixture = Symbol() as unknown as graphqlModels.Game;

          httpClientMock.getGamesMine.mockResolvedValueOnce({
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
            requestFixture,
          );
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call httpClient.getGamesMine()', () => {
          expect(httpClientMock.getGamesMine).toHaveBeenCalledTimes(1);
          expect(httpClientMock.getGamesMine).toHaveBeenCalledWith(
            requestFixture.headers,
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

      describe('when called, and httpClient.getGamesMine() returns an OK Response', () => {
        let gameV1Fixture: apiModels.GameV1;
        let gameFixture: graphqlModels.Game;

        let result: unknown;

        beforeAll(async () => {
          gameV1Fixture = Symbol() as unknown as apiModels.GameV1;

          gameFixture = Symbol() as unknown as graphqlModels.Game;

          httpClientMock.getGamesMine.mockResolvedValueOnce({
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
            requestFixture,
          );
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call httpClient.getGamesMine()', () => {
          expect(httpClientMock.getGamesMine).toHaveBeenCalledTimes(1);
          expect(httpClientMock.getGamesMine).toHaveBeenCalledWith(
            requestFixture.headers,
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

      describe('when called, and httpClient.getGamesMine() returns a Bad Request Response', () => {
        let gameFixture: graphqlModels.Game;

        let errorDescriptionFixture: string;

        let result: unknown;

        beforeAll(async () => {
          gameFixture = Symbol() as unknown as graphqlModels.Game;

          errorDescriptionFixture = 'error description fixture';

          httpClientMock.getGamesMine.mockResolvedValueOnce({
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
              requestFixture,
            );
          } catch (error: unknown) {
            result = error;
          }
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call httpClient.getGamesMine()', () => {
          expect(httpClientMock.getGamesMine).toHaveBeenCalledTimes(1);
          expect(httpClientMock.getGamesMine).toHaveBeenCalledWith(
            requestFixture.headers,
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
