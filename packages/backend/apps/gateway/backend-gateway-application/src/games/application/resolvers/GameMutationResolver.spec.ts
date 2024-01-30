import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { models as graphqlModels } from '@cornie-js/api-graphql-models';
import { HttpClient } from '@cornie-js/api-http-client';
import { models as apiModels } from '@cornie-js/api-models';
import { AppError, AppErrorKind } from '@cornie-js/backend-common';
import { HttpStatus } from '@nestjs/common';

import { Context } from '../../../foundation/graphql/application/models/Context';
import { GameGraphQlFromGameV1BuilderType } from '../builders/GameGraphQlFromGameV1Builder';
import { GameMutationResolver } from './GameMutationResolver';

describe(GameMutationResolver.name, () => {
  let httpClientMock: jest.Mocked<HttpClient>;

  let gameMutationResolver: GameMutationResolver;
  let gameGraphQlFromGameV1BuilderMock: jest.Mocked<GameGraphQlFromGameV1BuilderType>;

  beforeAll(() => {
    gameGraphQlFromGameV1BuilderMock = {
      build: jest.fn(),
    } as Partial<
      jest.Mocked<GameGraphQlFromGameV1BuilderType>
    > as jest.Mocked<GameGraphQlFromGameV1BuilderType>;

    httpClientMock = {
      createGame: jest.fn(),
      createGameSlot: jest.fn(),
      updateGame: jest.fn(),
    } as Partial<jest.Mocked<HttpClient>> as jest.Mocked<HttpClient>;

    gameMutationResolver = new GameMutationResolver(
      gameGraphQlFromGameV1BuilderMock,
      httpClientMock,
    );
  });

  describe('.createGame', () => {
    let gameSlotsAmountFixture: number;
    let nameFixture: string;
    let optionsFixture: graphqlModels.GameCreateInputOptions;

    beforeAll(() => {
      gameSlotsAmountFixture = 2;
      nameFixture = 'name-fixture';
      optionsFixture = {
        chainDraw2Draw2Cards: true,
        chainDraw2Draw4Cards: true,
        chainDraw4Draw2Cards: true,
        chainDraw4Draw4Cards: true,
        playCardIsMandatory: false,
        playMultipleSameCards: true,
        playWildDraw4IfNoOtherAlternative: true,
      };
    });

    describe('when called, and httpClient.createGame() returns an OK response', () => {
      let gameV1Fixture: apiModels.NonStartedGameV1;
      let gameGraphQlFixture: graphqlModels.Game;

      let contextFixture: Context;

      let result: unknown;

      beforeAll(async () => {
        gameV1Fixture = Symbol() as unknown as apiModels.NonStartedGameV1;
        gameGraphQlFixture = Symbol() as unknown as graphqlModels.Game;

        contextFixture = {
          request: {
            headers: {
              foo: 'bar',
            },
            query: {},
            urlParameters: {},
          },
        } as Partial<Context> as Context;

        httpClientMock.createGame.mockResolvedValueOnce({
          body: gameV1Fixture,
          headers: {},
          statusCode: HttpStatus.OK,
        });

        gameGraphQlFromGameV1BuilderMock.build.mockReturnValueOnce(
          gameGraphQlFixture,
        );

        result = await gameMutationResolver.createGame(
          undefined,
          {
            gameCreateInput: {
              gameSlotsAmount: gameSlotsAmountFixture,
              name: nameFixture,
              options: optionsFixture,
            },
          },
          contextFixture,
        );
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call httpClient.createGame()', () => {
        const expectedBody: apiModels.GameCreateQueryV1 = {
          gameSlotsAmount: gameSlotsAmountFixture,
          name: nameFixture,
          options: optionsFixture,
        };

        expect(httpClientMock.createGame).toHaveBeenCalledTimes(1);
        expect(httpClientMock.createGame).toHaveBeenCalledWith(
          contextFixture.request.headers,
          expectedBody,
        );
      });

      it('should call gameGraphQlFromGameV1Builder.build()', () => {
        expect(gameGraphQlFromGameV1BuilderMock.build).toHaveBeenCalledTimes(1);
        expect(gameGraphQlFromGameV1BuilderMock.build).toHaveBeenCalledWith(
          gameV1Fixture,
        );
      });

      it('should return GraphQl Game', () => {
        expect(result).toBe(gameGraphQlFixture);
      });
    });

    describe('when called, and httpClient.createGame() returns an BAD_REQUEST response', () => {
      let errorV1: apiModels.ErrorV1;
      let contextFixture: Context;

      let result: unknown;

      beforeAll(async () => {
        errorV1 = {
          description: 'error description fixture',
        };

        contextFixture = {
          request: {
            headers: {
              foo: 'bar',
            },
            query: {},
            urlParameters: {},
          },
        } as Partial<Context> as Context;

        httpClientMock.createGame.mockResolvedValueOnce({
          body: errorV1,
          headers: {},
          statusCode: HttpStatus.BAD_REQUEST,
        });

        try {
          await gameMutationResolver.createGame(
            undefined,
            {
              gameCreateInput: {
                gameSlotsAmount: gameSlotsAmountFixture,
                name: nameFixture,
                options: optionsFixture,
              },
            },
            contextFixture,
          );
        } catch (error: unknown) {
          result = error;
        }
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call httpClient.createGame()', () => {
        const expectedBody: apiModels.GameCreateQueryV1 = {
          gameSlotsAmount: gameSlotsAmountFixture,
          name: nameFixture,
          options: optionsFixture,
        };

        expect(httpClientMock.createGame).toHaveBeenCalledTimes(1);
        expect(httpClientMock.createGame).toHaveBeenCalledWith(
          contextFixture.request.headers,
          expectedBody,
        );
      });

      it('should throw an AppError', () => {
        const expectedErrorProperties: Partial<AppError> = {
          kind: AppErrorKind.contractViolation,
          message: errorV1.description,
        };

        expect(result).toBeInstanceOf(AppError);
        expect(result).toStrictEqual(
          expect.objectContaining(expectedErrorProperties),
        );
      });
    });
  });

  describe('.createGameSlot', () => {
    let gameIdFixture: string;
    let userIdFixture: string;

    beforeAll(() => {
      gameIdFixture = 'game-fixture';
      userIdFixture = 'user-id';
    });

    describe('when called, and httpClient.createGameSlot() returns an OK response', () => {
      let gameSlotV1Fixture: apiModels.NonStartedGameSlotV1;

      let contextFixture: Context;

      let result: unknown;

      beforeAll(async () => {
        gameSlotV1Fixture =
          Symbol() as unknown as apiModels.NonStartedGameSlotV1;

        contextFixture = {
          request: {
            headers: {
              foo: 'bar',
            },
            query: {},
            urlParameters: {},
          },
        } as Partial<Context> as Context;

        httpClientMock.createGameSlot.mockResolvedValueOnce({
          body: gameSlotV1Fixture,
          headers: {},
          statusCode: HttpStatus.OK,
        });

        result = await gameMutationResolver.createGameSlot(
          undefined,
          {
            gameSlotCreateInput: {
              gameId: gameIdFixture,
              userId: userIdFixture,
            },
          },
          contextFixture,
        );
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call httpClient.createGameSlot()', () => {
        const expectedBody: apiModels.GameIdSlotCreateQueryV1 = {
          userId: userIdFixture,
        };

        expect(httpClientMock.createGameSlot).toHaveBeenCalledTimes(1);
        expect(httpClientMock.createGameSlot).toHaveBeenCalledWith(
          contextFixture.request.headers,
          {
            gameId: gameIdFixture,
          },
          expectedBody,
        );
      });

      it('should return GraphQl GameSlot', () => {
        expect(result).toBe(gameSlotV1Fixture);
      });
    });

    describe.each<[400 | 401 | 403 | 409 | 422, AppErrorKind]>([
      [HttpStatus.BAD_REQUEST, AppErrorKind.contractViolation],
      [HttpStatus.UNAUTHORIZED, AppErrorKind.missingCredentials],
      [HttpStatus.FORBIDDEN, AppErrorKind.invalidCredentials],
      [HttpStatus.CONFLICT, AppErrorKind.entityConflict],
      [HttpStatus.UNPROCESSABLE_ENTITY, AppErrorKind.unprocessableOperation],
    ])(
      'when called, and httpClient.createGameSlot() returns a %s response',
      (httpStatus: 400 | 401 | 403 | 409 | 422, appErrorKind: AppErrorKind) => {
        let errorV1: apiModels.ErrorV1;
        let contextFixture: Context;

        let result: unknown;

        beforeAll(async () => {
          errorV1 = {
            description: 'error description fixture',
          };

          contextFixture = {
            request: {
              headers: {
                foo: 'bar',
              },
              query: {},
              urlParameters: {},
            },
          } as Partial<Context> as Context;

          httpClientMock.createGameSlot.mockResolvedValueOnce({
            body: errorV1,
            headers: {},
            statusCode: httpStatus,
          });

          try {
            await gameMutationResolver.createGameSlot(
              undefined,
              {
                gameSlotCreateInput: {
                  gameId: gameIdFixture,
                  userId: userIdFixture,
                },
              },
              contextFixture,
            );
          } catch (error: unknown) {
            result = error;
          }
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call httpClient.createGameSlot()', () => {
          const expectedBody: apiModels.GameIdSlotCreateQueryV1 = {
            userId: userIdFixture,
          };

          expect(httpClientMock.createGameSlot).toHaveBeenCalledTimes(1);
          expect(httpClientMock.createGameSlot).toHaveBeenCalledWith(
            contextFixture.request.headers,
            {
              gameId: gameIdFixture,
            },
            expectedBody,
          );
        });

        it('should throw an AppError', () => {
          const expectedErrorProperties: Partial<AppError> = {
            kind: appErrorKind,
            message: errorV1.description,
          };

          expect(result).toBeInstanceOf(AppError);
          expect(result).toStrictEqual(
            expect.objectContaining(expectedErrorProperties),
          );
        });
      },
    );
  });

  describe('.passGameTurn', () => {
    let gameIdFixture: string;
    let slotIndexFixture: number;

    beforeAll(() => {
      slotIndexFixture = 2;
      gameIdFixture = 'game-id-fixture';
    });

    describe('when called, and httpClient.updateGame() returns an OK response', () => {
      let gameV1Fixture: apiModels.NonStartedGameV1;
      let gameGraphQlFixture: graphqlModels.Game;

      let contextFixture: Context;

      let result: unknown;

      beforeAll(async () => {
        gameV1Fixture = Symbol() as unknown as apiModels.NonStartedGameV1;
        gameGraphQlFixture = Symbol() as unknown as graphqlModels.Game;

        contextFixture = {
          request: {
            headers: {
              foo: 'bar',
            },
            query: {},
            urlParameters: {},
          },
        } as Partial<Context> as Context;

        httpClientMock.updateGame.mockResolvedValueOnce({
          body: gameV1Fixture,
          headers: {},
          statusCode: HttpStatus.OK,
        });

        gameGraphQlFromGameV1BuilderMock.build.mockReturnValueOnce(
          gameGraphQlFixture,
        );

        result = await gameMutationResolver.passGameTurn(
          undefined,
          {
            gameId: gameIdFixture,
            gamePassTurnInput: {
              slotIndex: slotIndexFixture,
            },
          },
          contextFixture,
        );
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call httpClient.updateGame()', () => {
        const expectedBody: apiModels.GameIdPassTurnQueryV1 = {
          kind: 'passTurn',
          slotIndex: slotIndexFixture,
        };

        expect(httpClientMock.updateGame).toHaveBeenCalledTimes(1);
        expect(httpClientMock.updateGame).toHaveBeenCalledWith(
          contextFixture.request.headers,
          {
            gameId: gameIdFixture,
          },
          expectedBody,
        );
      });

      it('should call gameGraphQlFromGameV1Builder.build()', () => {
        expect(gameGraphQlFromGameV1BuilderMock.build).toHaveBeenCalledTimes(1);
        expect(gameGraphQlFromGameV1BuilderMock.build).toHaveBeenCalledWith(
          gameV1Fixture,
        );
      });

      it('should return GraphQl Game', () => {
        expect(result).toBe(gameGraphQlFixture);
      });
    });

    describe('when called, and httpClient.updateGame() returns an UNAUTHORIZED response', () => {
      let errorV1: apiModels.ErrorV1;
      let contextFixture: Context;

      let result: unknown;

      beforeAll(async () => {
        errorV1 = {
          description: 'error description fixture',
        };

        contextFixture = {
          request: {
            headers: {
              foo: 'bar',
            },
            query: {},
            urlParameters: {},
          },
        } as Partial<Context> as Context;

        httpClientMock.updateGame.mockResolvedValueOnce({
          body: errorV1,
          headers: {},
          statusCode: HttpStatus.UNAUTHORIZED,
        });

        try {
          await gameMutationResolver.passGameTurn(
            undefined,
            {
              gameId: gameIdFixture,
              gamePassTurnInput: {
                slotIndex: slotIndexFixture,
              },
            },
            contextFixture,
          );
        } catch (error: unknown) {
          result = error;
        }
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call httpClient.updateGame()', () => {
        const expectedBody: apiModels.GameIdPassTurnQueryV1 = {
          kind: 'passTurn',
          slotIndex: slotIndexFixture,
        };

        expect(httpClientMock.updateGame).toHaveBeenCalledTimes(1);
        expect(httpClientMock.updateGame).toHaveBeenCalledWith(
          contextFixture.request.headers,
          {
            gameId: gameIdFixture,
          },
          expectedBody,
        );
      });

      it('should throw an AppError', () => {
        const expectedErrorProperties: Partial<AppError> = {
          kind: AppErrorKind.missingCredentials,
          message: errorV1.description,
        };

        expect(result).toBeInstanceOf(AppError);
        expect(result).toStrictEqual(
          expect.objectContaining(expectedErrorProperties),
        );
      });
    });

    describe('when called, and httpClient.updateGame() returns an FORBIDDEN response', () => {
      let errorV1: apiModels.ErrorV1;
      let contextFixture: Context;

      let result: unknown;

      beforeAll(async () => {
        errorV1 = {
          description: 'error description fixture',
        };

        contextFixture = {
          request: {
            headers: {
              foo: 'bar',
            },
            query: {},
            urlParameters: {},
          },
        } as Partial<Context> as Context;

        httpClientMock.updateGame.mockResolvedValueOnce({
          body: errorV1,
          headers: {},
          statusCode: HttpStatus.FORBIDDEN,
        });

        try {
          await gameMutationResolver.passGameTurn(
            undefined,
            {
              gameId: gameIdFixture,
              gamePassTurnInput: {
                slotIndex: slotIndexFixture,
              },
            },
            contextFixture,
          );
        } catch (error: unknown) {
          result = error;
        }
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call httpClient.updateGame()', () => {
        const expectedBody: apiModels.GameIdPassTurnQueryV1 = {
          kind: 'passTurn',
          slotIndex: slotIndexFixture,
        };

        expect(httpClientMock.updateGame).toHaveBeenCalledTimes(1);
        expect(httpClientMock.updateGame).toHaveBeenCalledWith(
          contextFixture.request.headers,
          {
            gameId: gameIdFixture,
          },
          expectedBody,
        );
      });

      it('should throw an AppError', () => {
        const expectedErrorProperties: Partial<AppError> = {
          kind: AppErrorKind.invalidCredentials,
          message: errorV1.description,
        };

        expect(result).toBeInstanceOf(AppError);
        expect(result).toStrictEqual(
          expect.objectContaining(expectedErrorProperties),
        );
      });
    });
  });

  describe('.playGameCards', () => {
    let cardIndexesFixture: number[];
    let gameIdFixture: string;
    let slotIndexFixture: number;

    beforeAll(() => {
      cardIndexesFixture = [0, 1];
      slotIndexFixture = 2;
      gameIdFixture = 'game-id-fixture';
    });

    describe('when called, and httpClient.updateGame() returns an OK response', () => {
      let gameV1Fixture: apiModels.NonStartedGameV1;
      let gameGraphQlFixture: graphqlModels.Game;

      let contextFixture: Context;

      let result: unknown;

      beforeAll(async () => {
        gameV1Fixture = Symbol() as unknown as apiModels.NonStartedGameV1;
        gameGraphQlFixture = Symbol() as unknown as graphqlModels.Game;

        contextFixture = {
          request: {
            headers: {
              foo: 'bar',
            },
            query: {},
            urlParameters: {},
          },
        } as Partial<Context> as Context;

        httpClientMock.updateGame.mockResolvedValueOnce({
          body: gameV1Fixture,
          headers: {},
          statusCode: HttpStatus.OK,
        });

        gameGraphQlFromGameV1BuilderMock.build.mockReturnValueOnce(
          gameGraphQlFixture,
        );

        result = await gameMutationResolver.playGameCards(
          undefined,
          {
            gameId: gameIdFixture,
            gamePlayCardsInput: {
              cardIndexes: cardIndexesFixture,
              colorChoice: null,
              slotIndex: slotIndexFixture,
            },
          },
          contextFixture,
        );
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call httpClient.updateGame()', () => {
        const expectedBody: apiModels.GameIdPlayCardsQueryV1 = {
          cardIndexes: cardIndexesFixture,
          kind: 'playCards',
          slotIndex: slotIndexFixture,
        };

        expect(httpClientMock.updateGame).toHaveBeenCalledTimes(1);
        expect(httpClientMock.updateGame).toHaveBeenCalledWith(
          contextFixture.request.headers,
          {
            gameId: gameIdFixture,
          },
          expectedBody,
        );
      });

      it('should call gameGraphQlFromGameV1Builder.build()', () => {
        expect(gameGraphQlFromGameV1BuilderMock.build).toHaveBeenCalledTimes(1);
        expect(gameGraphQlFromGameV1BuilderMock.build).toHaveBeenCalledWith(
          gameV1Fixture,
        );
      });

      it('should return GraphQl Game', () => {
        expect(result).toBe(gameGraphQlFixture);
      });
    });

    describe('when called, and httpClient.updateGame() returns an UNAUTHORIZED response', () => {
      let errorV1: apiModels.ErrorV1;
      let contextFixture: Context;

      let result: unknown;

      beforeAll(async () => {
        errorV1 = {
          description: 'error description fixture',
        };

        contextFixture = {
          request: {
            headers: {
              foo: 'bar',
            },
            query: {},
            urlParameters: {},
          },
        } as Partial<Context> as Context;

        httpClientMock.updateGame.mockResolvedValueOnce({
          body: errorV1,
          headers: {},
          statusCode: HttpStatus.UNAUTHORIZED,
        });

        try {
          await gameMutationResolver.playGameCards(
            undefined,
            {
              gameId: gameIdFixture,
              gamePlayCardsInput: {
                cardIndexes: cardIndexesFixture,
                colorChoice: null,
                slotIndex: slotIndexFixture,
              },
            },
            contextFixture,
          );
        } catch (error: unknown) {
          result = error;
        }
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call httpClient.updateGame()', () => {
        const expectedBody: apiModels.GameIdPlayCardsQueryV1 = {
          cardIndexes: cardIndexesFixture,
          kind: 'playCards',
          slotIndex: slotIndexFixture,
        };

        expect(httpClientMock.updateGame).toHaveBeenCalledTimes(1);
        expect(httpClientMock.updateGame).toHaveBeenCalledWith(
          contextFixture.request.headers,
          {
            gameId: gameIdFixture,
          },
          expectedBody,
        );
      });

      it('should throw an AppError', () => {
        const expectedErrorProperties: Partial<AppError> = {
          kind: AppErrorKind.missingCredentials,
          message: errorV1.description,
        };

        expect(result).toBeInstanceOf(AppError);
        expect(result).toStrictEqual(
          expect.objectContaining(expectedErrorProperties),
        );
      });
    });

    describe('when called, and httpClient.updateGame() returns an FORBIDDEN response', () => {
      let errorV1: apiModels.ErrorV1;
      let contextFixture: Context;

      let result: unknown;

      beforeAll(async () => {
        errorV1 = {
          description: 'error description fixture',
        };

        contextFixture = {
          request: {
            headers: {
              foo: 'bar',
            },
            query: {},
            urlParameters: {},
          },
        } as Partial<Context> as Context;

        httpClientMock.updateGame.mockResolvedValueOnce({
          body: errorV1,
          headers: {},
          statusCode: HttpStatus.FORBIDDEN,
        });

        try {
          await gameMutationResolver.playGameCards(
            undefined,
            {
              gameId: gameIdFixture,
              gamePlayCardsInput: {
                cardIndexes: cardIndexesFixture,
                colorChoice: null,
                slotIndex: slotIndexFixture,
              },
            },
            contextFixture,
          );
        } catch (error: unknown) {
          result = error;
        }
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call httpClient.updateGame()', () => {
        const expectedBody: apiModels.GameIdPlayCardsQueryV1 = {
          cardIndexes: cardIndexesFixture,
          kind: 'playCards',
          slotIndex: slotIndexFixture,
        };

        expect(httpClientMock.updateGame).toHaveBeenCalledTimes(1);
        expect(httpClientMock.updateGame).toHaveBeenCalledWith(
          contextFixture.request.headers,
          {
            gameId: gameIdFixture,
          },
          expectedBody,
        );
      });

      it('should throw an AppError', () => {
        const expectedErrorProperties: Partial<AppError> = {
          kind: AppErrorKind.invalidCredentials,
          message: errorV1.description,
        };

        expect(result).toBeInstanceOf(AppError);
        expect(result).toStrictEqual(
          expect.objectContaining(expectedErrorProperties),
        );
      });
    });
  });
});
