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

  describe('.findNextEventsByGameActionId', () => {
    let idFixture: string;

    beforeAll(() => {
      idFixture = 'id-fixture';
    });

    describe('when called, and gameActionPersistenceOutputPort.findOne() returns undefined', () => {
      let result: unknown;

      beforeAll(async () => {
        gameActionPersistenceOutputPortMock.findOne.mockResolvedValueOnce(
          undefined,
        );

        try {
          await gameActionManagementInputPort.findNextEventsByGameActionId(
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

    describe('when called, and gameActionPersistenceOutputPort.findOne() returns GameAction and gameActionPersistenceOutputPort.find() returns too many GameAction[]', () => {
      let gameActionFixture: GameAction;
      let gameActionsFixture: GameAction[];

      let result: unknown;

      beforeAll(async () => {
        gameActionFixture = GameActionFixtures.any;
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
          await gameActionManagementInputPort.findNextEventsByGameActionId(
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
          limit: 21,
          position: {
            gt: gameActionFixture.position,
          },
        };

        expect(gameActionPersistenceOutputPortMock.find).toHaveBeenCalledTimes(
          1,
        );
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
      let gameActionFixture: GameAction;
      let messageEventFixture: MessageEvent;

      let result: unknown;

      beforeAll(async () => {
        gameActionFixture = GameActionFixtures.any;

        gameActionPersistenceOutputPortMock.findOne.mockResolvedValueOnce(
          gameActionFixture,
        );

        gameActionPersistenceOutputPortMock.find.mockResolvedValueOnce([
          GameActionFixtures.any,
        ]);

        messageEventFromGameActionBuilderMock.build.mockReturnValueOnce(
          messageEventFixture,
        );

        result =
          await gameActionManagementInputPort.findNextEventsByGameActionId(
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

      it('should call messageEventFromGameActionBuilder.build()', () => {
        expect(
          messageEventFromGameActionBuilderMock.build,
        ).toHaveBeenCalledTimes(1);
        expect(
          messageEventFromGameActionBuilderMock.build,
        ).toHaveBeenCalledWith(gameActionFixture);
      });

      it('should call gameActionPersistenceOutputPort.find()', () => {
        const expected: GameActionFindQuery = {
          limit: 21,
          position: {
            gt: gameActionFixture.position,
          },
        };

        expect(gameActionPersistenceOutputPortMock.find).toHaveBeenCalledTimes(
          1,
        );
        expect(gameActionPersistenceOutputPortMock.find).toHaveBeenCalledWith(
          expected,
        );
      });

      it('should return GameAction[]', () => {
        expect(result).toStrictEqual([messageEventFixture]);
      });
    });
  });
});
