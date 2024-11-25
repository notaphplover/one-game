import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { AppError, AppErrorKind, Builder } from '@cornie-js/backend-common';
import {
  GameAction,
  GameActionFindQuery,
} from '@cornie-js/backend-game-domain/gameActions';
import { GameActionFixtures } from '@cornie-js/backend-game-domain/gameActions/fixtures';
import { MessageEvent } from '@cornie-js/backend-http';

import { GameActionPersistenceOutputPort } from '../output/GameActionPersistenceOutputPort';
import { GameActionManagementInputPort } from './GameActionManagementInputPort';

describe(GameActionManagementInputPort.name, () => {
  let gameActionPersistenceOutputPortMock: jest.Mocked<GameActionPersistenceOutputPort>;
  let messageEventFromGameActionBuilderMock: jest.Mocked<
    Builder<MessageEvent, [GameAction]>
  >;

  let gameActionManagementInputPort: GameActionManagementInputPort;

  beforeAll(() => {
    gameActionPersistenceOutputPortMock = {
      find: jest.fn(),
      findOne: jest.fn(),
    } as Partial<
      jest.Mocked<GameActionPersistenceOutputPort>
    > as jest.Mocked<GameActionPersistenceOutputPort>;
    messageEventFromGameActionBuilderMock = {
      build: jest.fn(),
    };

    gameActionManagementInputPort = new GameActionManagementInputPort(
      gameActionPersistenceOutputPortMock,
      messageEventFromGameActionBuilderMock,
    );
  });

  describe('.findNextGameEvents', () => {
    describe('having gameId', () => {
      let gameIdFixture: string;

      beforeAll(() => {
        gameIdFixture = 'game-id-fixture';
      });

      describe('when called, and gameActionPersistenceOutputPort.findOne() returns GameAction and gameActionPersistenceOutputPort.find() returns GameAction[]', () => {
        let gameActionFixture: GameAction;
        let messageEventFixture: MessageEvent;

        let result: unknown;

        beforeAll(async () => {
          gameActionFixture = GameActionFixtures.any;
          messageEventFixture = {
            data: 'data-fixture',
          };

          gameActionPersistenceOutputPortMock.find.mockResolvedValueOnce([
            gameActionFixture,
          ]);

          messageEventFromGameActionBuilderMock.build.mockReturnValueOnce(
            messageEventFixture,
          );

          result = await gameActionManagementInputPort.findNextGameEvents(
            gameIdFixture,
            null,
          );
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call gameActionPersistenceOutputPort.find()', () => {
          const expected: GameActionFindQuery = {
            gameId: gameIdFixture,
            limit: 21,
          };

          expect(
            gameActionPersistenceOutputPortMock.find,
          ).toHaveBeenCalledTimes(1);
          expect(gameActionPersistenceOutputPortMock.find).toHaveBeenCalledWith(
            expected,
          );
        });

        it('should call messageEventFromGameActionBuilder.build()', () => {
          expect(
            messageEventFromGameActionBuilderMock.build,
          ).toHaveBeenCalledTimes(1);
          expect(
            messageEventFromGameActionBuilderMock.build,
          ).toHaveBeenCalledWith(gameActionFixture);
        });

        it('should return GameAction[]', () => {
          expect(result).toStrictEqual([messageEventFixture]);
        });
      });
    });

    describe('having gameId and string lastGameActionId', () => {
      let gameIdFixture: string;
      let idFixture: string;

      beforeAll(() => {
        gameIdFixture = 'game-id-fixture';
        idFixture = 'id-fixture';
      });

      describe('when called, and gameActionPersistenceOutputPort.findOne() returns undefined', () => {
        let result: unknown;

        beforeAll(async () => {
          gameActionPersistenceOutputPortMock.findOne.mockResolvedValueOnce(
            undefined,
          );

          try {
            await gameActionManagementInputPort.findNextGameEvents(
              gameIdFixture,
              idFixture,
            );
          } catch (error: unknown) {
            result = error;
          }
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call gameActionPersistenceOutputPort.findOne()', () => {
          const expected: GameActionFindQuery = {
            id: idFixture,
          };

          expect(
            gameActionPersistenceOutputPortMock.findOne,
          ).toHaveBeenCalledTimes(1);
          expect(
            gameActionPersistenceOutputPortMock.findOne,
          ).toHaveBeenCalledWith(expected);
        });

        it('should throw an AppError', () => {
          const expectedErrorProperties: Partial<AppError> = {
            kind: AppErrorKind.unprocessableOperation,
            message: `Unable to find previous game actions. No game action with id "${idFixture}" was found`,
          };

          expect(result).toBeInstanceOf(AppError);
          expect(result).toStrictEqual(
            expect.objectContaining(expectedErrorProperties),
          );
        });
      });

      describe('when called, and gameActionPersistenceOutputPort.findOne() returns GameAction with gameId different than gameId param', () => {
        let result: unknown;

        beforeAll(async () => {
          gameActionPersistenceOutputPortMock.findOne.mockResolvedValueOnce(
            GameActionFixtures.any,
          );

          try {
            await gameActionManagementInputPort.findNextGameEvents(
              gameIdFixture,
              idFixture,
            );
          } catch (error: unknown) {
            result = error;
          }
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call gameActionPersistenceOutputPort.findOne()', () => {
          const expected: GameActionFindQuery = {
            id: idFixture,
          };

          expect(
            gameActionPersistenceOutputPortMock.findOne,
          ).toHaveBeenCalledTimes(1);
          expect(
            gameActionPersistenceOutputPortMock.findOne,
          ).toHaveBeenCalledWith(expected);
        });

        it('should throw an AppError', () => {
          const expectedErrorProperties: Partial<AppError> = {
            kind: AppErrorKind.unprocessableOperation,
            message: `Unable to find previous game actions. Game action "${idFixture}" does not belong to game "${gameIdFixture}"`,
          };

          expect(result).toBeInstanceOf(AppError);
          expect(result).toStrictEqual(
            expect.objectContaining(expectedErrorProperties),
          );
        });
      });

      describe('when called, and gameActionPersistenceOutputPort.findOne() returns GameAction and gameActionPersistenceOutputPort.find() returns too many GameAction[]', () => {
        let gameActionFixture: GameAction;
        let gameActionsFixture: GameAction[];

        let result: unknown;

        beforeAll(async () => {
          gameActionFixture = {
            ...GameActionFixtures.any,
            gameId: gameIdFixture,
          };
          gameActionsFixture = {
            length: 21,
          } as Partial<GameAction[]> as GameAction[];

          gameActionPersistenceOutputPortMock.findOne.mockResolvedValueOnce(
            gameActionFixture,
          );

          gameActionPersistenceOutputPortMock.find.mockResolvedValueOnce(
            gameActionsFixture,
          );

          try {
            await gameActionManagementInputPort.findNextGameEvents(
              gameIdFixture,
              idFixture,
            );
          } catch (error: unknown) {
            result = error;
          }
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call gameActionPersistenceOutputPort.findOne()', () => {
          const expected: GameActionFindQuery = {
            id: idFixture,
          };

          expect(
            gameActionPersistenceOutputPortMock.findOne,
          ).toHaveBeenCalledTimes(1);
          expect(
            gameActionPersistenceOutputPortMock.findOne,
          ).toHaveBeenCalledWith(expected);
        });

        it('should call gameActionPersistenceOutputPort.find()', () => {
          const expected: GameActionFindQuery = {
            gameId: gameIdFixture,
            limit: 21,
            position: {
              gt: gameActionFixture.position,
            },
          };

          expect(
            gameActionPersistenceOutputPortMock.find,
          ).toHaveBeenCalledTimes(1);
          expect(gameActionPersistenceOutputPortMock.find).toHaveBeenCalledWith(
            expected,
          );
        });

        it('should throw an AppError', () => {
          const expectedErrorProperties: Partial<AppError> = {
            kind: AppErrorKind.unprocessableOperation,
            message: 'Unable to retrieve more than 20 previous game actions',
          };

          expect(result).toBeInstanceOf(AppError);
          expect(result).toStrictEqual(
            expect.objectContaining(expectedErrorProperties),
          );
        });
      });

      describe('when called, and gameActionPersistenceOutputPort.findOne() returns GameAction and gameActionPersistenceOutputPort.find() returns GameAction[]', () => {
        let firstGameActionFixture: GameAction;
        let secondGameActionFixture: GameAction;
        let messageEventFixture: MessageEvent;

        let result: unknown;

        beforeAll(async () => {
          firstGameActionFixture = {
            ...GameActionFixtures.any,
            gameId: gameIdFixture,
          };

          secondGameActionFixture = GameActionFixtures.any;

          messageEventFixture = {
            data: 'data-fixture',
          };

          gameActionPersistenceOutputPortMock.findOne.mockResolvedValueOnce(
            firstGameActionFixture,
          );

          gameActionPersistenceOutputPortMock.find.mockResolvedValueOnce([
            secondGameActionFixture,
          ]);

          messageEventFromGameActionBuilderMock.build.mockReturnValueOnce(
            messageEventFixture,
          );

          result = await gameActionManagementInputPort.findNextGameEvents(
            gameIdFixture,
            idFixture,
          );
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call gameActionPersistenceOutputPort.findOne()', () => {
          const expected: GameActionFindQuery = {
            id: idFixture,
          };

          expect(
            gameActionPersistenceOutputPortMock.findOne,
          ).toHaveBeenCalledTimes(1);
          expect(
            gameActionPersistenceOutputPortMock.findOne,
          ).toHaveBeenCalledWith(expected);
        });

        it('should call gameActionPersistenceOutputPort.find()', () => {
          const expected: GameActionFindQuery = {
            gameId: gameIdFixture,
            limit: 21,
            position: {
              gt: firstGameActionFixture.position,
            },
          };

          expect(
            gameActionPersistenceOutputPortMock.find,
          ).toHaveBeenCalledTimes(1);
          expect(gameActionPersistenceOutputPortMock.find).toHaveBeenCalledWith(
            expected,
          );
        });

        it('should call messageEventFromGameActionBuilder.build()', () => {
          expect(
            messageEventFromGameActionBuilderMock.build,
          ).toHaveBeenCalledTimes(1);
          expect(
            messageEventFromGameActionBuilderMock.build,
          ).toHaveBeenCalledWith(secondGameActionFixture);
        });

        it('should return GameAction[]', () => {
          expect(result).toStrictEqual([messageEventFixture]);
        });
      });
    });
  });
});
