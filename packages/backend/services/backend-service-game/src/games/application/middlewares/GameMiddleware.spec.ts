import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { AppError, AppErrorKind } from '@cornie-js/backend-common';
import {
  Request,
  RequestContextHolder,
  requestContextProperty,
} from '@cornie-js/backend-http';

import { NonStartedGameFixtures } from '../../domain/fixtures/NonStartedGameFixtures';
import { Game } from '../../domain/models/Game';
import { GameFindQuery } from '../../domain/query/GameFindQuery';
import { GameRequestContext } from '../models/GameRequestContext';
import { GamePersistenceOutputPort } from '../ports/output/GamePersistenceOutputPort';
import { GameMiddleware } from './GameMiddleware';

describe(GameMiddleware.name, () => {
  let gamePersistenceOutputPortMock: jest.Mocked<GamePersistenceOutputPort>;

  let gameMiddleware: GameMiddleware;

  beforeAll(() => {
    gamePersistenceOutputPortMock = {
      create: jest.fn(),
      findOne: jest.fn(),
    };

    gameMiddleware = new GameMiddleware(gamePersistenceOutputPortMock);
  });

  describe('.handle', () => {
    describe('having a request fixture with no url params', () => {
      describe('when called', () => {
        let result: unknown;

        let requestFixture: Request;

        beforeAll(async () => {
          requestFixture = {
            headers: {},
            query: {},
            urlParameters: {},
          };

          try {
            await gameMiddleware.handle(requestFixture);
          } catch (error: unknown) {
            result = error;
          }
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should throw an Error', () => {
          const errorProperties: Partial<AppError> = {
            kind: AppErrorKind.unknown,
            message: 'Unable to parse request game id',
          };

          expect(result).toBeInstanceOf(AppError);
          expect(result).toStrictEqual(
            expect.objectContaining(errorProperties),
          );
        });
      });
    });

    describe('having a request fixture with no gameId params', () => {
      describe('when called, and gamePersistenceOutputPort.findOne() returns undefined', () => {
        let gameIdFixture: string;
        let result: unknown;

        let requestFixture: Request;

        beforeAll(async () => {
          gameIdFixture = 'game-id-fixture';

          requestFixture = {
            headers: {},
            query: {},
            urlParameters: {
              gameId: gameIdFixture,
            },
          };

          gamePersistenceOutputPortMock.findOne.mockResolvedValueOnce(
            undefined,
          );

          try {
            await gameMiddleware.handle(requestFixture);
          } catch (error: unknown) {
            result = error;
          }
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call gamePersistenceOutputPort.findOne()', () => {
          const expectedGameFindQuery: GameFindQuery = {
            id: gameIdFixture,
          };

          expect(gamePersistenceOutputPortMock.findOne).toHaveBeenCalledTimes(
            1,
          );
          expect(gamePersistenceOutputPortMock.findOne).toHaveBeenCalledWith(
            expectedGameFindQuery,
          );
        });

        it('should throw an Error', () => {
          const errorProperties: Partial<AppError> = {
            kind: AppErrorKind.entityNotFound,
            message: expect.stringContaining(
              'Unable to process request. Game',
            ) as unknown as string,
          };

          expect(result).toBeInstanceOf(AppError);
          expect(result).toStrictEqual(
            expect.objectContaining(errorProperties),
          );
        });
      });

      describe('when called, and gamePersistenceOutputPort.findOne() returns a game', () => {
        let gameFixture: Game;

        let requestFixture: Request;

        beforeAll(async () => {
          gameFixture = NonStartedGameFixtures.any;

          requestFixture = {
            headers: {},
            query: {},
            urlParameters: {
              gameId: gameFixture.id,
            },
          };

          gamePersistenceOutputPortMock.findOne.mockResolvedValueOnce(
            gameFixture,
          );

          await gameMiddleware.handle(requestFixture);
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call gamePersistenceOutputPort.findOne()', () => {
          const expectedGameFindQuery: GameFindQuery = {
            id: gameFixture.id,
          };

          expect(gamePersistenceOutputPortMock.findOne).toHaveBeenCalledTimes(
            1,
          );
          expect(gamePersistenceOutputPortMock.findOne).toHaveBeenCalledWith(
            expectedGameFindQuery,
          );
        });

        it('should place auth in the request', () => {
          const expectedGameContext: GameRequestContext = {
            game: gameFixture,
          };

          expect(
            (requestFixture as Request & RequestContextHolder)[
              requestContextProperty
            ],
          ).toStrictEqual(expectedGameContext);
        });
      });
    });
  });
});
