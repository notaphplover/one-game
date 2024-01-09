import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { models as graphqlModels } from '@cornie-js/api-graphql-models';
import { AppError, AppErrorKind } from '@cornie-js/backend-common';
import { Request } from '@cornie-js/backend-http';

import { Context } from '../../../foundation/graphql/application/models/Context';
import { ActiveGameResolver } from './ActiveGameResolver';

describe(ActiveGameResolver.name, () => {
  let activeGameResolver: ActiveGameResolver;

  beforeAll(() => {
    activeGameResolver = new ActiveGameResolver();
  });

  describe('.id', () => {
    describe('having an ActiveGame', () => {
      let gameFixture: graphqlModels.ActiveGame;

      beforeAll(() => {
        gameFixture = {
          id: 'id-fixture',
          name: 'name-fixture',
          spec: Symbol() as unknown as graphqlModels.GameSpec,
          state: Symbol() as unknown as graphqlModels.ActiveGameState,
        };
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          result = activeGameResolver.id(gameFixture);
        });

        it('should return game id', () => {
          expect(result).toBe(gameFixture.id);
        });
      });
    });
  });

  describe('.name', () => {
    describe('having an ActiveGame', () => {
      let gameFixture: graphqlModels.ActiveGame;

      beforeAll(() => {
        gameFixture = {
          id: 'id-fixture',
          name: 'name-fixture',
          spec: Symbol() as unknown as graphqlModels.GameSpec,
          state: Symbol() as unknown as graphqlModels.ActiveGameState,
        };
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          result = activeGameResolver.name(gameFixture);
        });

        it('should return game name', () => {
          expect(result).toBe(gameFixture.name);
        });
      });
    });
  });

  describe('.spec', () => {
    describe('having an ActiveGame and a Context', () => {
      let gameFixture: graphqlModels.ActiveGame;
      let contextMock: jest.Mocked<Context>;

      beforeAll(() => {
        gameFixture = {
          id: 'id-fixture',
          name: 'name-fixture',
          spec: Symbol() as unknown as graphqlModels.GameSpec,
          state: Symbol() as unknown as graphqlModels.ActiveGameState,
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
            await activeGameResolver.spec(gameFixture, Symbol(), contextMock);
          } catch (error) {
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

          result = await activeGameResolver.spec(
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
    describe('having an ActiveGame', () => {
      let gameFixture: graphqlModels.ActiveGame;

      beforeAll(() => {
        gameFixture = {
          id: 'id-fixture',
          name: 'name-fixture',
          spec: Symbol() as unknown as graphqlModels.GameSpec,
          state: Symbol() as unknown as graphqlModels.ActiveGameState,
        };
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          result = activeGameResolver.state(gameFixture);
        });

        it('should return game state', () => {
          expect(result).toBe(gameFixture.state);
        });
      });
    });
  });
});
