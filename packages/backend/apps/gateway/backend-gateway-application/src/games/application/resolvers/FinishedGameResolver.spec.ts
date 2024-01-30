import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { models as graphqlModels } from '@cornie-js/api-graphql-models';
import { AppError, AppErrorKind } from '@cornie-js/backend-common';
import { Request } from '@cornie-js/backend-http';

import { Context } from '../../../foundation/graphql/application/models/Context';
import { FinishedGameResolver } from './FinishedGameResolver';

describe(FinishedGameResolver.name, () => {
  let finishedGameResolver: FinishedGameResolver;

  beforeAll(() => {
    finishedGameResolver = new FinishedGameResolver();
  });

  describe('.id', () => {
    describe('having an FinishedGame', () => {
      let gameFixture: graphqlModels.FinishedGame;

      beforeAll(() => {
        gameFixture = {
          id: 'id-fixture',
          name: 'name-fixture',
          spec: Symbol() as unknown as graphqlModels.GameSpec,
          state: Symbol() as unknown as graphqlModels.FinishedGameState,
        };
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          result = finishedGameResolver.id(gameFixture);
        });

        it('should return game id', () => {
          expect(result).toBe(gameFixture.id);
        });
      });
    });
  });

  describe('.name', () => {
    describe('having an FinishedGame', () => {
      let gameFixture: graphqlModels.FinishedGame;

      beforeAll(() => {
        gameFixture = {
          id: 'id-fixture',
          name: 'name-fixture',
          spec: Symbol() as unknown as graphqlModels.GameSpec,
          state: Symbol() as unknown as graphqlModels.FinishedGameState,
        };
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          result = finishedGameResolver.name(gameFixture);
        });

        it('should return game name', () => {
          expect(result).toBe(gameFixture.name);
        });
      });
    });
  });

  describe('.spec', () => {
    describe('having an FinishedGame and a Context', () => {
      let gameFixture: graphqlModels.FinishedGame;
      let contextMock: jest.Mocked<Context>;

      beforeAll(() => {
        gameFixture = {
          id: 'id-fixture',
          name: 'name-fixture',
          spec: Symbol() as unknown as graphqlModels.GameSpec,
          state: Symbol() as unknown as graphqlModels.FinishedGameState,
        };

        contextMock = {
          gameSpecByGameIdHandler: {
            handle: jest.fn(),
          },
          request: Symbol() as unknown as Request,
        };
      });

      describe('when called and gameSpecByGameIdHandler.handle() returns undefined', () => {
        let result: unknown;

        beforeAll(async () => {
          contextMock.gameSpecByGameIdHandler.handle.mockResolvedValueOnce(
            undefined,
          );

          try {
            await finishedGameResolver.spec(gameFixture, Symbol(), contextMock);
          } catch (error: unknown) {
            result = error;
          }
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call gameSpecByGameIdHandler.handle()', () => {
          expect(
            contextMock.gameSpecByGameIdHandler.handle,
          ).toHaveBeenCalledTimes(1);
          expect(
            contextMock.gameSpecByGameIdHandler.handle,
          ).toHaveBeenCalledWith(gameFixture.id);
        });

        it('should throw an AppError', () => {
          const expectedErrorPorperties: Partial<AppError> = {
            kind: AppErrorKind.unknown,
            message: expect.stringContaining(
              'Unable to fetch game',
            ) as unknown as string,
          };

          expect(result).toBeInstanceOf(AppError);
          expect(result).toStrictEqual(
            expect.objectContaining(expectedErrorPorperties),
          );
        });
      });

      describe('when called and gameSpecByGameIdHandler.handle() returns GameSpec', () => {
        let gameSpecFixture: graphqlModels.GameSpec;

        let result: unknown;

        beforeAll(async () => {
          gameSpecFixture = Symbol() as unknown as graphqlModels.GameSpec;

          contextMock.gameSpecByGameIdHandler.handle.mockResolvedValueOnce(
            gameSpecFixture,
          );

          result = await finishedGameResolver.spec(
            gameFixture,
            Symbol(),
            contextMock,
          );
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call gameSpecByGameIdHandler.handle()', () => {
          expect(
            contextMock.gameSpecByGameIdHandler.handle,
          ).toHaveBeenCalledTimes(1);
          expect(
            contextMock.gameSpecByGameIdHandler.handle,
          ).toHaveBeenCalledWith(gameFixture.id);
        });

        it('should return GameSpec', () => {
          expect(result).toBe(gameSpecFixture);
        });
      });
    });
  });

  describe('.state', () => {
    describe('having an FinishedGame', () => {
      let gameFixture: graphqlModels.FinishedGame;

      beforeAll(() => {
        gameFixture = {
          id: 'id-fixture',
          name: 'name-fixture',
          spec: Symbol() as unknown as graphqlModels.GameSpec,
          state: Symbol() as unknown as graphqlModels.FinishedGameState,
        };
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          result = finishedGameResolver.state(gameFixture);
        });

        it('should return game state', () => {
          expect(result).toBe(gameFixture.state);
        });
      });
    });
  });
});
